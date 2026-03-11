// @ts-nocheck
/**
 * SqlEditorQueryPicker — bandeau affiché au-dessus des cellules SQL du canvas.
 * Permet de remplir le SQL de la cellule depuis une requête sauvegardée dans le
 * panneau SQL Editor (@sqlrooms/sql-editor).
 *
 * Utilise useNotebookStore pour lire sqlEditor.config.queries et écrire dans
 * cells.config.data[cellId].data.sql via updateCanvasCellSql.
 */
import { useNotebookStore } from '../store/notebookStore'

interface Props {
    cellId: string
}

export const SqlEditorQueryPicker = ({ cellId }: Props) => {
    const queries = useNotebookStore((s: any) => s.sqlEditor?.config?.queries ?? [])
    const updateCanvasCellSql = useNotebookStore((s: any) => s.updateCanvasCellSql)

    if (!queries.length) return null

    return (
        <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-2 py-1 text-xs shrink-0">
            <span className="text-muted-foreground shrink-0">SQL Editor :</span>
            <select
                className="flex-1 min-w-0 rounded border border-input bg-background px-1 py-0.5 text-xs"
                defaultValue=""
                onChange={(e) => {
                    const q = queries.find((q: any) => q.id === e.target.value)
                    if (q && updateCanvasCellSql) updateCanvasCellSql(cellId, q.query)
                }}
            >
                <option value="">— choisir une requête —</option>
                {queries.map((q: any) => (
                    <option key={q.id} value={q.id}>{q.name}</option>
                ))}
            </select>
        </div>
    )
}
