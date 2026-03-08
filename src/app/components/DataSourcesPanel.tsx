// @ts-nocheck
/**
 * DataSourcesPanel — Panneau latéral de gestion des sources de données.
 * Rendu dans le mosaic layout de RoomShell (placement: 'sidebar').
 *
 * Sections :
 * - Fichiers : fichiers chargés (cells source + dropzone)
 * - Tables DuckDB : tables disponibles avec colonnes et types
 */
import { RoomPanel, TableCard, useBaseRoomShellStore } from '@sqlrooms/room-shell'
import { FileDropzone } from '@sqlrooms/dropzone'
import { convertToValidColumnOrTableName } from '@sqlrooms/utils'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    useToast,
    Button,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@sqlrooms/ui'
import { FolderIcon, TableIcon, FileTextIcon, XIcon, UploadIcon, DatabaseIcon } from 'lucide-react'
import { useNotebookStore } from '../store/notebookStore'

// ─── Section Fichiers ─────────────────────────────────────────────────────────
function FilesSection() {
    const _roomFiles = useNotebookStore(s => s._roomFiles)
    const files = _roomFiles ?? []

    if (files.length === 0) {
        return (
            <div className="px-2 py-3 text-xs text-muted-foreground text-center">
                Aucun fichier chargé
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-1">
            {files.map((f: any) => (
                <div key={f.tableName} className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-muted/50">
                    <FileTextIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="text-xs truncate font-mono">{f.name}</div>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                <p className="text-xs font-mono">{f.name}</p>
                            </TooltipContent>
                        </Tooltip>
                        <div className="text-xs text-muted-foreground font-mono">→ {f.tableName}</div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        {f.source === 'dropzone' && (
                            <UploadIcon className="h-3 w-3 text-muted-foreground" title="importé via dropzone" />
                        )}
                        {f.size > 0 && (
                            <span className="text-xs text-muted-foreground">
                                {f.size < 1024 ? `${f.size}B`
                                    : f.size < 1048576 ? `${(f.size / 1024).toFixed(1)}KB`
                                    : `${(f.size / 1048576).toFixed(1)}MB`}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

// ─── Section Tables ───────────────────────────────────────────────────────────
function TablesSection() {
    const _duckdbTables = useNotebookStore(s => s._duckdbTables)
    const tables = Object.entries(_duckdbTables || {})

    if (tables.length === 0) {
        return (
            <div className="px-2 py-3 text-xs text-muted-foreground text-center">
                Aucune table chargée
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2">
            {tables.map(([tableName, data]: [string, any]) => (
                <TableCard
                    key={tableName}
                    value={{
                        tableName,
                        columns: data.columns,  // [{name, type}]
                        rowCount: data.rowCount,
                    }}
                />
            ))}
        </div>
    )
}

// ─── DataSourcesPanel ─────────────────────────────────────────────────────────
export const DataSourcesPanel = () => {
    const addRoomFile = useNotebookStore(s => s.addRoomFile)
    const { toast } = useToast()

    async function handleDrop(files: File[]) {
        for (const file of files) {
            try {
                const tableName = convertToValidColumnOrTableName(file.name)
                await addRoomFile?.(file, tableName)
                toast({
                    title: 'Table créée',
                    description: `${file.name} → ${tableName}`,
                })
            } catch (err) {
                toast({
                    variant: 'destructive',
                    title: 'Erreur',
                    description: `Erreur lors du chargement de ${file.name}: ${err}`,
                })
            }
        }
    }

    const togglePanel = useBaseRoomShellStore(s => s.layout.togglePanel)

    return (
        <RoomPanel type="data" showHeader={false} className="flex flex-col h-full overflow-hidden">
            {/* Header custom sans épinglage */}
            <div className="flex items-center justify-between px-3 py-2 bg-secondary/50 shrink-0">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <DatabaseIcon className="h-4 w-4" />
                    <h2 className="text-xs font-semibold uppercase">Sources</h2>
                </div>
                <button
                    aria-label="Fermer le panneau Sources"
                    onClick={() => togglePanel('data')}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <XIcon className="w-[18px]" />
                </button>
            </div>
            {/* Dropzone */}
            <div className="p-2 border-b border-border shrink-0">
                <FileDropzone
                    className="min-h-[80px]"
                    acceptedFormats={{
                        'text/csv': ['.csv'],
                        'text/tab-separated-values': ['.tsv'],
                        'application/octet-stream': ['.parquet'],
                        'application/json': ['.json'],
                    }}
                    onDrop={handleDrop}
                >
                    <p className="text-xs text-muted-foreground text-center">
                        CSV, TSV, Parquet, JSON
                    </p>
                </FileDropzone>
            </div>

            {/* Accordion Files + Tables */}
            <div className="flex-1 overflow-auto px-2">
                <Accordion type="multiple" defaultValue={['files', 'tables']}>
                    <AccordionItem value="files">
                        <AccordionTrigger className="gap-1 px-1 py-2">
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <FolderIcon className="h-3.5 w-3.5" />
                                <span className="text-xs font-semibold uppercase tracking-wide">Fichiers</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                            <FilesSection />
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="tables">
                        <AccordionTrigger className="gap-1 px-1 py-2">
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <TableIcon className="h-3.5 w-3.5" />
                                <span className="text-xs font-semibold uppercase tracking-wide">Tables DuckDB</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                            <TablesSection />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </RoomPanel>
    )
}
