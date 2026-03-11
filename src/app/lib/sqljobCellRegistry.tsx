// @ts-nocheck
/**
 * sqljobCellRegistry — registry de cellules personnalisée pour sqljob.
 *
 * Étend la registry par défaut de @sqlrooms/cells en ajoutant un sélecteur de
 * requêtes SQL Editor au-dessus de chaque cellule SQL du canvas/notebook.
 *
 * Pourquoi : createDefaultCellRegistry() crée des cellules SQL vides, sans lien
 * avec les requêtes nommées du panneau SQL Editor (@sqlrooms/sql-editor).
 * Ce wrapper injecte un bandeau <SqlEditorQueryPicker> qui permet à l'utilisateur
 * de peupler le SQL d'une cellule canvas depuis une requête existante du SQL Editor.
 */
import { createDefaultCellRegistry } from '@sqlrooms/cells'
import { SqlEditorQueryPicker } from '../components/SqlEditorQueryPicker'

export function createSqljobCellRegistry() {
    const defaultRegistry = createDefaultCellRegistry()
    const defaultSqlRenderCell = defaultRegistry.sql?.renderCell

    if (!defaultSqlRenderCell) return defaultRegistry

    return {
        ...defaultRegistry,
        sql: {
            ...defaultRegistry.sql,
            renderCell: (props: any) => (
                <div className="flex h-full flex-col">
                    <SqlEditorQueryPicker cellId={props.id} />
                    {defaultSqlRenderCell(props)}
                </div>
            ),
        },
    }
}
