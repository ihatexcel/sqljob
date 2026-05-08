import { useState, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from '../store/notebookStore'
import { Spinner, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@sqlrooms/ui'
import { Icon } from '../../lib/icons'
import { CELL_TYPE_SCHEMAS } from '../../lib/cellTypeSchemas'

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
        moveItemInGroup, deleteCellAt, copyCellAt,
        isFirstInGroup, isLastInGroup,
        validateCellName, forceUpdate, _rev
    } = useNotebookStore(useShallow(s => ({
        devMode: s.devMode,
        isLoading: s.isLoading,
        runCellAt: s.runCellAt,
        openCellConfig: s.openCellConfig,
        openChildGroupModal: s.openChildGroupModal,
        moveItemInGroup: s.moveItemInGroup,
        deleteCellAt: s.deleteCellAt,
        copyCellAt: s.copyCellAt,
        isFirstInGroup: s.isFirstInGroup,
        isLastInGroup: s.isLastInGroup,
        validateCellName: s.validateCellName,
        forceUpdate: s.forceUpdate,
        _rev: s._rev
    })))

    const [copyDone, setCopyDone] = useState(false)
    const handleCopyCell = () => {
        copyCellAt(path, cellIndex)
        setCopyDone(true)
        setTimeout(() => setCopyDone(false), 2000)
    }

    const schema = CELL_TYPE_SCHEMAS?.types[cell?.type]
    const hasNameDisplay = !!(schema?.showNameInHeader || schema?.useNameAsReference)

    const [isEditing, setIsEditing] = useState(false)
    const [editVal, setEditVal] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    if (!devMode) return null

    const startEdit = () => {
        setEditVal(cell.name || '')
        setIsEditing(true)
        setTimeout(() => inputRef.current?.select(), 0)
    }

    const commitEdit = () => {
        const trimmed = editVal.trim()
        if (trimmed && trimmed !== cell.name) {
            cell.name = trimmed
            validateCellName(path, cellIndex)
        }
        setIsEditing(false)
        forceUpdate()
    }

    const cancelEdit = () => setIsEditing(false)

    return (
        <div className="group @container flex justify-between items-center py-2 px-4 bg-muted border-b border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
                {hasNameDisplay && !isEditing && (
                    <span
                        className={`font-mono text-xs font-semibold cursor-pointer hover:text-primary truncate ${schema?.useNameAsReference ? 'text-primary' : 'text-accent'}`}
                        onDoubleClick={startEdit}
                        title="Double-cliquer pour renommer"
                    >
                        {schema?.useNameAsReference
                            ? `{{ ${cell.name || ''} }}`
                            : cell.name || ''}
                    </span>
                )}
                {hasNameDisplay && isEditing && (
                    <input
                        ref={inputRef}
                        className="font-mono text-xs border border-input rounded px-1 py-0 h-5 w-32 bg-background text-foreground"
                        value={editVal}
                        onChange={e => setEditVal(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={e => {
                            if (e.key === 'Enter') { e.preventDefault(); commitEdit() }
                            if (e.key === 'Escape') cancelEdit()
                        }}
                    />
                )}
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
                    <button className="inline-flex items-center justify-center h-6 px-2 text-xs bg-background hover:bg-muted"
                        onClick={handleCopyCell}
                        title="Copier la cellule">
                        <Icon name={copyDone ? 'copy-check' : 'copy'} size={16} className={copyDone ? 'text-green-600' : ''} />
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
                        <DropdownMenuItem onClick={handleCopyCell}>
                            <Icon name={copyDone ? 'copy-check' : 'copy'} size={14} className={`mr-2 ${copyDone ? 'text-green-600' : ''}`} /> Copier
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
