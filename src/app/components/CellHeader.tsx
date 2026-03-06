// @ts-nocheck
import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from '../store/notebookStore'
import { Spinner } from '@sqlrooms/ui'

interface Props {
    cell: any
    path: number[]
    cellIndex: number
    group: any
}

export function CellHeader({ cell, path, cellIndex, group }: Props) {
    const {
        devMode, isLoading,
        runCellAt, openCellConfig, openChildGroupModal,
        moveItemInGroup, deleteCellAt,
        isFirstInGroup, isLastInGroup, getCellIcon, _rev
    } = useNotebookStore(useShallow(s => ({
        devMode: s.devMode,
        isLoading: s.isLoading,
        runCellAt: s.runCellAt,
        openCellConfig: s.openCellConfig,
        openChildGroupModal: s.openChildGroupModal,
        moveItemInGroup: s.moveItemInGroup,
        deleteCellAt: s.deleteCellAt,
        isFirstInGroup: s.isFirstInGroup,
        isLastInGroup: s.isLastInGroup,
        getCellIcon: s.getCellIcon,
        _rev: s._rev
    })))

    if (!devMode) return null

    return (
        <div className="flex justify-between items-center py-2 px-4 bg-muted border-b border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span dangerouslySetInnerHTML={{ __html: getCellIcon?.(cell.type) || '' }}></span>
                <span>{cell.type}</span>
                {cell._status === 'running' && (
                    <Spinner className="h-3 w-3 text-yellow-500" />
                )}
            </div>
            <div className="flex gap-1 items-center cell-header-responsive">
                {/* Button group (join) */}
                <div className="inline-flex rounded-md overflow-hidden border border-border divide-x divide-border">
                    <button className="inline-flex items-center justify-center h-6 px-2 text-xs bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                        onClick={() => runCellAt(path, cellIndex)}
                        disabled={isLoading}
                        title="Exécuter">
                        <span className="iconify" data-icon="material-symbols-light:play-arrow" style={{ fontSize: '1rem' }}></span>
                    </button>
                    <button className="inline-flex items-center justify-center h-6 px-2 text-xs bg-background hover:bg-muted"
                        onClick={() => openCellConfig(path, cellIndex)}
                        title="Configurer">
                        <span className="iconify" data-icon="material-symbols-light:settings" style={{ fontSize: '1rem' }}></span>
                    </button>
                    <button className="inline-flex items-center justify-center h-6 px-2 text-xs bg-background hover:bg-muted"
                        onClick={() => openChildGroupModal(path, cellIndex)}
                        title="Groupe enfant">
                        <span className="iconify" data-icon="material-symbols-light:export-notes-outline-sharp" style={{ fontSize: '1rem' }}></span>
                    </button>
                    <button className="inline-flex items-center justify-center h-6 px-2 text-xs bg-background hover:bg-muted disabled:opacity-50"
                        onClick={() => moveItemInGroup(path, 'cell', cellIndex, -1)}
                        disabled={isFirstInGroup(group, 'cell', cellIndex)}
                        title="Déplacer à gauche">
                        <span className="iconify" data-icon="material-symbols-light:arrow-back" style={{ fontSize: '1rem' }}></span>
                    </button>
                    <button className="inline-flex items-center justify-center h-6 px-2 text-xs bg-background hover:bg-muted disabled:opacity-50"
                        onClick={() => moveItemInGroup(path, 'cell', cellIndex, 1)}
                        disabled={isLastInGroup(group, 'cell', cellIndex)}
                        title="Déplacer à droite">
                        <span className="iconify" data-icon="material-symbols-light:arrow-forward" style={{ fontSize: '1rem' }}></span>
                    </button>
                    <button className="inline-flex items-center justify-center h-6 px-2 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/80"
                        onClick={() => deleteCellAt(path, cellIndex)}
                        title="Supprimer">
                        <span className="iconify" data-icon="material-symbols-light:delete" style={{ fontSize: '1rem' }}></span>
                    </button>
                </div>
            </div>
        </div>
    )
}
