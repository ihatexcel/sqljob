// Stub for @sqlrooms/monaco-editor in the CDN build.
// Monaco is not loaded in CDN mode (too large). These are no-op replacements.
import React from 'react';

export const JsonMonacoEditor = () => null;
export const MonacoEditor = () => null;
export const configureMonacoLoader = () => {};
export const isMonacoLoaderConfigured = () => false;
export const ensureMonacoLoaderConfigured = () => Promise.resolve();
export const getCssColor = () => '';
export const hslToHex = () => '';
export const getMonospaceFont = () => 'monospace';
