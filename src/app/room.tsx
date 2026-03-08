// @ts-nocheck
/**
 * Room — Composant racine utilisant RoomShell de @sqlrooms/room-shell.
 *
 * - RoomShell.Sidebar : boutons de navigation (SQL Editor, Theme, DB Engine, DevMode)
 * - RoomShell.LayoutComposer : mosaic layout (NotebookPanel + DataSourcesPanel)
 * - Modals globaux (portals → document.body, indépendants du layout)
 */
import { RoomShell, RoomShellSidebarButton } from '@sqlrooms/room-shell'
import { useDisclosure, useTheme } from '@sqlrooms/ui'
import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from './store/notebookStore'
import { SqlEditorModal } from '@sqlrooms/sql-editor'
import { BookHeartIcon, DatabaseIcon, MoonIcon, Settings2Icon, SunIcon, TerminalIcon } from 'lucide-react'
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
    const { theme, setTheme } = useTheme()
    const set = useNotebookStore.setState

    if (!showLayout) return null

    return (
        <>
            {/* Documentation */}
            <RoomShell.SidebarButton
                title="Documentation"
                onClick={() => window.open('https://ihatexcel.github.io/sqljob/?gist=68cd597ba5da05ceba24fb975c05384f', '_blank')}
                icon={BookHeartIcon}
            />

            {/* Theme toggle */}
            <RoomShell.SidebarButton
                title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                icon={theme === 'dark' ? SunIcon : MoonIcon}
            />

            {/* DB Engine (devMode only) */}
            {devMode && (
                <RoomShell.SidebarButton
                    title={`Moteur : ${dbEngine === 'ducklings' ? 'Ducklings 🐤' : 'DuckDB WASM 🦆'}`}
                    onClick={() => set({ showDbEngineModal: true })}
                    icon={DatabaseIcon}
                />
            )}

            {/* DevMode toggle — ancré en bas via spacer */}
            <div className="flex-1" />
            <RoomShell.SidebarButton
                title={devMode ? 'Passer en mode client' : 'Passer en mode développeur'}
                onClick={() => set({ devMode: !devMode })}
                isSelected={devMode}
                icon={Settings2Icon}
            />
        </>
    )
}

export function Room() {
    const sqlEditorDisclosure = useDisclosure()
    const { showLayout } = useNotebookStore(useShallow(s => ({
        showLayout: s.showLayout,
    })))

    return (
        <>
            <RoomShell roomStore={useNotebookStore} className="h-screen w-screen">
                <RoomShell.Sidebar className={showLayout ? '' : 'hidden'}>
                    {/* Sources panel toggle */}
                    <RoomShellSidebarButton roomPanelType="data" />
                    <RoomShell.SidebarButton
                        title="SQL Editor"
                        onClick={sqlEditorDisclosure.onToggle}
                        isSelected={sqlEditorDisclosure.isOpen}
                        icon={TerminalIcon}
                    />
                    <SidebarControls />
                </RoomShell.Sidebar>
                <RoomShell.LayoutComposer tileClassName="p-0" />
                <RoomShell.LoadingProgress />
                <SqlEditorModal
                    isOpen={sqlEditorDisclosure.isOpen}
                    onClose={sqlEditorDisclosure.onClose}
                />
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
