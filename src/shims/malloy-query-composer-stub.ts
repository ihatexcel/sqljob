// @ts-nocheck
/**
 * Stub for @malloydata/query-composer — used in CDN build to avoid bundling
 * heavy dependencies (vega, d3, styled-components ~32k modules → OOM).
 *
 * IS_STUB = true allows MalloyCellEditor to detect CDN mode at module load time
 * and hide the "Mode visuel" button without persisting any flag on the cell.
 */
import { createContext } from 'react'

export const IS_STUB = true

export const ComposerOptionsContext = createContext({ compiler: null })
export const UndoContext = createContext({})

export class StubCompile {
    async parseFilter() { return null }
}

export function useQueryBuilder() {
    return { querySummary: null, queryModifiers: {}, queryWriter: null }
}

export function QueryEditor() { return null }
