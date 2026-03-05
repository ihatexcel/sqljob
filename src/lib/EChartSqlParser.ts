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
    'COLORS',
    'LABELS',
    'RANGE',
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

// columnTypes: { colName -> DuckDB type string } obtenu via DESCRIBE (ex: 'XAXIS', 'BARCHART')
// Quand fourni, le TYPE DuckDB de la colonne est prioritaire sur le nom de colonne.
// Permet la syntaxe taleshape native : SELECT val::BARCHART AS "Mon Label"
export function parseColumnRoles(results: any[], columnTypes?: Record<string, string>): ParsedColumnRoles {
    if (!results || results.length === 0) {
        return { roles: [], roleMap: {}, chartType: 'unknown' };
    }

    const columnNames = Object.keys(results[0]);
    const roles: ColumnRole[] = [];

    for (const colName of columnNames) {
        const upper = colName.toUpperCase();
        const colType = columnTypes?.[colName]?.toUpperCase();

        // 0. Priorité : type DuckDB (ex: ::XAXIS AS "Mon Label" → type=XAXIS, display="Mon Label")
        if (colType && KNOWN_ROLES_SET.has(colType)) {
            roles.push({ originalName: colName, role: colType, displayName: colName });
            continue;
        }

        // 1. Exact match sur le nom de colonne (rétrocompatibilité)
        if (KNOWN_ROLES_SET.has(upper)) {
            roles.push({ originalName: colName, role: upper, displayName: colName });
            continue;
        }

        // 2. Suffix match: "Label_XAXIS" → role=XAXIS, displayName="Label"
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
        if (!matched) {
            // Colonne sans rôle chart : ignorée pour les graphiques
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

    if (has('BARCHART_STACKED_PERCENT')) return 'bar_stacked_percent';
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
    if (has('LABEL') || has('PERCENT') || has('COMPARE') || has('TREND')) return 'kpi';
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
        case 'bar_stacked_percent':
            return _buildBarOption(results, roleMap, 'bar_stacked_percent', base, textColor, false);
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

/** Collect LABEL markPoint data from results (text annotations at XAXIS position) */
function _buildMarkPoints(results: any[], roleMap: Record<string, ColumnRole[]>): any[] {
    const labelCols = roleMap['LABEL'] || [];
    if (labelCols.length === 0) return [];

    const axisCols = roleMap['XAXIS'] || roleMap['YAXIS'] || [];
    const axisCol = axisCols[0]?.originalName;
    const data: any[] = [];

    for (const col of labelCols) {
        for (const row of results) {
            const labelVal = row[col.originalName];
            if (labelVal === null || labelVal === undefined || _str(labelVal) === '') continue;
            const point: any = {
                name: _str(labelVal),
                value: _str(labelVal),
                symbol: 'pin',
                symbolSize: 28,
                label: { formatter: '{b}', position: 'top', fontSize: 10 },
            };
            if (axisCol) {
                point.xAxis = _str(row[axisCol]);
            }
            data.push(point);
        }
    }
    return data;
}

// ─── Bar chart ───────────────────────────────────────────────────────────────

function _buildBarOption(results, roleMap, chartType, base, textColor, horizontal) {
    const isStacked = chartType === 'bar_stacked' || chartType === 'bar_percent' || chartType === 'bar_stacked_percent';
    const isPercent = chartType === 'bar_percent' || chartType === 'bar_stacked_percent';
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
            if (isPercent) {
                s.label = { show: true, formatter: (p) => p.value > 0 ? p.value.toFixed(1) + '%' : '', position: 'inside', fontSize: 10 };
            }
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
            if (isPercent) {
                s.label = { show: true, formatter: (p) => p.value > 0 ? p.value.toFixed(1) + '%' : '', position: 'inside', fontSize: 10 };
            }
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

    // Attach markPoints (LABEL annotations) to first series
    const markPointData = _buildMarkPoints(results, roleMap);
    if (markPointData.length > 0 && series.length > 0) {
        series[0].markPoint = {
            symbol: 'pin',
            symbolSize: 28,
            data: markPointData,
            label: { color: '#fff', fontSize: 9 },
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
            ...(isPercent ? { formatter: (params) => {
                const name = params[0]?.axisValue || '';
                const lines = params.map(p => `${p.marker}${p.seriesName}: ${_num(p.value).toFixed(1)}%`);
                return [name, ...lines].join('<br/>');
            }} : {}),
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

    const valueCols: ColumnRole[] = roleMap['LINECHART_PERCENT'] || roleMap['LINECHART'] || [];
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

    // Attach markPoints (LABEL annotations)
    const markPointData = _buildMarkPoints(results, roleMap);
    if (markPointData.length > 0 && series.length > 0) {
        series[0].markPoint = {
            symbol: 'pin',
            symbolSize: 28,
            data: markPointData,
            label: { color: '#fff', fontSize: 9 },
        };
    }

    return {
        ...base,
        tooltip: {
            trigger: 'axis',
            confine: true,
            ...(isPercent ? { formatter: (params) => {
                const name = params[0]?.axisValue || '';
                const lines = params.map(p => `${p.marker}${p.seriesName}: ${_num(p.value).toFixed(1)}%`);
                return [name, ...lines].join('<br/>');
            }} : {}),
        },
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
    const valueCols: ColumnRole[] = roleMap['GAUGE_PERCENT'] || roleMap['GAUGE'] || [];
    const valueCol = valueCols[0]?.originalName;
    const value = _num(results[0]?.[valueCol]);
    const label = valueCols[0]?.displayName || '';

    // Helper: convert Arrow Vector / typed-array / plain Array to a JS Array
    const _toJSArr = (v: unknown): unknown[] | null => {
        if (Array.isArray(v)) return v;
        if (v == null || typeof v === 'string') return null;
        if (typeof (v as any)[Symbol.iterator] === 'function') return Array.from(v as Iterable<unknown>);
        return null;
    };

    // RANGE column: [min, max] OR [v0, v1, v2, ..., vN] for a segmented gauge
    const rangeCols = roleMap['RANGE'] || [];
    const rangeCol = rangeCols[0]?.originalName;
    let min = 0, max = 100;
    let rangeThresholds: number[] = []; // segment boundaries excluding min (used for COLORS/LABELS)
    if (rangeCol && results[0]?.[rangeCol] != null) {
        const r = results[0][rangeCol];
        let arr: number[] | null = null;
        const r_arr = _toJSArr(r);
        if (r_arr && r_arr.length >= 2) {
            arr = r_arr.map(_num);
        } else if (typeof r === 'string') {
            try {
                const parsed = JSON.parse(r);
                const p_arr = _toJSArr(parsed);
                if (p_arr && p_arr.length >= 2) arr = p_arr.map(_num);
            } catch (_) {}
        }
        if (arr) {
            min = arr[0];
            max = arr[arr.length - 1];
            rangeThresholds = arr.slice(1); // everything after min; last = max
        }
    }

    // COLORS column: either ECharts format [[fraction, color], ...] or simple ['#c1', '#c2', ...]
    const colorsCols = roleMap['COLORS'] || [];
    const colorsCol = colorsCols[0]?.originalName;
    let gaugeColors: any[] | undefined;
    if (colorsCol && results[0]?.[colorsCol] != null) {
        const raw = results[0][colorsCol];
        try {
            const raw_parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
            const parsed = _toJSArr(raw_parsed);
            if (parsed && parsed.length > 0) {
                if (Array.isArray(parsed[0])) {
                    // Already ECharts format [[fraction, color], ...]
                    gaugeColors = parsed as any[];
                } else {
                    // Simple string array ['#color1', '#color2', ...] → convert to ECharts format
                    const range = max - min || 1;
                    if (rangeThresholds.length === parsed.length) {
                        // Map each color to its corresponding threshold fraction
                        gaugeColors = rangeThresholds.map((threshold, i) => [
                            (threshold - min) / range,
                            parsed[i],
                        ]);
                    } else {
                        // Equal distribution across the gauge
                        gaugeColors = parsed.map((color, i) => [
                            (i + 1) / parsed.length,
                            color,
                        ]);
                    }
                }
            }
        } catch (_) {}
    }

    // LABELS column: [{value, label}, ...] OR simple ['label1', 'label2', ...]
    const labelsCols = roleMap['LABELS'] || [];
    const labelsCol = labelsCols[0]?.originalName;
    let gaugeAxisLabels: Array<{ value: number; label: string }> | undefined;
    if (labelsCol && results[0]?.[labelsCol] != null) {
        const raw = results[0][labelsCol];
        try {
            const raw_parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
            const parsed = _toJSArr(raw_parsed);
            if (parsed && parsed.length > 0) {
                if (parsed[0] && typeof parsed[0] === 'object' && 'value' in (parsed[0] as object)) {
                    // Already {value, label} format
                    gaugeAxisLabels = parsed as any[];
                } else if (rangeThresholds.length === parsed.length) {
                    // Simple string array aligned with range thresholds
                    gaugeAxisLabels = rangeThresholds.map((threshold, i) => ({
                        value: threshold,
                        label: String(parsed[i]),
                    }));
                } else {
                    // Fallback: equal distribution across range (e.g. RANGE=[min,max] with N labels)
                    const rng = max - min || 1;
                    gaugeAxisLabels = parsed.map((lbl, i) => ({
                        value: min + rng * (i + 1) / parsed.length,
                        label: String(lbl),
                    }));
                }
            }
        } catch (_) {}
    }

    // Build axisLine color config
    const axisLineStyle: any = { width: 6 };
    if (gaugeColors) {
        axisLineStyle.color = gaugeColors;
    } else {
        // Default: green → yellow → red gradient
        axisLineStyle.color = [
            [0.3, '#91cc75'],
            [0.7, '#fac858'],
            [1, '#ee6666'],
        ];
    }

    // Default: simple gauge with standard numeric labels
    let splitNumber = 5;
    let axisTickCfg: any = { distance: -20, length: 8 };
    let splitLineCfg: any = { distance: -25, length: 20 };
    let innerLabelFmt: any = isPercent ? '{value}%' : '{value}'; // threshold values (inside arc)
    let outerSeries: any = null;                                   // zone labels overlay (outside arc)

    if (gaugeAxisLabels) {
        // splitNumber = N*4 covers both zone midpoints and threshold positions
        const N = gaugeAxisLabels.length;
        splitNumber = N * 4;
        const tickInterval = (max - min) / splitNumber;
        const snapToTick = (pos: number) => Math.round((pos - min) / tickInterval) * tickInterval + min;
        const eps = tickInterval * 1e-4;

        const zoneBoundaries = [min, ...gaugeAxisLabels.map(item => item.value)];
        const zoneMidpoints = gaugeAxisLabels.map((_, i) => (zoneBoundaries[i] + zoneBoundaries[i + 1]) / 2);
        const activeZoneIdx = gaugeAxisLabels.findIndex((item, i) => value >= zoneBoundaries[i] && value <= item.value);

        // Map: snapped tick → threshold string (numeric)
        const thresholdMap = new Map<number, string>();
        zoneBoundaries.forEach(pos => thresholdMap.set(snapToTick(pos), String(pos)));

        // Map: snapped tick → zone label { text, isActive }
        const zoneMap = new Map<number, { text: string; isActive: boolean }>();
        zoneMidpoints.forEach((pos, i) => {
            const snap = snapToTick(pos);
            if (!thresholdMap.has(snap))
                zoneMap.set(snap, { text: gaugeAxisLabels![i].label, isActive: i === activeZoneIdx });
        });

        const findInMap = <T>(map: Map<number, T>, val: number): T | null => {
            for (const [k, v] of map.entries())
                if (Math.abs(val - k) < eps) return v;
            return null;
        };

        // Series 1 inner labels: threshold values only, INSIDE the arc
        innerLabelFmt = (val: number) => findInMap(thresholdMap, val) ?? '';

        // Series 2 outer labels: zone names OUTSIDE the arc, bold when active
        const outerFmt = (val: number) => {
            const item = findInMap(zoneMap, val);
            if (!item) return '';
            return item.isActive ? `{act|${item.text}}` : item.text;
        };
        outerSeries = {
            type: 'gauge', min, max, startAngle: 200, endAngle: -20,
            splitNumber,
            pointer: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: {
                color: textColor, fontSize: 11, distance: 18,
                rich: { act: { fontWeight: 'bold', fontSize: 12, color: textColor } },
                formatter: outerFmt,
            },
            detail: { show: false },
            data: [],
        };
        axisTickCfg = { show: false };
        splitLineCfg = { show: false };
    }

    const mainSeries: any = {
        type: 'gauge', min, max, startAngle: 200, endAngle: -20,
        splitNumber,
        pointer: { show: true, length: '60%' },
        axisLine: { lineStyle: axisLineStyle },
        axisLabel: { color: textColor, fontSize: 11, distance: -35, formatter: innerLabelFmt },
        axisTick: axisTickCfg,
        splitLine: splitLineCfg,
        detail: {
            fontSize: 24, fontWeight: 'bold', color: textColor,
            formatter: isPercent ? '{value}%' : '{value}',
            offsetCenter: [0, '70%'],
        },
        data: [{ value, name: label }],
    };

    return {
        ...base,
        tooltip: { formatter: '{b}: {c}' + (isPercent ? '%' : '') },
        series: outerSeries ? [mainSeries, outerSeries] : [mainSeries],
    };
}

// ─── Boxplot ─────────────────────────────────────────────────────────────────

function _buildBoxplotOption(results, roleMap, base, textColor) {
    const axisCols = roleMap['XAXIS'] || [];
    const valueCols = roleMap['BOXPLOT'] || [];
    const colorCols = roleMap['COLOR'] || [];
    const axisCol = axisCols[0]?.originalName;
    const colorCol = colorCols[0]?.originalName;

    let categories: string[] = [];
    let boxData: number[][] = [];
    let outlierData: Array<[number, number]> = []; // [catIndex, value]

    // If 5+ BOXPLOT columns, treat as direct [min, q1, median, q3, max] — no outlier detection
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
        // Group raw values by XAXIS category, compute quantiles + Tukey outliers
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

        for (let catIdx = 0; catIdx < catOrder.length; catIdx++) {
            const cat = catOrder[catIdx];
            const sorted = [...groups[cat]].sort((a, b) => a - b);
            const q1 = q(sorted, 0.25);
            const median = q(sorted, 0.5);
            const q3 = q(sorted, 0.75);
            const iqr = q3 - q1;

            // Tukey fences
            const lowerFence = q1 - 1.5 * iqr;
            const upperFence = q3 + 1.5 * iqr;

            // Whiskers: nearest actual data point within the fences
            const lowerWhisker = sorted.find(v => v >= lowerFence) ?? sorted[0];
            let upperWhisker = sorted[0];
            for (const v of sorted) { if (v <= upperFence) upperWhisker = v; }

            categories.push(cat);
            boxData.push([lowerWhisker, q1, median, q3, upperWhisker]);

            // Collect outliers (values beyond the fences)
            for (const v of sorted) {
                if (v < lowerFence || v > upperFence) {
                    outlierData.push([catIdx, v]);
                }
            }
        }
    }

    // Build custom item styles per category if COLOR column is present
    const itemStyles = boxData.map((_, idx) => {
        if (!colorCol) return undefined;
        const row = results.find(r => axisCol ? _str(r[axisCol]) === categories[idx] : true);
        if (row && row[colorCol]) return { color: _str(row[colorCol]) };
        return undefined;
    });

    const boxSeries: any[] = [{
        type: 'boxplot',
        data: boxData.map((d, i) => itemStyles[i] ? { value: d, itemStyle: itemStyles[i] } : d),
        emphasis: { focus: 'series' },
        tooltip: {
            formatter: (param) => {
                const v = param.data?.value || param.data;
                if (!Array.isArray(v)) return '';
                return `${param.name}<br/>
                    Max: ${v[4]}<br/>
                    Q3: ${v[3]}<br/>
                    Médiane: ${v[2]}<br/>
                    Q1: ${v[1]}<br/>
                    Min: ${v[0]}`;
            },
        },
    }];

    // Add outlier scatter series if there are outliers
    if (outlierData.length > 0) {
        boxSeries.push({
            name: 'Valeurs aberrantes',
            type: 'scatter',
            data: outlierData,
            tooltip: {
                formatter: (param) => `${categories[param.data[0]]}: ${param.data[1]}`,
            },
            symbolSize: 6,
            itemStyle: { color: '#ee6666', opacity: 0.7 },
        });
    }

    return {
        ...base,
        tooltip: { trigger: 'item', confine: true },
        xAxis: { type: 'category', data: categories, axisLabel: { color: textColor } },
        yAxis: { type: 'value', axisLabel: { color: textColor } },
        series: boxSeries,
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
        const color = val >= 75 ? 'text-success' : val >= 40 ? 'text-warning' : 'text-error';
        parts.push(`<div class="stat">
            <div class="stat-title">${col.displayName !== 'PERCENT' ? col.displayName : ''}</div>
            <div class="stat-value ${color}">${val.toFixed(1)}%</div>
        </div>`);
    }
    for (const col of (roleMap['COMPARE'] || [])) {
        const val = _num(row[col.originalName]);
        const sign = val >= 0 ? '+' : '';
        const color = val >= 0 ? 'text-success' : 'text-error';
        const icon = val >= 0
            ? `<span style="font-size:0.6em">▲</span>`
            : `<span style="font-size:0.6em">▼</span>`;
        parts.push(`<div class="stat">
            <div class="stat-title">${col.displayName !== 'COMPARE' ? col.displayName : 'Comparaison'}</div>
            <div class="stat-value ${color}">${icon} ${sign}${val}</div>
        </div>`);
    }
    for (const col of (roleMap['TREND'] || [])) {
        const val = _num(row[col.originalName]);
        const isUp = val > 0;
        const isNeutral = val === 0;
        const arrow = isNeutral ? '→' : isUp ? '↑' : '↓';
        const color = isNeutral ? 'text-warning' : isUp ? 'text-success' : 'text-error';
        const sign = isUp ? '+' : '';
        parts.push(`<div class="stat">
            <div class="stat-title">${col.displayName !== 'TREND' ? col.displayName : 'Tendance'}</div>
            <div class="stat-value ${color}">${arrow} ${sign}${val}</div>
        </div>`);
    }

    if (parts.length === 0) return '<div class="p-4 text-base-content/50 text-sm">Aucune donnée</div>';

    return `<div class="stats shadow w-full flex-wrap">${parts.join('')}</div>`;
}

// ─── Table cell HTML builder ──────────────────────────────────────────────────

/**
 * Returns an object mapping column originalName → HTML renderer function.
 * Used by renderTableInContainer to apply special formatting for PERCENT and TREND columns.
 */
export function buildTableColumnRenderers(parsed: ParsedColumnRoles): Record<string, (val: any) => string> {
    const { roleMap } = parsed;
    const renderers: Record<string, (val: any) => string> = {};

    for (const col of (roleMap['PERCENT'] || [])) {
        renderers[col.originalName] = (val) => {
            const n = _num(val);
            const color = n >= 75 ? '#22c55e' : n >= 40 ? '#f59e0b' : '#ef4444';
            const barWidth = Math.min(100, Math.max(0, n));
            return `<div style="display:flex;align-items:center;gap:6px;min-width:80px">
                <div style="flex:1;height:6px;background:#e2e8f0;border-radius:3px;overflow:hidden">
                    <div style="height:100%;width:${barWidth}%;background:${color};border-radius:3px"></div>
                </div>
                <span style="color:${color};font-weight:600;white-space:nowrap;min-width:3.5em;text-align:right">${n.toFixed(1)}%</span>
            </div>`;
        };
    }

    for (const col of (roleMap['TREND'] || [])) {
        renderers[col.originalName] = (val) => {
            const n = _num(val);
            const isUp = n > 0;
            const isNeutral = n === 0;
            const arrow = isNeutral ? '→' : isUp ? '↑' : '↓';
            const color = isNeutral ? '#f59e0b' : isUp ? '#22c55e' : '#ef4444';
            const sign = isUp ? '+' : '';
            return `<span style="color:${color};font-weight:600">${arrow} ${sign}${n}</span>`;
        };
    }

    return renderers;
}

/**
 * Returns the display name for a column (strips role suffix from the header).
 */
export function getTableColumnDisplayNames(parsed: ParsedColumnRoles): Record<string, string> {
    const map: Record<string, string> = {};
    for (const col of parsed.roles) {
        if (col.displayName && col.displayName !== col.originalName) {
            map[col.originalName] = col.displayName;
        }
    }
    return map;
}

// ─── Main class export (for Alpine / global access) ──────────────────────────

export class EChartSqlParser {
    static parseColumnRoles = parseColumnRoles;
    static buildEChartsOption = buildEChartsOption;
    static buildKpiHtml = buildKpiHtml;
    static buildTableColumnRenderers = buildTableColumnRenderers;
    static getTableColumnDisplayNames = getTableColumnDisplayNames;
    static detectChartType = _detectChartType;
}
