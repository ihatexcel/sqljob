// @ts-nocheck
import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from '../store/notebookStore'
import { Button, Badge, Accordion, AccordionContent, AccordionItem, AccordionTrigger, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@sqlrooms/ui'
import { CellHeader } from './CellHeader'
import { CellBody } from './CellBody'
import { Icon } from '../../lib/icons'

// ─── CellItem ─────────────────────────────────────────────────────────────────
function CellItem({ cell, cellIndex, path, group }: { cell: any, cellIndex: number, path: number[], group: any }) {
    const {
        devMode, getCellSizeOuterClass, getCellWrapperStyle,
        getCellSizeInnerClass, shouldShowCell
    } = useNotebookStore(useShallow(s => ({
        devMode: s.devMode,
        getCellSizeOuterClass: s.getCellSizeOuterClass,
        getCellWrapperStyle: s.getCellWrapperStyle,
        getCellSizeInnerClass: s.getCellSizeInnerClass,
        shouldShowCell: s.shouldShowCell
    })))

    const isColumn = group.direction === 'column'
    if (!devMode && !shouldShowCell(cell)) return null

    const outerClass = getCellSizeOuterClass?.(cell, isColumn) || ''
    const wrapperStyle = getCellWrapperStyle?.(cell, isColumn, cell._order ?? 0) || {}
    const innerClass = getCellSizeInnerClass?.() || ''

    const statusBorder = cell._status === 'running'
        ? 'border-yellow-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
        : cell._status === 'success' ? 'border-green-500'
            : cell._status === 'error' ? 'border-destructive' : ''

    const borderClass = cell.border !== false
        ? `border border-border shadow-sm hover:border-primary hover:shadow-lg ${statusBorder}`
        : 'border-0 shadow-none'

    return (
        <div className={`flex flex-1 ${outerClass}`} style={wrapperStyle}>
            <div className={`rounded-lg overflow-hidden bg-background cell-container ${innerClass} ${borderClass}`}>
                <CellHeader cell={cell} path={path} cellIndex={cellIndex} group={group} />
                <CellBody cell={cell} path={path} cellIndex={cellIndex} group={group} />
            </div>
        </div>
    )
}

// ─── TabsChild view ───────────────────────────────────────────────────────────
function TabsChildContent({ group, path, depth }: { group: any, path: number[], depth: number }) {
    const { getAllItemsSorted, _rev } = useNotebookStore(useShallow(s => ({
        getAllItemsSorted: s.getAllItemsSorted,
        _rev: s._rev
    })))
    const items = getAllItemsSorted?.(group) || []
    const [activeTab, setActiveTab] = useState(0)

    const tabs = items.map((item: any, i: number) => ({
        label: item.type === 'cell'
            ? (item.item.name || `Cellule ${i + 1}`)
            : (item.item.name || `Groupe ${i + 1}`),
        item,
        i
    }))

    const activeItem = tabs[activeTab]?.item

    return (
        <div>
            <div className="flex gap-1 border-b border-border overflow-x-auto">
                {tabs.map((t: any, i: number) => (
                    <button
                        key={i}
                        className={`px-3 py-1.5 text-sm border-b-2 transition-colors whitespace-nowrap
                            ${activeTab === i
                                ? 'border-primary font-medium text-foreground'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                            }`}
                        onClick={() => setActiveTab(i)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
            {activeItem && (
                <div>
                    {activeItem.type === 'cell' ? (
                        <CellItem cell={activeItem.item} cellIndex={activeItem.originalIndex} path={path} group={group} />
                    ) : (
                        <GroupContainer
                            group={activeItem.item}
                            path={[...path, activeItem.originalIndex]}
                            depth={depth + 1}
                            isFirst={true}
                            isLast={true}
                            siblingCount={1}
                        />
                    )}
                </div>
            )}
        </div>
    )
}

// ─── GroupContainer ───────────────────────────────────────────────────────────
export function GroupContainer({
    group, path, depth = 0, isFirst = false, isLast = false, siblingCount = 1, inModal = false
}: {
    group: any
    path: number[]
    depth?: number
    isFirst?: boolean
    isLast?: boolean
    siblingCount?: number
    inModal?: boolean
}) {
    const {
        devMode, isLoading,
        getSortedCells, getSortedChildren, getAllItemsSorted,
        shouldShowGroup, shouldShowCell,
        runGroupAtPath, addNestedGroup, openAddCellToGroupModal,
        moveItemInGroup, deleteGroupAtPath,
        openLoopConfigModal, openGroupSettingsModal,
        isFirstInGroup, isLastInGroup, forceUpdate, _rev
    } = useNotebookStore(useShallow(s => ({
        devMode: s.devMode,
        isLoading: s.isLoading,
        getSortedCells: s.getSortedCells,
        getSortedChildren: s.getSortedChildren,
        getAllItemsSorted: s.getAllItemsSorted,
        shouldShowGroup: s.shouldShowGroup,
        shouldShowCell: s.shouldShowCell,
        runGroupAtPath: s.runGroupAtPath,
        addNestedGroup: s.addNestedGroup,
        openAddCellToGroupModal: s.openAddCellToGroupModal,
        moveItemInGroup: s.moveItemInGroup,
        deleteGroupAtPath: s.deleteGroupAtPath,
        openLoopConfigModal: s.openLoopConfigModal,
        openGroupSettingsModal: s.openGroupSettingsModal,
        isFirstInGroup: s.isFirstInGroup,
        isLastInGroup: s.isLastInGroup,
        forceUpdate: s.forceUpdate,
        _rev: s._rev
    })))

    const [accordionOpen, setAccordionOpen] = useState(group.accordionOpen !== false ? 'item' : '')

    if (!devMode && !shouldShowGroup?.(group)) return null

    // Mode accordion (client only)
    if (!devMode && group.accordion) {
        return (
            <Accordion type="single" collapsible value={accordionOpen} onValueChange={setAccordionOpen} className="border border-border rounded-lg bg-background">
                <AccordionItem value="item" className="border-0">
                    <AccordionTrigger className="px-4 py-3 font-medium">{group.title || ''}</AccordionTrigger>
                    <AccordionContent className="px-0 pb-0">
                        <GroupContent group={group} path={path} depth={depth} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        )
    }

    // Mode tabsChild (client only)
    if (!devMode && group.tabsChild) {
        return <TabsChildContent group={group} path={path} depth={depth} />
    }

    // Mode normal
    return (
        <div className="bg-background w-full">
            {/* Header groupe (devMode uniquement) */}
            {devMode && (
                <div className="group/ghdr @container flex items-center justify-between gap-2 py-1 px-2 bg-muted/80 border-b border-border group-header">
                    <div className="flex gap-1 flex-wrap items-center">
                        {/* Bouton kebab — toujours visible (fallback touch/mobile) */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="inline-flex items-center justify-center h-6 w-6 rounded hover:bg-muted-foreground/20">
                                    <Icon name="ellipsis-vertical" size={16} className="block @[380px]:hidden" />
                                    <Icon name="ellipsis" size={16} className="hidden @[380px]:block" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={() => runGroupAtPath(path)} disabled={isLoading}>
                                    <Icon name="play-arrow" size={14} className="mr-2" /> Exécuter le groupe
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { group.direction = group.direction === 'column' ? 'row' : 'column'; forceUpdate() }}>
                                    <Icon name={group.direction === 'column' ? 'swap-vert' : 'swap-horiz'} size={14} className="mr-2" />
                                    {group.direction === 'column' ? 'Passer en ligne' : 'Passer en colonne'}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => addNestedGroup(path)}>
                                    <Icon name="create-new-folder" size={14} className="mr-2" /> Ajouter un sous-groupe
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openAddCellToGroupModal(path)}>
                                    <Icon name="add" size={14} className="mr-2" /> Ajouter une cellule
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openLoopConfigModal?.(path)}>
                                    <Icon name="autorenew" size={14} className="mr-2" /> Boucle
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openGroupSettingsModal?.(path)}>
                                    <Icon name="settings" size={14} className="mr-2" /> Paramètres
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => moveItemInGroup?.([...path.slice(0, -1)], 'child', path[path.length - 1], -1)} disabled={isFirst}>
                                    <Icon name="arrow-upward" size={14} className="mr-2" /> Monter
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => moveItemInGroup?.([...path.slice(0, -1)], 'child', path[path.length - 1], 1)} disabled={isLast}>
                                    <Icon name="arrow-downward" size={14} className="mr-2" /> Descendre
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => deleteGroupAtPath?.(path)}
                                    className="text-destructive focus:text-destructive">
                                    <Icon name="delete" size={14} className="mr-2" /> Supprimer le groupe
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Boutons — cachés par défaut, révélés au hover (desktop) */}
                        <div className="hidden @[380px]:group-hover/ghdr:inline-flex rounded-md overflow-hidden border border-border divide-x divide-border">
                            <button className="inline-flex items-center justify-center h-6 px-2 text-xs bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                                onClick={() => runGroupAtPath(path)} disabled={isLoading} title="Exécuter le groupe">
                                <Icon name="play-arrow" size={16} />
                            </button>
                            <button className="inline-flex items-center justify-center h-6 px-2 text-xs bg-background hover:bg-muted"
                                onClick={() => { group.direction = group.direction === 'column' ? 'row' : 'column'; forceUpdate() }}
                                title={group.direction === 'column' ? 'Passer en ligne' : 'Passer en colonne'}>
                                <Icon name={group.direction === 'column' ? 'swap-vert' : 'swap-horiz'} size={16} />
                            </button>
                            <button className="inline-flex items-center justify-center h-6 px-2 text-xs bg-background hover:bg-muted"
                                onClick={() => addNestedGroup(path)} title="Ajouter un sous-groupe">
                                <Icon name="create-new-folder" size={16} />
                            </button>
                            <button className="inline-flex items-center justify-center h-6 px-2 text-xs bg-background hover:bg-muted"
                                onClick={() => openAddCellToGroupModal(path)} title="Ajouter une cellule">
                                <Icon name="add" size={16} />
                            </button>
                            <button className="inline-flex items-center justify-center h-6 px-2 text-xs bg-background hover:bg-muted"
                                onClick={() => openLoopConfigModal?.(path)} title="Boucle">
                                <Icon name="autorenew" size={16} />
                            </button>
                            <button className="inline-flex items-center justify-center h-6 px-2 text-xs bg-background hover:bg-muted"
                                onClick={() => openGroupSettingsModal?.(path)} title="Paramètres">
                                <Icon name="settings" size={16} />
                            </button>
                            {!isFirst && (
                                <button className="inline-flex items-center justify-center h-6 px-2 text-xs bg-background hover:bg-muted"
                                    onClick={() => moveItemInGroup?.([...path.slice(0, -1)], 'child', path[path.length - 1], -1)} title="Monter">
                                    <Icon name="arrow-upward" size={16} />
                                </button>
                            )}
                            {!isLast && (
                                <button className="inline-flex items-center justify-center h-6 px-2 text-xs bg-background hover:bg-muted"
                                    onClick={() => moveItemInGroup?.([...path.slice(0, -1)], 'child', path[path.length - 1], 1)} title="Descendre">
                                    <Icon name="arrow-downward" size={16} />
                                </button>
                            )}
                            <button className="inline-flex items-center justify-center h-6 px-2 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/80"
                                onClick={() => deleteGroupAtPath?.(path)} title="Supprimer le groupe">
                                <Icon name="delete" size={16} />
                            </button>
                        </div>

                        {group.loop?.enabled && (
                            <Badge variant="secondary" className="text-xs">↺ Boucle</Badge>
                        )}
                    </div>
                </div>
            )}

            {/* Contenu du groupe */}
            <GroupContent group={group} path={path} depth={depth} />
        </div>
    )
}

// ─── Contenu interne du groupe ────────────────────────────────────────────────
function GroupContent({ group, path, depth }: { group: any, path: number[], depth: number }) {
    const {
        getSortedCells, getSortedChildren, getAllItemsSorted,
        shouldShowGroup, shouldShowCell, devMode, forceUpdate, _rev
    } = useNotebookStore(useShallow(s => ({
        getSortedCells: s.getSortedCells,
        getSortedChildren: s.getSortedChildren,
        getAllItemsSorted: s.getAllItemsSorted,
        shouldShowGroup: s.shouldShowGroup,
        shouldShowCell: s.shouldShowCell,
        devMode: s.devMode,
        forceUpdate: s.forceUpdate,
        _rev: s._rev
    })))

    const isColumn = group.direction === 'column'
    const cells = getSortedCells?.(group) || []
    const children = getSortedChildren?.(group) || []

    // Interleave cells and children by _order
    const allItems = getAllItemsSorted?.(group) || []

    return (
        <div className={`flex gap-2 p-2 ${isColumn ? 'flex-col' : 'flex-row flex-wrap'}`}>
            {allItems.map((item: any) => {
                if (item.type === 'cell') {
                    const cellItem = item
                    if (!devMode && !shouldShowCell?.(cellItem.item)) return null
                    return (
                        <CellItem
                            key={cellItem.item._id}
                            cell={cellItem.item}
                            cellIndex={cellItem.originalIndex}
                            path={path}
                            group={group}
                        />
                    )
                } else {
                    // child group
                    const childItem = item
                    const childPath = [...path, childItem.originalIndex]
                    if (!devMode && !shouldShowGroup?.(childItem.item)) return null
                    const childSortedIdx = allItems.indexOf(childItem)
                    return (
                        <div key={childItem.item._id || `child-${childItem.originalIndex}`}
                            className="flex-1 bg-background border border-border rounded-lg overflow-hidden transition-all duration-200 shadow-sm hover:border-primary hover:shadow-md group-container-responsive"
                            style={{ order: childItem.item._order ?? 0 }}>
                            <GroupContainer
                                group={childItem.item}
                                path={childPath}
                                depth={depth + 1}
                                isFirst={childSortedIdx === 0}
                                isLast={childSortedIdx === allItems.length - 1}
                                siblingCount={allItems.length}
                            />
                        </div>
                    )
                }
            })}
        </div>
    )
}
