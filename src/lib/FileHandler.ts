import { CDNManager } from './CDNManager'

// XLSX est chargé dynamiquement via CDNManager.loadXlsx() et exposé sur window
declare const XLSX: any;

        export class FileHandler {
            static getMimeTypeFromFileName(fileName) {
                const ext = fileName.split('.').pop().toLowerCase();
                const mimeTypes = {
                    'csv': 'text/csv',
                    'parquet': 'application/octet-stream',
                    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'xls': 'application/vnd.ms-excel'
                };
                return mimeTypes[ext] || 'application/octet-stream';
            }

            static async compressGzip(arrayBuffer) {
                if (typeof CompressionStream === 'undefined') {
                    throw new Error('CompressionStream non supporté');
                }

                const compressionStream = new CompressionStream('gzip');
                const reader = compressionStream.readable.getReader();
                const chunks = [];

                const readPromise = (async () => {
                    let done = false;
                    while (!done) {
                        const { value, done: streamDone } = await reader.read();
                        done = streamDone;
                        if (value) chunks.push(value);
                    }
                })();

                const writer = compressionStream.writable.getWriter();
                await writer.write(new Uint8Array(arrayBuffer));
                await writer.close();
                await readPromise;

                return await new Blob(chunks).arrayBuffer();
            }

            static async decompressGzip(compressedData) {
                if (typeof DecompressionStream === 'undefined') {
                    throw new Error('DecompressionStream non supporté');
                }

                const decompressionStream = new DecompressionStream('gzip');
                const reader = decompressionStream.readable.getReader();
                const chunks = [];

                const readPromise = (async () => {
                    let done = false;
                    while (!done) {
                        const { value, done: streamDone } = await reader.read();
                        done = streamDone;
                        if (value) chunks.push(value);
                    }
                })();

                const writer = decompressionStream.writable.getWriter();
                await writer.write(compressedData);
                await writer.close();
                await readPromise;

                return await new Blob(chunks).arrayBuffer();
            }

            static arrayBufferToBase64(arrayBuffer) {
                const bytes = new Uint8Array(arrayBuffer);
                let binary = '';
                for (let i = 0; i < bytes.length; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                return btoa(binary);
            }

            static base64ToUint8Array(base64) {
                const binaryString = atob(base64);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                return bytes;
            }

            static async processExcelFile(file, xlsxOptions, xlsxToCsvOptions, xlsxSheetSelection) {
                // Charger xlsx (SheetJS) à la demande
                await CDNManager.loadXlsx();

                const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array', ...xlsxOptions });

                let selectedSheetName = workbook.SheetNames[0];
                const sheetSelection = xlsxSheetSelection || { type: { auto: true } };

                if (sheetSelection.type?.name && sheetSelection.name) {
                    if (workbook.SheetNames.includes(sheetSelection.name)) {
                        selectedSheetName = sheetSelection.name;
                    }
                } else if (sheetSelection.type?.index && sheetSelection.index > 0) {
                    if (sheetSelection.index < workbook.SheetNames.length) {
                        selectedSheetName = workbook.SheetNames[sheetSelection.index];
                    }
                }

                const selectedSheet = workbook.Sheets[selectedSheetName];
                const csv = XLSX.utils.sheet_to_csv(selectedSheet, xlsxToCsvOptions || {});

                return {
                    csv,
                    csvFileName: file.name.replace(/\.(xlsx|xls)$/i, '.csv'),
                    sheetName: selectedSheetName
                };
            }

            static downloadFile(blob, fileName) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }
        }
