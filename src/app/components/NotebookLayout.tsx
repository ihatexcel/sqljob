// @ts-nocheck
import { useRef, useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from '../store/notebookStore'
import { PageContent } from './PageContent'
import { ConfirmModal } from './modals/ConfirmModal'
import { TemplateModal } from './modals/TemplateModal'
import { AddGroupModal, InsertGroupModal, InsertCellModal, AddCellToGroupModal } from './modals/SimpleModals'
import { DbEngineModal } from './modals/DbEngineModal'
import { ExportModal, GistTokenModal, GistResultModal, JsonPassphraseModal } from './modals/ExportModals'
import { CellConfigModal } from './modals/CellConfigModal'
import { LoopConfigModal, GroupSettingsModal, ChildGroupModal } from './modals/GroupModals'

// ─── TabBar (liste des pages) ─────────────────────────────────────────────────
function TabBar() {
    const {
        pages, activePageIndex, devMode,
        activatePage, addPage, deletePage,
        draggedPageIndex, dragOverPageIndex,
        startPageDrag, onPageDragOver, onPageDragLeave, onPageDrop, endPageDrag
    } = useNotebookStore(useShallow(s => ({
        pages: s.pages,
        activePageIndex: s.activePageIndex,
        devMode: s.devMode,
        activatePage: s.activatePage,
        addPage: s.addPage,
        deletePage: s.deletePage,
        draggedPageIndex: s.draggedPageIndex,
        dragOverPageIndex: s.dragOverPageIndex,
        startPageDrag: s.startPageDrag,
        onPageDragOver: s.onPageDragOver,
        onPageDragLeave: s.onPageDragLeave,
        onPageDrop: s.onPageDrop,
        endPageDrag: s.endPageDrag
    })))

    return (
        <div role="tablist" className="tabs tabs-border flex-nowrap overflow-x-auto">
            {pages.map((page: any, index: number) => (
                <PageTab
                    key={page._id}
                    page={page}
                    index={index}
                    isActive={activePageIndex === index}
                    devMode={devMode}
                    activatePage={activatePage}
                    deletePage={deletePage}
                    startPageDrag={startPageDrag}
                    onPageDragOver={onPageDragOver}
                    onPageDragLeave={onPageDragLeave}
                    onPageDrop={onPageDrop}
                    endPageDrag={endPageDrag}
                    isDragOver={dragOverPageIndex === index}
                />
            ))}
            {devMode && (
                <button role="tab" className="tab tab-sm" onClick={addPage} title="Nouvelle page">
                    <span className="iconify" data-icon="material-symbols-light:add" style={{ fontSize: '1rem' }}></span>
                </button>
            )}
        </div>
    )
}

function PageTab({ page, index, isActive, devMode, activatePage, deletePage, startPageDrag, onPageDragOver, onPageDragLeave, onPageDrop, endPageDrag, isDragOver }: any) {
    const forceUpdate = useNotebookStore(s => s.forceUpdate)
    const set = useNotebookStore.setState

    return (
        <button
            role="tab"
            className={`tab ${isActive ? 'tab-active' : ''} ${isDragOver ? 'opacity-50' : ''}`}
            onClick={() => activatePage(index)}
            draggable={devMode}
            onDragStart={e => startPageDrag(index, e)}
            onDragOver={e => onPageDragOver(index, e)}
            onDragLeave={() => onPageDragLeave?.()}
            onDrop={e => onPageDrop(index, e)}
            onDragEnd={endPageDrag}
        >
            {page.name}
            {devMode && (
                <span
                    className="ml-1 text-error hover:text-error-content"
                    onClick={e => { e.stopPropagation(); deletePage(index) }}
                    title="Supprimer"
                >
                    <span className="iconify" data-icon="material-symbols-light:close" style={{ fontSize: '0.75rem' }}></span>
                </span>
            )}
        </button>
    )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function NavBar() {
    const {
        devMode, isLoading, showLayout,
        openExportModal, runAllGroups, loadConfig
    } = useNotebookStore(useShallow(s => ({
        devMode: s.devMode,
        isLoading: s.isLoading,
        showLayout: s.showLayout,
        openExportModal: s.openExportModal,
        runAllGroups: s.runAllGroups,
        loadConfig: s.loadConfig
    })))
    const importJsonRef = useRef<HTMLInputElement>(null)

    if (!showLayout) return null

    return (
        <div className="navbar bg-base-100 border-b border-base-300 px-4 py-2 gap-2">
            <div className="navbar-start">
                <a href="https://ihatexcel.github.io/sqljob/?gist=68cd597ba5da05ceba24fb975c05384f" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <img src="https://raw.githubusercontent.com/ihatexcel/sqljob/main/ihatexcel.svg" alt="sqljob" className="h-8" />
                    <span className="font-bold text-primary text-lg">sqlJob</span>
                </a>
            </div>
            <div className="navbar-center">
                <TabBar />
            </div>
            <div className="navbar-end flex gap-2 items-center">
                {devMode && (
                    <>
                        <button className="btn btn-sm btn-ghost" onClick={runAllGroups} disabled={isLoading} title="Tout exécuter">
                            <span className="iconify" data-icon="material-symbols-light:play-arrow" style={{ fontSize: '1.25rem' }}></span>
                        </button>
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-sm btn-ghost">
                                <span className="iconify" data-icon="material-symbols-light:share" style={{ fontSize: '1.25rem' }}></span>
                            </div>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-48 p-2 shadow">
                                <li><button onClick={() => openExportModal('gist')}>
                                    <span className="iconify" data-icon="material-symbols-light:share" style={{ fontSize: '1rem' }}></span> Partager (Gist)
                                </button></li>
                                <li>
                                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 hover:bg-base-200 rounded-lg">
                                        <span className="iconify" data-icon="material-symbols-light:folder-open" style={{ fontSize: '1rem' }}></span> Import JSON
                                        <input ref={importJsonRef} type="file" accept=".json" hidden
                                            onChange={e => { loadConfig(e); (document.activeElement as HTMLElement)?.blur() }} />
                                    </label>
                                </li>
                                <li><button onClick={() => openExportModal('json')}>
                                    <span className="iconify" data-icon="material-symbols-light:data-object" style={{ fontSize: '1rem' }}></span> Export JSON
                                </button></li>
                                <li><button onClick={() => openExportModal('html')}>
                                    <span className="iconify" data-icon="material-symbols-light:save" style={{ fontSize: '1rem' }}></span> Export HTML
                                </button></li>
                                <li><button onClick={() => openExportModal('base64')}>
                                    <span className="iconify" data-icon="material-symbols-light:lock" style={{ fontSize: '1rem' }}></span> Export Base64
                                </button></li>
                            </ul>
                        </div>
                    </>
                )}
                {isLoading && (
                    <span className="loading loading-spinner loading-sm"></span>
                )}
            </div>
        </div>
    )
}

// ─── Status bar ───────────────────────────────────────────────────────────────
function StatusBar() {
    const { status, statusType } = useNotebookStore(useShallow(s => ({ status: s.status, statusType: s.statusType })))
    if (!status) return null
    return (
        <div className="toast toast-end toast-bottom z-[1500]">
            <div className={`alert ${statusType === 'loading' ? 'alert-info' : statusType === 'success' ? 'alert-success' : 'alert-error'}`}>
                {statusType === 'loading' && <span className="loading loading-spinner loading-md"></span>}
                <span>{status}</span>
            </div>
        </div>
    )
}

// ─── Floating controls (bottom left) ─────────────────────────────────────────
function FloatingControls() {
    const { devMode, showLayout, availableThemes, currentTheme, dbEngine, setTheme } = useNotebookStore(useShallow(s => ({
        devMode: s.devMode,
        showLayout: s.showLayout,
        availableThemes: s.availableThemes,
        currentTheme: s.currentTheme,
        dbEngine: s.dbEngine,
        setTheme: s.setTheme
    })))
    const set = useNotebookStore.setState

    if (!showLayout) return null

    return (
        <div className="fixed bottom-4 left-4 z-[1500] flex gap-1">
            <button
                className={`btn btn-sm ${devMode ? 'btn-soft' : 'btn-ghost'}`}
                title={devMode ? 'Mode client' : 'Mode développeur'}
                onClick={() => set({ devMode: !devMode })}
            >
                <span className="iconify" data-icon={devMode ? 'material-symbols-light:visibility' : 'material-symbols-light:settings'} style={{ fontSize: '1.25rem' }}></span>
            </button>

            {devMode && (
                <>
                    <div className="dropdown dropdown-top">
                        <div tabIndex={0} className="btn btn-sm btn-ghost">
                            <span className="iconify" data-icon="material-symbols-light:palette" style={{ fontSize: '1.25rem' }}></span>
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 shadow max-h-60 overflow-y-auto">
                            {availableThemes.map((themeName: string) => (
                                <li key={themeName}>
                                    <button
                                        onClick={() => setTheme(themeName)}
                                        className={currentTheme === themeName ? 'active' : ''}
                                    >{themeName}</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => set({ showDbEngineModal: true })}
                        title={`Moteur: ${dbEngine === 'ducklings' ? 'Ducklings' : 'DuckDB WASM'}`}
                    >
                        <span>{dbEngine === 'ducklings' ? '🐤' : '🦆'}</span>
                    </button>
                </>
            )}
        </div>
    )
}

// ─── Layout principal ─────────────────────────────────────────────────────────
export function NotebookLayout() {
    const { showLayout, setShowLayout } = useNotebookStore(useShallow(s => ({ showLayout: s.showLayout, setShowLayout: s.setShowLayout })))

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === ',') {
                e.preventDefault()
                setShowLayout(!showLayout)
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [showLayout, setShowLayout])

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />

            <main className="flex-1 overflow-auto">
                <PageContent />
            </main>

            {showLayout && (
                <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
                    <aside>
                        <p>iHateXcel - sqljob - Made with ❤️ by Théo Nobella-Pichonnier</p>
                    </aside>
                </footer>
            )}

            {/* Floating controls */}
            <FloatingControls />

            {/* Status bar */}
            <StatusBar />

            {/* All modals */}
            <ConfirmModal />
            <TemplateModal />
            <AddGroupModal />
            <InsertGroupModal />
            <InsertCellModal />
            <AddCellToGroupModal />
            <CellConfigModal />
            <ChildGroupModal />
            <LoopConfigModal />
            <GroupSettingsModal />
            <DbEngineModal />
            <ExportModal />
            <GistTokenModal />
            <GistResultModal />
            <JsonPassphraseModal />
        </div>
    )
}
