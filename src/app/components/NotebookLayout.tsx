// @ts-nocheck
import { useRef, useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from '../store/notebookStore'
import {
    Button,
    Input,
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
    Separator,
    Alert, AlertDescription,
    ThemeSwitch,
    Spinner,
} from '@sqlrooms/ui'
import { Icon } from '../../lib/icons'
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
        <div className="flex flex-nowrap overflow-x-auto gap-1">
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
                <Button variant="ghost" size="sm" onClick={addPage} title="Nouvelle page" className="h-8 px-2">
                    <Icon name="add" size={16} />
                </Button>
            )}
        </div>
    )
}

function PageTab({ page, index, isActive, devMode, activatePage, deletePage, startPageDrag, onPageDragOver, onPageDragLeave, onPageDrop, endPageDrag, isDragOver }: any) {
    const [editing, setEditing] = useState(false)
    const [editName, setEditName] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const set = useNotebookStore.setState

    function startEditing(e: any) {
        if (!devMode) return
        e.stopPropagation()
        setEditName(page.name)
        setEditing(true)
    }

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [editing])

    function commitEdit() {
        const newName = editName.trim() || page.name
        set(s => {
            const pages = [...s.pages]
            pages[index] = { ...pages[index], name: newName }
            return { pages }
        })
        setEditing(false)
    }

    function handleKeyDown(e: any) {
        if (e.key === 'Enter') commitEdit()
        else if (e.key === 'Escape') setEditing(false)
    }

    if (editing) {
        return (
            <span className={`inline-flex items-center border-b-2 px-2 ${isActive ? 'border-primary' : 'border-transparent'}`}>
                <Input
                    ref={inputRef}
                    className="h-6 text-xs w-24"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={handleKeyDown}
                    onClick={e => e.stopPropagation()}
                />
            </span>
        )
    }

    return (
        <button
            className={`inline-flex items-center gap-1 px-3 py-1 text-sm border-b-2 transition-colors whitespace-nowrap
                ${isActive ? 'border-primary font-medium text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}
                ${isDragOver ? 'opacity-50' : ''}`}
            onClick={() => activatePage(index)}
            onDoubleClick={startEditing}
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
                    className="ml-1 text-destructive hover:text-destructive/80"
                    onClick={e => { e.stopPropagation(); deletePage(index) }}
                    title="Supprimer"
                >
                    <Icon name="close" size={12} />
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
        <div className="flex items-center border-b border-border bg-background px-4 py-2 gap-2">
            <div className="flex-none">
                <a href="https://ihatexcel.github.io/sqljob/?gist=68cd597ba5da05ceba24fb975c05384f" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <img src="https://raw.githubusercontent.com/ihatexcel/sqljob/main/ihatexcel.svg" alt="sqljob" className="h-8" />
                    <span className="font-bold text-primary text-lg">sqlJob</span>
                </a>
            </div>
            <div className="flex-1 flex justify-center overflow-hidden">
                <TabBar />
            </div>
            <div className="flex-none flex gap-2 items-center">
                {devMode && (
                    <>
                        <Button variant="ghost" size="sm" onClick={runAllGroups} disabled={isLoading} title="Tout exécuter">
                            <Icon name="play-arrow" size={20} />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <Icon name="share" size={20} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => openExportModal('gist')}>
                                    <Icon name="share" size={16} className="mr-2" /> Partager (Gist)
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openExportModal('json')}>
                                    <Icon name="data-object" size={16} className="mr-2" /> Export JSON
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openExportModal('html')}>
                                    <Icon name="save" size={16} className="mr-2" /> Export HTML
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openExportModal('base64')}>
                                    <Icon name="lock" size={16} className="mr-2" /> Export Base64
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <label className="cursor-pointer flex items-center gap-2 w-full">
                                        <Icon name="folder-open" size={16} /> Import JSON
                                        <input ref={importJsonRef} type="file" accept=".json" hidden
                                            onChange={e => { loadConfig(e); (document.activeElement as HTMLElement)?.blur() }} />
                                    </label>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                )}
                {isLoading && (
                    <Spinner className="h-4 w-4" />
                )}
            </div>
        </div>
    )
}

// ─── Status bar ───────────────────────────────────────────────────────────────
function StatusBar() {
    const { status, statusType } = useNotebookStore(useShallow(s => ({ status: s.status, statusType: s.statusType })))
    if (!status) return null

    const alertClass =
        statusType === 'loading' ? 'border-blue-300 bg-blue-50 dark:bg-blue-950 dark:border-blue-700' :
        statusType === 'success' ? 'border-green-300 bg-green-50 dark:bg-green-950 dark:border-green-700' :
        'border-destructive bg-destructive/10'

    return (
        <div className="fixed bottom-4 right-4 z-[1500]">
            <Alert className={`flex items-center gap-2 ${alertClass}`}>
                {statusType === 'loading' && <Spinner className="h-4 w-4 shrink-0" />}
                <AlertDescription>{status}</AlertDescription>
            </Alert>
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
            <Button
                variant={devMode ? 'secondary' : 'ghost'}
                size="sm"
                title={devMode ? 'Mode client' : 'Mode développeur'}
                onClick={() => set({ devMode: !devMode })}
            >
                <Icon name={devMode ? 'visibility' : 'settings'} size={20} />
            </Button>

            {devMode && (
                <>
                    <ThemeSwitch />

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => set({ showDbEngineModal: true })}
                        title={`Moteur: ${dbEngine === 'ducklings' ? 'Ducklings' : 'DuckDB WASM'}`}
                    >
                        <span>{dbEngine === 'ducklings' ? '🐤' : '🦆'}</span>
                    </Button>
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
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <NavBar />

            <main className="flex-1 overflow-auto">
                <PageContent />
            </main>

            {showLayout && (
                <footer className="flex justify-center items-center bg-muted text-muted-foreground p-4 text-sm border-t border-border">
                    <p>iHateXcel - sqljob - Made with ❤️ by Théo Nobella-Pichonnier</p>
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
