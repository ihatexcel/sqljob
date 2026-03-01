// @ts-nocheck
import { useNotebookStore } from '../store/notebookStore'
import { GroupContainer } from './GroupContainer'

export function PageContent() {
    const {
        devMode, isLoading, showAddGroupModal,
        getActivePage, getGroups, getLinkGroups,
        getFlattenedGroups, addGroup, openInsertGroupModal, runAllGroups
    } = useNotebookStore(s => ({
        devMode: s.devMode,
        isLoading: s.isLoading,
        showAddGroupModal: s.showAddGroupModal,
        getActivePage: s.getActivePage,
        getGroups: s.getGroups,
        getLinkGroups: s.getLinkGroups,
        getFlattenedGroups: s.getFlattenedGroups,
        addGroup: s.addGroup,
        openInsertGroupModal: s.openInsertGroupModal,
        runAllGroups: s.runAllGroups
    }))
    const set = useNotebookStore.setState

    const groups = getGroups()

    return (
        <div className="flex flex-col gap-4 p-2">
            {/* Groupes de la page active */}
            {groups.map((group: any, i: number) => (
                <div
                    key={group._id}
                    className="border border-base-300 rounded-lg overflow-hidden bg-base-100 transition-colors duration-200 shadow-sm hover:border-primary hover:shadow-md"
                    style={{ order: group._order ?? i }}
                >
                    <GroupContainer
                        group={group}
                        path={[i]}
                        depth={0}
                        isFirst={i === 0}
                        isLast={i === groups.length - 1}
                        siblingCount={groups.length}
                    />
                </div>
            ))}

            {/* Boutons d'ajout (devMode uniquement) */}
            {devMode && (
                <div className="flex gap-2 flex-wrap mt-2">
                    <button
                        className="btn btn-sm btn-outline"
                        onClick={() => set({ showAddGroupModal: true })}
                    >
                        <span className="iconify" data-icon="material-symbols-light:add" style={{ fontSize: '1rem' }}></span>
                        Ajouter un groupe
                    </button>
                    <button
                        className="btn btn-sm btn-outline btn-success"
                        onClick={runAllGroups}
                        disabled={isLoading}
                    >
                        <span className="iconify" data-icon="material-symbols-light:play-arrow" style={{ fontSize: '1rem' }}></span>
                        Tout exécuter
                    </button>
                </div>
            )}

            {groups.length === 0 && devMode && (
                <div className="flex flex-col items-center justify-center py-20 text-base-content/40">
                    <span className="iconify" data-icon="material-symbols-light:add-circle-outline" style={{ fontSize: '4rem' }}></span>
                    <p className="mt-2 text-sm">Aucun groupe. Cliquez sur "Ajouter un groupe" pour commencer.</p>
                </div>
            )}
        </div>
    )
}
