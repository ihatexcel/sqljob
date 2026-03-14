// @ts-nocheck
/**
 * NotebookPanelSqlrooms — Panneau notebook natif sqlrooms.
 * Utilise les composants @sqlrooms/cells (SheetsTabBar) et @sqlrooms/notebook (Notebook).
 * Référence : https://github.com/sqlrooms/examples/blob/main/notebook/src/NotebookPanel.tsx
 *
 * Utilisé par NotebookPanel (wrapper) via le bouton de switch.
 */
import { SheetsTabBar } from '@sqlrooms/cells'
import { Notebook } from '@sqlrooms/notebook'
import { Canvas } from '@sqlrooms/canvas'
import { Button } from '@sqlrooms/ui'
import { ArrowLeftRightIcon } from 'lucide-react'
import { useNotebookStore } from '../store/notebookStore'

// ─── NotebookPanelSqlrooms ────────────────────────────────────────────────────
export const NotebookPanelSqlrooms = ({ onSwitchPanel }: { onSwitchPanel: () => void }) => {
    const currentSheetType = useNotebookStore((s: any) => {
        const id = s.cells?.config?.currentSheetId
        return id ? s.cells?.config?.sheets?.[id]?.type : 'notebook'
    })

    return (
        <div className="flex h-full flex-col">
            {/* Barre de titre avec bouton switch */}
            <div className="flex items-center border-b border-border bg-background px-4 py-2 gap-2 shrink-0">
                <span className="text-sm font-medium text-muted-foreground flex-1">
                    Notebook sqlrooms
                </span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onSwitchPanel}
                    title="Revenir au notebook sqlJob"
                    className="opacity-60 hover:opacity-100 gap-1.5"
                >
                    <ArrowLeftRightIcon size={16} />
                    <span className="text-xs">sqlJob</span>
                </Button>
            </div>

            {/* Onglets de feuilles */}
            <SheetsTabBar />

            {/* Contenu : canvas ou notebook selon le type de feuille courante */}
            <div className="min-h-0 flex-1">
                {currentSheetType === 'canvas'
                    ? <Canvas />
                    : <Notebook />
                }
            </div>
        </div>
    )
}
