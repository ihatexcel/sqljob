import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from '../store/notebookStore'

export function useFiles() {
    return useNotebookStore(useShallow((s: any) => ({
        loadEmbeddedFiles: s.loadEmbeddedFiles,
        handleSingleSourceDrop: s.handleSingleSourceDrop,
        handleSingleSourceFileSelect: s.handleSingleSourceFileSelect,
        loadSingleSourceFile: s.loadSingleSourceFile,
        executeSourceCell: s.executeSourceCell,
        removeSingleSourceFile: s.removeSingleSourceFile,
        handleDocxTemplateDrop: s.handleDocxTemplateDrop,
        handleDocxTemplateFileSelect: s.handleDocxTemplateFileSelect,
        loadDocxTemplate: s.loadDocxTemplate,
        downloadDocxTemplate: s.downloadDocxTemplate,
        removeDocxTemplate: s.removeDocxTemplate,
        loadPendingSourceFiles: s.loadPendingSourceFiles,
        // state
        _roomFiles: s._roomFiles,
    })))
}
