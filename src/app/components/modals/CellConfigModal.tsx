// @ts-nocheck
import { useEffect, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from '../../store/notebookStore'
import { ConfigManager } from '../../../lib/ConfigManager'
import { CellConfigService } from '../../../lib/CellConfigService'
import { CELL_TYPE_SCHEMAS } from '../../../lib/cellTypeSchemas'

function getCommonParamDef(paramKey: string, cellType: string) {
    const schema = CELL_TYPE_SCHEMAS?.types?.[cellType]
    return schema?.commonParams?.find((p: any) => p.key === paramKey) || null
}

function getCommonParamsExcludingName(cellType: string): string[] {
    const schema = CELL_TYPE_SCHEMAS?.types?.[cellType]
    if (!schema?.commonParams) return []
    return (schema.commonParams as string[]).filter((k: string) => k !== 'name')
}

function getSpecificParamsForType(cellType: string) {
    const schema = CELL_TYPE_SCHEMAS?.types?.[cellType]
    return schema?.specificParams || []
}

export function CellConfigModal() {
    const {
        cellConfigModal, closeCellConfig, getCellAtPath,
        onCellTypeChange, validateCellName, syncMarkdownToEditor,
        getCellValueByPath, setCellValueByPath, isLoading, forceUpdate
    } = useNotebookStore(useShallow(s => ({
        cellConfigModal: s.cellConfigModal,
        closeCellConfig: s.closeCellConfig,
        getCellAtPath: s.getCellAtPath,
        onCellTypeChange: s.onCellTypeChange,
        validateCellName: s.validateCellName,
        syncMarkdownToEditor: s.syncMarkdownToEditor,
        getCellValueByPath: s.getCellValueByPath,
        setCellValueByPath: s.setCellValueByPath,
        isLoading: s.isLoading,
        forceUpdate: s.forceUpdate
    })))

    if (!cellConfigModal.open) return null

    const cell = getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex)
    if (!cell) return null

    const specificParams = getSpecificParamsForType(cell.type)
    const commonParamKeys = ['name', ...getCommonParamsExcludingName(cell.type)]

    function isParamVisible(param: any) {
        if (!param.visibleWhen) return true
        const key = param.visibleWhen.key
        const val = getCellValueByPath(cell, key)
        return val === param.visibleWhen.value
    }

    return (
        <div className="modal modal-open z-[2100]" onClick={e => { if (e.target === e.currentTarget) closeCellConfig() }} role="presentation">
            <div className="modal-box" role="dialog" aria-modal="true">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeCellConfig}>
                    <span className="iconify" data-icon="material-symbols-light:close" style={{ fontSize: '1rem' }}></span>
                </button>
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <span className="iconify" data-icon="material-symbols-light:settings" style={{ fontSize: '1.25rem' }}></span>
                    Configuration de la cellule
                </h3>

                <div className="mt-4 space-y-4">
                    {/* Type de cellule */}
                    <div className="flex flex-col gap-2">
                        <label className="label"><span className="label-text">Type de cellule</span></label>
                        <select
                            className="select select-bordered select-sm w-full"
                            value={cell.type}
                            onChange={e => {
                                const oldType = cell.type
                                cell.type = e.target.value
                                onCellTypeChange(cellConfigModal.path, cellConfigModal.cellIndex, oldType)
                                forceUpdate()
                            }}
                        >
                            <option value="markdown">Markdown</option>
                            <option value="source">Source</option>
                            <option value="uiParameter">Paramètre UI</option>
                            <option value="buttonRunNextCells">Bouton Exécuter</option>
                            <option value="sqlRecursiveParse">SQL</option>
                            <option value="table">Tableau</option>
                            <option value="iframe">HTML/Iframe</option>
                            <option value="sqlStat">Stat SQL (daisyui)</option>
                            <option value="publipostageWord">Publipostage Word</option>
                            <option value="pdfme">PDF (pdfme)</option>
                            <option value="echart">EChart (Apache ECharts)</option>
                            <option value="perspective">Perspective Viewer</option>
                        </select>
                    </div>

                    {/* Paramètres communs */}
                    {commonParamKeys.map(paramKey => (
                        <div className="form-control" key={paramKey}>
                            {paramKey === 'name' ? (
                                <div>
                                    <label className="label gap-2">
                                        <span className="label-text">Nom</span>
                                        <span className="tooltip tooltip-bottom" data-tip="Identifiant unique. Pour source = nom de la table SQL.">
                                            <span className="badge badge-sm cursor-help">?</span>
                                        </span>
                                    </label>
                                    <input type="text" className="input input-bordered input-sm w-full"
                                        value={cell.name || ''}
                                        onChange={e => { cell.name = e.target.value; forceUpdate() }}
                                        onBlur={() => validateCellName(cellConfigModal.path, cellConfigModal.cellIndex)}
                                        placeholder="Identifiant unique de la cellule" />
                                </div>
                            ) : ['title', 'subtitle', 'icon', 'buttonLabel'].includes(paramKey) ? (
                                <div>
                                    <label className="label gap-2">
                                        <span className="label-text">{getCommonParamDef(paramKey, cell.type)?.label || paramKey}</span>
                                    </label>
                                    <input type="text" className="input input-bordered input-sm w-full"
                                        value={getCellValueByPath(cell, paramKey) || ''}
                                        onChange={e => { setCellValueByPath(cell, paramKey, e.target.value); forceUpdate() }}
                                        placeholder={getCommonParamDef(paramKey, cell.type)?.placeholder || ''} />
                                </div>
                            ) : null}
                        </div>
                    ))}

                    {/* Format cellule */}
                    <div className="collapse collapse-arrow border border-base-300 bg-base-100">
                        <input type="checkbox" />
                        <div className="collapse-title min-h-0 py-3 font-medium">Format de la cellule</div>
                        <div className="collapse-content">
                            <label className="label cursor-pointer justify-start gap-3 py-1">
                                <input type="checkbox" className="checkbox checkbox-sm"
                                    checked={cell.border !== false}
                                    onChange={e => { cell.border = e.target.checked; forceUpdate() }} />
                                <span className="label-text">Afficher bordure et ombre</span>
                            </label>
                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <div className="col-span-2 font-medium text-sm">Largeur</div>
                                {['minSizePx', 'minSizePercent', 'maxSizePx', 'maxSizePercent'].map(k => (
                                    <div key={k}>
                                        <span className="label-text-alt">{k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
                                        <input type="text" className="input input-bordered input-sm w-full"
                                            value={cell[k] || ''}
                                            onChange={e => { cell[k] = e.target.value; forceUpdate() }} />
                                    </div>
                                ))}
                                <div className="col-span-2 font-medium text-sm mt-1">Hauteur</div>
                                {['minHeightPx', 'minHeightPercent', 'maxHeightPx', 'maxHeightPercent'].map(k => (
                                    <div key={k}>
                                        <span className="label-text-alt">{k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
                                        <input type="text" className="input input-bordered input-sm w-full"
                                            value={cell[k] || ''}
                                            onChange={e => { cell[k] = e.target.value; forceUpdate() }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Paramètres spécifiques */}
                    {specificParams.filter(isParamVisible).map((param: any) => (
                        <div className="form-control" key={param.key}>
                            {param.inputType === 'checkbox' ? (
                                <label className="label cursor-pointer justify-start gap-3">
                                    <input type="checkbox" className="checkbox checkbox-sm"
                                        checked={!!getCellValueByPath(cell, param.key)}
                                        onChange={e => { setCellValueByPath(cell, param.key, e.target.checked); forceUpdate() }} />
                                    <span className="label-text">{param.label}</span>
                                </label>
                            ) : param.inputType === 'select' ? (
                                <div>
                                    <label className="label gap-2"><span className="label-text">{param.label}</span></label>
                                    <select className="select select-bordered select-sm w-full"
                                        value={getCellValueByPath(cell, param.key) || ''}
                                        onChange={e => { setCellValueByPath(cell, param.key, e.target.value); forceUpdate() }}>
                                        {(param.options || []).map((opt: any) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            ) : param.inputType === 'textarea' ? (
                                <div>
                                    <label className="label gap-2"><span className="label-text">{param.label}</span></label>
                                    <textarea
                                        className={`textarea textarea-bordered w-full ${param.key.includes('json') ? 'font-mono text-sm' : ''}`}
                                        rows={param.rows || 5}
                                        placeholder={param.placeholder || ''}
                                        value={getCellValueByPath(cell, param.key) || ''}
                                        onChange={e => {
                                            const val = e.target.value
                                            if (param.key === 'content') {
                                                setCellValueByPath(cell, 'content', val)
                                                syncMarkdownToEditor(cellConfigModal.path, cellConfigModal.cellIndex)
                                            } else {
                                                setCellValueByPath(cell, param.key, val)
                                            }
                                            forceUpdate()
                                        }}
                                    />
                                </div>
                            ) : param.inputType === 'number' ? (
                                <div>
                                    <label className="label gap-2"><span className="label-text">{param.label}</span></label>
                                    <input type="number" className="input input-bordered input-sm w-full"
                                        value={getCellValueByPath(cell, param.key) || 0}
                                        onChange={e => { setCellValueByPath(cell, param.key, parseFloat(e.target.value) || 0); forceUpdate() }}
                                        placeholder={param.placeholder}
                                        min={param.min} step="any" />
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
                <div className="modal-action">
                    <button className="btn" onClick={closeCellConfig}>Fermer</button>
                </div>
            </div>
        </div>
    )
}
