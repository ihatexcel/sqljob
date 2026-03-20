// @ts-nocheck
/**
 * Modals simples : AddGroup, InsertGroup, InsertCell, AddCellToGroup
 */
import { memo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from '../../store/notebookStore'
import {
    Button,
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@sqlrooms/ui'
import { Icon, CellTypeIcon } from '../../../lib/icons'

// ─── Icônes cellules ──────────────────────────────────────────────────────────
const CellTypeGrid = memo(function CellTypeGrid({ onSelect }: { onSelect: (type: string) => void }) {
    const cellTypes = useNotebookStore(s => s.cellTypes)
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cellTypes.map(ct => (
                <Button
                    key={ct.type}
                    variant="outline"
                    className="justify-start"
                    onClick={() => onSelect(ct.type)}
                >
                    <CellTypeIcon type={ct.type} size={20} />
                    <span>{ct.label}</span>
                </Button>
            ))}
        </div>
    )
})

// ─── AddGroupModal ────────────────────────────────────────────────────────────
export function AddGroupModal() {
    const { showAddGroupModal, addGroup } = useNotebookStore(useShallow(s => ({
        showAddGroupModal: s.showAddGroupModal,
        addGroup: s.addGroup
    })))
    const set = useNotebookStore.setState

    return (
        <Dialog open={showAddGroupModal} onOpenChange={open => !open && set({ showAddGroupModal: false })}>
            <DialogContent aria-describedby={undefined} className="flex flex-col max-h-[90dvh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Icon name="add" size={20} />
                        Ajouter un groupe
                    </DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto flex-1 min-h-0">
                    <p className="text-sm text-muted-foreground mb-4">Choisissez le type de cellule pour le nouveau groupe :</p>
                    <CellTypeGrid onSelect={type => { addGroup(type); set({ showAddGroupModal: false }) }} />
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ─── InsertGroupModal ─────────────────────────────────────────────────────────
export function InsertGroupModal() {
    const { insertGroupModal, insertGroupAt } = useNotebookStore(useShallow(s => ({
        insertGroupModal: s.insertGroupModal,
        insertGroupAt: s.insertGroupAt
    })))
    const set = useNotebookStore.setState

    return (
        <Dialog open={insertGroupModal.open} onOpenChange={open => !open && set({ insertGroupModal: { ...insertGroupModal, open: false } })}>
            <DialogContent aria-describedby={undefined} className="flex flex-col max-h-[90dvh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Icon name="add" size={20} />
                        Insérer un groupe à la position {(insertGroupModal.atIndex ?? 0) + 1}
                    </DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto flex-1 min-h-0">
                    <p className="text-sm text-muted-foreground mb-4">Choisissez le type de cellule pour le nouveau groupe :</p>
                    <CellTypeGrid onSelect={type => {
                        insertGroupAt(insertGroupModal.atIndex, type)
                        set({ insertGroupModal: { ...insertGroupModal, open: false } })
                    }} />
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ─── InsertCellModal ──────────────────────────────────────────────────────────
export function InsertCellModal() {
    const { insertCellModal, insertCellAt } = useNotebookStore(useShallow(s => ({
        insertCellModal: s.insertCellModal,
        insertCellAt: s.insertCellAt
    })))
    const set = useNotebookStore.setState

    return (
        <Dialog open={insertCellModal.open} onOpenChange={open => !open && set({ insertCellModal: { ...insertCellModal, open: false } })}>
            <DialogContent aria-describedby={undefined} className="flex flex-col max-h-[90dvh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Icon name="add" size={20} />
                        Insérer une cellule à la position {(insertCellModal.atCellIndex ?? 0) + 1}
                    </DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto flex-1 min-h-0">
                    <CellTypeGrid onSelect={type => {
                        insertCellAt(insertCellModal.groupIndex, insertCellModal.atCellIndex, type)
                        set({ insertCellModal: { ...insertCellModal, open: false } })
                    }} />
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ─── AddCellToGroupModal ──────────────────────────────────────────────────────
export function AddCellToGroupModal() {
    const { addCellToGroupModal, addCellToGroup } = useNotebookStore(useShallow(s => ({
        addCellToGroupModal: s.addCellToGroupModal,
        addCellToGroup: s.addCellToGroup
    })))
    const set = useNotebookStore.setState

    return (
        <Dialog open={addCellToGroupModal.open} onOpenChange={open => !open && set({ addCellToGroupModal: { ...addCellToGroupModal, open: false } })}>
            <DialogContent aria-describedby={undefined} className="flex flex-col max-h-[90dvh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Icon name="add" size={20} />
                        Ajouter une cellule au groupe
                    </DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto flex-1 min-h-0">
                    <CellTypeGrid onSelect={type => {
                        addCellToGroup(addCellToGroupModal.path ?? addCellToGroupModal.groupIndex, type)
                        set({ addCellToGroupModal: { ...addCellToGroupModal, open: false } })
                    }} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
