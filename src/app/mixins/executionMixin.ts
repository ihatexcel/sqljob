// @ts-nocheck

export function executionMixin() {
    return {
                async runGroupAtPath(path) {
                    const group = this.getGroupAtPath(path);
                    if (!group) return { stopped: false };

                    // Vérifier si le groupe a une loop activée
                    const useLoop = !!(group.loop && group.loop.enabled && group.loop.query);

                    if (useLoop) {
                        return await this.runGroupWithLoop(path, group);
                    } else {
                        return await this.runGroupOnce(path, group);
                    }
                },

                /** Cellule à exécuter manuellement (buttonLabel non vide) : sautée dans le flux auto. En mode boucle+zip, on exécute toutes les cellules productrices de fichiers. */
                isCellSkippedInAutoFlow(cell) {
                    if (!cell || cell.type === 'buttonRunNextCells') return false;
                    if (this._zipMode) return false; // En boucle avec zip, exécuter toutes les cellules productrices de fichiers
                    return !!(cell.buttonLabel && String(cell.buttonLabel).trim() !== '');
                },

                // Exécuter un groupe une seule fois (sans loop)
                // Retourne { stopped: true } si arrêt (ex: source sans fichier chargé), sinon { stopped: false }
                async runGroupOnce(path, group) {
                    // Évaluer queries[0] (condition d'affichage) au début de l'exécution du groupe
                    if (ConfigManager.getGroupIfQuery(group)) {
                        this.setStatus('Évaluation de la condition ifQuery...', 'loading');
                        const ifQueryResult = await this.evaluateGroupIfQuery(group);
                        group._ifQueryResult = ifQueryResult;

                        if (!ifQueryResult) {
                            this.setStatus('Groupe ignoré (ifQuery = false)', 'info');
                            return { stopped: false }; // Skip l'exécution du groupe
                        }
                    }

                    this.setStatus('Exécution du groupe...', 'loading');

                    // Exécuter selon l'ordre visuel (_order) en intercalant cellules et sous-groupes
                    const orderedItems = this.getAllItemsSorted(group);
                    for (const item of orderedItems) {
                        if (item.type === 'child') {
                            const result = await this.runGroupAtPath([...path, item.originalIndex]);
                            if (result?.stopped) return result;
                            continue;
                        }

                        const cell = item.item;
                        if (cell.type === 'buttonRunNextCells') {
                            this.setStatus('Arrêt : bouton "Exécuter les cellules suivantes" rencontré', 'info');
                            return { stopped: true, reason: 'buttonRunNextCells' };
                        }
                        if (this.isCellSkippedInAutoFlow(cell)) continue;
                        // Cellule source sans fileInput chargé : interrompre le flux
                        if (cell.type === 'source') {
                            if (!cell._fileName || !cell._currentFile || !cell._loaded) {
                                return { stopped: true, reason: 'source_no_file', cellName: cell.name };
                            }
                            if (cell._status === 'error') {
                                return { stopped: true, reason: 'source_error', cellName: cell.name };
                            }
                            continue;
                        }
                        await this.runCellAt(path, item.originalIndex);
                    }

                    this.setStatus('Groupe exécuté', 'success');
                    return { stopped: false };
                },

                // Parser une requête de loop (avec paramètres et imbrications {{ }})
                async parseLoopQuery(query) {
                    // Parse la requête avec les paramètres d'abord
                        let currentQuery = this.parseQueryWithParameters(query);
                    const maxLevels = 10;
                    let level = 0;

                    // Fonction récursive : traiter la requête la plus profonde (innermost) en premier
                    const parseRecursive = async (q) => {
                        if (level >= maxLevels) {
                            throw new Error('Nombre maximum de niveaux d\'imbrication atteint (10)');
                        }

                        const posClose = q.indexOf('}}');
                        if (posClose === -1) return q;
                        const posOpen = q.lastIndexOf('{{', posClose);
                        if (posOpen === -1) {
                            return q;
                        }

                        const innerQuery = q.substring(posOpen + 2, posClose).trim();
                        level++;

                        const resolvedInnerQuery = await parseRecursive(innerQuery);
                        const results = await DuckDBManager.executeQuery(resolvedInnerQuery);

                        if (!results || results.length === 0) {
                            throw new Error(`Niveau ${level}: La requête n'a retourné aucun résultat`);
                        }

                        const firstRow = results[0];
                        const replacement = Object.values(firstRow)[0];

                        if (replacement === null || replacement === undefined) {
                            throw new Error(`Niveau ${level}: Le résultat est null ou undefined`);
                        }

                        const replStr = String(replacement).replace(/\$/g, '$$$$');
                        const newQuery = q.substring(0, posOpen) + replStr + q.substring(posClose + 2);
                        return await parseRecursive(newQuery);
                    };

                    return await parseRecursive(currentQuery);
                },

                // Ajouter un fichier à la collection zip (utilisé par les cellules de génération de fichiers)
                addFileToZip(filename, content, type = 'blob') {
                    if (this._zipMode) {
                        this._zipFiles.push({ filename, content, type });
                        return true; // Fichier ajouté au zip, ne pas télécharger
                    }
                    return false; // Mode normal, télécharger directement
                },

                // Télécharger un fichier (ou l'ajouter au zip si mode zip actif)
                downloadOrZipFile(filename, content, mimeType = 'application/octet-stream') {
                    if (this._zipMode) {
                        this._zipFiles.push({ filename, content, type: 'blob' });
                        return true;
                    }
                    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    return false;
                },

                // Exécuter un groupe avec loop
                // Retourne { stopped: true } si arrêt (ex: source sans fichier chargé), sinon { stopped: false }
                async runGroupWithLoop(path, group) {
                    // Évaluer queries[0] (condition d'affichage) au début de l'exécution du groupe
                    if (ConfigManager.getGroupIfQuery(group)) {
                        this.setStatus('Évaluation de la condition ifQuery...', 'loading');
                        const ifQueryResult = await this.evaluateGroupIfQuery(group);
                        group._ifQueryResult = ifQueryResult;

                        if (!ifQueryResult) {
                            this.setStatus('Groupe ignoré (ifQuery = false)', 'info');
                            return { stopped: false }; // Skip l'exécution du groupe
                        }
                    }

                    this.setStatus('Initialisation de la boucle...', 'loading');

                    // Activer le mode zip si configuré
                    const zipEnabled = group.loop.zip === true;
                    if (zipEnabled) {
                        this._zipMode = true;
                        this._zipFiles = [];
                    }

                    try {
                        // Exécuter la requête de loop pour obtenir les valeurs
                        const loopQuery = group.loop.query;
                        const parsedLoopQuery = await this.parseLoopQuery(loopQuery);
                        const loopResults = await DuckDBManager.executeQuery(parsedLoopQuery);

                        if (!loopResults || loopResults.length === 0) {
                            this.setStatus('Boucle: aucune valeur trouvée', 'warning');
                            this._zipMode = false;
                            this._zipFiles = [];
                            return { stopped: false };
                        }

                        // Récupérer la première colonne pour les valeurs de loop
                        const firstColumnName = Object.keys(loopResults[0])[0];
                        const loopValues = loopResults.map(row => row[firstColumnName]);

                        this.setStatus(`Boucle: ${loopValues.length} itérations`, 'loading');

                        // Exécuter le groupe pour chaque valeur de loop
                        for (let i = 0; i < loopValues.length; i++) {
                            const loopValue = loopValues[i];
                            this._currentLoopValue = loopValue;
                            this.setStatus(`Boucle ${i + 1}/${loopValues.length}: $loop = ${loopValue}`, 'loading');

                            // Exécuter le contenu du groupe
                            const orderedItems = this.getAllItemsSorted(group);
                            for (const item of orderedItems) {
                                if (item.type === 'child') {
                                    const result = await this.runGroupAtPath([...path, item.originalIndex]);
                                    if (result?.stopped) return result;
                                    continue;
                                }

                                const cell = item.item;
                                if (cell.type === 'buttonRunNextCells') {
                                    this.setStatus('Arrêt : bouton "Exécuter les cellules suivantes" rencontré', 'info');
                                    return { stopped: true, reason: 'buttonRunNextCells' };
                                }
                                if (this.isCellSkippedInAutoFlow(cell)) continue;
                                // Cellule source sans fileInput chargé : interrompre le flux
                                if (cell.type === 'source') {
                                    if (!cell._fileName || !cell._currentFile || !cell._loaded) {
                                        return { stopped: true, reason: 'source_no_file', cellName: cell.name };
                                    }
                                    if (cell._status === 'error') {
                                        return { stopped: true, reason: 'source_error', cellName: cell.name };
                                    }
                                    continue;
                                }
                                await this.runCellAt(path, item.originalIndex);
                            }
                        }

                        // Réinitialiser la valeur de loop
                        this._currentLoopValue = null;

                        // Générer le ZIP si mode zip actif et fichiers collectés
                        if (zipEnabled && this._zipFiles.length > 0) {
                            await this.generateAndDownloadZip(group);
                        }

                        this.setStatus(`Boucle terminée: ${loopValues.length} itérations` + (zipEnabled ? ` - ${this._zipFiles.length} fichier(s) zippé(s)` : ''), 'success');
                        return { stopped: false };

                    } catch (error) {
                        this._currentLoopValue = null;
                        this.setStatus('Erreur boucle: ' + error.message, 'error');
                        return { stopped: true };
                    } finally {
                        // Toujours réinitialiser le mode zip
                        this._zipMode = false;
                        this._zipFiles = [];
                    }
                },

                // Générer et télécharger le fichier ZIP
                async generateAndDownloadZip(group) {
                    this.setStatus('Génération du fichier ZIP...', 'loading');

                    try {
                        // Déterminer le nom du fichier ZIP
                        let zipFilename = 'export.zip';
                        if (group.loop.zipQuery) {
                            const parsedZipQuery = await this.parseLoopQuery(group.loop.zipQuery);
                            const zipResults = await DuckDBManager.executeQuery(parsedZipQuery);
                            if (zipResults && zipResults.length > 0) {
                                const firstValue = Object.values(zipResults[0])[0];
                                if (firstValue) {
                                    zipFilename = String(firstValue);
                                    if (!zipFilename.toLowerCase().endsWith('.zip')) {
                                        zipFilename += '.zip';
                                    }
                                }
                            }
                        }

                        // Créer le ZIP avec PizZip
                        await CDNManager.loadPizZip();
                        const zip = new PizZip();

                        for (const file of this._zipFiles) {
                            if (file.content instanceof Blob) {
                                // Convertir le Blob en ArrayBuffer pour PizZip
                                const arrayBuffer = await file.content.arrayBuffer();
                                zip.file(file.filename, arrayBuffer);
                            } else if (file.content instanceof ArrayBuffer) {
                                zip.file(file.filename, file.content);
                            } else if (typeof file.content === 'string') {
                                zip.file(file.filename, file.content);
                            } else {
                                zip.file(file.filename, file.content);
                            }
                        }

                        // Générer et télécharger le ZIP
                        const zipBlob = zip.generate({ type: 'blob' });
                        const url = URL.createObjectURL(zipBlob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = zipFilename;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);

                        this.setStatus(`ZIP généré: ${zipFilename} (${this._zipFiles.length} fichiers)`, 'success');
                    } catch (error) {
                        console.error('Erreur lors de la génération du ZIP:', error);
                        throw new Error('Erreur ZIP: ' + error.message);
                    }
                },

                async runCellAt(pathOrIndex, cellIndex) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    const cell = this.getCellAtPath(path, cellIndex);
                    if (!cell) {
                        console.error('❌ Cell not found!');
                        return;
                    }

                    cell._status = 'running';
                    this.isLoading = true;
                    this.setStatus(`Exécution de ${cell.name || cell.type}...`, 'loading');

                    try {
                        const schema = CELL_TYPE_SCHEMAS?.types[cell?.type];
                        const handler = schema?.executeHandler;
                        if (handler && typeof this[handler] === 'function') {
                            await this[handler](cell);
                        } else if (handler !== null) {
                            console.warn('⚠️ Unknown cell type or missing handler:', cell.type);
                        }

                        cell._status = 'success';
                        this.setStatus(`${cell.name || cell.type} exécuté`, 'success');
                    } catch (error) {
                        cell._status = 'error';
                        cell._resultInfo = 'Erreur: ' + error.message;
                        this.setStatus('Erreur: ' + error.message, 'error');
                    } finally {
                        this.isLoading = false;
                    }
                },

                // Exécuter toutes les cellules d'un groupe (accepte path ou groupIndex)
                async runGroup(pathOrIndex) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    return await this.runGroupAtPath(path);
                },

                // ─────────────────────────────────────────────────────────────────
                // PARSING RÉCURSIF PARTAGÉ (utilisé par SQL et Table)
                // ─────────────────────────────────────────────────────────────────

                // Parser une requête de manière récursive et remplir cell._parseLevels ou cell._parseLevels2
                // queryIndex: 0 = query principale, 1 = query2 (ex: noms de fichiers publipostage)
                // allowEmpty: si true, les résultats vides sont remplacés par '' au lieu de lever une erreur
                async parseQueryRecursively(cell, queryIndex = 0, allowEmpty = false) {
                    const levelsKey = queryIndex === 1 ? '_parseLevels2' : '_parseLevels';
                    cell[levelsKey] = [];

                    let currentQuery = this.parseQueryWithParameters(ConfigManager.getCellQuery(cell, queryIndex) || '');
                    let level = 0;
                    const maxLevels = 10;

                    const parseRecursive = async (query) => {
                        if (level >= maxLevels) {
                            throw new Error('Nombre maximum de niveaux d\'imbrication atteint (10)');
                        }

                        const posClose = query.indexOf('}}');
                        if (posClose === -1) return query;
                        const posOpen = query.lastIndexOf('{{', posClose);
                        if (posOpen === -1) return query;

                        const innerQuery = query.substring(posOpen + 2, posClose).trim();
                        level++;

                        const statusSuffix = queryIndex === 1 ? ' (query2)' : '';
                        this.setStatus(`Parsing niveau ${level}${statusSuffix}...`, 'loading');

                        const resolvedInnerQuery = await parseRecursive(innerQuery);
                        const results = await DuckDBManager.executeQuery(resolvedInnerQuery);

                        let replacement;
                        if (allowEmpty) {
                            const firstVal = results.length > 0 ? Object.values(results[0])[0] : null;
                            replacement = (firstVal !== null && firstVal !== undefined) ? String(firstVal) : '';
                        } else {
                            if (!results || results.length === 0) {
                                throw new Error(`Niveau ${level}: La requête n'a retourné aucun résultat`);
                            }
                            const firstVal = Object.values(results[0])[0];
                            if (firstVal === null || firstVal === undefined) {
                                throw new Error(`Niveau ${level}: Le résultat est null ou undefined`);
                            }
                            replacement = String(firstVal);
                        }

                        cell[levelsKey].push({
                            level: level,
                            innerQuery: resolvedInnerQuery,
                            replacement: replacement
                        });

                        const replStr = String(replacement).replace(/\$/g, '$$$$');
                        const newQuery = query.substring(0, posOpen) + replStr + query.substring(posClose + 2);
                        return await parseRecursive(newQuery);
                    };

                    const finalQuery = await parseRecursive(currentQuery);
                    cell[levelsKey].push({ level: 'final', innerQuery: finalQuery, replacement: null });
                    return finalQuery;
                },

                async executeSqlRecursiveParseCell(cell) {

                    if (!ConfigManager.getCellQuery(cell, 0)?.trim()) {
                        console.warn('❌ cell.query est vide ou undefined!');
                        return;
                    }

                    this.setStatus('Parsing récursif...', 'loading');

                    try {
                        // Utiliser la fonction partagée pour le parsing récursif
                        const finalQuery = await this.parseQueryRecursively(cell);

                        this.setStatus('Exécution de la requête finale...', 'loading');

                        // Détecter si la requête finale est un COPY ([\s\S] au lieu de . pour traverser les retours à la ligne)
                        const copyRegex = /COPY\s+[\s\S]+\bTO\s+'([^']+)'/i;
                        const copyMatch = finalQuery.match(copyRegex);

                        if (copyMatch) {
                            // Mode export : la requête finale contient un COPY
                            this.setStatus('Export du fichier...', 'loading');

                            const fileName = copyMatch[1];

                            try {
                                // Exécuter le COPY
                                await DuckDBManager.executeQuery(finalQuery);

                                // Déterminer l'extension pour adapter les paramètres de retry
                                const fileExt = fileName.toLowerCase().split('.').pop();
                                const isBinaryFormat = ['xlsx', 'xls', 'parquet', 'pq', 'arrow', 'ipc', 'avro'].includes(fileExt);
                                
                                // Les formats binaires complexes (notamment XLSX) nécessitent plus de tentatives
                                const maxRetries = isBinaryFormat ? 15 : 10;
                                const delayMs = isBinaryFormat ? 300 : 200;

                                // Attendre que le fichier soit disponible avec retry
                                const buffer = await DuckDBManager.waitForFile(fileName, maxRetries, delayMs);
                                
                                const bufLen = buffer?.byteLength ?? 0;
                                if (bufLen > 0) {
                                    const view = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : new Uint8Array(buffer.buffer || buffer);
                                    if (fileExt === 'xlsx' && (view[0] !== 0x50 || view[1] !== 0x4B)) {
                                        console.warn(`⚠️ [EXPORT] XLSX invalide: doit commencer par PK (0x50 0x4B), trouvé: 0x${view[0]?.toString(16)} 0x${view[1]?.toString(16)}`);
                                    }
                                }

                                // Déterminer le MIME type selon l'extension du fichier
                                let mime = 'text/csv;charset=utf-8;'; // par défaut CSV
                                
                                switch (fileExt) {
                                    // Formats Parquet
                                    case 'parquet':
                                    case 'pq':
                                        mime = 'application/octet-stream';
                                        break;
                                    
                                    // Format Excel
                                    case 'xlsx':
                                        mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                                        break;
                                    case 'xls':
                                        mime = 'application/vnd.ms-excel';
                                        break;
                                    
                                    // Formats JSON
                                    case 'json':
                                    case 'jsonl':
                                    case 'ndjson':
                                        mime = 'application/json;charset=utf-8;';
                                        break;
                                    
                                    // Formats texte
                                    case 'txt':
                                        mime = 'text/plain;charset=utf-8;';
                                        break;
                                    case 'tsv':
                                        mime = 'text/tab-separated-values;charset=utf-8;';
                                        break;
                                    case 'csv':
                                        mime = 'text/csv;charset=utf-8;';
                                        break;
                                    
                                    // Formats XML
                                    case 'xml':
                                        mime = 'application/xml;charset=utf-8;';
                                        break;
                                    
                                    // Formats binaires génériques
                                    case 'bin':
                                    case 'dat':
                                    case 'blob':
                                        mime = 'application/octet-stream';
                                        break;
                                    
                                    // Format Arrow
                                    case 'arrow':
                                    case 'ipc':
                                        mime = 'application/vnd.apache.arrow.stream';
                                        break;
                                    
                                    // Format Avro
                                    case 'avro':
                                        mime = 'application/avro';
                                        break;
                                    
                                    // Formats compressés
                                    case 'gz':
                                    case 'gzip':
                                        mime = 'application/gzip';
                                        break;
                                    case 'zip':
                                        mime = 'application/zip';
                                        break;
                                    case 'zst':
                                    case 'zstd':
                                        mime = 'application/zstd';
                                        break;
                                    
                                    // Valeur par défaut pour autres formats
                                    default:
                                        mime = 'application/octet-stream';
                                        break;
                                }

                                // Télécharger le fichier (ou l'ajouter au zip si mode zip actif)
                                // Copier dans un nouveau Uint8Array pour éviter problèmes SharedArrayBuffer / mémoire partagée
                                let view = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : new Uint8Array(buffer.buffer ?? buffer, buffer.byteOffset ?? 0, buffer.byteLength);
                                // Corriger bug DuckDB: copyFileToBuffer préfixe parfois 1 octet parasite avant les fichiers XLSX (ZIP)
                                if (fileExt === 'xlsx' && view.length >= 3 && view[0] !== 0x50 && view[1] === 0x50 && view[2] === 0x4B) {
                                    view = view.slice(1);
                                }
                                const dataForBlob = view.slice(0);
                                const blob = new Blob([dataForBlob], { type: mime });
                                const downloadFileName = fileName.split('/').pop();
                                this.downloadOrZipFile(downloadFileName, blob, mime);

                                cell._results = [];
                                cell._resultInfo = `✅ Fichier exporté: ${fileName} (${buffer.byteLength} octets) - ${cell._parseLevels.length - 1} niveau(x) de parsing`;
                            } catch (copyError) {
                                console.error('❌ Erreur lors de la récupération du fichier exporté:', copyError);

                                // Si copyFileToBuffer échoue, essayer d'exporter directement les résultats
                                this.setStatus('Récupération alternative des résultats...', 'loading');

                                // Extraire la requête SELECT de la commande COPY
                                const copyContentMatch = finalQuery.match(/COPY\s+\(([\s\S]+)\)\s+TO\s+/i);

                                if (copyContentMatch) {
                                    const selectQuery = copyContentMatch[1];
                                    const results = await DuckDBManager.executeQuery(selectQuery);

                                    // Convertir en TSV
                                    if (results.length > 0) {
                                        const headers = Object.keys(results[0]);
                                        const tsvContent = [
                                            headers.join('\t'),
                                            ...results.map(row => headers.map(h => row[h] ?? '').join('\t'))
                                        ].join('\n');

                                        const blob = new Blob([tsvContent], { type: 'text/plain;charset=utf-8;' });
                                        const downloadFileName = fileName.split('/').pop();
                                        this.downloadOrZipFile(downloadFileName, blob, 'text/plain;charset=utf-8;');

                                        cell._results = [];
                                        cell._resultInfo = `✅ Fichier exporté (mode alternatif): ${fileName} - ${results.length} ligne(s)`;
                                    } else {
                                        throw new Error('Aucun résultat à exporter');
                                    }
                                } else {
                                    throw copyError;
                                }
                            } finally {
                                // Supprimer le fichier du VFS pour éviter que la prochaine exécution écrase/échoue
                                await DuckDBManager.dropFile(fileName);
                            }
                        } else {
                            // Mode normal : exécuter et stocker les résultats
                            const finalResults = await DuckDBManager.executeQuery(finalQuery);
                            cell._results = finalResults;
                            cell._resultInfo = `✅ ${finalResults.length} ligne(s) - ${cell._parseLevels.length - 1} niveau(x) de parsing`;
                            // Si tabular, stocker dans _rawTableDataStore et rendre le tableau (comme type 'table')
                            if (this.isSqlResultTabular(cell)) {
                                const maxRows = cell.maxRows || 100000;
                                const truncated = finalResults.length > maxRows;
                                const rawResults = finalResults.slice(0, maxRows);
                                _rawTableDataStore.set(cell._id, rawResults);
                                cell._results = rawResults;
                                if (truncated) cell._resultInfo = `✅ ${finalResults.length} ligne(s) (limité à ${maxRows})` + (cell._parseLevels?.length > 1 ? ` - ${cell._parseLevels.length - 1} niveau(x) de parsing` : '');
                                await this.$nextTick();
                                await this.$nextTick(); // Double tick pour laisser Alpine rendre le template x-if du conteneur table
                                await this.renderTableInContainer(cell, true);
                            }
                        }

                        this.setStatus('SQL Recursive Parse exécuté', 'success');
                    } catch (error) {
                        // En cas d'erreur, on garde les niveaux déjà parsés pour debug
                        throw error;
                    }
                },

                async executeTableCell(cell) {
                    if (!ConfigManager.getCellQuery(cell, 0)?.trim()) return;

                    this.setStatus('Chargement tableau...', 'loading');

                    try {
                        // Utiliser la fonction partagée pour le parsing récursif
                        const finalQuery = await this.parseQueryRecursively(cell);

                        this.setStatus('Exécution de la requête finale...', 'loading');

                        // Exécuter la requête finale
                        const results = await DuckDBManager.executeQuery(finalQuery);

                        const maxRows = cell.maxRows || 100000;
                        const truncated = results.length > maxRows;
                        const rawResults = results.slice(0, maxRows);
                        // Stocker les données brutes hors Alpine pour éviter le freeze
                        // dû aux millions de traps Proxy lors de l'itération
                        _rawTableDataStore.set(cell._id, rawResults);
                        cell._results = rawResults;
                        cell._resultInfo = `${results.length} ligne(s)` + (truncated ? ` (limité à ${maxRows})` : '') +
                            (cell._parseLevels.length > 1 ? ` - ${cell._parseLevels.length - 1} niveau(x) de parsing` : '');

                        await this.$nextTick();

                        // Rendre le tableau (fromExecute=true lève le garde anti-cascade)
                        await this.renderTableInContainer(cell, true);

                        this.setStatus('Tableau chargé', 'success');
                    } catch (error) {
                        // En cas d'erreur, on garde les niveaux déjà parsés pour debug
                        throw error;
                    }
                },

                // Afficher l'éditeur SQL (devMode ou clientVisible sur queries[0])
                showSqlEditorVisible(cell) {
                    return this.devMode || ConfigManager.getCellQueryClientVisible(cell, 0);
                },
                // Helpers pour distinguer résultat tabular vs texte/JSON (cells sqlRecursiveParse)
                isSqlResultTabular(cell) {
                    const r = cell?._results;
                    if (!r || !Array.isArray(r) || r.length === 0) return false;
                    const row = r[0];
                    const keys = Object.keys(row);
                    if (keys.length > 1) return true;
                    if (r.length > 1) return true;
                    const val = row[keys[0]];
                    return typeof val !== 'string';
                },
                isSqlResultText(cell) {
                    const r = cell?._results;
                    if (!r || !Array.isArray(r) || r.length !== 1) return false;
                    const keys = Object.keys(r[0]);
                    return keys.length === 1 && typeof r[0][keys[0]] === 'string';
                },
                getSqlResultAsText(cell) {
                    if (!this.isSqlResultText(cell)) return '';
                    const keys = Object.keys(cell._results[0]);
                    return cell._results[0][keys[0]] ?? '';
                },

                // Fonction pour rendre un tableau dans son conteneur (appelée aussi par x-init)
                async renderTableInContainer(cell, fromExecute = false) {
                    const containerId = 'table-' + cell._id;
                    const container = document.getElementById(containerId);

                    // Si le conteneur a été recréé (ex: changement de page), réinitialiser le garde
                    // pour permettre le rendu du SimpleDataTable dans le nouveau DOM.
                    if (container && !container.querySelector('.datatable-wrapper')) {
                        cell._tableRenderGuard = false;
                    }

                    // Garde anti-cascade : les mutations DOM du DataTable déclenchent
                    // le MutationObserver Alpine → x-init re-fire → boucle infinie.
                    // Seul executeTableCell peut lever ce garde (fromExecute = true).
                    if (cell._tableRenderGuard && !fromExecute) return;
                    // Utiliser les données brutes du store (hors Proxy Alpine) pour éviter
                    // le freeze lors de l'itération sur des grands jeux de données.
                    // Fallback sur cell._results si le store est vide (ex: x-init au chargement).
                    const rawResults = _rawTableDataStore.get(cell._id) || cell._results;

                    if (container && rawResults && rawResults.length > 0) {
                        await CDNManager.loadSimpleDatatables();
                        if (this._tables[cell._id]) {
                            this._tables[cell._id].destroy();
                        }

                        // Parse column roles for PERCENT/TREND rendering and display names
                        const _parsedRoles = EChartSqlParser.parseColumnRoles(rawResults);
                        const _colRenderers = EChartSqlParser.buildTableColumnRenderers(_parsedRoles);
                        const _displayNames = EChartSqlParser.getTableColumnDisplayNames(_parsedRoles);
                        const _colKeys = Object.keys(rawResults[0]);
                        const _hasSpecialCols = Object.keys(_colRenderers).length > 0;

                        const tableData = {
                            headings: _colKeys.map(k => _displayNames[k] || k),
                            data: rawResults.map(row => _colKeys.map(k =>
                                _colRenderers[k] ? _colRenderers[k](row[k]) : (row[k] ?? '')
                            ))
                        };

                        const dataTable = new simpleDatatables.DataTable('#' + containerId, {
                            data: tableData,
                            html: _hasSpecialCols,
                            perPage: 10,
                            perPageSelect: [5, 10, 25, 50],
                            searchable: cell.type === 'table',
                            sortable: true,
                            labels: {
                                placeholder: "Rechercher...",
                                perPage: "entrées par page",
                                noRows: "Aucune donnée",
                                info: "Affichage de {start} à {end} sur {rows} entrées"
                            },
                            template: (options) => {
                                const c = options.classes;
                                const top = options.searchable
                                    ? `<div class="${c.top}"><div class="${c.search}"><input class="${c.input}" placeholder="${options.labels.placeholder || ''}" type="search"></div></div>`
                                    : `<div class="${c.top}"></div>`;
                                const bottom = options.paging
                                    ? `<div class="${c.bottom}" style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0.75rem;">
<div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">${options.perPageSelect ? `<div class="${c.dropdown}" style="display:flex;align-items:center;gap:0.5rem;"><label>${options.labels.perPage}</label><select class="${c.selector}"></select></div>` : ''}<div class="${c.info}"></div></div><nav class="${c.pagination}"></nav></div>`
                                    : '';
                                return `${top}<div class="${c.container}"></div>${bottom}`;
                            },
                            tableRender: (_data, table, type) => {
                                if (type === "print") {
                                    return table;
                                }

                                // Classes DaisyUI/Tailwind sur la table
                                table.attributes = table.attributes || {};
                                table.attributes.class = "table table-zebra table-pin-rows w-full";

                                const tHead = table.childNodes[0];
                                const tBody = table.childNodes[1];

                                // Style header
                                if (tHead && tHead.childNodes) {
                                    tHead.childNodes.forEach((tr, trIndex) => {
                                        tr.attributes = tr.attributes || {};
                                        tr.attributes.class = "bg-base-200";
                                        if (tr.childNodes) {
                                            tr.childNodes.forEach((th, thIndex) => {
                                                th.attributes = th.attributes || {};
                                                const stickyClass = thIndex === 0 ? " sticky left-0 z-10 bg-base-200" : "";
                                                th.attributes.class = "text-base-content font-semibold text-sm px-3 py-2" + stickyClass;
                                            });
                                        }
                                    });
                                }

                                // Style body rows
                                if (tBody && tBody.childNodes) {
                                    tBody.childNodes.forEach((tr, trIndex) => {
                                        tr.attributes = tr.attributes || {};
                                        const isEven = trIndex % 2 === 0;
                                        const rowClass = isEven ? "bg-base-100" : "bg-base-200/50";
                                        tr.attributes.class = `${rowClass} hover:bg-base-300/50 transition-colors`;
                                        if (tr.childNodes) {
                                            tr.childNodes.forEach((td, tdIndex) => {
                                                td.attributes = td.attributes || {};
                                                const stickyClass = tdIndex === 0 ? ` sticky left-0 z-10 ${isEven ? "bg-base-100" : "bg-base-200"}` : "";
                                                td.attributes.class = "text-base-content text-sm px-3 py-2" + stickyClass;
                                            });
                                        }
                                    });
                                }

                                // Ajouter ligne de filtres par colonne
                                const filterHeaders = {
                                    nodeName: "TR",
                                    attributes: { class: "bg-base-100 filter-row" },
                                    childNodes: tHead.childNodes[0].childNodes.map(
                                        (_th, index) => ({
                                            nodeName: "TH",
                                            attributes: {
                                                class: "px-2 py-1" + (index === 0 ? " sticky left-0 z-10 bg-base-100" : "")
                                            },
                                            childNodes: [
                                                {
                                                    nodeName: "INPUT",
                                                    attributes: {
                                                        class: "input input-bordered input-xs w-full column-filter",
                                                        type: "search",
                                                        placeholder: "Filtrer...",
                                                        "data-column-index": index
                                                    }
                                                }
                                            ]
                                        })
                                    )
                                };
                                tHead.childNodes.push(filterHeaders);
                                return table;
                            }
                        });

                        this._tables[cell._id] = dataTable;

                        // Ajouter les event listeners pour les filtres de colonne
                        dataTable.on('datatable.init', () => {
                            const filterInputs = container.querySelectorAll('.column-filter');
                            const columnFilters = {};

                            filterInputs.forEach(input => {
                                input.addEventListener('input', (e) => {
                                    const columnIndex = parseInt(e.target.dataset.columnIndex);
                                    const value = e.target.value.trim();

                                    // Stocker la valeur du filtre pour cette colonne
                                    if (value) {
                                        columnFilters[columnIndex] = value;
                                    } else {
                                        delete columnFilters[columnIndex];
                                    }

                                    // Construire les queries pour multiSearch
                                    const queries = Object.entries(columnFilters).map(([col, term]) => ({
                                        terms: [term],
                                        columns: [parseInt(col)]
                                    }));

                                    // Appliquer le filtre multi-colonnes
                                    dataTable.multiSearch(queries);
                                });
                            });
                        });

                        // Garde anti-cascade : les mutations DOM du DataTable déclenchent
                        // Alpine MutationObserver → x-init re-fire → on bloque les appels suivants.
                        cell._tableRenderGuard = true;
                    }
                },

                async executeMarkdownCell(cell) {
                    const languageType = ConfigManager.getCellEngine(cell, 'main');
                    if (languageType === 'text') {
                        cell._markdownContent = ConfigManager.getCellEditableContent(cell);
                        cell._resultInfo = '✅ Markdown (texte)';
                        return;
                    }
                    const cellQuery = ConfigManager.getCellQuery(cell, 'main');
                    if (!cellQuery?.trim()) return;

                    this.setStatus('Chargement Markdown...', 'loading');

                    try {
                        let mdContent;
                        if (languageType === 'js') {
                            cell._parseLevels = [];
                            let jsCode = this.parseQueryWithParameters(cellQuery || '');
                            cell._parseLevels.push({ level: 'final', innerQuery: jsCode, replacement: null });
                            try {
                                const result = eval(jsCode);
                                mdContent = typeof result === 'string' ? result : String(result);
                            } catch (jsError) {
                                throw new Error(`Erreur JS: ${jsError.message}`);
                            }
                        } else {
                            const cellLike = { queries: [{ name: 'main', sql: cellQuery, engine: 'sql', clientVisible: false }], _parseLevels: [] };
                            const finalQuery = await this.parseQueryRecursively(cellLike);
                            cell._parseLevels = cellLike._parseLevels || [];
                            this.setStatus('Exécution de la requête...', 'loading');
                            const results = await DuckDBManager.executeQuery(finalQuery);
                            mdContent = results.map(row => Object.values(row).join('')).join('\n');
                        }
                        cell._markdownContent = mdContent;
                        this.setStatus('Markdown chargé', 'success');
                    } catch (error) {
                        throw error;
                    }
                },

                async executeIframeCell(cell) {
                    const cellQuery = ConfigManager.getCellQuery(cell, 0);
                    if (!cellQuery?.trim()) return;

                    const languageType = ConfigManager.getCellEngine(cell, 0);
                    this.setStatus('Chargement HTML...', 'loading');

                    try {
                        let htmlContent;

                        if (languageType === 'text') {
                            htmlContent = (cellQuery || '').trim();
                            cell._parseLevels = [];
                            cell._resultInfo = '✅ Texte utilisé tel quel';
                        } else if (languageType === 'js') {
                            cell._parseLevels = [];
                            let jsCode = this.parseQueryWithParameters(cellQuery || '');
                            cell._parseLevels.push({ level: 'final', innerQuery: jsCode, replacement: null });
                            try {
                                const result = eval(jsCode);
                                htmlContent = typeof result === 'string' ? result : String(result);
                            } catch (jsError) {
                                throw new Error(`Erreur JS: ${jsError.message}`);
                            }
                            cell._resultInfo = '✅ HTML généré (JavaScript)';
                        } else {
                            const finalQuery = await this.parseQueryRecursively(cell);
                            this.setStatus('Exécution de la requête finale...', 'loading');
                            const results = await DuckDBManager.executeQuery(finalQuery);
                            htmlContent = results.map(row => Object.values(row).join('')).join('\n');
                            cell._resultInfo = `✅ HTML généré` + (cell._parseLevels.length > 1 ? ` - ${cell._parseLevels.length - 1} niveau(x) de parsing` : '');
                        }

                        cell._htmlContent = htmlContent;
                        await this.$nextTick();
                        this.renderIframeInContainer(cell);
                        this.setStatus('HTML chargé', 'success');
                    } catch (error) {
                        throw error;
                    }
                },

                // Fonction pour rendre un iframe dans son conteneur (appelée aussi par x-init)
                renderIframeInContainer(cell) {
                    const iframe = document.getElementById('iframe-' + cell._id);
                    if (iframe && cell._htmlContent) {
                        const doc = iframe.contentDocument || iframe.contentWindow.document;
                        doc.open();
                        doc.write(cell._htmlContent);
                        doc.close();
                    }
                },

                async executeSqlStatCell(cell) {
                    if (!ConfigManager.getCellQuery(cell, 0)?.trim()) return;

                    this.setStatus('Exécution de la stat SQL...', 'loading');

                    try {
                        // Utiliser la fonction partagée pour le parsing récursif
                        const finalQuery = await this.parseQueryRecursively(cell);

                        this.setStatus('Exécution de la requête finale...', 'loading');
                        const results = await DuckDBManager.executeQuery(finalQuery);

                        if (!results || results.length === 0) {
                            cell._results = [];
                            cell._statValue = '-';
                            cell._resultInfo = 'Aucun résultat';
                            return;
                        }

                        // Prendre la première colonne de la première ligne
                        const firstRow = results[0];
                        const statValue = Object.values(firstRow)[0];

                        cell._results = results;
                        cell._statValue = statValue !== null && statValue !== undefined ? String(statValue) : '-';
                        cell._resultInfo = `✅ Stat calculée` + (cell._parseLevels.length > 1 ? ` - ${cell._parseLevels.length - 1} niveau(x) de parsing` : '');

                        this.setStatus('Stat SQL exécutée', 'success');
                    } catch (error) {
                        // En cas d'erreur, on garde les niveaux déjà parsés pour debug
                        throw error;
                    }
                },

                async executeUiParameterCell(cell) {
                    cell._paramError = null;

                    // Si preserveUserValue est activé et que l'utilisateur a modifié la valeur, ne pas ré-exécuter
                    if (cell.preserveUserValue && cell._userModified) {
                        this.setStatus(`${ConfigManager.getCellReferenceName(cell)} : valeur utilisateur préservée`, 'success');
                        return;
                    }

                    try {
                        const languageType = ConfigManager.getCellEngine(cell, 0);
                        let results;

                        if (languageType === 'text') {
                            // Mode Texte : le contenu est retourné directement, pas d'engine
                            this.setStatus(`${ConfigManager.getCellReferenceName(cell)} : texte utilisé tel quel`, 'success');
                            const textValue = (ConfigManager.getCellQuery(cell, 0) || '').trim();
                            if (cell.paramType === 'dropdown') {
                                const lines = textValue.split('\n').filter(Boolean);
                                results = lines.map(line => ({ col1: line, col2: line }));
                            } else {
                                results = [{ value: textValue }];
                            }
                        } else if (languageType === 'js') {
                            // Mode JavaScript
                            this.setStatus('Exécution du code JavaScript...', 'loading');

                            // Initialiser _parseLevels
                            cell._parseLevels = [];

                            // Parser les paramètres $param dans le code JS
                            let jsCode = ConfigManager.getCellQuery(cell, 0) || '';
                            const originalCode = jsCode;
                            jsCode = this.parseQueryWithParameters(jsCode);


                            // Stocker le code final
                            cell._parseLevels.push({
                                level: 'final',
                                innerQuery: jsCode,
                                replacement: null
                            });

                            // Exécuter le code JavaScript
                            try {
                                const jsResult = eval(jsCode);

                                // Convertir le résultat en format compatible
                                if (cell.paramType === 'dropdown') {
                                    // Pour dropdown, on attend un tableau
                                    if (Array.isArray(jsResult)) {
                                        results = jsResult.map(item => {
                                            if (Array.isArray(item)) {
                                                // Tableau à 2 colonnes : [valeur, libellé]
                                                return {
                                                    col1: String(item[0] || ''),
                                                    col2: item.length > 1 ? String(item[1]) : String(item[0] || '')
                                                };
                                            } else {
                                                // Valeur simple : une seule colonne
                                                return { col1: String(item) };
                                            }
                                        });
                                    } else {
                                        throw new Error('Le code JS doit retourner un tableau pour un dropdown');
                                    }
                                } else {
                                    // Pour input et range, on attend une valeur simple
                                    results = [{ value: jsResult }];
                                }
                            } catch (jsError) {
                                throw new Error(`Erreur JS: ${jsError.message}`);
                            }
                        } else {
                            // Mode SQL (par défaut)
                            const finalQuery = await this.parseQueryRecursively(cell);
                            this.setStatus('Exécution de la requête finale...', 'loading');
                            results = await DuckDBManager.executeQuery(finalQuery);
                        }

                        if (cell.paramType === 'dropdown') {
                            if (results.length === 0) {
                                cell._options = [];
                                cell._value = '';
                                cell._paramError = 'La requête n\'a retourné aucun résultat';
                                return;
                            }

                            // Déterminer les colonnes disponibles
                            const columnKeys = Object.keys(results[0]);
                            const firstColumnKey = columnKeys[0];
                            const secondColumnKey = columnKeys.length > 1 ? columnKeys[1] : null;

                            // Construire les options avec value et label
                            cell._options = results.map(row => {
                                const value = String(row[firstColumnKey]);
                                const label = secondColumnKey ? String(row[secondColumnKey]) : value;
                                return { value, label };
                            });

                            // Initialiser avec la première valeur si pas déjà défini
                            const currentValues = cell._options.map(opt => opt.value);
                            if (!cell._value || !currentValues.includes(cell._value)) {
                                cell._value = cell._options[0]?.value || '';
                            }

                            cell._initialized = true;
                            this.setStatus(`Options ${ConfigManager.getCellReferenceName(cell)} chargées`, 'success');

                        } else if (cell.paramType === 'input') {
                            // Charger la valeur initiale si une requête est définie
                            if (results.length > 0) {
                                const firstColumnKey = Object.keys(results[0])[0];
                                const rawValue = results[0][firstColumnKey];
                                // Formater la valeur selon le type d'input (date, time, etc.)
                                cell._value = formatValueForInputType(rawValue, cell.inputType);
                            }

                            cell._initialized = true;
                            this.setStatus(`${ConfigManager.getCellReferenceName(cell)} initialisé`, 'success');

                        } else if (cell.paramType === 'range') {
                            // Charger la valeur initiale si une requête est définie
                            if (results.length > 0) {
                                const firstColumnKey = Object.keys(results[0])[0];
                                const rawValue = results[0][firstColumnKey];
                                const numValue = Number(rawValue);
                                const min = cell.rangeMin ?? 0;
                                const max = cell.rangeMax ?? 100;
                                // Clamper la valeur entre min et max
                                cell._value = Math.min(max, Math.max(min, isNaN(numValue) ? min : numValue));
                            } else if (cell._value === '' || cell._value === undefined) {
                                // Valeur par défaut = min
                                cell._value = cell.rangeMin ?? 0;
                            }

                            cell._initialized = true;
                            this.setStatus(`${ConfigManager.getCellReferenceName(cell)} initialisé`, 'success');
                        }

                        // Réinitialiser le flag _userModified après une exécution réussie
                        cell._userModified = false;
                    } catch (error) {
                        cell._paramError = 'Erreur: ' + error.message;
                        this.setStatus('Erreur: ' + error.message, 'error');
                    }
                },

                async executePublipostageWordCell(cell) {
                    // Charger PizZip et Docxtemplater à la demande
                    await CDNManager.loadDocxtemplater();

                    if (!cell.docxTemplateBase64) {
                        console.error('❌ No template loaded');
                        throw new Error('Aucun template Word chargé');
                    }

                    if (!ConfigManager.getCellQuery(cell, 0)?.trim()) {
                        console.error('❌ No data query');
                        throw new Error('Requête de données manquante');
                    }

                    if (!ConfigManager.getCellQuery(cell, 1)?.trim()) {
                        console.error('❌ No filename query');
                        throw new Error('Requête de nom de fichier manquante');
                    }

                    this.setStatus('Exécution du publipostage Word...', 'loading');

                    try {
                        // Parser et exécuter query (données)
                        const finalQuery = await this.parseQueryRecursively(cell);

                        this.setStatus('Récupération des données...', 'loading');
                        const dataResults = await DuckDBManager.executeQuery(finalQuery);

                        if (!dataResults || dataResults.length === 0) {
                            cell._resultInfo = 'Aucune donnée à traiter';
                            return;
                        }

                        // Parser et exécuter query2 (noms de fichiers)
                        const finalQuery2 = await this.parseQueryRecursively(cell, 1, true);

                        this.setStatus('Récupération des noms de fichiers...', 'loading');
                        const filenameResults = await DuckDBManager.executeQuery(finalQuery2);

                        if (!filenameResults || filenameResults.length === 0) {
                            throw new Error('La requête de nom de fichier n\'a retourné aucun résultat');
                        }

                        // Vérifier que le nombre de lignes correspond
                        if (dataResults.length !== filenameResults.length) {
                            throw new Error(`Nombre de lignes différent: ${dataResults.length} données vs ${filenameResults.length} noms de fichiers`);
                        }

                        // Décoder le template
                        const templateArrayBuffer = FileHandler.base64ToUint8Array(cell.docxTemplateBase64).buffer;

                        // Générer les documents
                        this.setStatus('Génération des documents Word...', 'loading');
                        let generatedCount = 0;

                        for (let i = 0; i < dataResults.length; i++) {
                            const rowData = dataResults[i];
                            const filenameRow = filenameResults[i];
                            const filename = Object.values(filenameRow)[0] || `document_${i + 1}.docx`;

                            // Parser les données JSON si nécessaire
                            let templateData = rowData;

                            // Si la ligne contient une seule colonne avec du JSON, le parser
                            const keys = Object.keys(rowData);
                            if (keys.length === 1) {
                                const value = rowData[keys[0]];
                                if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
                                    try {
                                        templateData = JSON.parse(value);
                                    } catch (e) {
                                        console.warn('⚠️ Failed to parse JSON, using raw data:', e);
                                    }
                                }
                            }

                            // Créer une nouvelle instance du template pour chaque document
                            const zip = new PizZip(templateArrayBuffer);
                            const doc = new window.docxtemplater(zip, {
                                paragraphLoop: true,
                                linebreaks: true,
                            });

                            // Injecter les données
                            doc.render(templateData);

                            // Générer le blob
                            const blob = doc.getZip().generate({
                                type: 'blob',
                                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            });

                            // Télécharger le fichier (ou l'ajouter au zip si mode zip actif)
                            this.downloadOrZipFile(filename, blob, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
                            generatedCount++;

                            this.setStatus(`Génération ${generatedCount}/${dataResults.length}...`, 'loading');
                        }

                        cell._resultInfo = `✅ ${generatedCount} document(s) généré(s)` +
                            (cell._parseLevels.length > 1 ? ` - ${cell._parseLevels.length - 1} niveau(x) de parsing (query)` : '') +
                            (cell._parseLevels2.length > 1 ? ` - ${cell._parseLevels2.length - 1} niveau(x) de parsing (query2)` : '');
                        this.setStatus(`${generatedCount} documents générés`, 'success');
                    } catch (error) {
                        throw error;
                    }
                },

                async executePdfmeCell(cell) {

                    // Charger pdfme à la demande (ESM dynamic import)
                    this.setStatus('Chargement de pdfme...', 'loading');
                    try {
                        var pdfme = await CDNManager.loadPdfme();
                    } catch (loadErr) {
                        console.error('[pdfme] ERREUR chargement CDN:', loadErr);
                        throw loadErr;
                    }

                    if (!ConfigManager.getCellQuery(cell, 0)?.trim()) {
                        console.error('[pdfme] Requête SQL manquante');
                        throw new Error('Requête SQL manquante');
                    }

                    const pdfmeTemplate = typeof cell.json === 'string' ? cell.json : (cell.json ? JSON.stringify(cell.json) : null);
                    if (!pdfmeTemplate?.trim()) {
                        console.error('[pdfme] Template pdfme manquant');
                        throw new Error('Template pdfme manquant');
                    }

                    this.setStatus('Exécution de la requête SQL...', 'loading');

                    try {
                        // Parser et exécuter la requête SQL
                        const finalQuery = await this.parseQueryRecursively(cell);

                        this.setStatus('Récupération des données...', 'loading');
                        const data = await DuckDBManager.executeQuery(finalQuery);

                        if (!data || data.length === 0) {
                            console.warn('[pdfme] Aucune donnée retournée par la requête');
                            cell._resultInfo = 'Aucune donnée à exporter';
                            return;
                        }

                        // Récupérer le nom du fichier depuis query2 si défini
                        let pdfFileName = 'export.pdf'; // Sera écrasé par query 2
                        if (ConfigManager.getCellQuery(cell, 1)?.trim()) {
                            this.setStatus('Récupération du nom de fichier...', 'loading');

                            const finalQuery2 = await this.parseQueryRecursively(cell, 1, true);
                            const filenameResults = await DuckDBManager.executeQuery(finalQuery2);

                            if (filenameResults && filenameResults.length > 0) {
                                const filenameValue = Object.values(filenameResults[0])[0];
                                if (filenameValue) {
                                    pdfFileName = String(filenameValue);
                                }
                            }
                        }

                        this.setStatus('Génération du PDF (pdfme)...', 'loading');

                        // Parser le template JSON
                        let template;
                        try {
                            template = JSON.parse(pdfmeTemplate);
                        } catch (parseErr) {
                            console.error('[pdfme] ERREUR parsing template JSON:', parseErr);
                            throw new Error('Template JSON invalide: ' + parseErr.message);
                        }

                        // Résoudre les plugins depuis @pdfme/schemas
                        let pluginsConfig;
                        try {
                            pluginsConfig = JSON.parse('{"Text": "text", "Table": "table"}'); // Chargés automatiquement
                        } catch (parseErr) {
                            console.error('[pdfme] ERREUR parsing plugins JSON:', parseErr);
                            throw new Error('Plugins JSON invalide: ' + parseErr.message);
                        }

                        const plugins = {};
                        for (const [name, path] of Object.entries(pluginsConfig)) {
                            const parts = String(path).split('.');
                            let obj = pdfme.schemas;
                            for (const part of parts) {
                                if (obj && obj[part] !== undefined) {
                                    obj = obj[part];
                                } else {
                                    console.error(`[pdfme] Plugin introuvable: "${path}" partie "${part}"`, 'Clés disponibles:', obj ? Object.keys(obj) : 'obj est null/undefined');
                                    throw new Error(`Plugin introuvable: "${path}" (partie "${part}" non trouvée dans @pdfme/schemas). Clés disponibles: ${obj ? Object.keys(obj).join(', ') : 'aucune'}`);
                                }
                            }
                            plugins[name] = obj;
                        }

                        // Chaque ligne SQL = 1 input (1 page). Les noms de colonnes = noms des schemas
                        // Les valeurs JSON (arrays, objects) sont parsées automatiquement

                        // Extraire tous les noms de champs du template pour les valeurs par défaut
                        const fieldNames = new Set();
                        if (template.schemas && Array.isArray(template.schemas)) {
                            template.schemas.forEach(pageSchemas => {
                                if (Array.isArray(pageSchemas)) {
                                    pageSchemas.forEach(s => {
                                        if (s.name) fieldNames.add(s.name);
                                    });
                                }
                            });
                        }

                        const inputs = data.map((row, i) => {
                            const input = {};

                            // 1. Initialiser avec le contenu statique du template comme valeur par défaut
                            template.schemas.forEach(pageSchemas => {
                                pageSchemas.forEach(s => {
                                    if (s.name) {
                                        let val = s.content || '';
                                        try {
                                            const parsed = JSON.parse(val);
                                            input[s.name] = (Array.isArray(parsed) || typeof parsed === 'object') ? parsed : String(val);
                                        } catch {
                                            input[s.name] = String(val);
                                        }
                                    }
                                });
                            });

                            // 2. Surcharger avec les données SQL
                            for (const [key, value] of Object.entries(row)) {
                                if (typeof value === 'string') {
                                    // Tenter de parser les valeurs JSON (ex: [[...]] pour table)
                                    try {
                                        const parsed = JSON.parse(value);
                                        if (Array.isArray(parsed) || typeof parsed === 'object') {
                                            input[key] = parsed;
                                        } else {
                                            input[key] = String(value);
                                        }
                                    } catch {
                                        input[key] = String(value);
                                    }
                                } else {
                                    input[key] = String(value ?? '');
                                }
                            }
                            return input;
                        });
                        
                        if (!inputs || !Array.isArray(inputs) || inputs.length === 0) {
                            console.warn('[pdfme] Aucun input généré par le mapping');
                            cell._resultInfo = 'Aucun input généré par le mapping';
                            return;
                        }

                        // Générer le PDF avec pdfme
                        let pdf;
                        try {
                            pdf = await pdfme.generator.generate({ template, inputs, plugins });
                        } catch (genErr) {
                            console.error('[pdfme] ERREUR generate():', genErr);
                            console.error('[pdfme] generate() stack:', genErr.stack);
                            throw genErr;
                        }
                        // Télécharger ou zipper
                        // Utiliser pdf directement (Uint8Array) plutôt que pdf.buffer (ArrayBuffer partagé potentiellement plus grand)
                        const pdfBlob = new Blob([pdf], { type: 'application/pdf' });

                        if (this._zipMode) {
                            this.downloadOrZipFile(pdfFileName, pdfBlob, 'application/pdf');
                        } else {
                            const url = URL.createObjectURL(pdfBlob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = pdfFileName;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        }

                        cell._resultInfo = `✅ PDF généré: ${pdfFileName} (${inputs.length} page(s), ${data.length} ligne(s) SQL)` +
                            (cell._parseLevels.length > 1 ? ` - ${cell._parseLevels.length - 1} niveau(x) de parsing` : '') +
                            (cell._parseLevels2?.length > 1 ? ` - ${cell._parseLevels2.length - 1} niveau(x) de parsing (query2)` : '');
                        this.setStatus('PDF généré avec succès (pdfme)', 'success');
                    } catch (error) {
                        console.error('[pdfme] === ERREUR executePdfmeCell ===', error);
                        console.error('[pdfme] Stack:', error.stack);
                        throw error;
                    }
                },

                async executePerspectiveCell(cell) {
                    if (!ConfigManager.getCellQuery(cell, 0)?.trim()) {
                        throw new Error('Requête SQL manquante');
                    }

                    // Charger Perspective CDN à la demande
                    this.setStatus('Chargement de Perspective...', 'loading');
                    await CDNManager.loadPerspective();

                    this.setStatus('Parsing de la requête SQL...', 'loading');

                    try {
                        // Parser et exécuter la requête SQL avec le parsing récursif
                        const finalQuery = await this.parseQueryRecursively(cell);

                        this.setStatus('Exécution de la requête...', 'loading');

                        // Récupérer les données en format Arrow (non converti en array)
                        const arrowTable = await DuckDBManager.executeQueryArrow(finalQuery);

                        // Stocker la table Arrow pour le rendu
                        cell._arrowTable = arrowTable;
                        cell._perspectiveReady = true;

                        // Attendre le prochain tick pour que le DOM soit prêt
                        await this.$nextTick();

                        // Rendre le viewer Perspective
                        await this.renderPerspectiveInContainer(cell);

                        const rowCount = arrowTable.numRows;
                        cell._resultInfo = `✅ ${rowCount} ligne(s)` +
                            (cell._parseLevels.length > 1 ? ` - ${cell._parseLevels.length - 1} niveau(x) de parsing` : '');
                        this.setStatus('Perspective chargé', 'success');
                    } catch (error) {
                        cell._perspectiveReady = false;
                        throw error;
                    }
                },

                async renderPerspectiveInContainer(cell) {
                    const containerId = 'perspective-' + cell._id;
                    const viewer = document.getElementById(containerId);

                    if (!viewer || !cell._arrowTable) {
                        console.warn('Perspective viewer ou données Arrow manquantes');
                        return;
                    }

                    // Éviter les exécutions concurrentes
                    if (cell._perspectiveRendering) {
                        console.warn('Rendu Perspective déjà en cours pour cette cellule');
                        return;
                    }

                    cell._perspectiveRendering = true;

                    try {
                        // Vérifier que le moteur est duckdb-wasm (Perspective ne supporte pas ducklings)
                        if (DuckDBManager.getEngine() !== 'duckdb-wasm') {
                            throw new Error('Perspective nécessite le moteur DuckDB WASM. Veuillez changer de moteur dans les paramètres.');
                        }

                        // Obtenir la connexion DuckDB
                        const conn = DuckDBManager.getConnection();
                        const perspective = window.perspectiveClient;

                        // Parser la configuration JSON si présente (string ou objet déjà parsé)
                        let config = { theme: 'Pro Light' };
                        const perspectiveConfig = cell.json?.perspectiveConfig;
                        if (perspectiveConfig != null && perspectiveConfig !== '') {
                            try {
                                const userConfig = typeof perspectiveConfig === 'string'
                                    ? JSON.parse(perspectiveConfig.trim())
                                    : perspectiveConfig;
                                config = { ...config, ...userConfig };
                            } catch (e) {
                                console.warn('Configuration Perspective invalide, utilisation des valeurs par défaut:', e);
                            }
                        }

                        // Récupérer la requête finale
                        const finalQuery = cell._parseLevels?.find(l => l.level === 'final')?.innerQuery || ConfigManager.getCellQuery(cell, 0);

                        // Flux natif : DuckDB requête → Arrow → Perspective
                        const arrowResult = await conn.query(finalQuery);
                        const batches = [];
                        for await (const batch of arrowResult) {
                            batches.push(batch);
                        }

                        if (!cell._perspectiveWorker) {
                            cell._perspectiveWorker = await perspective.worker();
                        }
                        const table = await cell._perspectiveWorker.table(batches);

                        // Laisser le custom element perspective-viewer (WASM) s'initialiser complètement
                        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

                        if (typeof viewer.resetThemes === 'function') {
                            await viewer.resetThemes(['Pro Light', 'Pro Dark']);
                        }
                        await viewer.load(table);
                        await viewer.restore(config);

                        cell._perspectiveTable = table;

                    } catch (error) {
                        console.error('Erreur lors du rendu Perspective:', error);
                        throw error;
                    } finally {
                        cell._perspectiveRendering = false;
                    }
                },


                async executeEchartCell(cell) {
                    if (!ConfigManager.getCellQuery(cell, 0)?.trim()) {
                        throw new Error('Requête SQL manquante');
                    }

                    this.setStatus('Chargement ECharts...', 'loading');
                    await CDNManager.loadECharts();

                    this.setStatus('Parsing de la requête SQL...', 'loading');

                    try {
                        const finalQuery = await this.parseQueryRecursively(cell);

                        this.setStatus('Exécution de la requête...', 'loading');
                        const results = await DuckDBManager.executeQuery(finalQuery);

                        cell._results = results;
                        cell._echartReady = true;

                        await this.$nextTick();

                        await this.renderEchartInContainer(cell, true);

                        cell._resultInfo = `✅ ${results.length} ligne(s)` +
                            (cell._parseLevels.length > 1
                                ? ` - ${cell._parseLevels.length - 1} niveau(x) de parsing`
                                : '');
                        this.setStatus('EChart chargé', 'success');
                    } catch (error) {
                        cell._echartReady = false;
                        throw error;
                    }
                },

                async renderEchartInContainer(cell, fromExecute = false) {
                    const containerId = 'echart-' + cell._id;
                    const container = document.getElementById(containerId);

                    if (!container || !cell._results || cell._results.length === 0) {
                        return;
                    }

                    if (cell._echartRendering) return;
                    cell._echartRendering = true;

                    try {
                        // Dispose previous instance
                        if (cell._echartInstance) {
                            cell._echartInstance.dispose();
                            cell._echartInstance = null;
                        }
                        // Disconnect previous resize observer
                        if (cell._echartResizeObserver) {
                            cell._echartResizeObserver.disconnect();
                            cell._echartResizeObserver = null;
                        }

                        const parsed = EChartSqlParser.parseColumnRoles(cell._results);
                        const { chartType } = parsed;

                        // KPI: render as HTML, no ECharts instance
                        if (chartType === 'kpi') {
                            container.innerHTML = EChartSqlParser.buildKpiHtml(cell._results, parsed);
                            return;
                        }

                        // Unknown type: show guidance message
                        const option = EChartSqlParser.buildEChartsOption(cell._results, parsed);
                        if (!option) {
                            container.innerHTML = `<div class="flex items-center justify-center h-full text-base-content/50 text-sm p-6 text-center">
                                Aucun type de graphique reconnu.<br>
                                Utilisez des alias comme <strong>XAXIS</strong>, <strong>BARCHART</strong>, <strong>LINECHART</strong>, <strong>PIECHART</strong>, <strong>GAUGE</strong>…</div>`;
                            return;
                        }

                        // Initialize ECharts and render
                        const instance = window.echarts.init(container, null, { renderer: 'canvas' });
                        instance.setOption(option);
                        cell._echartInstance = instance;

                        // Responsive resize
                        const ro = new ResizeObserver(() => {
                            if (cell._echartInstance && !cell._echartInstance.isDisposed()) {
                                cell._echartInstance.resize();
                            }
                        });
                        ro.observe(container);
                        cell._echartResizeObserver = ro;

                    } catch (error) {
                        console.error('[EChart] Erreur de rendu:', error);
                        throw error;
                    } finally {
                        cell._echartRendering = false;
                    }
                },

                async runGroupsFromIndex(startGroupIndex) {
                    for (let groupIndex = startGroupIndex; groupIndex < this.groups.length; groupIndex++) {
                        await this.runGroup(groupIndex);
                    }
                },

                // Exécuter les groupes à partir d'un index avec conditions d'arrêt
                // Retourne {stopped: boolean, reason: string} si arrêté prématurément
                async runGroupsFromIndexWithStopConditions(startGroupIndex) {
                    for (let groupIndex = startGroupIndex; groupIndex < this.groups.length; groupIndex++) {
                        const result = await this.runGroupWithStopConditions([groupIndex]);
                        if (result.stopped) {
                            return result;
                        }
                    }
                    return { stopped: false };
                },

                // Exécuter un groupe avec conditions d'arrêt
                async runGroupWithStopConditions(path) {
                    const group = this.getGroupAtPath(path);
                    if (!group) return { stopped: false };

                    // Évaluer queries[0] (condition d'affichage) avant d'exécuter le groupe (comme dans runGroupOnce)
                    if (ConfigManager.getGroupIfQuery(group)) {
                        this.setStatus('Évaluation de la condition ifQuery...', 'loading');
                        const ifQueryResult = await this.evaluateGroupIfQuery(group);
                        group._ifQueryResult = ifQueryResult;

                        if (!ifQueryResult) {
                            this.setStatus('Groupe ignoré (ifQuery = false)', 'info');
                            return { stopped: false };
                        }
                    }

                    const orderedItems = this.getAllItemsSorted(group);
                    for (const item of orderedItems) {
                        if (item.type === 'child') {
                            const result = await this.runGroupWithStopConditions([...path, item.originalIndex]);
                            if (result.stopped) return result;
                            continue;
                        }

                        const cell = item.item;

                        // Condition d'arrêt : cellule buttonRunNextCells (bloquant)
                        if (cell.type === 'buttonRunNextCells') {
                            return { stopped: true, reason: 'buttonRunNextCells' };
                        }
                        if (this.isCellSkippedInAutoFlow(cell)) continue;

                        // Condition d'arrêt : cellule source sans fichier ou non chargée
                        if (cell.type === 'source') {
                            if (!cell._fileName || !cell._currentFile || !cell._loaded) {
                                return { stopped: true, reason: 'source_no_file', cellName: cell.name };
                            }
                            if (cell._status === 'error') {
                                this.setStatus(`Arrêt : la source "${cell.name}" a une erreur de chargement`, 'info');
                                return { stopped: true, reason: 'source_error', cellName: cell.name };
                            }
                            // Les cellules source sont déjà chargées, on ne les exécute pas
                            continue;
                        }

                        // Exécuter la cellule et vérifier les erreurs
                        try {
                            cell._status = 'running';
                            await this.runCellAt(path, item.originalIndex);

                            if (cell._status === 'error') {
                                this.setStatus(`Arrêt : erreur lors de l'exécution d'une cellule`, 'error');
                                return { stopped: true, reason: 'cell_error' };
                            }
                        } catch (error) {
                            cell._status = 'error';
                            this.setStatus(`Arrêt : erreur - ${error.message}`, 'error');
                            return { stopped: true, reason: 'execution_error', error: error.message };
                        }
                    }

                    return { stopped: false };
                },

                // Exécuter les cellules après une cellule donnée avec conditions d'arrêt (pour autoRunNextCells)
                async runCellsAfterWithStopConditions(path, cellIndex, cellId = null) {
                    const group = this.getGroupAtPath(path);
                    if (!group) return { stopped: false };

                    const orderedItems = this.getAllItemsSorted(group);
                    const startIndex = orderedItems.findIndex(item =>
                        item.type === 'cell' &&
                        (cellId ? item.item?._id === cellId : item.originalIndex === cellIndex)
                    );
                    if (startIndex === -1) return { stopped: false };

                    for (let i = startIndex + 1; i < orderedItems.length; i++) {
                        const item = orderedItems[i];

                        if (item.type === 'child') {
                            const result = await this.runGroupWithStopConditions([...path, item.originalIndex]);
                            if (result.stopped) return result;
                            continue;
                        }

                        const cell = item.item;

                        // Condition d'arrêt : cellule buttonRunNextCells (bloquant)
                        if (cell.type === 'buttonRunNextCells') {
                            this.setStatus('Arrêt : bouton "Exécuter les cellules suivantes" rencontré', 'info');
                            return { stopped: true, reason: 'buttonRunNextCells' };
                        }
                        if (this.isCellSkippedInAutoFlow(cell)) continue;

                        // Condition d'arrêt : cellule source sans fichier ou non chargée
                        if (cell.type === 'source') {
                            if (!cell._fileName || !cell._currentFile || !cell._loaded) {
                                this.setStatus(`Arrêt : la source "${cell.name}" n'a pas de fichier chargé`, 'info');
                                return { stopped: true, reason: 'source_no_file', cellName: cell.name };
                            }
                            if (cell._status === 'error') {
                                this.setStatus(`Arrêt : la source "${cell.name}" a une erreur de chargement`, 'info');
                                return { stopped: true, reason: 'source_error', cellName: cell.name };
                            }
                            continue;
                        }

                        // Exécuter la cellule et vérifier les erreurs
                        try {
                            cell._status = 'running';
                            await this.runCellAt(path, item.originalIndex);

                            if (cell._status === 'error') {
                                this.setStatus(`Arrêt : erreur lors de l'exécution d'une cellule`, 'error');
                                return { stopped: true, reason: 'cell_error' };
                            }
                        } catch (error) {
                            cell._status = 'error';
                            this.setStatus(`Arrêt : erreur - ${error.message}`, 'error');
                            return { stopped: true, reason: 'execution_error', error: error.message };
                        }
                    }

                    // Remonter la hiérarchie des groupes parents et continuer les items restants
                    let currentPath = [...path];
                    while (currentPath.length > 1) {
                        const childIndexInParent = currentPath[currentPath.length - 1];
                        currentPath = currentPath.slice(0, -1);
                        const parentGroup = this.getGroupAtPath(currentPath);
                        if (!parentGroup) break;

                        const parentOrderedItems = this.getAllItemsSorted(parentGroup);
                        const childPos = parentOrderedItems.findIndex(item =>
                            item.type === 'child' && item.originalIndex === childIndexInParent
                        );
                        if (childPos === -1) break;

                        // Continuer avec les items après le sous-groupe dans le parent
                        for (let i = childPos + 1; i < parentOrderedItems.length; i++) {
                            const item = parentOrderedItems[i];

                            if (item.type === 'child') {
                                const result = await this.runGroupWithStopConditions([...currentPath, item.originalIndex]);
                                if (result.stopped) return result;
                                continue;
                            }

                            const cell = item.item;

                            if (cell.type === 'buttonRunNextCells') {
                                this.setStatus('Arrêt : bouton "Exécuter les cellules suivantes" rencontré', 'info');
                                return { stopped: true, reason: 'buttonRunNextCells' };
                            }
                            if (this.isCellSkippedInAutoFlow(cell)) continue;

                            if (cell.type === 'source') {
                                if (!cell._fileName || !cell._currentFile || !cell._loaded) {
                                    this.setStatus(`Arrêt : la source "${cell.name}" n'a pas de fichier chargé`, 'info');
                                    return { stopped: true, reason: 'source_no_file', cellName: cell.name };
                                }
                                if (cell._status === 'error') {
                                    this.setStatus(`Arrêt : la source "${cell.name}" a une erreur de chargement`, 'info');
                                    return { stopped: true, reason: 'source_error', cellName: cell.name };
                                }
                                continue;
                            }

                            try {
                                cell._status = 'running';
                                await this.runCellAt(currentPath, item.originalIndex);
                                if (cell._status === 'error') {
                                    this.setStatus(`Arrêt : erreur lors de l'exécution d'une cellule`, 'error');
                                    return { stopped: true, reason: 'cell_error' };
                                }
                            } catch (error) {
                                cell._status = 'error';
                                this.setStatus(`Arrêt : erreur - ${error.message}`, 'error');
                                return { stopped: true, reason: 'execution_error', error: error.message };
                            }
                        }
                    }

                    // Au niveau racine, propager aux groupes suivants
                    if (currentPath.length === 1) {
                        const rootGroupIndex = currentPath[0];
                        const result = await this.runGroupsFromIndexWithStopConditions(rootGroupIndex + 1);
                        if (result.stopped) return result;
                    }

                    return { stopped: false };
                },

                // Exécuter toutes les cellules après une cellule donnée (pour buttonRunNextCells)
                async runCellsAfter(path, cellIndex) {
                    this.isLoading = true;
                    this.setStatus('Exécution des cellules suivantes...', 'loading');

                    try {
                        const group = this.getGroupAtPath(path);
                        if (!group) return;

                        const orderedItems = this.getAllItemsSorted(group);
                        const startIndex = orderedItems.findIndex(
                            item => item.type === 'cell' && item.originalIndex === cellIndex
                        );
                        if (startIndex === -1) return;

                        for (let i = startIndex + 1; i < orderedItems.length; i++) {
                            const item = orderedItems[i];
                            if (item.type === 'child') {
                                await this.runGroupAtPath([...path, item.originalIndex]);
                                continue;
                            }
                            const cell = item.item;
                            if (cell?.type === 'buttonRunNextCells') break;
                            if (this.isCellSkippedInAutoFlow(cell)) continue;
                            await this.runCellAt(path, item.originalIndex);
                        }

                        // Exécuter tous les groupes suivants au niveau racine
                        if (path.length === 1) {
                            const rootGroupIndex = path[0];
                            await this.runGroupsFromIndex(rootGroupIndex + 1);
                        }

                        this.setStatus('Exécution terminée', 'success');
                    } catch (error) {
                        this.setStatus('Erreur: ' + error.message, 'error');
                    } finally {
                        this.isLoading = false;
                    }
                },

                // Exécuter tous les groupes de la page active
                async runAllGroups() {
                    this.isLoading = true;
                    this.setStatus('Exécution de tous les groupes...', 'loading');

                    // Réévaluer les ifQuery avant l'exécution (données à jour)
                    await this.evaluateAllGroupIfQueries();

                    for (let groupIndex = 0; groupIndex < this.groups.length; groupIndex++) {
                        const result = await this.runGroup(groupIndex);
                        if (result?.stopped) {
                            this.isLoading = false;
                            return; // Ne pas exécuter les groupes suivants
                        }
                    }

                    this.isLoading = false;
                    this.setStatus('Toutes les cellules de la page exécutées', 'success');
                },
    };
}
