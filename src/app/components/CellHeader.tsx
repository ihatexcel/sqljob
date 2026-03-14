// @ts-nocheck
import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from '../store/notebookStore'
import { Spinner, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@sqlrooms/ui'
import { Icon, CellTypeIcon } from '../../lib/icons'
import { ConfigManager } from '../../lib/ConfigManager'

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
        <div className="group @container flex justify-between items-center py-2 px-4 bg-muted border-b border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CellTypeIcon type={cell.type} size={16} />
                {cell.type === 'uiParameter'
                    ? <span className="font-mono text-xs text-primary font-semibold">
                          {'{{ '}{ConfigManager.getCellReferenceName(cell)}{' }}'}
                      </span>
                    : <span>{cell.type}</span>
                }
                {cell._status === 'running' && (
                    <Spinner className="h-3 w-3 text-yellow-500" />
                )}
            </div>
            <div className="flex gap-1 items-center">
                {/* Boutons — cachés par défaut, révélés au hover (desktop) */}
                <div className="hidden @[320px]:group-hover:inline-flex rounded-md overflow-hidden border border-border divide-x divide-border">
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

                {/* Bouton kebab — toujours visible (fallback touch/mobile) */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="inline-flex items-center justify-center h-6 w-6 rounded hover:bg-muted-foreground/20">
                            <Icon name="ellipsis-vertical" size={16} className="block @[320px]:hidden" />
                            <Icon name="ellipsis" size={16} className="hidden @[320px]:block" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => runCellAt(path, cellIndex)} disabled={isLoading}>
                            <Icon name="play-arrow" size={14} className="mr-2" /> Exécuter
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openCellConfig(path, cellIndex)}>
                            <Icon name="settings" size={14} className="mr-2" /> Configurer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openChildGroupModal(path, cellIndex)}>
                            <Icon name="export-notes-outline-sharp" size={14} className="mr-2" /> Groupe enfant
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => moveItemInGroup(path, 'cell', cellIndex, -1)}
                            disabled={isFirstInGroup(group, 'cell', cellIndex)}>
                            <Icon name="arrow-back" size={14} className="mr-2" /> Déplacer à gauche
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => moveItemInGroup(path, 'cell', cellIndex, 1)}
                            disabled={isLastInGroup(group, 'cell', cellIndex)}>
                            <Icon name="arrow-forward" size={14} className="mr-2" /> Déplacer à droite
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => deleteCellAt(path, cellIndex)}
                            className="text-destructive focus:text-destructive">
                            <Icon name="delete" size={14} className="mr-2" /> Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
