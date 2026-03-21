// @ts-nocheck
/**
 * Icônes centralisées — migration Iconify → lucide-react (système natif sqlrooms).
 * Utilisé uniquement dans les composants React.
 * Les templates Alpine (CellRenderer, groupsMixin) conservent Iconify.
 */
import {
    Activity, ArrowDown, ArrowLeft, ArrowLeftRight, ArrowRight, ArrowUp,
    ArrowUpDown, BookHeart, BookMarked, Braces, ChartBar, CircleCheck, CirclePlay, ClipboardPaste, Copy, CopyCheck, Database,
    Download, Ellipsis, EllipsisVertical, Eye, FileOutput, FileText, FileType, FolderOpen, FolderPlus,
    Globe, Lock, Network, Newspaper, Paintbrush, PenLine, Play, Plus, RefreshCw,
    Save, Settings, Share2, SlidersHorizontal, Table2, Trash2, TrendingUp, X, Zap,
} from 'lucide-react'

/** Map depuis le nom d'icône material-symbols-light (sans préfixe) vers Lucide */
const ICON_MAP: Record<string, any> = {
    'edit-note':                    PenLine,
    'folder-open':                  FolderOpen,
    'tune':                         SlidersHorizontal,
    'play-circle':                  CirclePlay,
    'play-arrow':                   Play,
    'storage':                      Database,
    'database':                     Database,
    'table':                        Table2,
    'web':                          Globe,
    'monitoring':                   Activity,
    'description':                  FileText,
    'picture-as-pdf':               FileType,
    'bar-chart':                    ChartBar,
    'analytics':                    TrendingUp,
    'add':                          Plus,
    'close':                        X,
    'settings':                     Settings,
    'delete':                       Trash2,
    'arrow-back':                   ArrowLeft,
    'arrow-forward':                ArrowRight,
    'arrow-upward':                 ArrowUp,
    'arrow-downward':               ArrowDown,
    'swap-vert':                    ArrowUpDown,
    'swap-horiz':                   ArrowLeftRight,
    'autorenew':                    RefreshCw,
    'download':                     Download,
    'save':                         Save,
    'lock':                         Lock,
    'visibility':                   Eye,
    'create-new-folder':            FolderPlus,
    'check-circle':                 CircleCheck,
    'content-copy':                 Copy,
    'copy':                         Copy,
    'copy-check':                   CopyCheck,
    'clipboard-paste':              ClipboardPaste,
    'share':                        Share2,
    'data-object':                  Braces,
    'account-tree':                 Network,
    'article':                      Newspaper,
    'export-notes-outline-sharp':   FileOutput,
    'bolt':                         Zap,
    'palette':                      Paintbrush,
    'book-heart':                   BookHeart,
    'book-marked':                  BookMarked,
    'ellipsis':                     Ellipsis,
    'ellipsis-vertical':            EllipsisVertical,
}

/** Icône générique depuis un nom material-symbols (sans préfixe) */
export function Icon({ name, size = 16, className = '' }: { name: string; size?: number; className?: string }) {
    const LucideIcon = ICON_MAP[name] ?? FileText
    return <LucideIcon size={size} className={className} />
}

/** Map type de cellule → nom d'icône */
export const CELL_TYPE_ICON: Record<string, string> = {
    markdown:           'edit-note',
    source:             'folder-open',
    uiParameter:        'tune',
    buttonRunNextCells: 'play-circle',
    sqlRecursiveParse:  'storage',
    table:              'table',
    iframe:             'web',
    sqlStat:            'monitoring',
    publipostageWord:   'description',
    pdfme:              'picture-as-pdf',
    echart:             'bar-chart',
    perspective:        'analytics',
}

/** Icône pour un type de cellule */
export function CellTypeIcon({ type, size = 16 }: { type: string; size?: number }) {
    return <Icon name={CELL_TYPE_ICON[type] ?? 'description'} size={size} />
}
