// @ts-nocheck
import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from '../../store/notebookStore'
import {
    Button,
    Badge,
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
    Separator,
    Switch,
    Card, CardContent,
} from '@sqlrooms/ui'

export function DbEngineModal() {
    const {
        showDbEngineModal, dbEngine, directedAcyclicGraph,
        switchDbEngine, canUseDucklings
    } = useNotebookStore(useShallow(s => ({
        showDbEngineModal: s.showDbEngineModal,
        dbEngine: s.dbEngine,
        directedAcyclicGraph: s.directedAcyclicGraph,
        switchDbEngine: s.switchDbEngine,
        canUseDucklings: s.canUseDucklings
    })))
    const set = useNotebookStore.setState

    const canDucklings = canUseDucklings()

    return (
        <Dialog open={showDbEngineModal} onOpenChange={open => !open && set({ showDbEngineModal: false })}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span className="iconify" data-icon="material-symbols-light:settings" style={{ fontSize: '1.25rem' }}></span>
                        Configuration job générale
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Choisissez le moteur SQL pour ce notebook :</p>

                    <Card
                        className={`cursor-pointer transition-all ${dbEngine === 'duckdb-wasm' ? 'ring-2 ring-primary' : 'hover:bg-muted'}`}
                        onClick={() => { switchDbEngine('duckdb-wasm'); set({ showDbEngineModal: false }) }}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <input type="radio" name="dbEngine" className="accent-primary" checked={dbEngine === 'duckdb-wasm'} readOnly />
                                <div>
                                    <h4 className="font-semibold">🦆 DuckDB WASM</h4>
                                    <p className="text-sm text-muted-foreground">Moteur complet avec support fichiers, extensions Excel, etc.</p>
                                    <div className="flex gap-2 mt-1">
                                        <Badge className="bg-green-600 text-white text-xs">Fichiers</Badge>
                                        <Badge className="bg-green-600 text-white text-xs">Extensions</Badge>
                                        <Badge className="bg-yellow-500 text-white text-xs">~10MB</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={`transition-all ${dbEngine === 'ducklings' ? 'ring-2 ring-primary' : 'hover:bg-muted'} ${!canDucklings ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        onClick={() => { if (canDucklings) { switchDbEngine('ducklings'); set({ showDbEngineModal: false }) } }}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <input type="radio" name="dbEngine" className="accent-primary" checked={dbEngine === 'ducklings'} disabled={!canDucklings} readOnly />
                                <div>
                                    <h4 className="font-semibold">🐤 Ducklings</h4>
                                    <p className="text-sm text-muted-foreground">Moteur léger pour notebooks "calculette" sans fichiers.</p>
                                    <div className="flex gap-2 mt-1">
                                        <Badge variant="destructive" className="text-xs">Pas de fichiers</Badge>
                                        <Badge variant="destructive" className="text-xs">Pas d'extensions</Badge>
                                        <Badge className="bg-green-600 text-white text-xs">~2MB</Badge>
                                    </div>
                                    {!canDucklings && (
                                        <p className="text-xs text-destructive mt-2">⚠️ Ce notebook contient des cellules source. Supprimez-les pour utiliser Ducklings.</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Separator />

                    <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-muted">
                        <div>
                            <h4 className="font-semibold flex items-center gap-2">
                                <span className="iconify" data-icon="material-symbols-light:account-tree" style={{ fontSize: '1.25rem' }}></span>
                                DAG (graphe acyclique dirigé)
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">Les cellules dépendantes se rafraîchissent automatiquement.</p>
                        </div>
                        <Switch
                            checked={directedAcyclicGraph}
                            onCheckedChange={() => set({ directedAcyclicGraph: !directedAcyclicGraph })}
                        />
                    </div>

                    <Separator />
                    <div className="text-xs text-muted-foreground">
                        <p><strong>Moteur actuel :</strong> {dbEngine === 'ducklings' ? 'Ducklings' : 'DuckDB WASM'}</p>
                        <p className="mt-1">Le changement de moteur réinitialise la base de données.</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
