import {
  SemanticTokenModifiers,
  SemanticTokensLegend,
  SemanticTokenTypes,
} from 'vscode-languageserver';

/**
 * Types of semantic tokens that we extract
 *
 * We can only send token types that we capture here
 */
export const SEMANTIC_TOKEN_TYPES = [SemanticTokenTypes.class];

/**
 * Modifiers for semantic tokens that we extract
 *
 * We can only send modifiers that we capture here
 */
export const SEMANTIC_TOKEN_MODIFIERS = [SemanticTokenModifiers.definition];

/**
 * Legend for semantic tokens
 */
export const SEMANTIC_TOKEN_LEGEND: SemanticTokensLegend = {
  tokenTypes: SEMANTIC_TOKEN_TYPES,
  tokenModifiers: SEMANTIC_TOKEN_MODIFIERS,
};
