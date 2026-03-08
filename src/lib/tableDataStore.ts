/**
 * Store partagé pour les données brutes des tables SQL/table.
 * Hors Zustand pour éviter l'overhead du Proxy sur les grands datasets.
 */
export const rawTableDataStore = new Map<string, any[]>()
