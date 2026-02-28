// @ts-nocheck
// EChartSqlParser - Converts SQL query results (with column alias roles)
// into Apache ECharts option objects.
//
// Paradigme taleshape : les alias de colonnes SQL définissent le rôle visuel.
// Ex: SELECT date AS XAXIS, COUNT(*) AS BARCHART → bar chart automatique.
//
// Détection par alias exact  : BARCHART, XAXIS, CATEGORY, ...
// Détection par suffixe      : Revenue_BARCHART → série "Revenue" de type bar

// ─── Known role constants ───────────────────────────────────────────────────

const KNOWN_ROLES = [
    // Ordering matters: longer/more-specific roles MUST come before shorter ones
    // so suffix matching doesn't accidentally match a prefix
    'BARCHART_STACKED_PERCENT',
    'BARCHART_STACKED',
    'BARCHART_PERCENT',
    'BARCHART',
    'LINECHART_PERCENT',
    'LINECHART',
    'PIECHART_PERCENT',
    'PIECHART',
    'DONUTCHART_PERCENT',
    'DONUTCHART',
    'GAUGE_PERCENT',
    'GAUGE',
    'BOXPLOT',
    'XAXIS',
    'YAXIS',
    'CATEGORY',
    'COLOR',
    'LABEL',
    'PERCENT',
    'COMPARE',
    'TREND',
    'XLINE',
    'YLINE',
];

const KNOWN_ROLES_SET = new Set(KNOWN_ROLES);

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ColumnRole {
    originalName: string;   // raw column name in result object
    role: string;           // uppercase role string (e.g. 'BARCHART')
    displayName: string;    // human label for legend / tooltip
}

export interface ParsedColumnRoles {
    roles: ColumnRole[];
    roleMap: Record<string, ColumnRole[]>;
    chartType: string;
}

// ─── ECharts default colors (aligned with DaisyUI palette) ──────────────────

const DEFAULT_COLORS = [
    '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
    '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc',
];

// ─── Dark theme detection ────────────────────────────────────────────────────

const DARK_THEMES = new Set([
    'dark', 'synthwave', 'halloween', 'forest', 'luxury',
    'dracula', 'business', 'night', 'coffee', 'dim', 'sunset', 'black',
    'abyss', 'aqua',
]);

function _isDark(): boolean {
    if (typeof document === 'undefined') return false;
    const t = document.documentElement.getAttribute('data-theme') || '';
    return DARK_THEMES.has(t) ||
        (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
}

// ─── Column role parsing ─────────────────────────────────────────────────────

export function parseColumnRoles(results: any[]): ParsedColumnRoles {
    if (!results || results.length === 0) {
        return { roles: [], roleMap: {}, chartType: 'unknown' };
    }

    const columnNames = Object.keys(results[0]);
    const roles: ColumnRole[] = [];

    for (const colName of columnNames) {
        const upper = colName.toUpperCase();

        // 1. Exact match
        if (KNOWN_ROLES_SET.has(upper)) {
            roles.push({ originalName: colName, role: upper, displayName: colName });
            continue;
        }

        // 2. Suffix match: find the longest known role suffix
        let matched = false;
        for (const role of KNOWN_ROLES) {
            const suffix = '_' + role;
            if (upper.endsWith(suffix)) {
                const displayName = colName.substring(0, colName.length - suffix.length);
                roles.push({ originalName: colName, role, displayName });
                matched = true;
                break;
            }
        }
        // Unknown columns are silently ignored (no chart role)
        if (!matched) {
            // Still include it as-is for potential future use or debug
        }
    }

    const roleMap: Record<string, ColumnRole[]> = {};
    for (const cr of roles) {
        if (!roleMap[cr.role]) roleMap[cr.role] = [];
        roleMap[cr.role].push(cr);
    }

    const chartType = _detectChartType(roleMap);
    return { roles, roleMap, chartType };
}

function _detectChartType(roleMap: Record<string, ColumnRole[]>): string {
    const has = (r: string) => !!(roleMap[r]?.length);

    if (has('BARCHART_STACKED_PERCENT')) return 'bar_percent';
    if (has('BARCHART_PERCENT'))         return 'bar_percent';
    if (has('BARCHART_STACKED'))         return 'bar_stacked';
    if (has('BARCHART')) {
        // Horizontal bar when YAXIS instead of XAXIS
        if (has('YAXIS') && !has('XAXIS')) return 'bar_horizontal';
        return 'bar';
    }
    if (has('LINECHART_PERCENT')) return 'line_percent';
    if (has('LINECHART'))         return 'line';
    if (has('PIECHART_PERCENT'))  return 'pie_percent';
    if (has('PIECHART'))          return 'pie';
    if (has('DONUTCHART_PERCENT')) return 'donut_percent';
    if (has('DONUTCHART'))         return 'donut';
    if (has('GAUGE_PERCENT'))      return 'gauge_percent';
    if (has('GAUGE'))              return 'gauge';
    if (has('BOXPLOT'))            return 'boxplot';
    if (has('LABEL') || has('PERCENT') || has('COMPARE')) return 'kpi';
    return 'unknown';
}

// ─── Main entry point ────────────────────────────────────────────────────────

export function buildEChartsOption(results: any[], parsed: ParsedColumnRoles): object | null {
    const { roleMap, chartType } = parsed;
    if (!results || results.length === 0) return null;

    const dark = _isDark();
    const textColor = dark ? '#e2e8f0' : '#334155';

    const base = {
        backgroundColor: 'transparent',
        color: DEFAULT_COLORS,
        textStyle: { color: textColor, fontFamily: 'inherit' },
        tooltip: { trigger: 'axis', confine: true },
        legend: { show: true, textStyle: { color: textColor } },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    };

    switch (chartType) {
        case 'bar':
            return _buildBarOption(results, roleMap, 'bar', base, textColor, false);
        case 'bar_stacked':
            return _buildBarOption(results, roleMap, 'bar_stacked', base, textColor, false);
        case 'bar_percent':
            return _buildBarOption(results, roleMap, 'bar_percent', base, textColor, false);
        case 'bar_horizontal':
            return _buildBarOption(results, roleMap, 'bar', base, textColor, true);
        case 'line':
            return _buildLineOption(results, roleMap, 'line', base, textColor);
        case 'line_percent':
            return _buildLineOption(results, roleMap, 'line_percent', base, textColor);
        case 'pie':
        case 'pie_percent':
            return _buildPieOption(results, roleMap, chartType, base, textColor, false);
        case 'donut':
        case 'donut_percent':
            return _buildPieOption(results, roleMap, chartType, base, textColor, true);
        case 'gauge':
        case 'gauge_percent':
            return _buildGaugeOption(results, roleMap, chartType, base, textColor);
        case 'boxplot':
            return _buildBoxplotOption(results, roleMap, base, textColor);
        case 'kpi':
            // KPI is handled separately (rendered as HTML, not ECharts)
            return null;
        default:
            return null;
    }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Collect unique values from a column, preserving first-seen order */
function _uniqueOrdered(results: any[], colName: string): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const row of results) {
        const v = _str(row[colName]);
        if (!seen.has(v)) { seen.add(v); out.push(v); }
    }
    return out;
}

function _str(v: any): string {
    if (v === null || v === undefined) return '';
    if (v instanceof Date) return v.toISOString().split('T')[0];
    return String(v);
}

function _num(v: any): number {
    const n = Number(v);
    return isNaN(n) ? 0 : n;
}

/** Build a pivot: category → axisValue → numeric value */
function _pivot(results: any[], catCol: string, axisCol: string, valueCol: string):
    Record<string, Record<string, number>> {
    const map: Record<string, Record<string, number>> = {};
    for (const row of results) {
        const cat = _str(row[catCol]);
        const ax = _str(row[axisCol]);
        if (!map[cat]) map[cat] = {};
        map[cat][ax] = _num(row[valueCol]);
    }
    return map;
}

/** Collect XLINE / YLINE markLine data from results */
function _buildMarkLines(results: any[], roleMap: Record<string, ColumnRole[]>): any[] {
    const data: any[] = [];
    for (const col of (roleMap['XLINE'] || [])) {
        for (const row of results) {
            const v = row[col.originalName];
            if (v !== null && v !== undefined) {
                data.push({ xAxis: _str(v), name: col.displayName, lineStyle: { type: 'dashed' } });
            }
        }
    }
    for (const col of (roleMap['YLINE'] || [])) {
        for (const row of results) {
            const v = row[col.originalName];
            if (v !== null && v !== undefined) {
                data.push({ yAxis: _num(v), name: col.displayName, lineStyle: { type: 'dashed' } });
            }
        }
    }
    return data;
}

// ─── Bar chart ───────────────────────────────────────────────────────────────

function _buildBarOption(results, roleMap, chartType, base, textColor, horizontal) {
    const isStacked = chartType === 'bar_stacked' || chartType === 'bar_percent';
    const isPercent = chartType === 'bar_percent';
    const stack = isStacked ? 'total' : undefined;

    // Determine value columns (prefer most-specific role)
    const valueCols: ColumnRole[] = (
        roleMap['BARCHART_STACKED_PERCENT'] ||
        roleMap['BARCHART_PERCENT'] ||
        roleMap['BARCHART_STACKED'] ||
        roleMap['BARCHART'] ||
        []
    );
    const axisCols = roleMap[horizontal ? 'YAXIS' : 'XAXIS'] || [];
    const categoryCols = roleMap['CATEGORY'] || [];
    const colorCols = roleMap['COLOR'] || [];
    const axisCol = axisCols[0]?.originalName;

    let axisData: string[] = [];
    const series: any[] = [];

    if (categoryCols.length > 0 && valueCols.length > 0) {
        // Multi-series via CATEGORY pivot
        const catCol = categoryCols[0].originalName;
        const valueCol = valueCols[0].originalName;
        const colorCol = colorCols[0]?.originalName;

        axisData = axisCol ? _uniqueOrdered(results, axisCol) : [];
        const categories = _uniqueOrdered(results, catCol);
        const pivotData = _pivot(results, catCol, axisCol || '', valueCol);

        // Custom colors per category (from COLOR column)
        const customColors: Record<string, string> = {};
        if (colorCol) {
            for (const row of results) {
                const cat = _str(row[catCol]);
                if (row[colorCol]) customColors[cat] = _str(row[colorCol]);
            }
        }

        for (const cat of categories) {
            const data = axisData.map(ax => pivotData[cat]?.[ax] ?? 0);
            const s: any = {
                name: cat,
                type: 'bar',
                data,
                stack,
                barMaxWidth: 60,
                emphasis: { focus: 'series' },
            };
            if (customColors[cat]) s.itemStyle = { color: customColors[cat] };
            series.push(s);
        }
    } else if (valueCols.length > 0) {
        // Multiple value columns → multiple named series
        axisData = axisCol ? results.map(r => _str(r[axisCol])) : [];
        const colorCol = colorCols[0]?.originalName;

        for (const vc of valueCols) {
            const s: any = {
                name: vc.displayName,
                type: 'bar',
                stack,
                barMaxWidth: 60,
                emphasis: { focus: 'series' },
                data: results.map(r => {
                    const val = _num(r[vc.originalName]);
                    if (colorCol && r[colorCol]) {
                        return { value: val, itemStyle: { color: _str(r[colorCol]) } };
                    }
                    return val;
                }),
            };
            series.push(s);
        }
    }

    // Attach markLines to first series
    const markLineData = _buildMarkLines(results, roleMap);
    if (markLineData.length > 0 && series.length > 0) {
        series[0].markLine = {
            symbol: ['none', 'none'],
            data: markLineData,
            label: { show: true },
        };
    }

    const categoryAxis = { type: 'category', data: axisData, axisLabel: { color: textColor } };
    const valueAxis: any = {
        type: 'value',
        axisLabel: {
            color: textColor,
            ...(isPercent ? { formatter: '{value}%' } : {}),
        },
        ...(isPercent ? { max: 100 } : {}),
    };

    return {
        ...base,
        tooltip: {
            trigger: 'axis',
            confine: true,
            axisPointer: { type: 'shadow' },
        },
        xAxis: horizontal ? valueAxis : categoryAxis,
        yAxis: horizontal ? categoryAxis : valueAxis,
        series,
    };
}

// ─── Line chart ──────────────────────────────────────────────────────────────

function _buildLineOption(results, roleMap, chartType, base, textColor) {
    const isPercent = chartType === 'line_percent';
    const stack = isPercent ? 'total' : undefined;

    const valueCols: ColumnRole[] = roleMap['LINECHART'] || roleMap['LINECHART_PERCENT'] || [];
    const axisCols = roleMap['XAXIS'] || [];
    const categoryCols = roleMap['CATEGORY'] || [];
    const colorCols = roleMap['COLOR'] || [];
    const axisCol = axisCols[0]?.originalName;

    let axisData: string[] = [];
    const series: any[] = [];

    if (categoryCols.length > 0 && valueCols.length > 0) {
        const catCol = categoryCols[0].originalName;
        const valueCol = valueCols[0].originalName;
        const colorCol = colorCols[0]?.originalName;

        axisData = axisCol ? _uniqueOrdered(results, axisCol) : [];
        const categories = _uniqueOrdered(results, catCol);
        const pivotData = _pivot(results, catCol, axisCol || '', valueCol);

        const customColors: Record<string, string> = {};
        if (colorCol) {
            for (const row of results) {
                const cat = _str(row[catCol]);
                if (row[colorCol]) customColors[cat] = _str(row[colorCol]);
            }
        }

        for (const cat of categories) {
            const data = axisData.map(ax => pivotData[cat]?.[ax] ?? 0);
            const s: any = {
                name: cat,
                type: 'line',
                smooth: true,
                data,
                stack,
                areaStyle: isPercent ? {} : undefined,
                emphasis: { focus: 'series' },
            };
            if (customColors[cat]) s.lineStyle = { color: customColors[cat] };
            series.push(s);
        }
    } else {
        axisData = axisCol ? results.map(r => _str(r[axisCol])) : [];
        const colorCol = colorCols[0]?.originalName;

        for (const vc of valueCols) {
            const customColor = colorCol ? _str(results[0]?.[colorCol]) : undefined;
            const s: any = {
                name: vc.displayName,
                type: 'line',
                smooth: true,
                stack,
                areaStyle: isPercent ? {} : undefined,
                emphasis: { focus: 'series' },
                data: results.map(r => _num(r[vc.originalName])),
            };
            if (customColor) s.lineStyle = { color: customColor };
            series.push(s);
        }
    }

    // Attach markLines
    const markLineData = _buildMarkLines(results, roleMap);
    if (markLineData.length > 0 && series.length > 0) {
        series[0].markLine = {
            symbol: ['none', 'none'],
            data: markLineData,
            label: { show: true },
        };
    }

    return {
        ...base,
        tooltip: { trigger: 'axis', confine: true },
        xAxis: { type: 'category', data: axisData, axisLabel: { color: textColor } },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: textColor,
                ...(isPercent ? { formatter: '{value}%' } : {}),
            },
            ...(isPercent ? { max: 100 } : {}),
        },
        series,
    };
}

// ─── Pie / Donut chart ───────────────────────────────────────────────────────

function _buildPieOption(results, roleMap, chartType, base, textColor, isDonut) {
    const isPercent = chartType.includes('percent');
    const valueCols: ColumnRole[] = (
        roleMap['PIECHART_PERCENT'] ||
        roleMap['PIECHART'] ||
        roleMap['DONUTCHART_PERCENT'] ||
        roleMap['DONUTCHART'] ||
        []
    );
    const categoryCols = roleMap['CATEGORY'] || [];
    const colorCols = roleMap['COLOR'] || [];

    const valueCol = valueCols[0]?.originalName;
    const catCol = categoryCols[0]?.originalName;
    const colorCol = colorCols[0]?.originalName;

    const data = results.map(row => {
        const entry: any = {
            name: catCol ? _str(row[catCol]) : _str(row[valueCol]),
            value: _num(row[valueCol]),
        };
        if (colorCol && row[colorCol]) {
            entry.itemStyle = { color: _str(row[colorCol]) };
        }
        return entry;
    });

    const radius = isDonut ? ['38%', '65%'] : '60%';

    return {
        ...base,
        tooltip: {
            trigger: 'item',
            formatter: isPercent ? '{b}: {d}%' : '{b}: {c}',
        },
        legend: {
            orient: 'horizontal',
            bottom: 0,
            textStyle: { color: textColor },
        },
        series: [{
            type: 'pie',
            radius,
            data,
            label: {
                formatter: isPercent ? '{b}: {d}%' : '{b}: {c}',
                color: textColor,
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0,0,0,0.4)',
                },
            },
        }],
    };
}

// ─── Gauge ───────────────────────────────────────────────────────────────────

function _buildGaugeOption(results, roleMap, chartType, base, textColor) {
    const isPercent = chartType === 'gauge_percent';
    const valueCols: ColumnRole[] = roleMap['GAUGE'] || roleMap['GAUGE_PERCENT'] || [];
    const valueCol = valueCols[0]?.originalName;
    const value = _num(results[0]?.[valueCol]);
    const label = valueCols[0]?.displayName || '';

    // Optional RANGE column: array [min, max] from first row
    const rangeCols = roleMap['RANGE'] || [];
    const rangeCol = rangeCols[0]?.originalName;
    let min = 0, max = 100;
    if (rangeCol && results[0]?.[rangeCol] != null) {
        const r = results[0][rangeCol];
        if (Array.isArray(r) && r.length >= 2) { min = _num(r[0]); max = _num(r[1]); }
        else { max = _num(r); }
    }

    return {
        ...base,
        tooltip: { formatter: '{b}: {c}' + (isPercent ? '%' : '') },
        series: [{
            type: 'gauge',
            min,
            max,
            startAngle: 200,
            endAngle: -20,
            splitNumber: 5,
            pointer: { show: true, length: '60%' },
            axisLabel: {
                color: textColor,
                fontSize: 11,
                formatter: isPercent ? '{value}%' : '{value}',
            },
            axisTick: { distance: -20, length: 8 },
            splitLine: { distance: -25, length: 20 },
            detail: {
                fontSize: 24,
                fontWeight: 'bold',
                color: textColor,
                formatter: isPercent ? '{value}%' : '{value}',
                offsetCenter: [0, '70%'],
            },
            data: [{ value, name: label }],
        }],
    };
}

// ─── Boxplot ─────────────────────────────────────────────────────────────────

function _buildBoxplotOption(results, roleMap, base, textColor) {
    const axisCols = roleMap['XAXIS'] || [];
    const valueCols = roleMap['BOXPLOT'] || [];
    const axisCol = axisCols[0]?.originalName;

    let categories: string[] = [];
    let boxData: number[][] = [];

    // If 5+ BOXPLOT columns, treat as direct [min, q1, median, q3, max]
    if (valueCols.length >= 5) {
        for (const row of results) {
            categories.push(axisCol ? _str(row[axisCol]) : '');
            boxData.push([
                _num(row[valueCols[0].originalName]),
                _num(row[valueCols[1].originalName]),
                _num(row[valueCols[2].originalName]),
                _num(row[valueCols[3].originalName]),
                _num(row[valueCols[4].originalName]),
            ]);
        }
    } else {
        // Group raw values by XAXIS category, compute quantiles
        const valueCol = valueCols[0]?.originalName;
        const groups: Record<string, number[]> = {};
        const catOrder: string[] = [];
        for (const row of results) {
            const cat = axisCol ? _str(row[axisCol]) : '_';
            if (!groups[cat]) { groups[cat] = []; catOrder.push(cat); }
            groups[cat].push(_num(row[valueCol]));
        }
        const q = (sorted: number[], p: number) => {
            const idx = p * (sorted.length - 1);
            const lo = Math.floor(idx), hi = Math.ceil(idx);
            return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
        };
        for (const cat of catOrder) {
            const sorted = [...groups[cat]].sort((a, b) => a - b);
            categories.push(cat);
            boxData.push([sorted[0], q(sorted, 0.25), q(sorted, 0.5), q(sorted, 0.75), sorted[sorted.length - 1]]);
        }
    }

    return {
        ...base,
        tooltip: { trigger: 'item', confine: true },
        xAxis: { type: 'category', data: categories, axisLabel: { color: textColor } },
        yAxis: { type: 'value', axisLabel: { color: textColor } },
        series: [{ type: 'boxplot', data: boxData, emphasis: { focus: 'series' } }],
    };
}

// ─── KPI card HTML builder (not an ECharts option) ───────────────────────────

/**
 * Returns an HTML string for a KPI single-value display.
 * Used when chartType === 'kpi' (no ECharts instance needed).
 */
export function buildKpiHtml(results: any[], parsed: ParsedColumnRoles): string {
    const { roleMap } = parsed;
    const row = results[0] || {};
    const parts: string[] = [];

    for (const col of (roleMap['LABEL'] || [])) {
        const val = _str(row[col.originalName]);
        parts.push(`<div class="stat">
            <div class="stat-title">${col.displayName !== 'LABEL' ? col.displayName : ''}</div>
            <div class="stat-value text-primary">${val}</div>
        </div>`);
    }
    for (const col of (roleMap['PERCENT'] || [])) {
        const val = _num(row[col.originalName]);
        parts.push(`<div class="stat">
            <div class="stat-title">${col.displayName !== 'PERCENT' ? col.displayName : ''}</div>
            <div class="stat-value">${val.toFixed(1)}%</div>
        </div>`);
    }
    for (const col of (roleMap['COMPARE'] || [])) {
        const val = _num(row[col.originalName]);
        const sign = val >= 0 ? '+' : '';
        const color = val >= 0 ? 'text-success' : 'text-error';
        parts.push(`<div class="stat">
            <div class="stat-title">${col.displayName !== 'COMPARE' ? col.displayName : 'Comparaison'}</div>
            <div class="stat-value ${color}">${sign}${val}</div>
        </div>`);
    }

    if (parts.length === 0) return '<div class="p-4 text-base-content/50 text-sm">Aucune donnée</div>';

    return `<div class="stats shadow w-full flex-wrap">${parts.join('')}</div>`;
}

// ─── Main class export (for Alpine / global access) ──────────────────────────

export class EChartSqlParser {
    static parseColumnRoles = parseColumnRoles;
    static buildEChartsOption = buildEChartsOption;
    static buildKpiHtml = buildKpiHtml;
    static detectChartType = _detectChartType;
}
