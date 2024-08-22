/**
 * Matches for binary keywords
 *
 * @param {string} full Full match for the binary keyword (starts with `/`)
 * @param {string} keyword Name of the keyword
 */
export type KeywordBinaryMatches = [full: string, keyword: string];

/**
 * Matches for keyword definitions
 *
 * @param {string} external Full match for the keyword definition
 * @param {string} internal (optional) Name of the argument definition for internal use
 */
export type KeywordDefinitionMatches = [external: string, internal?: string];
