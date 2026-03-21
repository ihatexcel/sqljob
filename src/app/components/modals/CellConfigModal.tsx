// @ts-nocheck
import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from '../../store/notebookStore'
import { ConfigManager } from '../../../lib/ConfigManager'
import { CellConfigService } from '../../../lib/CellConfigService'
import { CELL_TYPE_SCHEMAS } from '../../../lib/cellTypeSchemas'
import {
    Button, Input, Label, Textarea, Switch,
    Badge,
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
    Accordion, AccordionContent, AccordionItem, AccordionTrigger,
    Checkbox,
} from '@sqlrooms/ui'
import { Icon } from '../../../lib/icons'

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
        getCellValueByPath, setCellValueByPath, isLoading, forceUpdate, _rev
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
        forceUpdate: s.forceUpdate,
        _rev: s._rev
    })))

    const open = cellConfigModal.open
    const cell = open ? getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex) : null

    const specificParams = cell ? getSpecificParamsForType(cell.type) : []
    const commonParamKeys = cell ? ['name', ...getCommonParamsExcludingName(cell.type)] : []

    function isParamVisible(param: any) {
        if (!param.visibleWhen) return true
        const key = param.visibleWhen.key
        const val = getCellValueByPath(cell, key)
        return val === param.visibleWhen.value
    }

    return (
        <Dialog open={open} onOpenChange={open => !open && closeCellConfig()}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Icon name="settings" size={20} />
                        Configuration de la cellule
                    </DialogTitle>
                </DialogHeader>
                {cell && (
                    <div className="space-y-4">
                        {/* Type de cellule */}
                        <div className="space-y-1">
                            <Label>Type de cellule</Label>
                            <Select
                                value={cell.type}
                                onValueChange={v => {
                                    const oldType = cell.type
                                    cell.type = v
                                    onCellTypeChange(cellConfigModal.path, cellConfigModal.cellIndex, oldType)
                                    forceUpdate()
                                }}
                            >
                                <SelectTrigger className="h-8 text-sm w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="markdown">Markdown</SelectItem>
                                    <SelectItem value="source">Source</SelectItem>
                                    <SelectItem value="uiParameter">Paramètre UI</SelectItem>
                                    <SelectItem value="buttonRunNextCells">Bouton Exécuter</SelectItem>
                                    <SelectItem value="sqlBlock">SQL Block</SelectItem>
                                    <SelectItem value="sqlRecursiveParse">SQL</SelectItem>
                                    <SelectItem value="table">Tableau</SelectItem>
                                    <SelectItem value="iframe">HTML/Iframe</SelectItem>
                                    <SelectItem value="sqlStat">Stat SQL</SelectItem>
                                    <SelectItem value="publipostageWord">Publipostage Word</SelectItem>
                                    <SelectItem value="pdfme">PDF (pdfme)</SelectItem>
                                    <SelectItem value="echart">EChart (Apache ECharts)</SelectItem>
                                    <SelectItem value="perspective">Perspective Viewer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Paramètres communs */}
                        {commonParamKeys.map(paramKey => (
                            <div key={paramKey}>
                                {paramKey === 'name' ? (
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Label>Nom</Label>
                                            <Badge variant="outline" className="text-xs cursor-help" title="Identifiant unique. Pour source = nom de la table SQL.">?</Badge>
                                        </div>
                                        <Input className="h-8 text-sm"
                                            value={cell.name || ''}
                                            onChange={e => {
                                                const v = e.target.value
                                                if (cell.type === 'uiParameter' && v.trim().toLowerCase() === 'subquery') return
                                                cell.name = v; forceUpdate()
                                            }}
                                            onBlur={() => validateCellName(cellConfigModal.path, cellConfigModal.cellIndex)}
                                            placeholder="Identifiant unique de la cellule" />
                                        {cell.type === 'uiParameter' && (cell.name || '').trim().toLowerCase() === 'subquery' && (
                                            <p className="text-xs text-destructive">« subquery » est réservé au step SQL personnalisé.</p>
                                        )}
                                    </div>
                                ) : ['title', 'subtitle', 'icon', 'buttonLabel'].includes(paramKey) ? (
                                    <div className="space-y-1">
                                        <Label>{getCommonParamDef(paramKey, cell.type)?.label || paramKey}</Label>
                                        <Input className="h-8 text-sm"
                                            value={getCellValueByPath(cell, paramKey) || ''}
                                            onChange={e => { setCellValueByPath(cell, paramKey, e.target.value); forceUpdate() }}
                                            placeholder={getCommonParamDef(paramKey, cell.type)?.placeholder || ''} />
                                    </div>
                                ) : null}
                            </div>
                        ))}

                        {/* Format cellule */}
                        <Accordion type="single" collapsible className="border border-border rounded-lg">
                            <AccordionItem value="format" className="border-0">
                                <AccordionTrigger className="px-3 py-2 text-sm font-medium">Format de la cellule</AccordionTrigger>
                                <AccordionContent className="px-3 pb-3">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Checkbox
                                            checked={cell.border !== false}
                                            onCheckedChange={v => { cell.border = !!v; forceUpdate() }}
                                        />
                                        <Label className="cursor-pointer">Afficher bordure et ombre</Label>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="col-span-2 font-medium text-sm">Largeur</div>
                                        {['minSizePx', 'minSizePercent', 'maxSizePx', 'maxSizePercent'].map(k => (
                                            <div key={k} className="space-y-1">
                                                <Label className="text-xs">{k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</Label>
                                                <Input className="h-7 text-xs"
                                                    value={cell[k] || ''}
                                                    onChange={e => { cell[k] = e.target.value; forceUpdate() }} />
                                            </div>
                                        ))}
                                        <div className="col-span-2 font-medium text-sm mt-1">Hauteur</div>
                                        {['minHeightPx', 'minHeightPercent', 'maxHeightPx', 'maxHeightPercent'].map(k => (
                                            <div key={k} className="space-y-1">
                                                <Label className="text-xs">{k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</Label>
                                                <Input className="h-7 text-xs"
                                                    value={cell[k] || ''}
                                                    onChange={e => { cell[k] = e.target.value; forceUpdate() }} />
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        {/* Paramètres spécifiques */}
                        {specificParams.filter(isParamVisible).map((param: any) => (
                            <div key={param.key}>
                                {param.inputType === 'checkbox' ? (
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            checked={!!getCellValueByPath(cell, param.key)}
                                            onCheckedChange={v => { setCellValueByPath(cell, param.key, !!v); forceUpdate() }}
                                        />
                                        <Label className="cursor-pointer">{param.label}</Label>
                                    </div>
                                ) : param.inputType === 'select' ? (
                                    <div className="space-y-1">
                                        <Label>{param.label}</Label>
                                        <Select
                                            value={getCellValueByPath(cell, param.key) || ''}
                                            onValueChange={v => { setCellValueByPath(cell, param.key, v); forceUpdate() }}
                                        >
                                            <SelectTrigger className="h-8 text-sm w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(param.options || []).map((opt: any) => (
                                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ) : param.inputType === 'textarea' ? (
                                    <div className="space-y-1">
                                        <Label>{param.label}</Label>
                                        <Textarea
                                            className={`${param.key.includes('json') ? 'font-mono text-sm' : ''}`}
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
                                    <div className="space-y-1">
                                        <Label>{param.label}</Label>
                                        <Input type="number" className="h-8 text-sm"
                                            value={getCellValueByPath(cell, param.key) || 0}
                                            onChange={e => { setCellValueByPath(cell, param.key, parseFloat(e.target.value) || 0); forceUpdate() }}
                                            placeholder={param.placeholder}
                                            min={param.min} step="any" />
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                )}
                <DialogFooter>
                    <Button variant="ghost" onClick={closeCellConfig}>Fermer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
