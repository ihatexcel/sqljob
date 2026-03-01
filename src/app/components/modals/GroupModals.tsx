// @ts-nocheck
/**
 * LoopConfigModal + GroupSettingsModal + ChildGroupModal
 */
import { useEffect, useRef } from 'react'
import { useNotebookStore } from '../../store/notebookStore'
import { ConfigManager } from '../../../lib/ConfigManager'
import { GroupContainer } from '../GroupContainer'

// ─── LoopConfigModal ──────────────────────────────────────────────────────────
export function LoopConfigModal() {
    const { loopConfigModal, getGroupAtPath, getDefaultLoopQuery, getDefaultZipQuery, forceUpdate } = useNotebookStore(s => ({
        loopConfigModal: s.loopConfigModal,
        getGroupAtPath: s.getGroupAtPath,
        getDefaultLoopQuery: s.getDefaultLoopQuery,
        getDefaultZipQuery: s.getDefaultZipQuery,
        forceUpdate: s.forceUpdate
    }))
    const set = useNotebookStore.setState

    if (!loopConfigModal.open) return null
    const group = getGroupAtPath(loopConfigModal.path)
    if (!group) return null

    return (
        <div className="modal modal-open z-[2100]" onClick={e => { if (e.target === e.currentTarget) set({ loopConfigModal: { open: false, path: null } }) }} role="presentation">
            <div className="modal-box max-w-2xl" role="dialog" aria-modal="true">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <span className="iconify" data-icon="material-symbols-light:autorenew" style={{ fontSize: '1.25rem' }}></span>
                        Configuration de la boucle
                    </h3>
                    <button className="btn btn-sm btn-ghost" onClick={() => set({ loopConfigModal: { open: false, path: null } })}>
                        <span className="iconify" data-icon="material-symbols-light:close" style={{ fontSize: '1rem' }}></span>
                    </button>
                </div>
                <div className="mt-4">
                    <div className="form-control mb-4">
                        <label className="label cursor-pointer justify-start gap-3">
                            <input type="checkbox" className="toggle toggle-primary"
                                checked={!!group.loop?.enabled}
                                onChange={e => { group.loop = group.loop || {}; group.loop.enabled = e.target.checked; forceUpdate() }} />
                            <span className="label-text">Activer la boucle sur ce groupe</span>
                        </label>
                    </div>

                    {group.loop?.enabled && (
                        <div>
                            <div className="alert alert-info mb-4">
                                <p className="text-sm">La requête doit retourner une colonne. Chaque valeur sera utilisée comme variable <code className="badge badge-neutral">$loop</code> pour chaque itération du groupe.</p>
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Requête SQL de la boucle</span></label>
                                <textarea
                                    className="textarea textarea-bordered w-full font-mono min-h-32 text-sm"
                                    value={group.loop?.query || ''}
                                    onChange={e => { group.loop.query = e.target.value; forceUpdate() }}
                                    placeholder="SELECT DISTINCT colonne FROM source1 LIMIT 10;"
                                />
                            </div>
                            <div className="mt-2 mb-4">
                                <button className="btn btn-sm btn-outline" onClick={() => { group.loop.query = getDefaultLoopQuery(); forceUpdate() }}>
                                    <span className="iconify" data-icon="material-symbols-light:article" style={{ fontSize: '1rem' }}></span> Requête par défaut
                                </button>
                            </div>
                            <div className="divider"></div>
                            <div className="form-control mb-4">
                                <label className="label cursor-pointer justify-start gap-3">
                                    <input type="checkbox" className="toggle toggle-secondary"
                                        checked={!!group.loop?.zip}
                                        onChange={e => { group.loop.zip = e.target.checked; forceUpdate() }} />
                                    <span className="label-text">Zipper les fichiers générés</span>
                                </label>
                            </div>
                            {group.loop?.zip && (
                                <div className="form-control">
                                    <label className="label"><span className="label-text font-semibold">Requête SQL pour le nom du fichier ZIP</span></label>
                                    <textarea
                                        className="textarea textarea-bordered w-full font-mono min-h-16 text-sm"
                                        value={group.loop?.zipQuery || ''}
                                        onChange={e => { group.loop.zipQuery = e.target.value; forceUpdate() }}
                                        placeholder="SELECT 'export.zip' as filename;"
                                    />
                                    <div className="mt-2">
                                        <button className="btn btn-sm btn-outline" onClick={() => { group.loop.zipQuery = getDefaultZipQuery(); forceUpdate() }}>
                                            <span className="iconify" data-icon="material-symbols-light:article" style={{ fontSize: '1rem' }}></span> Requête par défaut
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="modal-action">
                    <button className="btn" onClick={() => set({ loopConfigModal: { open: false, path: null } })}>Fermer</button>
                </div>
            </div>
        </div>
    )
}

// ─── GroupSettingsModal ───────────────────────────────────────────────────────
export function GroupSettingsModal() {
    const { groupSettingsModal, getGroupAtPath, forceUpdate } = useNotebookStore(s => ({
        groupSettingsModal: s.groupSettingsModal,
        getGroupAtPath: s.getGroupAtPath,
        forceUpdate: s.forceUpdate
    }))
    const set = useNotebookStore.setState

    if (!groupSettingsModal.open) return null
    const group = getGroupAtPath(groupSettingsModal.path)
    if (!group) return null

    const ifQuery = ConfigManager.getGroupIfQuery(group)

    return (
        <div className="modal modal-open z-[2100]" onClick={e => { if (e.target === e.currentTarget) set({ groupSettingsModal: { open: false, path: null } }) }} role="presentation">
            <div className="modal-box max-w-lg" role="dialog" aria-modal="true">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <span className="iconify" data-icon="material-symbols-light:settings" style={{ fontSize: '1.25rem' }}></span>
                        Paramètres du groupe
                    </h3>
                    <button className="btn btn-sm btn-ghost" onClick={() => set({ groupSettingsModal: { open: false, path: null } })}>
                        <span className="iconify" data-icon="material-symbols-light:close" style={{ fontSize: '1rem' }}></span>
                    </button>
                </div>
                <div className="mt-4">
                    <div className="form-control mb-4">
                        <label className="label cursor-pointer justify-start gap-3">
                            <input type="checkbox" className="toggle toggle-primary"
                                checked={!!group.accordion}
                                onChange={e => { group.accordion = e.target.checked; forceUpdate() }} />
                            <span className="label-text">Activer le mode accordion</span>
                        </label>
                    </div>
                    {group.accordion && (
                        <>
                            <div className="form-control mb-4">
                                <label className="label"><span className="label-text font-semibold">Titre du groupe</span></label>
                                <input type="text" className="input input-bordered w-full"
                                    value={group.title || ''}
                                    onChange={e => { group.title = e.target.value; forceUpdate() }}
                                    placeholder="Titre affiché dans la bande accordion" />
                            </div>
                            <div className="form-control mb-4">
                                <label className="label cursor-pointer justify-start gap-3">
                                    <input type="checkbox" className="toggle toggle-secondary"
                                        checked={group.accordionOpen !== false}
                                        onChange={e => { group.accordionOpen = e.target.checked; forceUpdate() }} />
                                    <span className="label-text">Ouvert par défaut</span>
                                </label>
                            </div>
                        </>
                    )}
                    <div className="divider"></div>
                    <div className="form-control mb-4">
                        <label className="label cursor-pointer justify-start gap-3">
                            <input type="checkbox" className="toggle toggle-primary"
                                checked={!!group.tabsChild}
                                onChange={e => { group.tabsChild = e.target.checked; forceUpdate() }} />
                            <span className="label-text">Afficher les enfants en onglets (tabsChild)</span>
                        </label>
                    </div>
                    <div className="form-control mb-4">
                        <label className="label"><span className="label-text font-semibold">Nom du groupe (pour onglet)</span></label>
                        <input type="text" className="input input-bordered w-full"
                            value={group.name || ''}
                            onChange={e => { group.name = e.target.value; forceUpdate() }}
                            placeholder="Libellé de l'onglet" />
                    </div>
                    <div className="divider"></div>
                    <div className="form-control mb-4">
                        <label className="label gap-2">
                            <span className="label-text font-semibold">Condition d'affichage (queries.main)</span>
                        </label>
                        <p className="text-xs text-base-content/60 mb-2">Requête SQL ou JS. Si définie, le groupe est affiché uniquement si le résultat est truthy.</p>
                        <div className="rounded-lg border border-base-300 p-3 bg-base-200/50">
                            <div className="form-control mb-2">
                                <label className="label py-1"><span className="label-text text-sm">Type de langage</span></label>
                                <select className="select select-bordered select-sm w-full"
                                    value={ConfigManager.getGroupIfQuery(group)?.engine || 'sql'}
                                    onChange={e => {
                                        const q = ConfigManager.ensureGroupQueries(group)
                                        if (q) { q.engine = e.target.value; forceUpdate() }
                                    }}>
                                    <option value="sql">SQL</option>
                                    <option value="js">JavaScript</option>
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label py-1"><span className="label-text text-sm">Requête</span></label>
                                <textarea
                                    className="textarea textarea-bordered w-full font-mono min-h-20 text-sm"
                                    value={ConfigManager.getGroupIfQuery(group)?.sql || ''}
                                    onChange={e => {
                                        const q = ConfigManager.ensureGroupQueries(group)
                                        if (q) { q.sql = e.target.value; forceUpdate() }
                                    }}
                                    placeholder="SELECT true" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-action">
                    <button className="btn" onClick={() => set({ groupSettingsModal: { open: false, path: null } })}>Fermer</button>
                </div>
            </div>
        </div>
    )
}

// ─── ChildGroupModal ──────────────────────────────────────────────────────────
export function ChildGroupModal() {
    const {
        childGroupModal, devMode, isLoading,
        closeChildGroupModal, deleteChildGroupModal,
        addNestedGroup, openAddCellToGroupModal, runGroupAtPath
    } = useNotebookStore(s => ({
        childGroupModal: s.childGroupModal,
        devMode: s.devMode,
        isLoading: s.isLoading,
        closeChildGroupModal: s.closeChildGroupModal,
        deleteChildGroupModal: s.deleteChildGroupModal,
        addNestedGroup: s.addNestedGroup,
        openAddCellToGroupModal: s.openAddCellToGroupModal,
        runGroupAtPath: s.runGroupAtPath
    }))

    if (!childGroupModal.open || !childGroupModal.group) return null

    return (
        <div className="modal modal-open fixed inset-0 z-[2000]" role="presentation">
            <div className="modal-box w-full h-full max-w-none max-h-none rounded-none flex flex-col p-0" role="dialog" aria-modal="true">
                {/* Header sticky */}
                <div className="sticky top-0 z-10 flex items-center justify-between bg-primary text-primary-content px-6 py-4 shadow-md">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <span className="iconify" data-icon="material-symbols-light:export-notes-outline-sharp" style={{ fontSize: '1.5rem' }}></span>
                    </h3>
                    <button className="btn btn-sm btn-circle btn-ghost text-primary-content" onClick={closeChildGroupModal}>
                        <span className="iconify" data-icon="material-symbols-light:close" style={{ fontSize: '1rem' }}></span>
                    </button>
                </div>

                {/* Contenu scrollable */}
                <div className="flex-1 overflow-y-auto bg-base-100 p-6">
                    <div className="w-full">
                        <div className="border border-base-300 rounded-lg overflow-hidden bg-base-100">
                            {devMode && (
                                <div className="flex items-center justify-between gap-2 py-2 px-4 bg-primary/10 border-b border-base-300">
                                    <div className="join">
                                        <button className="btn btn-xs join-item btn-success" onClick={() => runGroupAtPath([-1])} disabled={isLoading} title="Exécuter">
                                            <span className="iconify" data-icon="material-symbols-light:play-arrow" style={{ fontSize: '1rem' }}></span>
                                        </button>
                                        <button className="btn btn-xs join-item" onClick={() => addNestedGroup([-1])} title="Ajouter un sous-groupe">
                                            <span className="iconify" data-icon="material-symbols-light:create-new-folder" style={{ fontSize: '1rem' }}></span>
                                        </button>
                                        <button className="btn btn-xs join-item" onClick={() => openAddCellToGroupModal([-1])} title="Ajouter une cellule">
                                            <span className="iconify" data-icon="material-symbols-light:add" style={{ fontSize: '1rem' }}></span>
                                        </button>
                                        <button className="btn btn-xs btn-error join-item" onClick={deleteChildGroupModal} title="Supprimer le groupe">
                                            <span className="iconify" data-icon="material-symbols-light:delete" style={{ fontSize: '1rem' }}></span>
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="p-2">
                                <GroupContainer
                                    group={childGroupModal.group}
                                    path={[-1]}
                                    depth={0}
                                    isFirst={true}
                                    isLast={true}
                                    siblingCount={1}
                                    inModal={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
