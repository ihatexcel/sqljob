// @ts-nocheck
/**
 * DataSourcesPanel — Panneau latéral de gestion des sources de données.
 * Rendu dans le mosaic layout de RoomShell (placement: 'sidebar').
 *
 * Contient :
 * - FileDropzone : drag & drop pour charger des fichiers locaux (CSV, Parquet, JSON)
 * - TablesListPanel : affichage des tables DuckDB chargées
 */
import { RoomPanel } from '@sqlrooms/room-shell'
import { FileDropzone } from '@sqlrooms/dropzone'
import { convertToValidColumnOrTableName } from '@sqlrooms/utils'
import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from '../store/notebookStore'
import { useToast } from '@sqlrooms/ui'

// ─── Affichage des tables chargées ───────────────────────────────────────────
function TablesListPanel() {
    const _tables = useNotebookStore(s => s._tables)
    const tables = Object.entries(_tables || {})

    if (tables.length === 0) {
        return (
            <div className="p-4 text-xs text-muted-foreground text-center">
                Aucune table chargée
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-1 p-2 overflow-auto">
            {tables.map(([tableName, data]: [string, any]) => {
                const columns = Array.isArray(data) && data.length > 0
                    ? Object.keys(data[0])
                    : []
                const rowCount = Array.isArray(data) ? data.length : 0
                return (
                    <div key={tableName} className="border border-border rounded-md p-2 bg-background">
                        <div className="flex items-center gap-1 mb-1">
                            <span className="iconify text-primary" data-icon="material-symbols-light:table" style={{ fontSize: '0.875rem' }}></span>
                            <span className="text-xs font-medium text-foreground truncate">{tableName}</span>
                            <span className="ml-auto text-xs text-muted-foreground shrink-0">{rowCount} lignes</span>
                        </div>
                        {columns.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                                {columns.slice(0, 5).map(col => (
                                    <span key={col} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-muted text-muted-foreground truncate max-w-[8rem]">{col}</span>
                                ))}
                                {columns.length > 5 && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-muted text-muted-foreground">+{columns.length - 5}</span>
                                )}
                            </div>
                        )}
                    </div>
                )
            })}
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
                // Use the existing store's addRoomFile (from filesMixin)
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

    return (
        <RoomPanel type="data" showHeader={false} className="flex flex-col h-full overflow-hidden">
            <div className="p-2 border-b border-border shrink-0">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1 mb-2">Sources de données</p>
                <FileDropzone
                    className="min-h-[100px]"
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
            <div className="flex-1 overflow-auto">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 py-2">Tables DuckDB</p>
                <TablesListPanel />
            </div>
        </RoomPanel>
    )
}
