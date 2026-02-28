// @ts-nocheck

export function generateGistPassphraseModalHTML() {
    return `
    <div class="min-h-screen flex items-center justify-center p-4 bg-base-200" x-data="gistPassphraseModal()" x-init="init()">
<div class="modal modal-open">
    <div class="modal-box max-w-md">
        <h3 class="font-bold text-lg flex items-center gap-2"><span class="iconify" data-icon="material-symbols-light:lock" style="font-size:1.25rem"></span> Configuration chiffrée</h3>
        <p class="py-2 text-sm text-base-content/70">
            Cette configuration est protégée par un mot de passe. Entrez-le pour charger les données.
        </p>
        <div class="form-control mt-4">
            <label class="label"><span class="label-text">Passphrase</span></label>
            <input type="password" x-model="passphrase" placeholder="68cd597ba5da05ceba24fb975c05384f"
                class="input input-bordered w-full font-mono"
                @keydown.enter="unlock()"
                autocomplete="current-password">
        </div>
        <div x-show="error" class="alert alert-error mt-3">
            <span x-text="error"></span>
        </div>
        <div class="modal-action flex-wrap gap-2">
            <button class="btn btn-ghost btn-sm" @click="useDefaultConfig()" x-show="(typeof window !== 'undefined' && window._encryptedSource !== 'html')">Utiliser la config par défaut</button>
            <button class="btn btn-primary" @click="unlock()" :disabled="loading">
                <span x-show="!loading">Déchiffrer</span>
                <span x-show="loading" class="loading loading-spinner loading-sm"></span>
            </button>
        </div>
    </div>
    <form method="dialog" class="modal-backdrop"><button type="button">close</button></form>
</div>
    </div>`;
}

export function generateAppHTML() {
    return `
    <div x-data="notebookApp()" x-init="init()" @keydown.window.ctrl.comma.prevent="showLayout = !showLayout" class="drawer drawer-end">
<input id="mobile-drawer" type="checkbox" class="drawer-toggle" />
<div class="drawer-side">
    <label for="mobile-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
    <ul class="menu bg-base-200 min-h-full w-80 p-4 pt-20">
        <!-- Onglets de pages mobile -->
        <li class="menu-title">Pages</li>
        <template x-for="(page, index) in pages" :key="page._id">
            <li x-data="{ editing: false, tempName: '' }">
                <div class="flex items-center justify-between w-full">
                    <a @click="activatePage(index); document.getElementById('mobile-drawer').checked = false;"
                       @dblclick="if (devMode) { editing = true; tempName = page.name; $nextTick(() => $refs.input.select()); }"
                       x-show="!editing"
                       :class="activePageIndex === index ? 'active' : ''"
                       x-text="page.name"></a>
                    <input x-show="editing"
                           x-ref="input"
                           type="text"
                           class="input input-xs input-bordered w-32"
                           x-model="tempName"
                           @keydown.enter="page.name = tempName; editing = false; saveToLocalStorage();"
                           @keydown.escape="editing = false"
                           @blur="page.name = tempName; editing = false; saveToLocalStorage();">
                    <button x-show="devMode && pages.length > 1 && !editing"
                            @click.stop="deletePage(index)"
                            class="btn btn-ghost btn-xs"
                            title="Supprimer la page">
                        <span class="iconify" data-icon="material-symbols-light:close" style="font-size:1rem"></span>
                    </button>
                </div>
            </li>
        </template>
        <li x-show="devMode">
            <button @click="addPage()" class="btn btn-ghost btn-sm">
                <span class="iconify" data-icon="material-symbols-light:add" style="font-size:1rem"></span> Ajouter une page
            </button>
        </li>
        <li class="divider"></li>
        <li x-show="devMode">
            <button class="btn btn-sm" @click="runAllGroups(); document.getElementById('mobile-drawer').checked = false;" :disabled="isLoading"><span class="iconify" data-icon="material-symbols-light:play-arrow" style="font-size:1rem"></span> Tout exécuter</button>
        </li>
        <template x-if="devMode">
            <li>
                <a><span class="iconify" data-icon="material-symbols-light:upload" style="font-size:1rem"></span> Export</a>
                <ul class="p-2">
                    <li><button @click="openExportModal('html'); document.getElementById('mobile-drawer').checked = false;" :disabled="isLoading"><span class="iconify" data-icon="material-symbols-light:save" style="font-size:1rem"></span> HTML</button></li>
                    <li><button @click="openExportModal('json'); document.getElementById('mobile-drawer').checked = false;"><span class="iconify" data-icon="material-symbols-light:data-object" style="font-size:1rem"></span> JSON</button></li>
                    <li><button @click="openExportModal('base64'); document.getElementById('mobile-drawer').checked = false;"><span class="iconify" data-icon="material-symbols-light:lock" style="font-size:1rem"></span> Base64</button></li>
                    <li><button @click="openExportModal('gist'); document.getElementById('mobile-drawer').checked = false;" :disabled="isLoading"><span class="iconify" data-icon="material-symbols-light:share" style="font-size:1rem"></span> Partager via Gist</button></li>
                </ul>
            </li>
        </template>
        <template x-if="devMode">
            <li>
                <label class="cursor-pointer">
                    <span class="iconify" data-icon="material-symbols-light:folder-open" style="font-size:1rem"></span> Import JSON
                    <input type="file" accept=".json" @change="loadConfig($event); document.getElementById('mobile-drawer').checked = false;" hidden>
                </label>
            </li>
        </template>
    </ul>
</div>
<div class="drawer-content">
<!-- Header fixe -->
<div  class="navbar fixed top-0 left-0 right-0 z-50 bg-base-100 shadow-sm" x-show="showLayout">
    <div class="navbar-start">
        <a href="https://ihatexcel.github.io/sqljob/?gist=68cd597ba5da05ceba24fb975c05384f" target="_blank"class="btn btn-ghost text-xl flex items-center gap-2">
            <img src="https://raw.githubusercontent.com/ihatexcel/sqljob/main/ihatexcel.svg" 
                alt="I Hate Excel" 
                class="h-8 w-8">
            sqljob
        </a>
    </div>
    
    <!-- Tabs pour les pages (centre de la navbar) -->
    <div class="navbar-center hidden lg:flex">
        <div role="tablist" class="tabs tabs-lifted" style="vertical-align: middle;">
            <template x-for="(page, index) in pages" :key="page._id">
                <div class="flex items-center gap-1" 
                     x-data="{ editing: false, tempName: '' }"
                     :draggable="devMode"
                     @dragstart="startPageDrag(index, $event)"
                     @dragover="onPageDragOver(index, $event)"
                     @dragleave="onPageDragLeave()"
                     @drop="onPageDrop(index, $event)"
                     @dragend="endPageDrag()"
                     :class="{ 'opacity-50': draggedPageIndex === index, 'ring-2 ring-primary': dragOverPageIndex === index }">
                    <a role="tab" 
                       class="tab"
                       :class="activePageIndex === index ? 'tab-active' : ''"
                       @click="activatePage(index)"
                       @dblclick="if (devMode) { editing = true; tempName = page.name; $nextTick(() => $refs.input.select()); }"
                       x-show="!editing"
                       x-text="page.name"
                       :style="devMode ? 'cursor: grab' : ''"></a>
                    
                    <input x-show="editing"
                           x-ref="input"
                           type="text"
                           class="input input-xs input-bordered w-32"
                           x-model="tempName"
                           @keydown.enter="page.name = tempName; editing = false; saveToLocalStorage();"
                           @keydown.escape="editing = false"
                           @blur="page.name = tempName; editing = false; saveToLocalStorage();">
                    <button x-show="devMode && pages.length > 1"
                            @click.stop="deletePage(index)"
                            class="btn btn-ghost btn-xs -ml-2"
                            title="Supprimer la page">
                        <span class="iconify" data-icon="material-symbols-light:close" style="font-size:1rem"></span>
                    </button>
                </div>
            </template>
            <button x-show="devMode"
                    @click="addPage()"
                    class="btn btn-ghost btn-sm self-center"
                    title="Ajouter une page">
                <span class="iconify" data-icon="material-symbols-light:add" style="font-size:1rem"></span>
            </button>
        </div>
    </div>
    
    <!-- Boutons d'action desktop -->
    <div class="navbar-end flex items-center gap-2">
        <!-- Menu hamburger mobile -->
        <label for="mobile-drawer" class="btn btn-ghost drawer-button lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </label>
        <button x-show="devMode" class="btn btn-sm btn-primary hidden lg:flex" @click="runAllGroups()" :disabled="isLoading">
            <span class="iconify" data-icon="material-symbols-light:play-arrow" style="font-size:1rem"></span> Tout exécuter
        </button>
        <template x-if="devMode">
            <div class="join hidden lg:flex">
                <!-- Mode dev : menu export complet -->
                <div class="join-item dropdown dropdown-end">
                    <div tabindex="0" role="button" class="btn btn-sm join-item">
                        <span class="iconify" data-icon="material-symbols-light:upload" style="font-size:1rem"></span> Export
                    </div>
                    <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                        <li><button @click="openExportModal('html')" :disabled="isLoading"><span class="iconify" data-icon="material-symbols-light:save" style="font-size:1rem"></span> HTML</button></li>
                        <li><button @click="openExportModal('json')"><span class="iconify" data-icon="material-symbols-light:data-object" style="font-size:1rem"></span> JSON</button></li>
                        <li><button @click="openExportModal('base64')"><span class="iconify" data-icon="material-symbols-light:lock" style="font-size:1rem"></span> Base64</button></li>
                        <li><button @click="openExportModal('gist')" :disabled="isLoading"><span class="iconify" data-icon="material-symbols-light:share" style="font-size:1rem"></span> Partager via Gist</button></li>
                    </ul>
                </div>
                <!-- Import JSON : seulement en mode dev -->
                <label class="btn join-item btn-sm cursor-pointer">
                    <span class="iconify" data-icon="material-symbols-light:folder-open" style="font-size:1rem"></span> Import JSON
                    <input type="file" accept=".json" @change="loadConfig($event)" hidden>
                </label>
            </div>
        </template>
    </div>
</div>
<div class="max-w-7xl mx-auto px-4 mt-6 pb-8" :class="showLayout ? 'pt-16' : 'pt-0'">
    <div class="flex flex-col" :class="devMode ? 'gap-4' : 'gap-0'">
        <!-- Rendu unifié de tous les groupes de niveau 0 (toutes pages, x-show pour conserver le DOM) -->
        <template x-for="item in getFlattenedGroupsForAllPages()" :key="item.uniqueKey">
            <div x-show="activePageIndex === item.pageIndex">
			<!-- Séparateur avant le groupe -->
                <div
                x-show="devMode && !item.isFirst && !draggedCellPath && !draggedChildPath"
                @click="openInsertGroupModal(item.path[0])"
                class="group relative flex items-center justify-center
                        h-2 my-[-0.25rem] cursor-pointer z-10 mb-4"
                >
                <!-- Ligne -->
                <div
                class="absolute left-1/2 -translate-x-1/2
                        h-[2px] w-3/5 rounded
                        bg-primary
                        opacity-0
                        transition-all duration-200
                        group-hover:w-4/5
                        group-hover:opacity-100">
                </div>

                <!-- Bouton + -->
                <button
                    type="button"
                    title="Insérer un groupe ici"
                    class="btn btn-circle btn-xs
                        opacity-0 scale-90
                        transition-all duration-200
                        group-hover:opacity-100
                        group-hover:scale-100
                        z-20"
                >
                    +
                </button>
                </div>
                
                <!-- Groupe niveau 0 (même structure que sous-groupe) -->
                <div class="flex-1 rounded-lg overflow-hidden" :class="(devMode || item.group.accordion) ? 'bg-base-100 border border-base-300 hover:border-primary transition-all duration-200 shadow-sm hover:shadow-md' : 'border border-transparent'" x-show="shouldShowGroup(item.group)">
                    
                    <!-- Header du groupe -->
                    <div class="flex items-center justify-between gap-2 py-2 px-4 bg-primary/10 border-b border-base-300" x-show="devMode">
                        <div class="join">
                            <button class="btn btn-xs join-item" @click="toggleGroupDirection(item.path)" :title="item.group.direction === 'column' ? 'Passer en ligne' : 'Passer en colonne'">
                                <span class="iconify" :data-icon="item.group.direction === 'column' ? 'material-symbols-light:swap-vert' : 'material-symbols-light:swap-horiz'" style="font-size:1rem"></span>
                            </button>
                            <button class="btn btn-xs join-item" :class="item.group.loop?.enabled ? 'btn-info' : ''" @click="openLoopConfigModal(item.path)" title="Configurer la boucle"><span class="iconify" data-icon="material-symbols-light:autorenew" style="font-size:1rem"></span></button>
                            <button class="btn btn-xs join-item" :class="item.group.accordion ? 'btn-accent' : ''" @click="openGroupSettingsModal(item.path)" title="Paramètres du groupe"><span class="iconify" data-icon="material-symbols-light:settings" style="font-size:1rem"></span></button>
                            <button class="btn btn-xs btn-success join-item" @click="runGroupAtPath(item.path)" :disabled="isLoading" title="Exécuter"><span class="iconify" data-icon="material-symbols-light:play-arrow" style="font-size:1rem"></span></button>
                            <button class="btn btn-xs join-item" @click="moveGroupAtPath(item.path, -1)" :disabled="item.isFirst" title="Monter"><span class="iconify" data-icon="material-symbols-light:arrow-upward" style="font-size:1rem"></span></button>
                            <button class="btn btn-xs join-item" @click="moveGroupAtPath(item.path, 1)" :disabled="item.isLast" title="Descendre"><span class="iconify" data-icon="material-symbols-light:arrow-downward" style="font-size:1rem"></span></button>
                            <button class="btn btn-xs join-item" @click="addNestedGroup(item.path)" title="Ajouter un sous-groupe"><span class="iconify" data-icon="material-symbols-light:create-new-folder" style="font-size:1rem"></span></button>
                            <button class="btn btn-xs join-item" @click="openAddCellToGroupModal(item.path)" title="Ajouter une cellule"><span class="iconify" data-icon="material-symbols-light:add" style="font-size:1rem"></span></button>
                            <button class="btn btn-xs btn-error join-item" @click="deleteGroupAtPath(item.path)" title="Supprimer"><span class="iconify" data-icon="material-symbols-light:delete" style="font-size:1rem"></span></button>
                        </div>
                        <div class="dropdown hidden">
                            <div tabindex="0" role="button" class="btn btn-xs"><span class="iconify" data-icon="material-symbols-light:more-vert" style="font-size:1rem"></span></div>
                            <ul tabindex="-1" class="dropdown-content menu menu-xs bg-base-100 rounded-box z-[1] w-48 p-2 shadow-sm">
                                <li><button @click="toggleGroupDirection(item.path)"><span class="iconify" :data-icon="item.group.direction === 'column' ? 'material-symbols-light:swap-vert' : 'material-symbols-light:swap-horiz'" style="font-size:1rem"></span> <span x-text="item.group.direction === 'column' ? 'Passer en ligne' : 'Passer en colonne'"></span></button></li>
                                <li><button @click="openLoopConfigModal(item.path)"><span class="iconify" data-icon="material-symbols-light:autorenew" style="font-size:1rem"></span> Configurer la boucle</button></li>
                                <li><button @click="openGroupSettingsModal(item.path)"><span class="iconify" data-icon="material-symbols-light:settings" style="font-size:1rem"></span> Paramètres du groupe</button></li>
                                <li><button @click="runGroupAtPath(item.path)" :disabled="isLoading"><span class="iconify" data-icon="material-symbols-light:play-arrow" style="font-size:1rem"></span> Exécuter</button></li>
                                <li><button @click="moveGroupAtPath(item.path, -1)" :disabled="item.isFirst"><span class="iconify" data-icon="material-symbols-light:arrow-upward" style="font-size:1rem"></span> Monter</button></li>
                                <li><button @click="moveGroupAtPath(item.path, 1)" :disabled="item.isLast"><span class="iconify" data-icon="material-symbols-light:arrow-downward" style="font-size:1rem"></span> Descendre</button></li>
                                <li><button @click="addNestedGroup(item.path)"><span class="iconify" data-icon="material-symbols-light:create-new-folder" style="font-size:1rem"></span> Ajouter un sous-groupe</button></li>
                                <li><button @click="openAddCellToGroupModal(item.path)"><span class="iconify" data-icon="material-symbols-light:add" style="font-size:1rem"></span> Ajouter une cellule</button></li>
                                <li><button class="text-error" @click="deleteGroupAtPath(item.path)"><span class="iconify" data-icon="material-symbols-light:delete" style="font-size:1rem"></span> Supprimer</button></li>
                            </ul>
                        </div>
                    </div>
                    
                    <!-- Bande accordion (visible quand accordion activé) -->
                    <div x-show="item.group.accordion" 
                         @click="toggleAccordion(item.path)"
                         class="flex items-center gap-2 py-2 px-4 bg-base-200 border-b border-base-300 cursor-pointer select-none hover:bg-base-300 transition-colors duration-200">
                        <span class="text-sm transition-transform duration-200" :class="item.group.accordionOpen ? 'rotate-90' : ''">▶</span>
                        <span class="font-semibold text-sm" x-text="item.group.title || ''"></span>
                    </div>

                    <!-- Contenu du groupe -->
                    <div class="p-1" x-show="!item.group.accordion || item.group.accordionOpen" x-collapse
                         x-data="{ _activeTabKey: null }"
                         x-init="if (item.group.tabsChild) { const items = getAllItemsSorted(item.group); if (items.length > 0) _activeTabKey = (items[0].type === 'cell' ? 'c-' : 'g-') + items[0].originalIndex; }">
                        <!-- Barre d'onglets (mode client + tabsChild) -->
                        <div x-show="!devMode && item.group.tabsChild" role="tablist" class="tabs tabs-box mb-2">
                            <template x-for="(tabItem, tabIdx) in getAllItemsSorted(item.group)" :key="'tab-' + (tabItem.type === 'cell' ? 'c-' : 'g-') + tabItem.originalIndex">
                                <a role="tab" class="tab"
                                   :class="{ 'tab-active': _activeTabKey === ((tabItem.type === 'cell' ? 'c-' : 'g-') + tabItem.originalIndex) }"
                                   @click="_activeTabKey = (tabItem.type === 'cell' ? 'c-' : 'g-') + tabItem.originalIndex"
                                   x-text="getTabName(tabItem, tabIdx)"></a>
                            </template>
                        </div>
                        <div class="flex gap-2" :class="(!devMode && item.group.tabsChild) ? 'flex-col' : ((item.group.direction || 'row') === 'row' ? 'flex-row flex-wrap' : 'flex-col')" :style="item.group.style">
                            <!-- Cellules du groupe (triées par _order) - Niveau 0 -->
                        <template x-for="cellItem in getSortedCells(item.group)" :key="cellItem.cell._id">
                            <div class="flex flex-1" 
                                :class="getCellSizeOuterClass(cellItem.cell, (item.group.direction || 'row') === 'column')"
                                x-show="shouldShowCell(cellItem.cell) && (devMode || !item.group.tabsChild || _activeTabKey === ('c-' + cellItem.originalIndex))"
                                :style="getCellWrapperStyle(cellItem.cell, (item.group.direction || 'row') === 'column', cellItem.cell._order ?? 0)"
                            >
                                <div class="bg-base-100 rounded-lg overflow-hidden transition-[border-color,box-shadow] duration-200 cell-container" 
                                     :class="[getCellSizeInnerClass(), cellItem.cell.border !== false ? 'border border-base-300 shadow-sm hover:border-primary hover:shadow-lg' : 'border-0 shadow-none', {
                                         'border-warning shadow-[0_0_10px_rgba(251,191,36,0.3)]': cellItem.cell.border !== false && cellItem.cell._status === 'running', 
                                         'border-success': cellItem.cell.border !== false && cellItem.cell._status === 'success', 
                                         'border-error': cellItem.cell.border !== false && cellItem.cell._status === 'error'
                                     }]">
                                ${CellRenderer.renderCell('item.path', 'cellItem.originalIndex', 'item.group')}
                            </div>
                            </div>
                        </template>
                        
                        <!-- Sous-groupes récursifs (nombre de niveaux illimité) -->
                        <template x-for="childItem in getSortedChildren(item.group)" :key="childItem.child._id || ('child-' + childItem.originalIndex)">
                            <div class="flex-1 bg-base-100 border border-base-300 rounded-lg overflow-hidden transition-all duration-200 shadow-sm hover:border-primary hover:shadow-md"
                                 :class="(item.group.direction || 'row') === 'column' ? 'w-full' : 'min-w-[200px]'"
                                 x-show="shouldShowGroup(childItem.child) && (devMode || !item.group.tabsChild || _activeTabKey === ('g-' + childItem.originalIndex))"
                                 :style="'order: ' + (childItem.child._order ?? 0)"
                                 x-data="{ _childPath: [...item.path, childItem.originalIndex] }"
                                 x-html="renderChildGroupHTML(childItem.child, _childPath, item.group, childItem.originalIndex)"
                                 x-effect="$nextTick(() => Alpine.initTree($el))">
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            </div>
        </template>
    </div>
    
    <div x-show="devMode" class="flex justify-center p-4">
        <button class="btn btn-primary btn-sm" @click="openAddGroupModal()">
            <span class="iconify" data-icon="material-symbols-light:add" style="font-size:1rem"></span> Ajouter un groupe
        </button>
    </div>
</div>

<!-- Modal ajout groupe -->
<template x-if="showAddGroupModal">
    <div class="modal modal-open" @click.self="showAddGroupModal = false" role="presentation">
        <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-add-group-title"
             x-trap.noscroll="showAddGroupModal">
            <div class="flex items-center justify-between gap-2">
                <h3 class="text-lg font-semibold flex items-center gap-2" id="modal-add-group-title"><span class="iconify" data-icon="material-symbols-light:add" style="font-size:1.25rem"></span> Ajouter un groupe</h3>
                <button class="btn btn-sm btn-ghost" @click="showAddGroupModal = false" x-focus="showAddGroupModal"><span class="iconify" data-icon="material-symbols-light:close" style="font-size:1rem"></span></button>
            </div>
            <div class="mt-4">
                <p class="text-sm text-base-content/60 mb-4">Choisissez le type de cellule pour le nouveau groupe :</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <template x-for="cellType in cellTypes" :key="cellType.type">
                        <button class="btn justify-start" @click="addGroup(cellType.type)">
                            <span x-html="cellType.icon"></span>
                            <span x-text="cellType.label"></span>
                        </button>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- Modal configuration moteur DB -->
<template x-if="showDbEngineModal">
    <div class="modal modal-open z-[2100]" @click.self="showDbEngineModal = false" role="presentation">
        <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-db-engine-title"
             x-trap.noscroll="showDbEngineModal">
            <div class="flex items-center justify-between gap-2">
                <h3 class="text-lg font-semibold flex items-center gap-2" id="modal-db-engine-title"><span class="iconify" data-icon="material-symbols-light:settings" style="font-size:1.25rem"></span> Configuration job générale</h3>
                <button class="btn btn-sm btn-ghost" @click="showDbEngineModal = false"><span class="iconify" data-icon="material-symbols-light:close" style="font-size:1rem"></span></button>
            </div>
            <div class="mt-4 space-y-4">
                <p class="text-sm text-base-content/60">Choisissez le moteur SQL pour ce notebook :</p>
                
                <!-- DuckDB WASM -->
                <div class="card bg-base-200 cursor-pointer transition-all"
                     :class="dbEngine === 'duckdb-wasm' ? 'ring-2 ring-primary' : 'hover:bg-base-300'"
                     @click="switchDbEngine('duckdb-wasm'); showDbEngineModal = false">
                    <div class="card-body p-4">
                        <div class="flex items-center gap-3">
                            <input type="radio" name="dbEngine" value="duckdb-wasm" 
                                   class="radio radio-primary" :checked="dbEngine === 'duckdb-wasm'">
                            <div>
                                <h4 class="font-semibold">🦆 DuckDB WASM</h4>
                                <p class="text-sm text-base-content/60">Moteur complet avec support fichiers, extensions Excel, etc.</p>
                                <div class="flex gap-2 mt-1">
                                    <span class="badge badge-success badge-sm">Fichiers</span>
                                    <span class="badge badge-success badge-sm">Extensions</span>
                                    <span class="badge badge-warning badge-sm">~10MB</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Ducklings -->
                <div class="card bg-base-200 cursor-pointer transition-all"
                     :class="[
                         dbEngine === 'ducklings' ? 'ring-2 ring-primary' : 'hover:bg-base-300',
                         !canUseDucklings() ? 'opacity-50 cursor-not-allowed' : ''
                     ]"
                     @click="canUseDucklings() && (switchDbEngine('ducklings'), showDbEngineModal = false)">
                    <div class="card-body p-4">
                        <div class="flex items-center gap-3">
                            <input type="radio" name="dbEngine" value="ducklings" 
                                   class="radio radio-primary" :checked="dbEngine === 'ducklings'" :disabled="!canUseDucklings()">
                            <div>
                                <h4 class="font-semibold">🐤 Ducklings</h4>
                                <p class="text-sm text-base-content/60">Moteur léger pour notebooks "calculette" sans fichiers.</p>
                                <div class="flex gap-2 mt-1">
                                    <span class="badge badge-error badge-sm">Pas de fichiers</span>
                                    <span class="badge badge-error badge-sm">Pas d'extensions</span>
                                    <span class="badge badge-success badge-sm">~2MB</span>
                                </div>
                                <template x-if="!canUseDucklings()">
                                    <p class="text-xs text-error mt-2">⚠️ Ce notebook contient des cellules source. Supprimez-les pour utiliser Ducklings.</p>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="divider"></div>
                
                <!-- DAG (rafraîchissement automatique) -->
                <div class="flex items-center justify-between gap-4 p-4 rounded-lg bg-base-200">
                    <div>
                        <h4 class="font-semibold flex items-center gap-2">
                            <span class="iconify" data-icon="material-symbols-light:account-tree" style="font-size:1.25rem"></span>
                            DAG (graphe acyclique dirigé)
                        </h4>
                        <p class="text-sm text-base-content/60 mt-1">Les cellules dépendantes se rafraîchissent automatiquement.</p>
                    </div>
                    <input type="checkbox" class="toggle toggle-primary" 
                           :checked="directedAcyclicGraph"
                           @change="directedAcyclicGraph = !directedAcyclicGraph">
                </div>

                <div class="divider"></div>
                <div class="text-xs text-base-content/50">
                    <p><strong>Moteur actuel :</strong> <span x-text="dbEngine === 'ducklings' ? 'Ducklings' : 'DuckDB WASM'"></span></p>
                    <p class="mt-1">Le changement de moteur réinitialise la base de données.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- Modal ajout cellule à un groupe -->
<template x-if="addCellToGroupModal.open">
    <div class="modal modal-open z-[2100]" @click.self="addCellToGroupModal.open = false" role="presentation">
        <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-add-cell-title"
             x-trap.noscroll="addCellToGroupModal.open">
            <div class="flex items-center justify-between gap-2">
                <h3 class="text-lg font-semibold flex items-center gap-2" id="modal-add-cell-title"><span class="iconify" data-icon="material-symbols-light:add" style="font-size:1.25rem"></span> Ajouter une cellule au groupe</h3>
                <button class="btn btn-sm btn-ghost" @click="addCellToGroupModal.open = false" x-focus="addCellToGroupModal.open"><span class="iconify" data-icon="material-symbols-light:close" style="font-size:1rem"></span></button>
            </div>
            <div class="mt-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <template x-for="cellType in cellTypes" :key="cellType.type">
                        <button class="btn justify-start" 
                                @click="addCellToGroup(addCellToGroupModal.path ?? addCellToGroupModal.groupIndex, cellType.type)">
                            <span x-html="cellType.icon"></span>
                            <span x-text="cellType.label"></span>
                        </button>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- Modal insertion groupe entre deux groupes -->
<template x-if="insertGroupModal.open">
    <div class="modal modal-open" @click.self="insertGroupModal.open = false" role="presentation">
        <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-insert-group-title"
             x-trap.noscroll="insertGroupModal.open">
            <div class="flex items-center justify-between gap-2">
                <h3 class="text-lg font-semibold flex items-center gap-2" id="modal-insert-group-title"><span class="iconify" data-icon="material-symbols-light:add" style="font-size:1.25rem"></span> Insérer un groupe à la position <span x-text="insertGroupModal.atIndex + 1"></span></h3>
                <button class="btn btn-sm btn-ghost" @click="insertGroupModal.open = false" x-focus="insertGroupModal.open"><span class="iconify" data-icon="material-symbols-light:close" style="font-size:1rem"></span></button>
            </div>
            <div class="mt-4">
                <p class="text-sm text-base-content/60 mb-4">Choisissez le type de cellule pour le nouveau groupe :</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <template x-for="cellType in cellTypes" :key="cellType.type">
                        <button class="btn justify-start" @click="insertGroupAt(insertGroupModal.atIndex, cellType.type)">
                            <span x-html="cellType.icon"></span>
                            <span x-text="cellType.label"></span>
                        </button>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- Modal insertion cellule entre deux cellules -->
<template x-if="insertCellModal.open">
    <div class="modal modal-open" @click.self="insertCellModal.open = false" role="presentation">
        <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-insert-cell-title"
             x-trap.noscroll="insertCellModal.open">
            <div class="flex items-center justify-between gap-2">
                <h3 class="text-lg font-semibold flex items-center gap-2" id="modal-insert-cell-title"><span class="iconify" data-icon="material-symbols-light:add" style="font-size:1.25rem"></span> Insérer une cellule à la position <span x-text="insertCellModal.atCellIndex + 1"></span></h3>
                <button class="btn btn-sm btn-ghost" @click="insertCellModal.open = false" x-focus="insertCellModal.open"><span class="iconify" data-icon="material-symbols-light:close" style="font-size:1rem"></span></button>
            </div>
            <div class="mt-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <template x-for="cellType in cellTypes" :key="cellType.type">
                        <button class="btn justify-start" @click="insertCellAt(insertCellModal.groupIndex, insertCellModal.atCellIndex, cellType.type)">
                            <span x-html="cellType.icon"></span>
                            <span x-text="cellType.label"></span>
                        </button>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- Modal configuration loop -->
<template x-if="loopConfigModal.open">
    <div class="modal modal-open z-[2100]" @click.self="loopConfigModal.open = false" role="presentation">
        <div class="modal-box max-w-2xl" role="dialog" aria-modal="true" aria-labelledby="modal-loop-config-title"
             x-trap.noscroll="true">
            <div class="flex items-center justify-between gap-2">
                <h3 class="text-lg font-semibold flex items-center gap-2" id="modal-loop-config-title"><span class="iconify" data-icon="material-symbols-light:autorenew" style="font-size:1.25rem"></span> Configuration de la boucle</h3>
                <button class="btn btn-sm btn-ghost" @click="loopConfigModal.open = false"><span class="iconify" data-icon="material-symbols-light:close" style="font-size:1rem"></span></button>
            </div>
            <div class="mt-4">
                <div class="form-control mb-4">
                    <label class="label cursor-pointer justify-start gap-3">
                        <input type="checkbox" class="toggle toggle-primary" x-model="getGroupAtPath(loopConfigModal.path).loop.enabled" />
                        <span class="label-text">Activer la boucle sur ce groupe</span>
                    </label>
                </div>
                
                <div x-show="getGroupAtPath(loopConfigModal.path).loop.enabled" x-transition>
                    <div class="alert alert-info mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <div>
                            <p class="text-sm">La requête doit retourner une colonne. Chaque valeur de la première colonne sera utilisée comme variable <code class="badge badge-neutral">$loop</code> pour chaque itération du groupe.</p>
                        </div>
                    </div>
                    
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold">Requête SQL de la boucle</span>
                        </label>
                        <textarea 
                            class="textarea textarea-bordered w-full font-mono min-h-32 text-sm"
                            x-model="getGroupAtPath(loopConfigModal.path).loop.query"
                            placeholder="SELECT DISTINCT colonne FROM source1 LIMIT 10;"></textarea>
                    </div>
                    
                    <div class="mt-2 mb-4">
                        <button class="btn btn-sm btn-outline" @click="getGroupAtPath(loopConfigModal.path).loop.query = getDefaultLoopQuery()">
                            <span class="iconify" data-icon="material-symbols-light:article" style="font-size:1rem"></span> Requête par défaut
                        </button>
                    </div>

                    <div class="divider"></div>

                    <!-- Option ZIP -->
                    <div class="form-control mb-4">
                        <label class="label cursor-pointer justify-start gap-3">
                            <input type="checkbox" class="toggle toggle-secondary" x-model="getGroupAtPath(loopConfigModal.path).loop.zip" />
                            <span class="label-text"><span class="iconify" data-icon="material-symbols-light:archive" style="font-size:1rem"></span> Zipper les fichiers générés</span>
                        </label>
                        <p class="text-xs text-base-content/60 ml-12">Les fichiers produits (SQL COPY, Publipostage Word, pdfme) seront regroupés dans un ZIP à la fin de la boucle.</p>
                    </div>

                    <div x-show="getGroupAtPath(loopConfigModal.path).loop.zip" x-transition>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text font-semibold">Requête SQL pour le nom du fichier ZIP</span>
                            </label>
                            <textarea 
                                class="textarea textarea-bordered w-full font-mono min-h-16 text-sm"
                                x-model="getGroupAtPath(loopConfigModal.path).loop.zipQuery"
                                placeholder="SELECT 'export.zip' as filename;"></textarea>
                        </div>
                        
                        <div class="mt-2">
                            <button class="btn btn-sm btn-outline" @click="getGroupAtPath(loopConfigModal.path).loop.zipQuery = getDefaultZipQuery()">
                                <span class="iconify" data-icon="material-symbols-light:article" style="font-size:1rem"></span> Requête par défaut
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-action">
                <button class="btn" @click="loopConfigModal.open = false">Fermer</button>
            </div>
        </div>
    </div>
</template>

<!-- Modal paramètres du groupe (accordion, title, accordionOpen) -->
<template x-if="groupSettingsModal.open">
    <div class="modal modal-open z-[2100]" :key="'group-settings-' + (groupSettingsModal.path || []).join('-')" @click.self="groupSettingsModal.open = false" role="presentation">
        <div class="modal-box max-w-lg" role="dialog" aria-modal="true" aria-labelledby="modal-group-settings-title"
             x-trap.noscroll="groupSettingsModal.open">
            <div class="flex items-center justify-between gap-2">
                <h3 class="text-lg font-semibold flex items-center gap-2" id="modal-group-settings-title"><span class="iconify" data-icon="material-symbols-light:settings" style="font-size:1.25rem"></span> Paramètres du groupe</h3>
                <button class="btn btn-sm btn-ghost" @click="groupSettingsModal.open = false"><span class="iconify" data-icon="material-symbols-light:close" style="font-size:1rem"></span></button>
            </div>
            <div class="mt-4">
                <div class="form-control mb-4">
                    <label class="label cursor-pointer justify-start gap-3">
                        <input type="checkbox" class="toggle toggle-primary" x-model="getGroupAtPath(groupSettingsModal.path).accordion" />
                        <span class="label-text">Activer le mode accordion</span>
                    </label>
                    <p class="text-xs text-base-content/60 ml-12">Affiche une bande cliquable permettant de replier/déplier le contenu du groupe.</p>
                </div>
                
                <div x-show="getGroupAtPath(groupSettingsModal.path).accordion" x-transition>
                    <div class="form-control mb-4">
                        <label class="label">
                            <span class="label-text font-semibold">Titre du groupe</span>
                        </label>
                        <input type="text" 
                            class="input input-bordered w-full"
                            x-model="getGroupAtPath(groupSettingsModal.path).title"
                            placeholder="Titre affiché dans la bande accordion" />
                    </div>
                    
                    <div class="form-control mb-4">
                        <label class="label cursor-pointer justify-start gap-3">
                            <input type="checkbox" class="toggle toggle-secondary" x-model="getGroupAtPath(groupSettingsModal.path).accordionOpen" />
                            <span class="label-text">Ouvert par défaut</span>
                        </label>
                        <p class="text-xs text-base-content/60 ml-12">Si désactivé, le groupe sera replié au chargement de la page.</p>
                    </div>
                </div>

                <div class="divider"></div>

                <!-- tabsChild : afficher les enfants directs en onglets (mode client) -->
                <div class="form-control mb-4">
                    <label class="label cursor-pointer justify-start gap-3">
                        <input type="checkbox" class="toggle toggle-primary" x-model="getGroupAtPath(groupSettingsModal.path).tabsChild" />
                        <span class="label-text">Afficher les enfants en onglets (tabsChild)</span>
                    </label>
                    <p class="text-xs text-base-content/60 ml-12">En mode client : les cellules et groupes directs seront affichés dans des onglets DaisyUI. Configurez le nom des onglets sur chaque cellule/groupe.</p>
                </div>
                <div class="form-control mb-4">
                    <label class="label">
                        <span class="label-text font-semibold">Nom du groupe (pour onglet)</span>
                    </label>
                    <input type="text" 
                        class="input input-bordered w-full"
                        x-model="getGroupAtPath(groupSettingsModal.path).name"
                        placeholder="Libellé de l'onglet lorsque ce groupe est enfant d'un groupe avec tabsChild" />
                </div>

                <div class="divider"></div>

                <!-- queries.main : condition d'affichage en mode client -->
                <div class="form-control mb-4">
                    <label class="label gap-2">
                        <span class="label-text font-semibold">Condition d'affichage (queries.main)</span>
                        <span class="tooltip tooltip-bottom" data-tip="En mode client : si la requête retourne true, le groupe est affiché ; si null ou false, le groupe est caché.">
                            <span class="badge badge-sm cursor-help">?</span>
                        </span>
                    </label>
                    <p class="text-xs text-base-content/60 mb-2">Requête SQL ou JS. Si définie, le groupe ne sera affiché en mode client que si le résultat est truthy.</p>
                    <div class="rounded-lg border border-base-300 p-3 bg-base-200/50">
                        <div class="form-control mb-2">
                            <label class="label py-1">
                                <span class="label-text text-sm">Type de langage</span>
                            </label>
                            <select class="select select-bordered select-sm w-full" 
                                    :value="(ConfigManager.getGroupIfQuery(getGroupAtPath(groupSettingsModal.path))?.engine || 'sql')"
                                    @change="(() => { const g = getGroupAtPath(groupSettingsModal.path); const q = ConfigManager.ensureGroupQueries(g); if (q) { g._cmEditor_ifQuery?.destroy(); g._cmEditor_ifQuery = null; q.engine = $event.target.value; } })()">
                                <option value="sql">SQL</option>
                                <option value="js">JavaScript</option>
                            </select>
                        </div>
                        <div class="form-control">
                            <label class="label py-1">
                                <span class="label-text text-sm">Requête</span>
                            </label>
                            <div x-init="$nextTick(() => renderGroupIfQueryEditorInit(getGroupAtPath(groupSettingsModal.path), $el))"></div>
                        </div>
                        <div class="mt-2 flex gap-2">
                            <button type="button" class="btn btn-sm btn-outline" @click="testGroupIfQuery(groupSettingsModal.path)" :disabled="!ConfigManager.getGroupIfQuery(getGroupAtPath(groupSettingsModal.path)) || isLoading">
                                <span class="iconify" data-icon="material-symbols-light:play-arrow" style="font-size:1rem"></span> Tester
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-action">
                <button class="btn" @click="groupSettingsModal.open = false">Fermer</button>
            </div>
        </div>
    </div>
</template>

<!-- Modal configuration cellule -->
<template x-if="cellConfigModal.open">
    <div class="modal modal-open z-[2100]" @click.self="closeCellConfig()" role="presentation">
        <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-cell-config-title"
             x-trap.noscroll="cellConfigModal.open">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeCellConfig()"><span class="iconify" data-icon="material-symbols-light:close" style="font-size:1rem"></span></button>
            </form>
            <h3 class="text-lg font-bold flex items-center gap-2" id="modal-cell-config-title"><span class="iconify" data-icon="material-symbols-light:settings" style="font-size:1.25rem"></span> Configuration de la cellule</h3>
            <div class="mt-4 space-y-4" :key="'cellcfg-'+(cellConfigModal.path?.join?.('-')??'')+'-'+(cellConfigModal.cellIndex??'')"
                 x-init="(function(){ const c = getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex); if (c?.type) CellConfigService.ensureCellFromSchema(c, c.type, { baseName: c.name }); })()"
                 x-show="getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex)">
                <div class="flex flex-col gap-2">
                    <label class="label"><span class="label-text">Type de cellule</span></label>
                    <select class="select select-bordered select-sm w-full" x-ref="typeSelect"
                            x-effect="if (cellConfigModal.open && cellConfigModal.path !== null) $refs.typeSelect.value = getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex)?.type"
                            @change="(function(){ const c=getCellAtPath(cellConfigModal.path,cellConfigModal.cellIndex); const oldType=c?.type; c.type=$event.target.value; onCellTypeChange(cellConfigModal.path,cellConfigModal.cellIndex,oldType); })()">
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
                        <option value="perspective">Perspective Viewer</option>
                    </select>
                </div>

                <!-- Paramètres communs unifiés (name, title, subtitle, icon, buttonLabel, queries) -->
                <template x-for="paramKey in ['name', ...getCommonParamsExcludingName(getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex)?.type).filter(p => p !== 'queries')]" :key="'common-'+paramKey">
                    <div class="form-control">
                        <template x-if="paramKey === 'name'">
                            <div>
                                <label class="label gap-2">
                                    <span class="label-text">Nom</span>
                                    <span class="tooltip tooltip-bottom" data-tip="Identifiant unique (tous types confondus). Pour source = nom de la table SQL. Pour onglets tabsChild = libellé affiché."><span class="badge badge-sm cursor-help">?</span></span>
                                </label>
                                <input type="text" class="input input-bordered input-sm w-full"
                                       x-model="getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex).name"
                                       @blur="validateCellName(cellConfigModal.path, cellConfigModal.cellIndex)"
                                       placeholder="Identifiant unique de la cellule" />
                            </div>
                        </template>
                        <template x-if="['title','subtitle','icon','buttonLabel'].includes(paramKey)">
                            <div>
                                <label class="label gap-2">
                                    <span class="label-text" x-text="getCommonParamDef(paramKey, getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex)?.type)?.label || paramKey"></span>
                                    <span class="tooltip tooltip-bottom" :data-tip="getCommonParamDef(paramKey, getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex)?.type)?.tooltip || ''" x-show="getCommonParamDef(paramKey, getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex)?.type)?.tooltip"><span class="badge badge-sm cursor-help">?</span></span>
                                </label>
                                <input type="text" class="input input-bordered input-sm w-full"
                                       :value="getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex)[paramKey]"
                                       @input="getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex)[paramKey] = $event.target.value"
                                       :placeholder="getCommonParamDef(paramKey, getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex)?.type)?.placeholder || ''" />
                            </div>
                        </template>
                    </div>
                </template>

                <!-- Taille (commun à tous) -->
                <div class="collapse collapse-arrow border border-base-300 bg-base-100">
                    <input type="checkbox" />
                    <div class="collapse-title min-h-0 py-3 font-medium flex items-center gap-2">Format de la cellule</div>
                    <div class="collapse-content">
                        <label class="label cursor-pointer justify-start gap-3 py-1">
                            <input type="checkbox" class="checkbox checkbox-sm"
                                   :checked="getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex).border !== false"
                                   @change="getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex).border = $event.target.checked">
                            <span class="label-text">Afficher bordure et ombre</span>
                        </label>
                        <div class="grid grid-cols-2 gap-3 pt-1">
                            <div class="col-span-2 font-medium text-sm">Largeur</div>
                            <div><span class="label-text-alt">Min (px)</span><input type="text" class="input input-bordered input-sm validator w-full" placeholder="100" x-model="getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex).minSizePx" /></div>
                            <div><span class="label-text-alt">Min (%)</span><input type="text" class="input input-bordered input-sm validator w-full" placeholder="50" x-model="getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex).minSizePercent" /></div>
                            <div><span class="label-text-alt">Max (px)</span><input type="text" class="input input-bordered input-sm validator w-full" placeholder="400" x-model="getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex).maxSizePx" /></div>
                            <div><span class="label-text-alt">Max (%)</span><input type="text" class="input input-bordered input-sm validator w-full" placeholder="80" x-model="getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex).maxSizePercent" /></div>
                            <div class="col-span-2 font-medium text-sm mt-1">Hauteur</div>
                            <div><span class="label-text-alt">Min (px)</span><input type="text" class="input input-bordered input-sm validator w-full" placeholder="100" x-model="getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex).minHeightPx" /></div>
                            <div><span class="label-text-alt">Min (%)</span><input type="text" class="input input-bordered input-sm validator w-full" placeholder="50" x-model="getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex).minHeightPercent" /></div>
                            <div><span class="label-text-alt">Max (px)</span><input type="text" class="input input-bordered input-sm validator w-full" placeholder="400" x-model="getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex).maxHeightPx" /></div>
                            <div><span class="label-text-alt">Max (%)</span><input type="text" class="input input-bordered input-sm validator w-full" placeholder="80" x-model="getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex).maxHeightPercent" /></div>
                        </div>
                    </div>
                </div>

                <!-- Paramètres spécifiques unifiés (boucle sur le schéma) -->
                <template x-for="param in getSpecificParamsForType(getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex)?.type)" :key="'spec-'+param.key">
                    <div class="form-control" x-show="isSpecificParamVisible(param, getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex))">
                        <!-- perspectiveCdns : 4 checkboxes -->
                        <template x-if="param.inputType === 'perspectiveCdns'">
                            <div>
                                <label class="label gap-2"><span class="label-text" x-text="param.label"></span>
                                    <span class="tooltip tooltip-bottom" :data-tip="param.tooltip || ''"><span class="badge badge-sm cursor-help">?</span></span>
                                </label>
                                <div class="flex flex-col gap-2 p-3 bg-base-200 rounded-lg" x-init="if (!getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex).perspectiveCdns) getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex).perspectiveCdns = { viewer: true, datagrid: true, d3fc: true, openlayers: false }">
                                    <label class="label cursor-pointer justify-start gap-3"><input type="checkbox" class="checkbox checkbox-sm" x-model="getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex).perspectiveCdns.viewer"><span class="label-text font-mono text-xs">@perspective-dev/viewer (requis)</span></label>
                                    <label class="label cursor-pointer justify-start gap-3"><input type="checkbox" class="checkbox checkbox-sm" x-model="getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex).perspectiveCdns.datagrid"><span class="label-text font-mono text-xs">@perspective-dev/viewer-datagrid</span></label>
                                    <label class="label cursor-pointer justify-start gap-3"><input type="checkbox" class="checkbox checkbox-sm" x-model="getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex).perspectiveCdns.d3fc"><span class="label-text font-mono text-xs">@perspective-dev/viewer-d3fc (charts)</span></label>
                                    <label class="label cursor-pointer justify-start gap-3"><input type="checkbox" class="checkbox checkbox-sm" x-model="getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex).perspectiveCdns.openlayers"><span class="label-text font-mono text-xs">@perspective-dev/viewer-openlayers (maps)</span></label>
                                </div>
                            </div>
                        </template>
                        <!-- checkbox -->
                        <template x-if="param.inputType === 'checkbox'">
                            <label class="label cursor-pointer justify-start gap-3">
                                <input type="checkbox" class="checkbox checkbox-sm"
                                       :checked="getCellValueByPath(getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex), param.key)"
                                       @change="setCellValueByPath(getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex), param.key, $event.target.checked)">
                                <span class="label-text" x-text="param.label"></span>
                                <span class="tooltip tooltip-bottom" :data-tip="param.tooltip || ''"><span class="badge badge-sm cursor-help">?</span></span>
                            </label>
                        </template>
                        <!-- select -->
                        <template x-if="param.inputType === 'select'">
                            <div>
                                <label class="label gap-2"><span class="label-text" x-text="param.label"></span><span class="tooltip tooltip-bottom" :data-tip="param.tooltip || ''"><span class="badge badge-sm cursor-help">?</span></span></label>
                                <select class="select select-bordered select-sm w-full"
                                        :key="'select-'+param.key+'-'+(getCellValueByPath(getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex), param.key) || '')"
                                        :value="getCellValueByPath(getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex), param.key)"
                                        @change="setCellValueByPath(getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex), param.key, $event.target.value)">
                                    <template x-for="opt in (param.options || [])" :key="opt.value"><option :value="opt.value" x-text="opt.label"></option></template>
                                </select>
                            </div>
                        </template>
                        <!-- textarea (content, json, json.xlsx, json.perspectiveConfig) -->
                        <template x-if="param.inputType === 'textarea'">
                            <div>
                                <label class="label gap-2"><span class="label-text" x-text="param.label"></span><span class="tooltip tooltip-bottom" :data-tip="param.tooltip || ''"><span class="badge badge-sm cursor-help">?</span></span></label>
                                <textarea class="textarea textarea-bordered w-full" :class="param.key.includes('json') ? 'font-mono text-sm' : ''" :rows="param.rows || 5"
                                          :style="param.rows >= 10 ? 'min-height: 200px;' : (param.key === 'json' ? 'min-height: 300px;' : '')"
                                          :placeholder="param.placeholder || ''"
                                          :value="param.key === 'json.xlsx' ? getCellValueByPath(getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex), 'json.xlsx') : getCellValueByPath(getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex), param.key)"
                                          @input="param.key === 'content' ? (setCellValueByPath(getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex), 'content', $event.target.value), syncMarkdownToEditor(cellConfigModal.path, cellConfigModal.cellIndex)) : setCellValueByPath(getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex), param.key === 'json.xlsx' ? 'json.xlsx' : param.key, $event.target.value)">
                                </textarea>
                            </div>
                        </template>
                        <!-- number -->
                        <template x-if="param.inputType === 'number'">
                            <div>
                                <label class="label gap-2"><span class="label-text" x-text="param.label"></span><span class="tooltip tooltip-bottom" :data-tip="param.tooltip || ''"><span class="badge badge-sm cursor-help">?</span></span></label>
                                <input type="number" class="input input-bordered input-sm w-full"
                                       :value="getCellValueByPath(getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex), param.key)"
                                       @input="setCellValueByPath(getCellAtPath(cellConfigModal.path, cellConfigModal.cellIndex), param.key, parseFloat($event.target.value) || 0)"
                                       :placeholder="param.placeholder" :min="param.min" step="any" />
                            </div>
                        </template>
                    </div>
                </template>
            </div>
            <div class="modal-action">
                <button class="btn" @click="closeCellConfig()">Fermer</button>
            </div>
        </div>
    </div>
</template>
    
<!-- Modal groupe enfant Full-screen -->
<template x-if="childGroupModal.open">
    <div class="modal modal-open fixed inset-0 z-[2000]" role="presentation">
        <div class="modal-box w-full h-full max-w-none max-h-none rounded-none flex flex-col p-0" role="dialog" aria-modal="true" aria-labelledby="modal-child-group-title"
             x-trap.noscroll="childGroupModal.open">
            <!-- Header sticky -->
            <div class="sticky top-0 z-10 flex items-center justify-between bg-primary text-primary-content px-6 py-4 shadow-md">
                <h3 class="text-xl font-bold flex items-center gap-2" id="modal-child-group-title">
                    <span class="iconify" data-icon="material-symbols-light:export-notes-outline-sharp" style="font-size:1.5rem"></span>
                </h3>
                <button class="btn btn-sm btn-circle btn-ghost text-primary-content hover:bg-primary-focus" @click="closeChildGroupModal()"><span class="iconify" data-icon="material-symbols-light:close" style="font-size:1rem"></span></button>
            </div>
            
            <!-- Contenu scrollable -->
            <div class="flex-1 overflow-y-auto bg-base-100 p-6">
                <!-- Rendu du groupe dans la modale -->
                <template x-if="childGroupModal.group">
                    <div class="w-full">
                        <!-- Wrapper pour le groupe -->
                        <div class="border border-base-300 rounded-lg overflow-hidden bg-base-100">
                            <!-- Header du groupe -->
                            <div x-show="devMode" class="flex items-center justify-between gap-2 py-2 px-4 bg-primary/10 border-b border-base-300">
                                <div class="join">
                                    <button class="btn btn-xs join-item" @click="childGroupModal.group.direction = childGroupModal.group.direction === 'column' ? 'row' : 'column'" 
                                            :title="childGroupModal.group.direction === 'column' ? 'Passer en ligne' : 'Passer en colonne'">
                                        <span class="iconify" :data-icon="childGroupModal.group.direction === 'column' ? 'material-symbols-light:swap-vert' : 'material-symbols-light:swap-horiz'" style="font-size:1rem"></span>
                                    </button>
                                    <button class="btn btn-xs btn-success join-item" @click="runGroupAtPath([-1])" :disabled="isLoading" title="Exécuter"><span class="iconify" data-icon="material-symbols-light:play-arrow" style="font-size:1rem"></span></button>
                                    <button class="btn btn-xs join-item" @click="addNestedGroup([-1])" title="Ajouter un sous-groupe"><span class="iconify" data-icon="material-symbols-light:create-new-folder" style="font-size:1rem"></span></button>
                                    <button class="btn btn-xs join-item" @click="openAddCellToGroupModal([-1])" title="Ajouter une cellule"><span class="iconify" data-icon="material-symbols-light:add" style="font-size:1rem"></span></button>
                                    <button class="btn btn-xs btn-error join-item" @click="deleteChildGroupModal()" title="Supprimer le groupe"><span class="iconify" data-icon="material-symbols-light:delete" style="font-size:1rem"></span></button>
                                </div>
                            </div>
                            
                            <!-- Contenu du groupe -->
                            <div class="p-2">
                                <div class="flex gap-2" :class="childGroupModal.group.direction === 'row' ? 'flex-row flex-wrap' : 'flex-col'">
                                    <!-- Cellules du groupe modal -->
                                    <template x-for="(cellItem, cellIdx) in getSortedCells(childGroupModal.group)" :key="cellItem.cell._id">
                                        <div class="flex flex-1"
                                             :class="getCellSizeOuterClass(cellItem.cell, childGroupModal.group.direction === 'column')"
                                             :style="getCellWrapperStyle(cellItem.cell, childGroupModal.group.direction === 'column', cellItem.cell._order ?? 0)">
                                            <div class="rounded-lg overflow-hidden bg-base-100 cell-container"
                                                 :class="[getCellSizeInnerClass(), cellItem.cell.border !== false ? 'border border-base-300 shadow-sm hover:border-primary hover:shadow-lg' : 'border-0 shadow-none', {
                                                     'border-warning shadow-[0_0_10px_rgba(251,191,36,0.3)]': cellItem.cell.border !== false && cellItem.cell._status === 'running', 
                                                     'border-success': cellItem.cell.border !== false && cellItem.cell._status === 'success', 
                                                     'border-error': cellItem.cell.border !== false && cellItem.cell._status === 'error'
                                                 }]">
                                            
                                            <!-- Header de cellule -->
                                            <div class="flex justify-between items-center py-2 px-4 bg-base-200 border-b border-base-300" x-show="devMode">
                                                <div class="flex items-center gap-2 text-sm text-base-content/60">
                                                    <span x-html="getCellIcon(cellItem.cell.type)"></span>
                                                    <span x-text="cellItem.cell.type"></span>
                                                    <span x-show="cellItem.cell._status === 'running'" class="loading loading-spinner loading-xs" style="color:var(--warning)"></span>
                                                </div>
                                                <div class="flex gap-1 items-center">
                                                    <div class="join">
                                                        <button class="btn btn-xs btn-success join-item" @click="runCellAt([-1], cellItem.originalIndex)" :disabled="isLoading" title="Exécuter"><span class="iconify" data-icon="material-symbols-light:play-arrow" style="font-size:1rem"></span></button>
                                                        <button class="btn btn-xs join-item" @click="openCellConfig([-1], cellItem.originalIndex)" title="Configurer"><span class="iconify" data-icon="material-symbols-light:settings" style="font-size:1rem"></span></button>
                                                        <button class="btn btn-xs join-item" @click="moveItemInGroup([-1], 'cell', cellItem.originalIndex, -1)" :disabled="isFirstInGroup(childGroupModal.group, 'cell', cellItem.originalIndex)" title="Déplacer à gauche"><span class="iconify" data-icon="material-symbols-light:arrow-back" style="font-size:1rem"></span></button>
                                                        <button class="btn btn-xs join-item" @click="moveItemInGroup([-1], 'cell', cellItem.originalIndex, 1)" :disabled="isLastInGroup(childGroupModal.group, 'cell', cellItem.originalIndex)" title="Déplacer à droite"><span class="iconify" data-icon="material-symbols-light:arrow-forward" style="font-size:1rem"></span></button>
                                                        <button class="btn btn-xs btn-error join-item" @click="deleteCellAt([-1], cellItem.originalIndex)" title="Supprimer"><span class="iconify" data-icon="material-symbols-light:delete" style="font-size:1rem"></span></button>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <!-- Body de la cellule - utilise le rendu unifié de CellRenderer -->
                                            <div x-html="CellRenderer.renderBody('[-1]', 'cellItem.originalIndex')"></div>
                                        </div>
                                        </div>
                                    </template>
                                    
                                    <!-- Sous-groupes dans la modale (récursif) -->
                                    <template x-for="childItem in getSortedChildren(childGroupModal.group)" :key="childItem.child._id || ('child-' + childItem.originalIndex)">
                                        <div class="flex-1 bg-base-100 border border-base-300 rounded-lg overflow-hidden transition-all duration-200 shadow-sm hover:border-primary hover:shadow-md"
                                             x-show="shouldShowGroup(childItem.child)"
                                             :style="'order: ' + (childItem.child._order ?? 0)"
                                             x-data="{ _childPath: [-1, childItem.originalIndex] }"
                                             x-html="renderChildGroupHTML(childItem.child, _childPath, childGroupModal.group, childItem.originalIndex)"
                                             x-effect="$nextTick(() => Alpine.initTree($el))">
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
    

<!-- DevMode Toggle -->
<div class="fixed bottom-4 left-4 z-[1500] flex gap-1" x-show="showLayout">
    <!-- Sélecteur de thème (devMode uniquement) -->
        <div class="dropdown dropdown-top" x-show="devMode">
            <div tabindex="0"  class="btn btn-sm  btn-ghost">
                <span class="iconify" data-icon="material-symbols-light:palette" style="font-size:1.25rem"></span>
            </div>
            <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 shadow max-h-60 overflow-y-auto">
                <template x-for="themeName in availableThemes" :key="themeName">
                    <li>
                        <button @click="setTheme(themeName)" :class="currentTheme === themeName ? 'active' : ''" x-text="themeName"></button>
                    </li>
                </template>
            </ul>
    </div>
    <!-- Bouton configuration moteur DB (devMode uniquement) -->
    <button class="btn btn-sm" x-show="devMode" @click="showDbEngineModal = true" 
            :class="directedAcyclicGraph ? 'btn-warning' : 'btn-ghost'"
            :title="'Moteur: ' + (dbEngine === 'ducklings' ? 'Ducklings' : 'DuckDB WASM')">
        <span x-text="dbEngine === 'ducklings' ? '🐤' : '🦆'"></span>
    </button>
    <!-- Bouton Dev/View -->
    <button class="btn btn-sm" :class="devMode ? 'btn-soft' : 'btn-ghost'" @click="devMode = !devMode">
            <span class="iconify" :data-icon="devMode ? 'material-symbols-light:visibility' : 'material-symbols-light:settings'" style="font-size:1.25rem"></span>
    </button>
</div>

<!-- Status bar -->
<template x-if="status">
    <div class="toast toast-end toast-bottom z-[1500]">
        <div class="alert"
             :class="statusType === 'loading' ? 'alert-info' : statusType === 'success' ? 'alert-success' : 'alert-error'">
            <span x-show="statusType === 'loading'" class="loading loading-spinner loading-md"></span>
            <span x-text="status"></span>
        </div>
    </div>
</template>

<footer class="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4" x-show="showLayout">
    <aside>
        <p>iHateXcel - sqljob - Made with ❤️ by Théo Nobella-Pichonnier</p>
    </aside>
</footer>

<!-- Modale des templates SQL -->
<div x-show="$store.templateModal.isOpen" 
     x-cloak
     class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
     @click.self="$store.templateModal.close()">
    <div class="bg-base-100 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col m-4">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-base-300">
            <h3 class="text-lg font-semibold" x-text="$store.templateModal.getModalTitle()"></h3>
            <button @click="$store.templateModal.close()" class="btn btn-ghost btn-sm btn-circle"><span class="iconify" data-icon="material-symbols-light:close" style="font-size:1rem"></span></button>
        </div>
        
        <!-- Recherche -->
        <div class="p-4 border-b border-base-300">
            <input 
                type="text" 
                x-model="$store.templateModal.searchQuery"
                placeholder="🔍 Rechercher un template..."
                class="input input-bordered w-full"
                @input="$store.templateModal.filterTemplates()">
            <div x-show="$store.templateModal.filteredTemplates.length === 0 && $store.templateModal.searchQuery" 
                 class="text-sm text-base-content/60 mt-2">
                Aucun template trouvé
            </div>
        </div>
        
        <!-- Body -->
        <div class="p-4 overflow-y-auto flex-1">
            <div class="space-y-3">
                <template x-for="(template, idx) in $store.templateModal.filteredTemplates" :key="idx">
                    <div class="card bg-base-200 hover:bg-base-300 cursor-pointer transition-colors border border-base-300"
                         @click="$store.templateModal.selectTemplate(template.originalIndex)">
                        <div class="card-body p-4">
                            <h4 class="card-title text-base" x-text="template.name"></h4>
                            <p class="text-sm text-base-content/70" x-text="template.description"></p>
                            <div class="mt-2">
                                <pre class="bg-base-100 p-3 rounded text-xs overflow-x-auto"><code x-text="template.code"></code></pre>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="flex justify-end gap-2 p-4 border-t border-base-300">
            <button @click="$store.templateModal.close()" class="btn btn-ghost">Annuler</button>
        </div>
    </div>
</div>

</div>

<!-- Modal d'export unifié -->
<template x-if="exportModal.show">
    <div class="modal modal-open z-[2100]" @click.self="cancelExport()" role="presentation">
        <div class="modal-box max-w-lg" role="dialog" aria-modal="true" aria-labelledby="modal-export-title"
             x-trap.noscroll="exportModal.show">
            <div class="flex items-center justify-between gap-2">
                <h3 class="text-lg font-semibold" id="modal-export-title">
                    <span x-show="exportModal.type === 'gist'" class="flex items-center gap-2"><span class="iconify" data-icon="material-symbols-light:share" style="font-size:1.25rem"></span> Partager via GitHub Gist</span>
                    <span x-show="exportModal.type === 'json'" class="flex items-center gap-2"><span class="iconify" data-icon="material-symbols-light:data-object" style="font-size:1.25rem"></span> Export JSON</span>
                    <span x-show="exportModal.type === 'base64'" class="flex items-center gap-2"><span class="iconify" data-icon="material-symbols-light:lock" style="font-size:1.25rem"></span> Export Base64</span>
                    <span x-show="exportModal.type === 'html'" class="flex items-center gap-2"><span class="iconify" data-icon="material-symbols-light:save" style="font-size:1.25rem"></span> Export HTML</span>
                </h3>
                <button class="btn btn-sm btn-ghost" @click="cancelExport()"><span class="iconify" data-icon="material-symbols-light:close" style="font-size:1rem"></span></button>
            </div>
            <div class="mt-4 space-y-4">
                <!-- Description (seulement pour Gist) -->
                <div class="form-control" x-show="exportModal.type === 'gist'">
                    <label class="label">
                        <span class="label-text">Description</span>
                    </label>
                    <input 
                        type="text" 
                        x-model="exportModal.description" 
                        placeholder="sqljob Notebook Configuration"
                        class="input input-bordered w-full"
                        @keydown.enter="executeExport()">
                    <label class="label">
                        <span class="label-text-alt">Décrivez votre notebook (visible sur GitHub)</span>
                    </label>
                </div>

                <!-- Nom du fichier -->
                <div class="form-control">
                    <label class="label">
                        <span class="label-text" x-show="exportModal.type === 'html'">Nom du fichier HTML</span>
                        <span class="label-text" x-show="exportModal.type === 'base64'">Nom du fichier Base64</span>
                        <span class="label-text" x-show="exportModal.type === 'json' || exportModal.type === 'gist'">Nom du fichier JSON</span>
                    </label>
                    <input 
                        type="text" 
                        x-model="exportModal.fileName" 
                        placeholder="sqljob_yyyymmdd_hhmmss"
                        class="input input-bordered w-full font-mono text-sm"
                        @keydown.enter="executeExport()">
                    <label class="label">
                        <span class="label-text-alt" x-show="exportModal.type === 'base64'">Extension .txt sera ajoutée automatiquement</span>
                        <span class="label-text-alt" x-show="exportModal.type === 'html'">Extension .html sera ajoutée automatiquement</span>
                        <span class="label-text-alt" x-show="exportModal.type === 'json' || exportModal.type === 'gist'">Extension .json sera ajoutée automatiquement si absente</span>
                    </label>
                </div>

                <!-- Paramètres UI -->
                <div class="divider text-sm">Paramètres de la configuration</div>
                
                <div class="form-control">
                    <label class="label cursor-pointer justify-start gap-3">
                        <input type="checkbox" class="toggle toggle-primary" x-model="exportModal.devMode" />
                        <div>
                            <span class="label-text font-semibold">Mode développeur</span>
                            <p class="text-xs text-base-content/60">Afficher les contrôles d'édition des cellules et groupes</p>
                        </div>
                    </label>
                </div>

                <div class="form-control">
                    <label class="label cursor-pointer justify-start gap-3">
                        <input type="checkbox" class="toggle toggle-primary" x-model="exportModal.showLayout" />
                        <div>
                            <span class="label-text font-semibold">Afficher l'entête et pied de page</span>
                            <p class="text-xs text-base-content/60">Parfait pour partager votre notebook sous forme d'iframe</p>
                        </div>
                    </label>
                </div>

                <!-- Chiffrer (Gist, JSON et HTML) -->
                <div class="form-control" x-show="exportModal.type === 'gist' || exportModal.type === 'json' || exportModal.type === 'html'">
                    <label class="label cursor-pointer justify-start gap-3">
                        <input type="checkbox" class="toggle toggle-primary" x-model="exportModal.encryptGist"
                            @change="if (exportModal.encryptGist && !exportModal.gistPassphrase) exportModal.gistPassphrase = GistEncrypt.generatePassphrase()" />
                        <div>
                            <span class="label-text font-semibold flex items-center gap-2"><span class="iconify" data-icon="material-symbols-light:lock" style="font-size:1rem"></span> Chiffrer la configuration</span>
                            <p class="text-xs text-base-content/60">Chiffre la config et les datachunks avec un mot de passe</p>
                        </div>
                    </label>
                </div>
                <div class="form-control" x-show="(exportModal.type === 'gist' || exportModal.type === 'json' || exportModal.type === 'html') && exportModal.encryptGist">
                    <label class="label">
                        <span class="label-text">Mot de passe (à partager pour déchiffrer)</span>
                    </label>
                    <input type="text" x-model="exportModal.gistPassphrase"
                        placeholder="68cd597ba5da05ceba24fb975c05384f"
                        class="input input-bordered w-full font-mono text-sm"
                        @keydown.enter="executeExport()">
                    <label class="label">
                        <span class="label-text-alt">À transmettre séparément au destinataire (demandée via modale au chargement).</span>
                    </label>
                </div>

                <!-- Info pour Gist -->
                <div class="alert alert-info" x-show="exportModal.type === 'gist'">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span class="text-sm">
                        Ne partagez pas de données confidentielles. Le Gist sera accessible via le lien partagé.
                    </span>
                </div>
            </div>
            <div class="modal-action">
                <button @click="cancelExport()" class="btn btn-ghost">Annuler</button>
                <button @click="executeExport()" class="btn btn-primary">
                    <span x-show="exportModal.type === 'gist'">Créer le Gist</span>
                    <span x-show="exportModal.type !== 'gist'">Exporter</span>
                </button>
            </div>
        </div>
    </div>
</template>

<!-- Modal token GitHub -->
<template x-if="showGistTokenModal">
    <div class="modal modal-open z-[2100]" @click.self="cancelGithubToken()" role="presentation">
        <div class="modal-box max-w-lg" role="dialog" aria-modal="true" aria-labelledby="modal-github-token-title"
             x-trap.noscroll="showGistTokenModal">
            <div class="flex items-center justify-between gap-2">
                <h3 class="text-lg font-semibold flex items-center gap-2" id="modal-github-token-title"><span class="iconify" data-icon="material-symbols-light:settings" style="font-size:1.25rem"></span> Configuration GitHub</h3>
                <button class="btn btn-sm btn-ghost" @click="cancelGithubToken()"><span class="iconify" data-icon="material-symbols-light:close" style="font-size:1rem"></span></button>
            </div>
            <div class="mt-4 space-y-4">
                <p class="text-sm text-base-content/60">
                    Pour partager votre notebook via GitHub Gist, vous devez créer un <strong>Personal Access Token</strong> :
                </p>
                <ol class="text-sm list-decimal list-inside space-y-2 text-base-content/80">
                    <li>Allez sur <a href="https://github.com/settings/tokens/new?scopes=gist&description=sqljob-notebook" target="_blank" class="link link-primary">GitHub → Settings → Developer settings</a></li>
                    <li>Cliquez sur "Generate new token (classic)"</li>
                    <li>Donnez un nom (ex: "sqljob notebook")</li>
                    <li>Cochez uniquement la permission <strong>gist</strong></li>
                    <li>Cliquez sur "Generate token" et copiez-le</li>
                </ol>
                <div class="form-control">
                    <label class="label">
                        <span class="label-text">Collez votre token ici :</span>
                    </label>
                    <input 
                        type="password" 
                        x-model="githubToken" 
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        class="input input-bordered w-full"
                        @keydown.enter="saveGithubToken()">
                    <label class="label">
                        <span class="label-text-alt text-warning">⚠️ Le token sera stocké localement dans votre navigateur</span>
                    </label>
                </div>
            </div>
            <div class="modal-action">
                <button @click="cancelGithubToken()" class="btn btn-ghost">Annuler</button>
                <button @click="saveGithubToken()" class="btn btn-primary">Enregistrer</button>
            </div>
        </div>
    </div>
</template>

<!-- Modal résultat Gist -->
<template x-if="showGistModal">
    <div class="modal modal-open z-[2100]" @click.self="closeGistModal()" role="presentation">
        <div class="modal-box max-w-2xl" role="dialog" aria-modal="true" aria-labelledby="modal-gist-result-title"
             x-trap.noscroll="showGistModal">
            <div class="flex items-center justify-between gap-2">
                <h3 class="text-lg font-semibold flex items-center gap-2" id="modal-gist-result-title"><span class="iconify text-success" data-icon="material-symbols-light:check-circle" style="font-size:1.25rem"></span> Gist créé avec succès</h3>
                <button class="btn btn-sm btn-ghost" @click="closeGistModal()"><span class="iconify" data-icon="material-symbols-light:close" style="font-size:1rem"></span></button>
            </div>
            <div class="mt-4 space-y-4">
                <p class="text-sm text-base-content/60">
                    Votre notebook a été partagé sur GitHub Gist. Partagez cette URL pour permettre aux autres d'accéder à votre configuration :
                </p>
                <div class="form-control">
                    <div class="join w-full">
                        <input 
                            type="text" 
                            :value="gistShareUrl" 
                            readonly 
                            class="input input-bordered join-item flex-1 font-mono text-sm"
                            @click="$event.target.select()">
                        <button @click="copyGistUrl()" class="btn join-item btn-primary"><span class="iconify" data-icon="material-symbols-light:content-copy" style="font-size:1rem"></span> Copier</button>
                    </div>
                </div>
                <div class="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span class="text-sm">
                        Cette URL charge automatiquement votre configuration depuis GitHub Gist.
                        Ne partagez pas de données confidentielles. Le Gist sera accessible via le lien partagé.
                    </span>
                </div>
                <div class="alert alert-warning" x-show="gistWasEncrypted">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    <span class="text-sm">
                        <strong>Configuration chiffrée.</strong> Transmettez le mot de passe au destinataire par un canal sécurisé. Elle sera demandée via une modale lors du chargement.
                    </span>
                </div>
                <div class="form-control" x-show="gistWasEncrypted">
                    <label class="label"><span class="label-text">Mot de passe (à transmettre au destinataire)</span></label>
                    <div class="join w-full">
                        <input type="text" :value="gistPassphraseToShare" readonly
                            class="input input-bordered join-item flex-1 font-mono text-sm"
                            @click="$event.target.select()">
                        <button @click="copyGistPassphrase()" class="btn join-item btn-primary"><span class="iconify" data-icon="material-symbols-light:content-copy" style="font-size:1rem"></span> Copier le mot de passe</button>
                    </div>
                </div>
            </div>
            <div class="modal-action">
                <button @click="closeGistModal()" class="btn btn-ghost">Fermer</button>
                <button @click="openGistUrl()" class="btn btn-primary">Ouvrir le lien</button>
            </div>
        </div>
    </div>
</template>

<!-- Modal passphrase pour JSON chiffré -->
<template x-if="showJsonPassphraseModal">
    <div class="modal modal-open z-[2100]" @click.self="cancelJsonPassphraseModal()" role="presentation">
        <div class="modal-box max-w-md" role="dialog" aria-modal="true" aria-labelledby="modal-json-passphrase-title"
             x-trap.noscroll="showJsonPassphraseModal">
            <div class="flex items-center justify-between gap-2">
                <h3 class="text-lg font-semibold flex items-center gap-2" id="modal-json-passphrase-title"><span class="iconify" data-icon="material-symbols-light:lock" style="font-size:1.25rem"></span> Fichier JSON chiffré</h3>
                <button class="btn btn-sm btn-ghost" @click="cancelJsonPassphraseModal()"><span class="iconify" data-icon="material-symbols-light:close" style="font-size:1rem"></span></button>
            </div>
            <p class="py-2 text-sm text-base-content/70">
                Ce fichier est protégé par un mot de passe. Entrez-la pour charger la configuration.
            </p>
            <div class="form-control mt-4">
                <label class="label"><span class="label-text">Mot de passe</span></label>
                <input type="password" x-model="jsonPassphrase" placeholder="68cd597ba5da05ceba24fb975c05384f"
                    class="input input-bordered w-full font-mono"
                    @keydown.enter="unlockJsonConfig()"
                    autocomplete="current-password">
            </div>
            <div x-show="jsonPassphraseError" class="alert alert-error mt-3">
                <span x-text="jsonPassphraseError"></span>
            </div>
            <div class="modal-action">
                <button @click="cancelJsonPassphraseModal()" class="btn btn-ghost">Annuler</button>
                <button @click="unlockJsonConfig()" class="btn btn-primary" :disabled="jsonPassphraseLoading">
                    <span x-show="!jsonPassphraseLoading">Déchiffrer</span>
                    <span x-show="jsonPassphraseLoading" class="loading loading-spinner loading-sm"></span>
                </button>
            </div>
        </div>
    </div>
</template>

    <!-- Modal de confirmation générique -->
<template x-if="$store.confirmModal.isOpen">
    <div class="modal modal-open z-[9999]" role="presentation">
        <div class="modal-box max-w-sm" role="dialog" aria-modal="true" aria-labelledby="modal-confirm-title"
             x-trap.noscroll="$store.confirmModal.isOpen">
            <h3 class="text-lg font-semibold mb-4" id="modal-confirm-title">Confirmation</h3>
            <p class="text-base-content/80" x-text="$store.confirmModal.message"></p>
            <div class="modal-action">
                <button @click="$store.confirmModal.cancel()" class="btn btn-ghost">Annuler</button>
                <button @click="$store.confirmModal.confirm()" class="btn btn-error">Supprimer</button>
            </div>
        </div>
        <div class="modal-backdrop" @click="$store.confirmModal.cancel()"></div>
    </div>
</template>

    </div>`;
}
