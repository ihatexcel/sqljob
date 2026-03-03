// @ts-nocheck
/**
 * Modals simples : AddGroup, InsertGroup, InsertCell, AddCellToGroup
 */
import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from '../../store/notebookStore'

// ─── Icônes cellules ──────────────────────────────────────────────────────────
function CellTypeGrid({ onSelect }: { onSelect: (type: string) => void }) {
    const cellTypes = useNotebookStore(s => s.cellTypes)
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cellTypes.map(ct => (
                <button
                    key={ct.type}
                    className="btn justify-start"
                    onClick={() => onSelect(ct.type)}
                    dangerouslySetInnerHTML={undefined}
                >
                    <span dangerouslySetInnerHTML={{ __html: ct.icon }}></span>
                    <span>{ct.label}</span>
                </button>
            ))}
        </div>
    )
}

// ─── AddGroupModal ────────────────────────────────────────────────────────────
export function AddGroupModal() {
    const { showAddGroupModal, addGroup } = useNotebookStore(useShallow(s => ({
        showAddGroupModal: s.showAddGroupModal,
        addGroup: s.addGroup
    })))
    const set = useNotebookStore.setState

    if (!showAddGroupModal) return null
    return (
        <div className="modal modal-open" onClick={e => { if (e.target === e.currentTarget) set({ showAddGroupModal: false }) }} role="presentation">
            <div className="modal-box" role="dialog" aria-modal="true">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <span className="iconify" data-icon="material-symbols-light:add" style={{ fontSize: '1.25rem' }}></span>
                        Ajouter un groupe
                    </h3>
                    <button className="btn btn-sm btn-ghost" onClick={() => set({ showAddGroupModal: false })}>
                        <span className="iconify" data-icon="material-symbols-light:close" style={{ fontSize: '1rem' }}></span>
                    </button>
                </div>
                <div className="mt-4">
                    <p className="text-sm text-base-content/60 mb-4">Choisissez le type de cellule pour le nouveau groupe :</p>
                    <CellTypeGrid onSelect={type => { addGroup(type); set({ showAddGroupModal: false }) }} />
                </div>
            </div>
        </div>
    )
}

// ─── InsertGroupModal ─────────────────────────────────────────────────────────
export function InsertGroupModal() {
    const { insertGroupModal, insertGroupAt } = useNotebookStore(useShallow(s => ({
        insertGroupModal: s.insertGroupModal,
        insertGroupAt: s.insertGroupAt
    })))
    const set = useNotebookStore.setState

    if (!insertGroupModal.open) return null
    return (
        <div className="modal modal-open" onClick={e => { if (e.target === e.currentTarget) set({ insertGroupModal: { ...insertGroupModal, open: false } }) }} role="presentation">
            <div className="modal-box" role="dialog" aria-modal="true">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <span className="iconify" data-icon="material-symbols-light:add" style={{ fontSize: '1.25rem' }}></span>
                        Insérer un groupe à la position {(insertGroupModal.atIndex ?? 0) + 1}
                    </h3>
                    <button className="btn btn-sm btn-ghost" onClick={() => set({ insertGroupModal: { ...insertGroupModal, open: false } })}>
                        <span className="iconify" data-icon="material-symbols-light:close" style={{ fontSize: '1rem' }}></span>
                    </button>
                </div>
                <div className="mt-4">
                    <p className="text-sm text-base-content/60 mb-4">Choisissez le type de cellule pour le nouveau groupe :</p>
                    <CellTypeGrid onSelect={type => {
                        insertGroupAt(insertGroupModal.atIndex, type)
                        set({ insertGroupModal: { ...insertGroupModal, open: false } })
                    }} />
                </div>
            </div>
        </div>
    )
}

// ─── InsertCellModal ──────────────────────────────────────────────────────────
export function InsertCellModal() {
    const { insertCellModal, insertCellAt } = useNotebookStore(useShallow(s => ({
        insertCellModal: s.insertCellModal,
        insertCellAt: s.insertCellAt
    })))
    const set = useNotebookStore.setState

    if (!insertCellModal.open) return null
    return (
        <div className="modal modal-open" onClick={e => { if (e.target === e.currentTarget) set({ insertCellModal: { ...insertCellModal, open: false } }) }} role="presentation">
            <div className="modal-box" role="dialog" aria-modal="true">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <span className="iconify" data-icon="material-symbols-light:add" style={{ fontSize: '1.25rem' }}></span>
                        Insérer une cellule à la position {(insertCellModal.atCellIndex ?? 0) + 1}
                    </h3>
                    <button className="btn btn-sm btn-ghost" onClick={() => set({ insertCellModal: { ...insertCellModal, open: false } })}>
                        <span className="iconify" data-icon="material-symbols-light:close" style={{ fontSize: '1rem' }}></span>
                    </button>
                </div>
                <div className="mt-4">
                    <CellTypeGrid onSelect={type => {
                        insertCellAt(insertCellModal.groupIndex, insertCellModal.atCellIndex, type)
                        set({ insertCellModal: { ...insertCellModal, open: false } })
                    }} />
                </div>
            </div>
        </div>
    )
}

// ─── AddCellToGroupModal ──────────────────────────────────────────────────────
export function AddCellToGroupModal() {
    const { addCellToGroupModal, addCellToGroup } = useNotebookStore(useShallow(s => ({
        addCellToGroupModal: s.addCellToGroupModal,
        addCellToGroup: s.addCellToGroup
    })))
    const set = useNotebookStore.setState

    if (!addCellToGroupModal.open) return null
    return (
        <div className="modal modal-open z-[2100]" onClick={e => { if (e.target === e.currentTarget) set({ addCellToGroupModal: { ...addCellToGroupModal, open: false } }) }} role="presentation">
            <div className="modal-box" role="dialog" aria-modal="true">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <span className="iconify" data-icon="material-symbols-light:add" style={{ fontSize: '1.25rem' }}></span>
                        Ajouter une cellule au groupe
                    </h3>
                    <button className="btn btn-sm btn-ghost" onClick={() => set({ addCellToGroupModal: { ...addCellToGroupModal, open: false } })}>
                        <span className="iconify" data-icon="material-symbols-light:close" style={{ fontSize: '1rem' }}></span>
                    </button>
                </div>
                <div className="mt-4">
                    <CellTypeGrid onSelect={type => {
                        addCellToGroup(addCellToGroupModal.path ?? addCellToGroupModal.groupIndex, type)
                        set({ addCellToGroupModal: { ...addCellToGroupModal, open: false } })
                    }} />
                </div>
            </div>
        </div>
    )
}
