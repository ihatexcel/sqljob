import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from '../store/notebookStore'

export function useEditors() {
    return useNotebookStore(useShallow((s: any) => ({
        renderUiParameterEditor: s.renderUiParameterEditor,
        renderGroupIfQueryEditor: s.renderGroupIfQueryEditor,
        renderGroupIfQueryEditorInit: s.renderGroupIfQueryEditorInit,
        renderSqlQueryEditor: s.renderSqlQueryEditor,
        safeRenderSqlEditor: s.safeRenderSqlEditor,
        safeRenderUiParameterEditor: s.safeRenderUiParameterEditor,
        renderMarkdownQueryEditor: s.renderMarkdownQueryEditor,
        initCodeMirrorForCell: s.initCodeMirrorForCell,
        safeRenderMarkdownQueryEditor: s.safeRenderMarkdownQueryEditor,
        renderIframeEditor: s.renderIframeEditor,
        safeRenderIframeEditor: s.safeRenderIframeEditor,
        insertTemplate: s.insertTemplate,
        // state
        devMode: s.devMode,
    })))
}
