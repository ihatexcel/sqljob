// @ts-nocheck
/**
 * Stub for @malloydata/query-composer — used in CDN build to avoid bundling
 * heavy dependencies (vega, d3, styled-components ~32k modules → OOM).
 *
 * When this stub is loaded, `queryWriter` will be null. MalloyVisualEditor
 * detects this and auto-switches to text mode via onSwitchToText().
 */
import { createContext } from 'react'

export const ComposerOptionsContext = createContext({ compiler: null })
export const UndoContext = createContext({})

export class StubCompile {
    async parseFilter() { return null }
}

export function useQueryBuilder() {
    return { querySummary: null, queryModifiers: {}, queryWriter: null }
}

export function QueryEditor() { return null }
