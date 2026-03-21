import { useState, useRef } from 'react'
import {
    Button, Input,
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@sqlrooms/ui'
import { useTemplateModal } from '../../store/uiStores'
import { Icon } from '../../../lib/icons'

export function TemplateModal() {
    const {
        isOpen, filteredTemplates, searchQuery, getModalTitle,
        filterTemplates, close
    } = useTemplateModal()

    const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    function copyTemplate(code: string, idx: number) {
        navigator.clipboard.writeText(code).then(() => {
            setCopiedIdx(idx)
            if (timerRef.current) clearTimeout(timerRef.current)
            timerRef.current = setTimeout(() => setCopiedIdx(null), 2000)
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={open => !open && close()}>
            <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0" aria-describedby={undefined}>
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
                            <div key={idx} className="rounded-lg border border-border bg-muted transition-colors p-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <h4 className="font-medium">{template.name}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant={copiedIdx === idx ? 'default' : 'outline'}
                                        className="shrink-0"
                                        onClick={() => copyTemplate(template.code, idx)}
                                    >
                                        <Icon name={copiedIdx === idx ? 'check' : 'content-copy'} size={14} />
                                        {copiedIdx === idx ? 'Copié !' : 'Copier'}
                                    </Button>
                                </div>
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
                    <Button variant="ghost" onClick={close}>Fermer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
