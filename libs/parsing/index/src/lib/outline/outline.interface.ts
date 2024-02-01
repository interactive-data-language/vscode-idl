import { GLOBAL_TOKEN_TYPES } from '@idl/types/core';
import { SymbolKind } from 'vscode-languageserver/node';

/**
 * When generating an outline for a document, these are the tokens we report outlines for
 */
export const OUTLINE_THESE_TOKENS: { [key: string]: boolean } = {};
OUTLINE_THESE_TOKENS[GLOBAL_TOKEN_TYPES.FUNCTION] = true;
OUTLINE_THESE_TOKENS[GLOBAL_TOKEN_TYPES.FUNCTION_METHOD] = true;
OUTLINE_THESE_TOKENS[GLOBAL_TOKEN_TYPES.PROCEDURE] = true;
OUTLINE_THESE_TOKENS[GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD] = true;

/**
 * Map for symbol kinds from our global tokens to what the
 * VSCode user interface expects
 */
export const OUTLINE_TOKEN_KIND_MAP: { [key: string]: SymbolKind } = {};
OUTLINE_TOKEN_KIND_MAP[GLOBAL_TOKEN_TYPES.FUNCTION] = SymbolKind.Function;
OUTLINE_TOKEN_KIND_MAP[GLOBAL_TOKEN_TYPES.FUNCTION_METHOD] = SymbolKind.Class;
OUTLINE_TOKEN_KIND_MAP[GLOBAL_TOKEN_TYPES.PROCEDURE] = SymbolKind.Function;
OUTLINE_TOKEN_KIND_MAP[GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD] = SymbolKind.Class;

/**
 * If we have a mistake and a global token is in the outline tokens, but not the map,
 * then this is the default symbol kind that we will use
 */
export const DEFAULT_OUTLINE_SYMBOL_KIND = SymbolKind.Function;
