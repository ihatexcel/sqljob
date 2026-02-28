// @ts-nocheck
import { CELL_TYPE_SCHEMAS } from './cellTypeSchemas'
import { CELL_BODY_FAMILIES } from './CellBodyRenderer'

        export class CellRenderer {
            // Génère le HTML du header d'une cellule (mode dev uniquement)
            static renderHeader(pathExpr, cellIdxExpr, groupExpr) {
                return `
                    <div class="flex justify-between items-center py-2 px-4 bg-base-200 border-b border-base-300 cell-header-responsive" x-show="devMode">
                        <div class="flex items-center gap-2 text-sm text-base-content/60">
                            <span x-html="getCellIcon(cellItem.cell.type)"></span>
                            <span x-text="cellItem.cell.type"></span>
                            <span x-show="cellItem.cell._status === 'running'" class="loading loading-spinner loading-xs" style="color:var(--warning)"></span>
                        </div>
                        <div class="flex gap-1 items-center">
                            <div class="join">
                                <button class="btn btn-xs btn-success join-item" @click="runCellAt(${pathExpr}, ${cellIdxExpr})" :disabled="isLoading" title="Exécuter"><span class="iconify" data-icon="material-symbols-light:play-arrow" style="font-size:1rem"></span></button>
                                <button class="btn btn-xs join-item" @click="openCellConfig(${pathExpr}, ${cellIdxExpr})" title="Configurer"><span class="iconify" data-icon="material-symbols-light:settings" style="font-size:1rem"></span></button>
                                <button class="btn btn-xs join-item" @click="openChildGroupModal(${pathExpr}, ${cellIdxExpr})" title="Groupe enfant"><span class="iconify" data-icon="material-symbols-light:note-add" style="font-size:1rem"></span></button>
                                <button class="btn btn-xs join-item" @click="moveItemInGroup(${pathExpr}, 'cell', ${cellIdxExpr}, -1)" :disabled="isFirstInGroup(${groupExpr}, 'cell', ${cellIdxExpr})" title="Déplacer à gauche"><span class="iconify" data-icon="material-symbols-light:arrow-back" style="font-size:1rem"></span></button>
                                <button class="btn btn-xs join-item" @click="moveItemInGroup(${pathExpr}, 'cell', ${cellIdxExpr}, 1)" :disabled="isLastInGroup(${groupExpr}, 'cell', ${cellIdxExpr})" title="Déplacer à droite"><span class="iconify" data-icon="material-symbols-light:arrow-forward" style="font-size:1rem"></span></button>
                                <button class="btn btn-xs btn-error join-item" @click="deleteCellAt(${pathExpr}, ${cellIdxExpr})" title="Supprimer"><span class="iconify" data-icon="material-symbols-light:delete" style="font-size:1rem"></span></button>
                            </div>
                            <div class="dropdown dropdown-end hidden">
                                <div tabindex="0" role="button" class="btn btn-xs"><span class="iconify" data-icon="material-symbols-light:more-vert" style="font-size:1rem"></span></div>
                                <ul tabindex="-1" class="dropdown-content menu menu-xs bg-base-100 rounded-box z-[1] w-48 p-2 shadow-sm">
                                    <li><button @click="runCellAt(${pathExpr}, ${cellIdxExpr})" :disabled="isLoading"><span class="iconify" data-icon="material-symbols-light:play-arrow" style="font-size:1rem"></span> Exécuter</button></li>
                                    <li><button @click="openCellConfig(${pathExpr}, ${cellIdxExpr})"><span class="iconify" data-icon="material-symbols-light:settings" style="font-size:1rem"></span> Configurer</button></li>
                                    <li><button @click="moveItemInGroup(${pathExpr}, 'cell', ${cellIdxExpr}, -1)" :disabled="isFirstInGroup(${groupExpr}, 'cell', ${cellIdxExpr})"><span class="iconify" data-icon="material-symbols-light:arrow-back" style="font-size:1rem"></span> Déplacer à gauche</button></li>
                                    <li><button @click="moveItemInGroup(${pathExpr}, 'cell', ${cellIdxExpr}, 1)" :disabled="isLastInGroup(${groupExpr}, 'cell', ${cellIdxExpr})"><span class="iconify" data-icon="material-symbols-light:arrow-forward" style="font-size:1rem"></span> Déplacer à droite</button></li>
                                    <li><button class="text-error" @click="deleteCellAt(${pathExpr}, ${cellIdxExpr})"><span class="iconify" data-icon="material-symbols-light:delete" style="font-size:1rem"></span> Supprimer</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>`;
            }

            // Skeleton DaisyUI affiché quand la cellule n'est pas encore chargée (template unique)
            static renderCellBodySkeleton() {
                return `<div class="flex min-w-0 w-full flex-col mt-2 gap-4">
  <div class="skeleton h-8 w-full"></div>
  <div class="skeleton h-2 w-28"></div>
  <div class="skeleton h-2 w-full"></div>
  <div class="skeleton h-2 w-full"></div>
</div>`;
            }
            static renderTableSkeleton() {
                return `<div class="flex flex-col gap-2 p-4">
  <div class="skeleton h-6 w-full"></div>
  <div class="skeleton h-4 w-full"></div>
  <div class="skeleton h-4 w-full"></div>
  <div class="skeleton h-4 w-3/4"></div>
</div>`;
            }

            // Génère le HTML du body d'une cellule (tous les types – registre bodyFamily)
            static renderBody(pathExpr, cellIdxExpr) {
                const skeleton = this.renderCellBodySkeleton();
                const bodyParts = Object.entries(CELL_TYPE_SCHEMAS.types)
                    .filter(([, schema]) => schema.bodyFamily && CELL_BODY_FAMILIES[schema.bodyFamily])
                    .map(([type, schema]) => {
                        const family = CELL_BODY_FAMILIES[schema.bodyFamily];
                        const html = family.render(pathExpr, cellIdxExpr, schema);
                        return { type, html };
                    });
                const bodyTemplates = bodyParts.map(({ type, html }) =>
                    `<template x-if="cellItem.cell.type === '${type}'">${html}</template>`).join('\n                        ');
                return `
                    <div class="pt-1 pb-1 pl-2 pr-2 relative flex-1 flex flex-col min-h-0 cell-body"
                         :class="{ 'cell-body-has-height': hasCellHeight(cellItem.cell) }"
                         :style="getCellHeightVars(cellItem.cell)">
                        <!-- SKELETON: logique pilotée par bodyDisplay (schéma) -->
                        <div x-show="bodyDisplayShouldShowSkeleton(cellItem.cell)">
                            ${skeleton}
                        </div>
                        <!-- CONTENU: logique pilotée par bodyDisplay (schéma) -->
                        <div class="flex-1 flex flex-col min-h-0" x-show="bodyDisplayShouldShowContent(cellItem.cell)">
                        ${bodyTemplates}
                        <!-- CLIENT MODE BUTTON: Open child group modal if cell has childGroupId -->
                        <template x-if="!devMode && cellItem.cell.childGroupId">
                            <div class="absolute top-2 right-2">
                                <button class="btn btn-sm gap-0"
                                        @click="openChildGroupModal(${pathExpr}, ${cellIdxExpr})"
                                        title="Ouvrir le groupe enfant">
                                    <span class="iconify" data-icon="material-symbols-light:export-notes-outline-sharp" style="font-size:1rem"></span>
                                </button>
                            </div>
                        </template>
                        </div>
                    </div>`;
            }

            // Génère le HTML complet d'une cellule
            static renderCell(pathExpr, cellIdxExpr, groupExpr) {
                return CellRenderer.renderHeader(pathExpr, cellIdxExpr, groupExpr) + CellRenderer.renderBody(pathExpr, cellIdxExpr);
            }
        }
