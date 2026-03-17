// Shim for @malloydata/render/webcomponent
// The query-composer@0.0.269 imports this for side effects (custom element registration)
// but @malloydata/render@0.0.362 moved the webcomponent to a different package.
// Since we use our own SqlDataTable for results, this shim is sufficient.
export {}
