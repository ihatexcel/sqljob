import {
    Button,
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@sqlrooms/ui'
import { useConfirmModal } from '../../store/uiStores'

export function ConfirmModal() {
    const { isOpen, message, confirm, cancel } = useConfirmModal()
    return (
        <Dialog open={isOpen} onOpenChange={open => !open && cancel()}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Confirmation</DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="ghost" onClick={cancel}>Annuler</Button>
                    <Button variant="destructive" onClick={confirm}>Supprimer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
