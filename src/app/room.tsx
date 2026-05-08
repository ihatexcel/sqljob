/**
 * Room — Composant racine utilisant RoomShell de @sqlrooms/room-shell.
 *
 * - RoomShell.Sidebar : sidebar (boutons panels auto-inclus) + boutons custom
 * - RoomShell.LayoutComposer : mosaic layout (NotebookPanel + DataSourcesPanel)
 * - RoomShell.LoadingProgress : barre de progression DuckDB
 * - RoomShell.CommandPalette : palette de commandes (Ctrl+K)
 * - Modals globaux (portals → document.body, indépendants du layout)
 */
import { RoomShell } from '@sqlrooms/room-shell'
import { useDisclosure, ThemeSwitch } from '@sqlrooms/ui'
import { useShallow } from 'zustand/react/shallow'
import { roomStore, useNotebookStore } from './store/notebookStore'
import { SqlEditorModal } from '@sqlrooms/sql-editor'
import { BookHeartIcon, MessageSquareCodeIcon, PaintbrushIcon, Settings2Icon, TerminalIcon } from 'lucide-react'
import { ThemeCustomModal } from './components/modals/ThemeCustomModal'
import { ErudaModal } from './components/modals/ErudaModal'
import { ConfirmModal } from './components/modals/ConfirmModal'
import { TemplateModal } from './components/modals/TemplateModal'
import { AddGroupModal, InsertGroupModal, InsertCellModal, AddCellToGroupModal } from './components/modals/SimpleModals'
import { DbEngineModal } from './components/modals/DbEngineModal'
import { ExportModal, GistTokenModal, GistResultModal, JsonPassphraseModal } from './components/modals/ExportModals'
import { CellConfigModal } from './components/modals/CellConfigModal'
import { LoopConfigModal, GroupSettingsModal, ChildGroupModal } from './components/modals/GroupModals'

function DbEngineIcon({ className }: { className?: string }) {
    const dbEngine = useNotebookStore(s => s.dbEngine)
    return <span className={className} style={{ fontSize: '1.1em', lineHeight: 1 }}>{dbEngine === 'ducklings' ? '🐤' : '🦆'}</span>
}

function SidebarControls() {
    const { devMode, dbEngine, showLayout } = useNotebookStore(useShallow(s => ({
        devMode: s.devMode,
        dbEngine: s.dbEngine,
        showLayout: s.showLayout,
    })))
    const set = useNotebookStore.setState
    const sqlEditorDisclosure = useDisclosure()
    const themeModalDisclosure = useDisclosure()
    const erudaDisclosure = useDisclosure()

    if (!showLayout) return null

    return (
        <>
            {devMode && (
                <>
                    {/* SQL Editor */}
                    <RoomShell.SidebarButton
                        title="SQL Editor"
                        onClick={sqlEditorDisclosure.onToggle}
                        isSelected={sqlEditorDisclosure.isOpen}
                        icon={TerminalIcon}
                    />

                    {/* Personnalisation CSS du thème */}
                    <RoomShell.SidebarButton
                        title="Personnaliser le thème"
                        onClick={themeModalDisclosure.onToggle}
                        isSelected={themeModalDisclosure.isOpen}
                        icon={PaintbrushIcon}
                    />
                    <ThemeCustomModal open={themeModalDisclosure.isOpen} onClose={themeModalDisclosure.onClose} />

                    {/* DB Engine */}
                    <RoomShell.SidebarButton
                        title={`Moteur : ${dbEngine === 'ducklings' ? 'Ducklings 🐤' : 'DuckDB WASM 🦆'}`}
                        onClick={() => set({ showDbEngineModal: true })}
                        isSelected={false}
                        icon={DbEngineIcon}
                    />

                    {/* Console debug Eruda */}
                    <RoomShell.SidebarButton
                        title="Console debug (Eruda)"
                        onClick={erudaDisclosure.onToggle}
                        isSelected={erudaDisclosure.isOpen}
                        icon={MessageSquareCodeIcon}
                    />
                    <ErudaModal open={erudaDisclosure.isOpen} onClose={erudaDisclosure.onClose} />
                </>
            )}

            {/* Ancrés en bas via spacer */}
            <div className="flex-1" />

            {/* Documentation (gist) */}
            <RoomShell.SidebarButton
                title="Documentation"
                onClick={() => window.open('https://ihatexcel.github.io/sqljob/?gist=68cd597ba5da05ceba24fb975c05384f', '_blank')}
                isSelected={false}
                icon={BookHeartIcon}
            />



            {/* DevMode toggle */}
            <RoomShell.SidebarButton
                title={devMode ? 'Passer en mode client' : 'Passer en mode développeur'}
                onClick={() => set({ devMode: !devMode })}
                isSelected={devMode}
                icon={Settings2Icon}
            />

            {/* Bascule thème clair/sombre via ThemeSwitch sqlrooms */}
            <ThemeSwitch />

            <SqlEditorModal
                isOpen={sqlEditorDisclosure.isOpen}
                onClose={sqlEditorDisclosure.onClose}
            />
        </>
    )
}

export function Room() {
    const showLayout = useNotebookStore(s => s.showLayout)

    return (
        <>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <RoomShell roomStore={roomStore as any} className="h-screen w-screen">
                <RoomShell.Sidebar className={showLayout ? '' : 'hidden'}>
                    <SidebarControls />
                </RoomShell.Sidebar>
                <RoomShell.LayoutComposer tileClassName="p-0" />
                <RoomShell.LoadingProgress />
                <RoomShell.CommandPalette />
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
