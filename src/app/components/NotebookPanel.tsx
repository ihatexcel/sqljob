// @ts-nocheck
/**
 * NotebookPanel — Wrapper principal du panneau notebook.
 * Gère le switch entre :
 *  - NotebookPanelSqljob : notebook custom sqljob (cells DAG, pages, groupes)
 *  - NotebookPanelSqlrooms : notebook natif sqlrooms (@sqlrooms/cells + @sqlrooms/notebook)
 *
 * Le bouton de switch est exposé dans la barre de chaque sous-panneau.
 */
import { useState } from 'react'
import { RoomPanel } from '@sqlrooms/room-shell'
import { NotebookPanelSqljob } from './NotebookPanelSqljob'
import { NotebookPanelSqlrooms } from './NotebookPanelSqlrooms'

type NotebookMode = 'sqljob' | 'sqlrooms'

export const NotebookPanel = () => {
    const [mode, setMode] = useState<NotebookMode>('sqljob')

    const toggle = () => setMode(m => m === 'sqljob' ? 'sqlrooms' : 'sqljob')

    return (
        <RoomPanel type="main" showHeader={false} className="flex flex-col h-full">
            {mode === 'sqljob'
                ? <NotebookPanelSqljob onSwitchPanel={toggle} />
                : <NotebookPanelSqlrooms onSwitchPanel={toggle} />
            }
        </RoomPanel>
    )
}
