/**
 * Types of filters
 */
export type RuleBasedFilterType = 'blacklist' | 'whitelist';

/**
 * Allowed types of filters
 *
 * Whitelist and blacklist entries are matched case-insensitively.
 *
 * - `whitelist`: if provided and non-empty, only items whose names appear
 *   in this list will be included in results
 * - `blacklist`: items whose names appear in this list are always excluded
 */
export type IRuleBasedFilters = {
  [T in RuleBasedFilterType]: string[];
};

export const DEFAULT_FILTERS: IRuleBasedFilters = {
  blacklist: [],
  whitelist: [],
};

/**
 * Allowed types of filters
 *
 * Whitelist and blacklist entries are matched case-insensitively.
 *
 * - `whitelist`: if provided and non-empty, only items whose names appear
 *   in this list will be included in results
 * - `blacklist`: items whose names appear in this list are always excluded
 */
export type IRuleBasedFilterSets = {
  [T in RuleBasedFilterType]: Set<string>;
};

export const DEFAULT_FILTER_SETS: IRuleBasedFilterSets = {
  blacklist: new Set(),
  whitelist: new Set(),
};
