import { useConfirmModal } from '../../store/uiStores'

export function ConfirmModal() {
    const { isOpen, message, confirm, cancel } = useConfirmModal()
    if (!isOpen) return null
    return (
        <div className="modal modal-open z-[9999]" role="presentation">
            <div className="modal-box max-w-sm" role="dialog" aria-modal="true">
                <h3 className="text-lg font-semibold mb-4">Confirmation</h3>
                <p className="text-base-content/80">{message}</p>
                <div className="modal-action">
                    <button onClick={cancel} className="btn btn-ghost">Annuler</button>
                    <button onClick={confirm} className="btn btn-error">Supprimer</button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={cancel}></div>
        </div>
    )
}
