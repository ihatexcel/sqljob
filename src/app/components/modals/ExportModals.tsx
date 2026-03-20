// @ts-nocheck
/**
 * Modals d'export : ExportModal, GistTokenModal, GistResultModal, JsonPassphraseModal
 */
import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from '../../store/notebookStore'
import {
    Button, Input, Label,
    Alert, AlertDescription,
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
    Separator,
    Switch,
    Spinner,
} from '@sqlrooms/ui'
import { Icon } from '../../../lib/icons'

// ─── ExportModal ──────────────────────────────────────────────────────────────
export function ExportModal() {
    const {
        exportModal, isLoading,
        cancelExport, executeExport, copyExportJson
    } = useNotebookStore(useShallow(s => ({
        exportModal: s.exportModal,
        isLoading: s.isLoading,
        cancelExport: s.cancelExport,
        executeExport: s.executeExport,
        copyExportJson: s.copyExportJson,
    })))
    const set = useNotebookStore.setState

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
        <Dialog open={!!em.show} onOpenChange={open => !open && cancelExport()}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>{typeLabels[em.type] || em.type}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {em.type === 'gist' && (
                        <div className="space-y-1">
                            <Label>Description</Label>
                            <Input value={em.description} onChange={e => update({ description: e.target.value })}
                                placeholder="sqljob Notebook Configuration"
                                onKeyDown={e => e.key === 'Enter' && executeExport()} />
                        </div>
                    )}

                    <div className="space-y-1">
                        <Label>
                            {em.type === 'html' ? 'Nom du fichier HTML' :
                                em.type === 'base64' ? 'Nom du fichier Base64' : 'Nom du fichier JSON'}
                        </Label>
                        <Input value={em.fileName} onChange={e => update({ fileName: e.target.value })}
                            placeholder="sqljob_yyyymmdd_hhmmss"
                            className="font-mono text-sm"
                            onKeyDown={e => e.key === 'Enter' && executeExport()} />
                        <p className="text-xs text-muted-foreground">
                            {em.type === 'base64' ? 'Extension .txt sera ajoutée automatiquement' :
                                em.type === 'html' ? 'Extension .html sera ajoutée automatiquement' :
                                    'Extension .json sera ajoutée automatiquement si absente'}
                        </p>
                    </div>

                    <Separator />
                    <p className="text-sm font-medium text-muted-foreground">Paramètres de la configuration</p>

                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <Label className="font-semibold flex items-center gap-2">
                                <Icon name="database" size={16} />
                                Inclure les fichiers chargés
                            </Label>
                            <p className="text-xs text-muted-foreground">Attention vos données seront partagées si coché</p>
                        </div>
                        <Switch checked={!!em.includeFiles} onCheckedChange={v => update({ includeFiles: v })} />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <Label className="font-semibold">Mode développeur</Label>
                            <p className="text-xs text-muted-foreground">Afficher les contrôles d'édition des cellules et groupes</p>
                        </div>
                        <Switch checked={!!em.devMode} onCheckedChange={v => update({ devMode: v, showLayout: v })} />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <Label className="font-semibold">Afficher l'entête et pied de page</Label>
                            <p className="text-xs text-muted-foreground">Décocher pour partager votre notebook sous forme d'iframe</p>
                        </div>
                        <Switch checked={!!em.showLayout} onCheckedChange={v => update({ showLayout: v })} />
                    </div>

                    {['gist', 'json', 'html'].includes(em.type) && (
                        <>
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <Label className="font-semibold flex items-center gap-2">
                                        <Icon name="lock" size={20} />
                                        Chiffrer la configuration
                                    </Label>
                                    <p className="text-xs text-muted-foreground">Chiffrer la configuration et les données avec un mot de passe</p>
                                </div>
                                <Switch
                                    checked={em.encryptGist}
                                    onCheckedChange={v => {
                                        const GistEncrypt = window.GistEncrypt
                                        update({
                                            encryptGist: v,
                                            gistPassphrase: v && !em.gistPassphrase ? GistEncrypt?.generatePassphrase() || '' : em.gistPassphrase
                                        })
                                    }}
                                />
                            </div>
                            {em.encryptGist && (
                                <div className="space-y-1">
                                    <Label>Mot de passe (à partager pour déchiffrer)</Label>
                                    <Input value={em.gistPassphrase}
                                        onChange={e => update({ gistPassphrase: e.target.value })}
                                        placeholder="68cd597ba5da05ceba24fb975c05384f"
                                        className="font-mono text-sm"
                                        onKeyDown={e => e.key === 'Enter' && executeExport()} />
                                </div>
                            )}
                        </>
                    )}

                    {em.type === 'gist' && (
                        <Alert>
                            <AlertDescription className="text-sm">Ne partagez pas de données confidentielles. Le Gist sera accessible via le lien partagé.</AlertDescription>
                        </Alert>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={cancelExport}>Annuler</Button>
                    {em.type === 'json' && (
                        <Button variant="outline" onClick={copyExportJson} disabled={isLoading}>
                            <Icon name="content-copy" size={16} />
                            Copier
                        </Button>
                    )}
                    <Button onClick={executeExport}>
                        {em.type === 'gist' ? 'Créer le Gist' : 'Exporter'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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

    return (
        <Dialog open={showGistTokenModal} onOpenChange={open => !open && cancelGithubToken()}>
            <DialogContent className="max-w-lg" aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Icon name="settings" size={20} />
                        Configuration GitHub
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Pour partager votre notebook via GitHub Gist, vous devez créer un <strong>Personal Access Token</strong> :
                    </p>
                    <ol className="text-sm list-decimal list-inside space-y-2 text-muted-foreground">
                        <li>Allez sur GitHub → Settings → Developer settings</li>
                        <li>Cliquez sur "Generate new token (classic)"</li>
                        <li>Donnez un nom (ex: "sqljob notebook")</li>
                        <li>Cochez uniquement la permission <strong>gist</strong></li>
                        <li>Cliquez sur "Generate token" et copiez-le</li>
                    </ol>
                    <div className="space-y-1">
                        <Label>Collez votre token ici :</Label>
                        <Input type="password" value={githubToken}
                            onChange={e => set({ githubToken: e.target.value })}
                            placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                            onKeyDown={e => e.key === 'Enter' && saveGithubToken()} />
                        <p className="text-xs text-yellow-600">⚠️ Le token sera stocké localement dans votre navigateur</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={cancelGithubToken}>Annuler</Button>
                    <Button onClick={saveGithubToken}>Enregistrer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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

    return (
        <Dialog open={showGistModal} onOpenChange={open => !open && closeGistModal()}>
            <DialogContent className="max-w-2xl" aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Icon name="check-circle" size={20} className="text-green-600" />
                        Gist créé avec succès
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Votre notebook a été partagé sur GitHub Gist. Partagez cette URL :
                    </p>
                    <div className="flex gap-2">
                        <Input value={gistShareUrl} readOnly
                            className="flex-1 font-mono text-sm"
                            onClick={e => (e.target as HTMLInputElement).select()} />
                        <Button onClick={copyGistUrl}>
                            <Icon name="content-copy" size={16} /> Copier
                        </Button>
                    </div>
                    {gistWasEncrypted && (
                        <>
                            <Alert className="border-yellow-400">
                                <AlertDescription className="text-sm"><strong>Configuration chiffrée.</strong> Transmettez le mot de passe au destinataire par un canal sécurisé.</AlertDescription>
                            </Alert>
                            <div className="space-y-1">
                                <Label>Mot de passe</Label>
                                <div className="flex gap-2">
                                    <Input value={gistPassphraseToShare} readOnly
                                        className="flex-1 font-mono text-sm"
                                        onClick={e => (e.target as HTMLInputElement).select()} />
                                    <Button onClick={copyGistPassphrase}>
                                        <Icon name="content-copy" size={16} /> Copier
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={closeGistModal}>Fermer</Button>
                    <Button onClick={openGistUrl}>Ouvrir le lien</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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

    return (
        <Dialog open={showJsonPassphraseModal} onOpenChange={open => !open && cancelJsonPassphraseModal()}>
            <DialogContent className="max-w-md" aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Icon name="lock" size={20} />
                        Fichier JSON chiffré
                    </DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">Ce fichier est protégé par un mot de passe.</p>
                <div className="space-y-1">
                    <Label>Mot de passe</Label>
                    <Input type="password" value={jsonPassphrase}
                        onChange={e => set({ jsonPassphrase: e.target.value })}
                        onKeyDown={e => e.key === 'Enter' && unlockJsonConfig()}
                        placeholder="68cd597ba5da05ceba24fb975c05384f"
                        className="font-mono"
                        autoComplete="current-password" />
                </div>
                {jsonPassphraseError && (
                    <Alert variant="destructive">
                        <AlertDescription>{jsonPassphraseError}</AlertDescription>
                    </Alert>
                )}
                <DialogFooter>
                    <Button variant="ghost" onClick={cancelJsonPassphraseModal}>Annuler</Button>
                    <Button onClick={unlockJsonConfig} disabled={jsonPassphraseLoading}>
                        {jsonPassphraseLoading ? <Spinner className="h-4 w-4 mr-2" /> : null}
                        Déchiffrer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
