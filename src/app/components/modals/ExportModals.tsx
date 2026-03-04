// @ts-nocheck
/**
 * Modals d'export : ExportModal, GistTokenModal, GistResultModal, JsonPassphraseModal
 */
import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from '../../store/notebookStore'

// ─── ExportModal ──────────────────────────────────────────────────────────────
export function ExportModal() {
    const {
        exportModal, isLoading,
        cancelExport, executeExport
    } = useNotebookStore(useShallow(s => ({
        exportModal: s.exportModal,
        isLoading: s.isLoading,
        cancelExport: s.cancelExport,
        executeExport: s.executeExport
    })))
    const set = useNotebookStore.setState

    if (!exportModal.show) return null

    const em = exportModal
    const update = (patch: any) => set({ exportModal: { ...em, ...patch } })

    const typeLabels: Record<string, string> = {
        gist: 'Partager via GitHub Gist',
        json: 'Export JSON',
        base64: 'Export Base64',
        html: 'Export HTML',
        'html-client': 'Export HTML Client'
    }

    return (
        <div className="modal modal-open z-[2100]" onClick={e => { if (e.target === e.currentTarget) cancelExport() }} role="presentation">
            <div className="modal-box max-w-lg overflow-y-auto max-h-[90vh]" role="dialog" aria-modal="true">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold">{typeLabels[em.type] || em.type}</h3>
                    <button className="btn btn-sm btn-ghost" onClick={cancelExport}>
                        <span className="iconify" data-icon="material-symbols-light:close" style={{ fontSize: '1rem' }}></span>
                    </button>
                </div>
                <div className="mt-4 space-y-4">
                    {em.type === 'gist' && (
                        <div className="form-control">
                            <label className="label"><span className="label-text">Description</span></label>
                            <input type="text" value={em.description} onChange={e => update({ description: e.target.value })}
                                placeholder="sqljob Notebook Configuration"
                                className="input input-bordered w-full"
                                onKeyDown={e => e.key === 'Enter' && executeExport()} />
                        </div>
                    )}

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                {em.type === 'html' ? 'Nom du fichier HTML' :
                                    em.type === 'base64' ? 'Nom du fichier Base64' : 'Nom du fichier JSON'}
                            </span>
                        </label>
                        <input type="text" value={em.fileName} onChange={e => update({ fileName: e.target.value })}
                            placeholder="sqljob_yyyymmdd_hhmmss"
                            className="input input-bordered w-full font-mono text-sm"
                            onKeyDown={e => e.key === 'Enter' && executeExport()} />
                        <label className="label">
                            <span className="label-text-alt">
                                {em.type === 'base64' ? 'Extension .txt sera ajoutée automatiquement' :
                                    em.type === 'html' ? 'Extension .html sera ajoutée automatiquement' :
                                        'Extension .json sera ajoutée automatiquement si absente'}
                            </span>
                        </label>
                    </div>

                    <div className="divider text-sm">Paramètres de la configuration</div>

                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-3">
                            <input type="checkbox" className="toggle toggle-warning"
                                checked={!!em.includeFiles} onChange={e => update({ includeFiles: e.target.checked })} />
                            <div>
                                <span className="label-text font-semibold flex items-center gap-2">
                                    <span className="iconify" data-icon="material-symbols-light:database" style={{ fontSize: '1rem' }}></span>
                                    Inclure les fichiers chargés
                                </span>
                                <p className="text-xs text-base-content/60">Attention vos données seront partagées si coché</p>
                            </div>
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-3">
                            <input type="checkbox" className="toggle toggle-primary"
                                checked={!!em.devMode} onChange={e => update({ devMode: e.target.checked })} />
                            <div>
                                <span className="label-text font-semibold">Mode développeur</span>
                                <p className="text-xs text-base-content/60">Afficher les contrôles d'édition des cellules et groupes</p>
                            </div>
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-3">
                            <input type="checkbox" className="toggle toggle-primary"
                                checked={!!em.showLayout} onChange={e => update({ showLayout: e.target.checked })} />
                            <div>
                                <span className="label-text font-semibold">Afficher l'entête et pied de page</span>
                                <p className="text-xs text-base-content/60">Décocher pour partager votre notebook sous forme d'iframe</p>
                            </div>
                        </label>
                    </div>

                    {['gist', 'json', 'html'].includes(em.type) && (
                        <>
                            <div className="form-control">
                                <label className="label cursor-pointer justify-start gap-3">
                                    <input type="checkbox" className="toggle toggle-primary"
                                        checked={em.encryptGist}
                                        onChange={e => {
                                            const GistEncrypt = window.GistEncrypt
                                            update({
                                                encryptGist: e.target.checked,
                                                gistPassphrase: e.target.checked && !em.gistPassphrase ? GistEncrypt?.generatePassphrase() || '' : em.gistPassphrase
                                            })
                                        }} />
                                    <div>
                                        <span className="label-text font-semibold flex items-center gap-2">
                                            <span className="iconify" data-icon="material-symbols-light:lock" style={{ fontSize: '1rem' }}></span>
                                            Chiffrer la configuration
                                        </span>
                                        <p className="text-xs text-base-content/60">Chiffrer la configuration et les données avec un mot de passe</p>
                                    </div>
                                </label>
                            </div>
                            {em.encryptGist && (
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Mot de passe (à partager pour déchiffrer)</span></label>
                                    <input type="text" value={em.gistPassphrase}
                                        onChange={e => update({ gistPassphrase: e.target.value })}
                                        placeholder="68cd597ba5da05ceba24fb975c05384f"
                                        className="input input-bordered w-full font-mono text-sm"
                                        onKeyDown={e => e.key === 'Enter' && executeExport()} />
                                </div>
                            )}
                        </>
                    )}

                    {em.type === 'gist' && (
                        <div className="alert alert-info">
                            <span className="text-sm">Ne partagez pas de données confidentielles. Le Gist sera accessible via le lien partagé.</span>
                        </div>
                    )}
                </div>
                <div className="modal-action">
                    <button onClick={cancelExport} className="btn btn-ghost">Annuler</button>
                    <button onClick={executeExport} className="btn btn-primary">
                        {em.type === 'gist' ? 'Créer le Gist' : 'Exporter'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── GistTokenModal ───────────────────────────────────────────────────────────
export function GistTokenModal() {
    const { showGistTokenModal, githubToken, saveGithubToken, cancelGithubToken } = useNotebookStore(useShallow(s => ({
        showGistTokenModal: s.showGistTokenModal,
        githubToken: s.githubToken,
        saveGithubToken: s.saveGithubToken,
        cancelGithubToken: s.cancelGithubToken
    })))
    const set = useNotebookStore.setState

    if (!showGistTokenModal) return null
    return (
        <div className="modal modal-open z-[2100]" onClick={e => { if (e.target === e.currentTarget) cancelGithubToken() }} role="presentation">
            <div className="modal-box max-w-lg" role="dialog" aria-modal="true">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <span className="iconify" data-icon="material-symbols-light:settings" style={{ fontSize: '1.25rem' }}></span>
                        Configuration GitHub
                    </h3>
                    <button className="btn btn-sm btn-ghost" onClick={cancelGithubToken}>
                        <span className="iconify" data-icon="material-symbols-light:close" style={{ fontSize: '1rem' }}></span>
                    </button>
                </div>
                <div className="mt-4 space-y-4">
                    <p className="text-sm text-base-content/60">
                        Pour partager votre notebook via GitHub Gist, vous devez créer un <strong>Personal Access Token</strong> :
                    </p>
                    <ol className="text-sm list-decimal list-inside space-y-2 text-base-content/80">
                        <li>Allez sur GitHub → Settings → Developer settings</li>
                        <li>Cliquez sur "Generate new token (classic)"</li>
                        <li>Donnez un nom (ex: "sqljob notebook")</li>
                        <li>Cochez uniquement la permission <strong>gist</strong></li>
                        <li>Cliquez sur "Generate token" et copiez-le</li>
                    </ol>
                    <div className="form-control">
                        <label className="label"><span className="label-text">Collez votre token ici :</span></label>
                        <input type="password" value={githubToken}
                            onChange={e => set({ githubToken: e.target.value })}
                            placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                            className="input input-bordered w-full"
                            onKeyDown={e => e.key === 'Enter' && saveGithubToken()} />
                        <label className="label">
                            <span className="label-text-alt text-warning">⚠️ Le token sera stocké localement dans votre navigateur</span>
                        </label>
                    </div>
                </div>
                <div className="modal-action">
                    <button onClick={cancelGithubToken} className="btn btn-ghost">Annuler</button>
                    <button onClick={saveGithubToken} className="btn btn-primary">Enregistrer</button>
                </div>
            </div>
        </div>
    )
}

// ─── GistResultModal ──────────────────────────────────────────────────────────
export function GistResultModal() {
    const {
        showGistModal, gistShareUrl, gistWasEncrypted, gistPassphraseToShare,
        closeGistModal, copyGistUrl, copyGistPassphrase, openGistUrl
    } = useNotebookStore(useShallow(s => ({
        showGistModal: s.showGistModal,
        gistShareUrl: s.gistShareUrl,
        gistWasEncrypted: s.gistWasEncrypted,
        gistPassphraseToShare: s.gistPassphraseToShare,
        closeGistModal: s.closeGistModal,
        copyGistUrl: s.copyGistUrl,
        copyGistPassphrase: s.copyGistPassphrase,
        openGistUrl: s.openGistUrl
    })))

    if (!showGistModal) return null
    return (
        <div className="modal modal-open z-[2100]" onClick={e => { if (e.target === e.currentTarget) closeGistModal() }} role="presentation">
            <div className="modal-box max-w-2xl" role="dialog" aria-modal="true">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <span className="iconify text-success" data-icon="material-symbols-light:check-circle" style={{ fontSize: '1.25rem' }}></span>
                        Gist créé avec succès
                    </h3>
                    <button className="btn btn-sm btn-ghost" onClick={closeGistModal}>
                        <span className="iconify" data-icon="material-symbols-light:close" style={{ fontSize: '1rem' }}></span>
                    </button>
                </div>
                <div className="mt-4 space-y-4">
                    <p className="text-sm text-base-content/60">
                        Votre notebook a été partagé sur GitHub Gist. Partagez cette URL :
                    </p>
                    <div className="form-control">
                        <div className="join w-full">
                            <input type="text" value={gistShareUrl} readOnly
                                className="input input-bordered join-item flex-1 font-mono text-sm"
                                onClick={e => (e.target as HTMLInputElement).select()} />
                            <button onClick={copyGistUrl} className="btn join-item btn-primary">
                                <span className="iconify" data-icon="material-symbols-light:content-copy" style={{ fontSize: '1rem' }}></span> Copier
                            </button>
                        </div>
                    </div>
                    {gistWasEncrypted && (
                        <>
                            <div className="alert alert-warning">
                                <span className="text-sm"><strong>Configuration chiffrée.</strong> Transmettez le mot de passe au destinataire par un canal sécurisé.</span>
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Mot de passe</span></label>
                                <div className="join w-full">
                                    <input type="text" value={gistPassphraseToShare} readOnly
                                        className="input input-bordered join-item flex-1 font-mono text-sm"
                                        onClick={e => (e.target as HTMLInputElement).select()} />
                                    <button onClick={copyGistPassphrase} className="btn join-item btn-primary">
                                        <span className="iconify" data-icon="material-symbols-light:content-copy" style={{ fontSize: '1rem' }}></span> Copier
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="modal-action">
                    <button onClick={closeGistModal} className="btn btn-ghost">Fermer</button>
                    <button onClick={openGistUrl} className="btn btn-primary">Ouvrir le lien</button>
                </div>
            </div>
        </div>
    )
}

// ─── JsonPassphraseModal ──────────────────────────────────────────────────────
export function JsonPassphraseModal() {
    const {
        showJsonPassphraseModal, jsonPassphrase, jsonPassphraseError, jsonPassphraseLoading,
        unlockJsonConfig, cancelJsonPassphraseModal
    } = useNotebookStore(useShallow(s => ({
        showJsonPassphraseModal: s.showJsonPassphraseModal,
        jsonPassphrase: s.jsonPassphrase,
        jsonPassphraseError: s.jsonPassphraseError,
        jsonPassphraseLoading: s.jsonPassphraseLoading,
        unlockJsonConfig: s.unlockJsonConfig,
        cancelJsonPassphraseModal: s.cancelJsonPassphraseModal
    })))
    const set = useNotebookStore.setState

    if (!showJsonPassphraseModal) return null
    return (
        <div className="modal modal-open z-[2100]" onClick={e => { if (e.target === e.currentTarget) cancelJsonPassphraseModal() }} role="presentation">
            <div className="modal-box max-w-md" role="dialog" aria-modal="true">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <span className="iconify" data-icon="material-symbols-light:lock" style={{ fontSize: '1.25rem' }}></span>
                        Fichier JSON chiffré
                    </h3>
                    <button className="btn btn-sm btn-ghost" onClick={cancelJsonPassphraseModal}>
                        <span className="iconify" data-icon="material-symbols-light:close" style={{ fontSize: '1rem' }}></span>
                    </button>
                </div>
                <p className="py-2 text-sm text-base-content/70">Ce fichier est protégé par un mot de passe.</p>
                <div className="form-control mt-4">
                    <label className="label"><span className="label-text">Mot de passe</span></label>
                    <input type="password" value={jsonPassphrase}
                        onChange={e => set({ jsonPassphrase: e.target.value })}
                        onKeyDown={e => e.key === 'Enter' && unlockJsonConfig()}
                        placeholder="68cd597ba5da05ceba24fb975c05384f"
                        className="input input-bordered w-full font-mono"
                        autoComplete="current-password" />
                </div>
                {jsonPassphraseError && (
                    <div className="alert alert-error mt-3"><span>{jsonPassphraseError}</span></div>
                )}
                <div className="modal-action">
                    <button onClick={cancelJsonPassphraseModal} className="btn btn-ghost">Annuler</button>
                    <button onClick={unlockJsonConfig} className="btn btn-primary" disabled={jsonPassphraseLoading}>
                        {jsonPassphraseLoading
                            ? <span className="loading loading-spinner loading-sm"></span>
                            : 'Déchiffrer'
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}
