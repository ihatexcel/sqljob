import {
    Button, Input,
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@sqlrooms/ui'
import { useTemplateModal } from '../../store/uiStores'

export function TemplateModal() {
    const {
        isOpen, filteredTemplates, searchQuery, getModalTitle,
        filterTemplates, selectTemplate, close
    } = useTemplateModal()

    return (
        <Dialog open={isOpen} onOpenChange={open => !open && close()}>
            <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-4 border-b border-border">
                    <DialogTitle>{getModalTitle()}</DialogTitle>
                </DialogHeader>
                <div className="p-4 border-b border-border">
                    <Input
                        value={searchQuery}
                        onChange={e => {
                            useTemplateModal.setState({ searchQuery: e.target.value })
                            filterTemplates()
                        }}
                        placeholder="🔍 Rechercher un template..."
                    />
                    {filteredTemplates.length === 0 && searchQuery && (
                        <div className="text-sm text-muted-foreground mt-2">Aucun template trouvé</div>
                    )}
                </div>
                <div className="p-4 overflow-y-auto flex-1">
                    <div className="space-y-3">
                        {filteredTemplates.map((template, idx) => (
                            <div
                                key={idx}
                                className="rounded-lg border border-border bg-muted hover:bg-accent cursor-pointer transition-colors p-4"
                                onClick={() => selectTemplate(template.originalIndex)}
                            >
                                <h4 className="font-medium">{template.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                                <div className="mt-2">
                                    <pre className="bg-background p-3 rounded text-xs overflow-x-auto border border-border">
                                        <code>{template.code}</code>
                                    </pre>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <DialogFooter className="p-4 border-t border-border">
                    <Button variant="ghost" onClick={close}>Annuler</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
