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
 * Lookup to map the types of semantic tokens from their names to array elements
 */
export const SEMANTIC_TOKEN_TYPE_INDEX_LOOKUP: { [key: string]: number } = {};

// populate
for (let i = 0; i < SEMANTIC_TOKEN_TYPES.length; i++) {
  SEMANTIC_TOKEN_TYPE_INDEX_LOOKUP[SEMANTIC_TOKEN_TYPES[i]] = i;
}

/**
 * Modifiers for semantic tokens that we extract
 *
 * We can only send modifiers that we capture here
 */
export const SEMANTIC_TOKEN_MODIFIERS = [SemanticTokenModifiers.definition];

/**
 * Lookup to map the modifiers from their names to array elements
 */
export const SEMANTIC_TOKEN_MODIFIER_INDEX_LOOKUP: { [key: string]: number } =
  {};

// populate
for (let i = 0; i < SEMANTIC_TOKEN_MODIFIERS.length; i++) {
  SEMANTIC_TOKEN_MODIFIER_INDEX_LOOKUP[SEMANTIC_TOKEN_MODIFIERS[i]] = i;
}

/**
 * Legend for semantic tokens
 */
export const SEMANTIC_TOKEN_LEGEND: SemanticTokensLegend = {
  tokenTypes: SEMANTIC_TOKEN_TYPES,
  tokenModifiers: SEMANTIC_TOKEN_MODIFIERS,
};
