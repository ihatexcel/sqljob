// @ts-nocheck
/**
 * Room — Composant racine utilisant RoomShell de @sqlrooms/room-shell.
 * Structure identique au notebook example de sqlrooms.
 *
 * - RoomShell.Sidebar : boutons de navigation (ThemeSwitch, DevMode, DB Engine)
 * - RoomShell.LayoutComposer : mosaic layout (NotebookPanel + DataSourcesPanel)
 * - Modals globaux (portals → document.body, indépendants du layout)
 */
import { RoomShell } from '@sqlrooms/room-shell'
import { ThemeSwitch, Button } from '@sqlrooms/ui'
import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from './store/notebookStore'
import { ConfirmModal } from './components/modals/ConfirmModal'
import { TemplateModal } from './components/modals/TemplateModal'
import { AddGroupModal, InsertGroupModal, InsertCellModal, AddCellToGroupModal } from './components/modals/SimpleModals'
import { DbEngineModal } from './components/modals/DbEngineModal'
import { ExportModal, GistTokenModal, GistResultModal, JsonPassphraseModal } from './components/modals/ExportModals'
import { CellConfigModal } from './components/modals/CellConfigModal'
import { LoopConfigModal, GroupSettingsModal, ChildGroupModal } from './components/modals/GroupModals'

function SidebarControls() {
    const { devMode, dbEngine, showLayout } = useNotebookStore(useShallow(s => ({
        devMode: s.devMode,
        dbEngine: s.dbEngine,
        showLayout: s.showLayout,
    })))
    const set = useNotebookStore.setState

    if (!showLayout) return null

    return (
        <div className="flex flex-col gap-1 p-1">
            <Button
                variant={devMode ? 'secondary' : 'ghost'}
                size="sm"
                title={devMode ? 'Passer en mode client' : 'Passer en mode développeur'}
                onClick={() => set({ devMode: !devMode })}
                className="w-full justify-start"
            >
                <span
                    className="iconify"
                    data-icon={devMode ? 'material-symbols-light:visibility' : 'material-symbols-light:settings'}
                    style={{ fontSize: '1.25rem' }}
                ></span>
            </Button>

            <ThemeSwitch />

            {devMode && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => set({ showDbEngineModal: true })}
                    title={`Moteur: ${dbEngine === 'ducklings' ? 'Ducklings' : 'DuckDB WASM'}`}
                    className="w-full justify-start"
                >
                    <span>{dbEngine === 'ducklings' ? '🐤' : '🦆'}</span>
                </Button>
            )}
        </div>
    )
}

export function Room() {
    return (
        <>
            <RoomShell roomStore={useNotebookStore} className="h-screen w-screen">
                <RoomShell.Sidebar>
                    <SidebarControls />
                </RoomShell.Sidebar>
                <RoomShell.LayoutComposer tileClassName="p-0" />
                <RoomShell.LoadingProgress />
            </RoomShell>

            {/* Modals globaux — portals vers document.body, indépendants du layout */}
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
        </>
    )
}
