// @ts-nocheck
import { useNotebookStore } from '../../store/notebookStore'

export function DbEngineModal() {
    const {
        showDbEngineModal, dbEngine, directedAcyclicGraph,
        switchDbEngine, canUseDucklings
    } = useNotebookStore(s => ({
        showDbEngineModal: s.showDbEngineModal,
        dbEngine: s.dbEngine,
        directedAcyclicGraph: s.directedAcyclicGraph,
        switchDbEngine: s.switchDbEngine,
        canUseDucklings: s.canUseDucklings
    }))
    const set = useNotebookStore.setState

    if (!showDbEngineModal) return null
    const canDucklings = canUseDucklings()

    return (
        <div className="modal modal-open z-[2100]" onClick={e => { if (e.target === e.currentTarget) set({ showDbEngineModal: false }) }} role="presentation">
            <div className="modal-box" role="dialog" aria-modal="true">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <span className="iconify" data-icon="material-symbols-light:settings" style={{ fontSize: '1.25rem' }}></span>
                        Configuration job générale
                    </h3>
                    <button className="btn btn-sm btn-ghost" onClick={() => set({ showDbEngineModal: false })}>
                        <span className="iconify" data-icon="material-symbols-light:close" style={{ fontSize: '1rem' }}></span>
                    </button>
                </div>
                <div className="mt-4 space-y-4">
                    <p className="text-sm text-base-content/60">Choisissez le moteur SQL pour ce notebook :</p>

                    <div
                        className={`card bg-base-200 cursor-pointer transition-all ${dbEngine === 'duckdb-wasm' ? 'ring-2 ring-primary' : 'hover:bg-base-300'}`}
                        onClick={() => { switchDbEngine('duckdb-wasm'); set({ showDbEngineModal: false }) }}
                    >
                        <div className="card-body p-4">
                            <div className="flex items-center gap-3">
                                <input type="radio" name="dbEngine" className="radio radio-primary" checked={dbEngine === 'duckdb-wasm'} readOnly />
                                <div>
                                    <h4 className="font-semibold">🦆 DuckDB WASM</h4>
                                    <p className="text-sm text-base-content/60">Moteur complet avec support fichiers, extensions Excel, etc.</p>
                                    <div className="flex gap-2 mt-1">
                                        <span className="badge badge-success badge-sm">Fichiers</span>
                                        <span className="badge badge-success badge-sm">Extensions</span>
                                        <span className="badge badge-warning badge-sm">~10MB</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`card bg-base-200 transition-all ${dbEngine === 'ducklings' ? 'ring-2 ring-primary' : 'hover:bg-base-300'} ${!canDucklings ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        onClick={() => { if (canDucklings) { switchDbEngine('ducklings'); set({ showDbEngineModal: false }) } }}
                    >
                        <div className="card-body p-4">
                            <div className="flex items-center gap-3">
                                <input type="radio" name="dbEngine" className="radio radio-primary" checked={dbEngine === 'ducklings'} disabled={!canDucklings} readOnly />
                                <div>
                                    <h4 className="font-semibold">🐤 Ducklings</h4>
                                    <p className="text-sm text-base-content/60">Moteur léger pour notebooks "calculette" sans fichiers.</p>
                                    <div className="flex gap-2 mt-1">
                                        <span className="badge badge-error badge-sm">Pas de fichiers</span>
                                        <span className="badge badge-error badge-sm">Pas d'extensions</span>
                                        <span className="badge badge-success badge-sm">~2MB</span>
                                    </div>
                                    {!canDucklings && (
                                        <p className="text-xs text-error mt-2">⚠️ Ce notebook contient des cellules source. Supprimez-les pour utiliser Ducklings.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-base-200">
                        <div>
                            <h4 className="font-semibold flex items-center gap-2">
                                <span className="iconify" data-icon="material-symbols-light:account-tree" style={{ fontSize: '1.25rem' }}></span>
                                DAG (graphe acyclique dirigé)
                            </h4>
                            <p className="text-sm text-base-content/60 mt-1">Les cellules dépendantes se rafraîchissent automatiquement.</p>
                        </div>
                        <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={directedAcyclicGraph}
                            onChange={() => set({ directedAcyclicGraph: !directedAcyclicGraph })}
                        />
                    </div>

                    <div className="divider"></div>
                    <div className="text-xs text-base-content/50">
                        <p><strong>Moteur actuel :</strong> {dbEngine === 'ducklings' ? 'Ducklings' : 'DuckDB WASM'}</p>
                        <p className="mt-1">Le changement de moteur réinitialise la base de données.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
