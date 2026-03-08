import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from '../store/notebookStore'

export function useExecution() {
    return useNotebookStore(useShallow((s: any) => ({
        runAllGroups: s.runAllGroups,
        runGroupAtPath: s.runGroupAtPath,
        runGroup: s.runGroup,
        runGroupOnce: s.runGroupOnce,
        runGroupWithLoop: s.runGroupWithLoop,
        runCellAt: s.runCellAt,
        runCellsAfter: s.runCellsAfter,
        runCellsAfterWithStopConditions: s.runCellsAfterWithStopConditions,
        runGroupWithStopConditions: s.runGroupWithStopConditions,
        runGroupsFromIndex: s.runGroupsFromIndex,
        runGroupsFromIndexWithStopConditions: s.runGroupsFromIndexWithStopConditions,
        isCellSkippedInAutoFlow: s.isCellSkippedInAutoFlow,
        parseQueryRecursively: s.parseQueryRecursively,
        parseLoopQuery: s.parseLoopQuery,
        generateAndDownloadZip: s.generateAndDownloadZip,
        downloadOrZipFile: s.downloadOrZipFile,
        addFileToZip: s.addFileToZip,
        showSqlEditorVisible: s.showSqlEditorVisible,
        isSqlResultTabular: s.isSqlResultTabular,
        isSqlResultText: s.isSqlResultText,
        getSqlResultAsText: s.getSqlResultAsText,
        renderIframeInContainer: s.renderIframeInContainer,
        renderPerspectiveInContainer: s.renderPerspectiveInContainer,
        renderEchartInContainer: s.renderEchartInContainer,
        // state
        isLoading: s.isLoading,
        _zipMode: s._zipMode,
    })))
}
