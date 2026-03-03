import { useTemplateModal } from '../../store/uiStores'

export function TemplateModal() {
    const {
        isOpen, filteredTemplates, searchQuery, getModalTitle,
        filterTemplates, selectTemplate, close
    } = useTemplateModal()

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
            onClick={e => { if (e.target === e.currentTarget) close() }}
        >
            <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col m-4">
                <div className="flex items-center justify-between p-4 border-b border-base-300">
                    <h3 className="text-lg font-semibold">{getModalTitle()}</h3>
                    <button onClick={close} className="btn btn-ghost btn-sm btn-circle">
                        <span className="iconify" data-icon="material-symbols-light:close" style={{ fontSize: '1rem' }}></span>
                    </button>
                </div>
                <div className="p-4 border-b border-base-300">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => {
                            useTemplateModal.setState({ searchQuery: e.target.value })
                            filterTemplates()
                        }}
                        placeholder="🔍 Rechercher un template..."
                        className="input input-bordered w-full"
                    />
                    {filteredTemplates.length === 0 && searchQuery && (
                        <div className="text-sm text-base-content/60 mt-2">Aucun template trouvé</div>
                    )}
                </div>
                <div className="p-4 overflow-y-auto flex-1">
                    <div className="space-y-3">
                        {filteredTemplates.map((template, idx) => (
                            <div
                                key={idx}
                                className="card bg-base-200 hover:bg-base-300 cursor-pointer transition-colors border border-base-300"
                                onClick={() => selectTemplate(template.originalIndex)}
                            >
                                <div className="card-body p-4">
                                    <h4 className="card-title text-base">{template.name}</h4>
                                    <p className="text-sm text-base-content/70">{template.description}</p>
                                    <div className="mt-2">
                                        <pre className="bg-base-100 p-3 rounded text-xs overflow-x-auto">
                                            <code>{template.code}</code>
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end gap-2 p-4 border-t border-base-300">
                    <button onClick={close} className="btn btn-ghost">Annuler</button>
                </div>
            </div>
        </div>
    )
}
