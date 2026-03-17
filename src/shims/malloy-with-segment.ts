// @ts-nocheck
/**
 * Shim pour @malloydata/malloy — ajoute l'export `Segment` manquant.
 *
 * @malloydata/query-composer@0.0.269 importe `Segment` depuis @malloydata/malloy.
 * Cet export a été retiré dans malloy@0.0.362.
 *
 * `Segment.nextStructDef(source, stage)` est utilisé pour calculer le SourceDef
 * de sortie après un stage de pipeline. Pour les requêtes à un seul stage
 * (cas standard), le résultat est ignoré → retourner `source` inchangé suffit.
 */

// Re-export tout le package malloy réel (via l'alias '@malloydata/malloy-real')
export * from '@malloydata/malloy-real'

// Ajout de l'export Segment manquant
export const Segment = {
  nextStructDef(source: unknown, _stage: unknown): unknown {
    return source
  },
}
