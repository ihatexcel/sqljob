// @ts-nocheck
import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from '../store/notebookStore'
import { CellHeader } from './CellHeader'
import { CellBody } from './CellBody'

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
        ? 'border-warning shadow-[0_0_10px_rgba(251,191,36,0.3)]'
        : cell._status === 'success' ? 'border-success'
            : cell._status === 'error' ? 'border-error' : ''

    const borderClass = cell.border !== false
        ? `border border-base-300 shadow-sm hover:border-primary hover:shadow-lg ${statusBorder}`
        : 'border-0 shadow-none'

    return (
        <div className={`flex flex-1 ${outerClass}`} style={wrapperStyle}>
            <div className={`rounded-lg overflow-hidden bg-base-100 cell-container ${innerClass} ${borderClass}`}>
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
            <div role="tablist" className="tabs tabs-border">
                {tabs.map((t: any, i: number) => (
                    <button key={i} role="tab" className={`tab ${activeTab === i ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab(i)}>
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

    const [accordionOpen, setAccordionOpen] = useState(group.accordionOpen !== false)

    if (!devMode && !shouldShowGroup?.(group)) return null

    // Mode accordion
    if (!devMode && group.accordion) {
        return (
            <div className="collapse border border-base-300 rounded-lg bg-base-100">
                <input type="checkbox" checked={accordionOpen} onChange={e => setAccordionOpen(e.target.checked)} />
                <div className="collapse-title font-medium">{group.title || ''}</div>
                <div className="collapse-content">
                    <GroupContent group={group} path={path} depth={depth} />
                </div>
            </div>
        )
    }

    // Mode tabsChild (client only)
    if (!devMode && group.tabsChild) {
        return <TabsChildContent group={group} path={path} depth={depth} />
    }

    // Mode normal
    return (
        <div className="bg-base-100 w-full">
            {/* Header groupe (devMode uniquement) */}
            {devMode && (
                <div className="flex items-center justify-between gap-2 py-1 px-2 bg-base-200/80 border-b border-base-300 group-header">
                    <div className="flex gap-1 flex-wrap">
                        <div className="join">
                            <button className="btn btn-xs btn-success join-item" onClick={() => runGroupAtPath(path)} disabled={isLoading} title="Exécuter le groupe">
                                <span className="iconify" data-icon="material-symbols-light:play-arrow" style={{ fontSize: '1rem' }}></span>
                            </button>
                            <button className="btn btn-xs join-item"
                                onClick={() => { group.direction = group.direction === 'column' ? 'row' : 'column'; forceUpdate() }}
                                title={group.direction === 'column' ? 'Passer en ligne' : 'Passer en colonne'}>
                                <span className="iconify" data-icon={group.direction === 'column' ? 'material-symbols-light:swap-vert' : 'material-symbols-light:swap-horiz'} style={{ fontSize: '1rem' }}></span>
                            </button>
                            <button className="btn btn-xs join-item" onClick={() => addNestedGroup(path)} title="Ajouter un sous-groupe">
                                <span className="iconify" data-icon="material-symbols-light:create-new-folder" style={{ fontSize: '1rem' }}></span>
                            </button>
                            <button className="btn btn-xs join-item" onClick={() => openAddCellToGroupModal(path)} title="Ajouter une cellule">
                                <span className="iconify" data-icon="material-symbols-light:add" style={{ fontSize: '1rem' }}></span>
                            </button>
                            <button className="btn btn-xs join-item" onClick={() => openLoopConfigModal?.(path)} title="Boucle">
                                <span className="iconify" data-icon="material-symbols-light:autorenew" style={{ fontSize: '1rem' }}></span>
                            </button>
                            <button className="btn btn-xs join-item" onClick={() => openGroupSettingsModal?.(path)} title="Paramètres">
                                <span className="iconify" data-icon="material-symbols-light:settings" style={{ fontSize: '1rem' }}></span>
                            </button>
                            {!isFirst && (
                                <button className="btn btn-xs join-item" onClick={() => moveItemInGroup?.([...path.slice(0, -1)], 'child', path[path.length - 1], -1)} title="Monter">
                                    <span className="iconify" data-icon="material-symbols-light:arrow-upward" style={{ fontSize: '1rem' }}></span>
                                </button>
                            )}
                            {!isLast && (
                                <button className="btn btn-xs join-item" onClick={() => moveItemInGroup?.([...path.slice(0, -1)], 'child', path[path.length - 1], 1)} title="Descendre">
                                    <span className="iconify" data-icon="material-symbols-light:arrow-downward" style={{ fontSize: '1rem' }}></span>
                                </button>
                            )}
                            <button className="btn btn-xs btn-error join-item" onClick={() => deleteGroupAtPath?.(path)} title="Supprimer le groupe">
                                <span className="iconify" data-icon="material-symbols-light:delete" style={{ fontSize: '1rem' }}></span>
                            </button>
                        </div>
                        {group.loop?.enabled && (
                            <span className="badge badge-secondary badge-sm">↺ Boucle</span>
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
                            className="flex-1 bg-base-100 border border-base-300 rounded-lg overflow-hidden transition-all duration-200 shadow-sm hover:border-primary hover:shadow-md"
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
