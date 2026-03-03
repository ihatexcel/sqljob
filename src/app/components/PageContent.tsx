// @ts-nocheck
import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from '../store/notebookStore'
import { GroupContainer } from './GroupContainer'

// ─── Séparateur entre groupes (hover uniquement) ──────────────────────────────
function GroupDivider({ atIndex }: { atIndex: number }) {
    const openInsertGroupModal = useNotebookStore(s => s.openInsertGroupModal)
    return (
        <div
            className="group relative flex items-center h-5 cursor-pointer"
            onClick={() => openInsertGroupModal(atIndex)}
            title="Insérer un groupe ici"
        >
            <div className="absolute inset-x-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <div className="flex-1 border-t border-dashed border-primary/50"></div>
                <span className="text-primary text-xs font-bold leading-none mx-2 px-1.5 py-0.5 rounded border border-dashed border-primary/40 bg-base-100 select-none">
                    +
                </span>
                <div className="flex-1 border-t border-dashed border-primary/50"></div>
            </div>
        </div>
    )
}

export function PageContent() {
    const {
        devMode, isLoading, showAddGroupModal,
        getGroups, addGroup, activePageIndex, _rev
    } = useNotebookStore(useShallow(s => ({
        devMode: s.devMode,
        isLoading: s.isLoading,
        showAddGroupModal: s.showAddGroupModal,
        getGroups: s.getGroups,
        addGroup: s.addGroup,
        activePageIndex: s.activePageIndex,
        _rev: s._rev
    })))
    const set = useNotebookStore.setState

    const groups = getGroups()
    const sortedGroups = [...groups].sort((a: any, b: any) => (a._order ?? 0) - (b._order ?? 0))

    return (
        <div className="flex flex-col gap-2 p-2">
            {/* Groupes triés avec séparateurs hover entre eux */}
            {sortedGroups.flatMap((group: any, sortedIdx: number) => {
                const rawIdx = groups.indexOf(group)
                const items: any[] = []

                if (devMode && sortedIdx > 0) {
                    items.push(<GroupDivider key={`div-${group._id}`} atIndex={sortedIdx} />)
                }

                items.push(
                    <div
                        key={group._id}
                        className="overflow-hidden bg-base-100"
                    >
                        <GroupContainer
                            group={group}
                            path={[rawIdx]}
                            depth={0}
                            isFirst={sortedIdx === 0}
                            isLast={sortedIdx === sortedGroups.length - 1}
                            siblingCount={sortedGroups.length}
                        />
                    </div>
                )

                return items
            })}

            {/* Bouton d'ajout centré (devMode uniquement) */}
            {devMode && (
                <div className="flex justify-center mt-2">
                    <button
                        className="btn btn-sm btn-outline"
                        onClick={() => set({ showAddGroupModal: true })}
                    >
                        <span className="iconify" data-icon="material-symbols-light:add" style={{ fontSize: '1rem' }}></span>
                        Ajouter un groupe
                    </button>
                </div>
            )}
        </div>
    )
}
