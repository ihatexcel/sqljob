// @ts-nocheck
import { useNotebookStore } from '../store/notebookStore'

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
        isFirstInGroup, isLastInGroup, getCellIcon
    } = useNotebookStore(s => ({
        devMode: s.devMode,
        isLoading: s.isLoading,
        runCellAt: s.runCellAt,
        openCellConfig: s.openCellConfig,
        openChildGroupModal: s.openChildGroupModal,
        moveItemInGroup: s.moveItemInGroup,
        deleteCellAt: s.deleteCellAt,
        isFirstInGroup: s.isFirstInGroup,
        isLastInGroup: s.isLastInGroup,
        getCellIcon: s.getCellIcon
    }))

    if (!devMode) return null

    return (
        <div className="flex justify-between items-center py-2 px-4 bg-base-200 border-b border-base-300">
            <div className="flex items-center gap-2 text-sm text-base-content/60">
                <span dangerouslySetInnerHTML={{ __html: getCellIcon?.(cell.type) || '' }}></span>
                <span>{cell.type}</span>
                {cell._status === 'running' && (
                    <span className="loading loading-spinner loading-xs" style={{ color: 'var(--warning)' }}></span>
                )}
            </div>
            <div className="flex gap-1 items-center">
                <div className="join">
                    <button className="btn btn-xs btn-success join-item"
                        onClick={() => runCellAt(path, cellIndex)}
                        disabled={isLoading}
                        title="Exécuter">
                        <span className="iconify" data-icon="material-symbols-light:play-arrow" style={{ fontSize: '1rem' }}></span>
                    </button>
                    <button className="btn btn-xs join-item"
                        onClick={() => openCellConfig(path, cellIndex)}
                        title="Configurer">
                        <span className="iconify" data-icon="material-symbols-light:settings" style={{ fontSize: '1rem' }}></span>
                    </button>
                    <button className="btn btn-xs join-item"
                        onClick={() => openChildGroupModal(path, cellIndex)}
                        title="Groupe enfant">
                        <span className="iconify" data-icon="material-symbols-light:export-notes-outline-sharp" style={{ fontSize: '1rem' }}></span>
                    </button>
                    <button className="btn btn-xs join-item"
                        onClick={() => moveItemInGroup(path, 'cell', cellIndex, -1)}
                        disabled={isFirstInGroup(group, 'cell', cellIndex)}
                        title="Déplacer à gauche">
                        <span className="iconify" data-icon="material-symbols-light:arrow-back" style={{ fontSize: '1rem' }}></span>
                    </button>
                    <button className="btn btn-xs join-item"
                        onClick={() => moveItemInGroup(path, 'cell', cellIndex, 1)}
                        disabled={isLastInGroup(group, 'cell', cellIndex)}
                        title="Déplacer à droite">
                        <span className="iconify" data-icon="material-symbols-light:arrow-forward" style={{ fontSize: '1rem' }}></span>
                    </button>
                    <button className="btn btn-xs btn-error join-item"
                        onClick={() => deleteCellAt(path, cellIndex)}
                        title="Supprimer">
                        <span className="iconify" data-icon="material-symbols-light:delete" style={{ fontSize: '1rem' }}></span>
                    </button>
                </div>
            </div>
        </div>
    )
}
