/**
 * SqlDataTable — remplace SimpleDatatables pour les cellules sql/table.
 * Utilise DataTablePaginated de @sqlrooms/data-table avec tri et pagination
 * client-side. Gère les colonnes spéciales PERCENT et TREND.
 */
import { useMemo, useState } from 'react'
import DataTablePaginated from '@sqlrooms/data-table/dist/DataTablePaginated'
import { rawTableDataStore as _rawTableDataStore } from '../../lib/tableDataStore'
import { parseColumnRoles, getTableColumnDisplayNames } from '../../lib/EChartSqlParser'

// Types Arrow numériques tels que retournés par String(field.type) de duckdb-wasm
const NUMERIC_ARROW_RE = /^(Int|Uint|Float|Decimal)/i

function colMeta(schemaTypes: Record<string, string>, key: string) {
    const type = schemaTypes?.[key]
    return { type: type || '', isNumeric: type ? NUMERIC_ARROW_RE.test(type) : false }
}

export function SqlDataTable({ cell, searchable = false }: { cell: any; searchable?: boolean }) {
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
    const [sorting, setSorting] = useState([])
    const [search, setSearch] = useState('')

    const rawResults = _rawTableDataStore.get(cell._id) || cell._results || []
    const schemaTypes: Record<string, string> = cell._schemaTypes || {}

    const { columns, allColKeys } = useMemo(() => {
        if (!rawResults?.length) return { columns: [], allColKeys: [] }
        const parsed = parseColumnRoles(rawResults)
        const displayNames = getTableColumnDisplayNames(parsed)
        const colKeys = Object.keys(rawResults[0])
        const percentCols = new Set((parsed.roleMap['PERCENT'] || []).map((c: any) => c.originalName))
        const trendCols = new Set((parsed.roleMap['TREND'] || []).map((c: any) => c.originalName))

        const columns = colKeys.map(key => {
            const header = displayNames[key] || key

            if (percentCols.has(key)) {
                return {
                    id: key, accessorKey: key, header, meta: colMeta(schemaTypes, key),
                    cell: ({ getValue }: any) => {
                        const n = Math.min(100, Math.max(0, Number(getValue()) || 0))
                        const color = n >= 75 ? '#22c55e' : n >= 40 ? '#f59e0b' : '#ef4444'
                        return (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 80 }}>
                                <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${n}%`, background: color, borderRadius: 3 }} />
                                </div>
                                <span style={{ color, fontWeight: 600, whiteSpace: 'nowrap', minWidth: '3.5em', textAlign: 'right' }}>
                                    {n.toFixed(1)}%
                                </span>
                            </div>
                        )
                    }
                }
            }

            if (trendCols.has(key)) {
                return {
                    id: key, accessorKey: key, header, meta: colMeta(schemaTypes, key),
                    cell: ({ getValue }: any) => {
                        const n = Number(getValue()) || 0
                        const arrow = n === 0 ? '→' : n > 0 ? '↑' : '↓'
                        const color = n === 0 ? '#f59e0b' : n > 0 ? '#22c55e' : '#ef4444'
                        return (
                            <span style={{ color, fontWeight: 600 }}>
                                {arrow} {n > 0 ? '+' : ''}{n}
                            </span>
                        )
                    }
                }
            }

            return {
                id: key, accessorKey: key, header, meta: colMeta(schemaTypes, key),
                cell: ({ getValue }: any) => {
                    const v = getValue()
                    return v == null ? '' : String(v)
                }
            }
        })

        return { columns, allColKeys: colKeys }
    }, [rawResults, schemaTypes])

    const filteredData = useMemo(() => {
        if (!searchable || !search) return rawResults
        const q = search.toLowerCase()
        return rawResults.filter((row: any) =>
            allColKeys.some(k => String(row[k] ?? '').toLowerCase().includes(q))
        )
    }, [rawResults, search, searchable, allColKeys])

    const sortedData = useMemo(() => {
        if (!sorting.length) return filteredData
        const { id, desc } = sorting[0] as any
        return [...filteredData].sort((a: any, b: any) => {
            const av = a[id], bv = b[id]
            if (av == null && bv == null) return 0
            if (av == null) return desc ? -1 : 1
            if (bv == null) return desc ? 1 : -1
            return (av < bv ? -1 : av > bv ? 1 : 0) * (desc ? -1 : 1)
        })
    }, [filteredData, sorting])

    const pageData = useMemo(() => {
        const start = pagination.pageIndex * pagination.pageSize
        return sortedData.slice(start, start + pagination.pageSize)
    }, [sortedData, pagination])

    if (!rawResults?.length) return null

    return (
        <div className="flex flex-col gap-2">
            {searchable && (
                <input
                    type="search"
                    className="border border-input rounded px-2 py-1 text-sm bg-background max-w-xs"
                    placeholder="Rechercher..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPagination(p => ({ ...p, pageIndex: 0 })) }}
                />
            )}
            <DataTablePaginated
                data={pageData}
                columns={columns}
                numRows={sortedData.length}
                pagination={pagination}
                sorting={sorting}
                onPaginationChange={setPagination}
                onSortingChange={setSorting}
                fontSize="text-xs"
            />
        </div>
    )
}
