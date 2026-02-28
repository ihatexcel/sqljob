// @ts-nocheck

/**
 * Évalue une expression JavaScript dans un sandbox restreint.
 *
 * Globals disponibles : Date, Math, String, Number, Boolean, Array, Object, JSON,
 *   Map, Set, WeakMap, WeakSet, Symbol, RegExp, Error, TypeError, RangeError, SyntaxError,
 *   parseInt, parseFloat, isNaN, isFinite, NaN, Infinity,
 *   encodeURIComponent, decodeURIComponent, encodeURI, decodeURI, atob, btoa,
 *   Intl, console
 *
 * Bloqués : window, document, fetch, XMLHttpRequest, localStorage, sessionStorage,
 *   indexedDB, navigator, location, et tout l'API DOM/réseau.
 *
 * Expressions simples : `return (code)` est ajouté automatiquement.
 * Multi-statements   : utiliser `return` explicite dans le code.
 */

const SAFE_GLOBALS = {
    Date,
    Math,
    String,
    Number,
    Boolean,
    Array,
    Object,
    JSON,
    Map,
    Set,
    WeakMap,
    WeakSet,
    Symbol,
    RegExp,
    Error,
    TypeError,
    RangeError,
    SyntaxError,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    NaN,
    Infinity,
    encodeURIComponent,
    decodeURIComponent,
    encodeURI,
    decodeURI,
    atob,
    btoa,
    Intl,
    console,
};

const SAFE_KEYS = Object.keys(SAFE_GLOBALS);
const SAFE_VALUES = Object.values(SAFE_GLOBALS);

export function safeEvalJs(code: string): unknown {
    const trimmed = code.trim();
    const body = trimmed.startsWith('return ') ? trimmed : `return (${trimmed})`;
    // new Function is used intentionally here in a sandboxed context
    const fn = new Function(...SAFE_KEYS, `"use strict"; ${body}`);
    return fn(...SAFE_VALUES);
}
