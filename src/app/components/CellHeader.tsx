// @ts-nocheck
import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from '../store/notebookStore'
import { Spinner } from '@sqlrooms/ui'
import { Icon, CellTypeIcon } from '../../lib/icons'

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
        isFirstInGroup, isLastInGroup, _rev
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
        _rev: s._rev
    })))

    if (!devMode) return null

    return (
        <div className="flex justify-between items-center py-2 px-4 bg-muted border-b border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CellTypeIcon type={cell.type} size={16} />
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
                        <Icon name="play-arrow" size={16} />
                    </button>
                    <button className="inline-flex items-center justify-center h-6 px-2 text-xs bg-background hover:bg-muted"
                        onClick={() => openCellConfig(path, cellIndex)}
                        title="Configurer">
                        <Icon name="settings" size={16} />
                    </button>
                    <button className="inline-flex items-center justify-center h-6 px-2 text-xs bg-background hover:bg-muted"
                        onClick={() => openChildGroupModal(path, cellIndex)}
                        title="Groupe enfant">
                        <Icon name="export-notes-outline-sharp" size={16} />
                    </button>
                    <button className="inline-flex items-center justify-center h-6 px-2 text-xs bg-background hover:bg-muted disabled:opacity-50"
                        onClick={() => moveItemInGroup(path, 'cell', cellIndex, -1)}
                        disabled={isFirstInGroup(group, 'cell', cellIndex)}
                        title="Déplacer à gauche">
                        <Icon name="arrow-back" size={16} />
                    </button>
                    <button className="inline-flex items-center justify-center h-6 px-2 text-xs bg-background hover:bg-muted disabled:opacity-50"
                        onClick={() => moveItemInGroup(path, 'cell', cellIndex, 1)}
                        disabled={isLastInGroup(group, 'cell', cellIndex)}
                        title="Déplacer à droite">
                        <Icon name="arrow-forward" size={16} />
                    </button>
                    <button className="inline-flex items-center justify-center h-6 px-2 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/80"
                        onClick={() => deleteCellAt(path, cellIndex)}
                        title="Supprimer">
                        <Icon name="delete" size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}
