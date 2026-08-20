import { copy } from 'fast-copy';

import {
  DEFAULT_FILTER_SETS,
  IRuleBasedFilters,
  IRuleBasedFilterSets,
  RuleBasedFilterType,
} from './rule-based-filter.interface';

export class RuleBasedFilter {
  /** Express the filters as unique sets */
  sets = copy(DEFAULT_FILTER_SETS);

  constructor(filters?: Partial<IRuleBasedFilters>) {
    this._updateSets(filters);
  }

  /**
   * Adds an item to a filter
   */
  addToFilter(filter: RuleBasedFilterType, itemName: string) {
    this.sets[filter].add(this._normalizeItemName(itemName));
  }

  /**
   * Clears all entries from the blacklist
   */
  clearFilter(filter: RuleBasedFilterType) {
    this.sets[filter].clear();
  }

  /**
   * Returns true if the given lowercase task name passes the current
   * whitelist and blacklist filters
   */
  isAllowedByFilters(itemName: string): boolean {
    /** Normalize the name */
    const lc = this._normalizeItemName(itemName);

    // apply filter
    switch (true) {
      case this.sets.whitelist.size > 0 && !this.sets.whitelist.has(lc):
        return false;
      case this.sets.blacklist.has(lc):
        return false;
      default:
        return true;
    }
  }

  /**
   * Removes an item from a filter
   */
  removeFromFilter(filter: RuleBasedFilterType, itemName: string) {
    this.sets[filter].delete(this._normalizeItemName(itemName));
  }

  /**
   * Resets filters to default values
   */
  resetAllFilters() {
    this.sets = copy(DEFAULT_FILTER_SETS);
  }

  /**
   * Replaces existing filters with new values
   */
  updateFilters(filters: Partial<IRuleBasedFilters>) {
    this._updateSets(filters);
  }

  /**
   * Make sure name is consistent
   */
  private _normalizeItemName(itemName: string) {
    return itemName.toLowerCase().trim();
  }

  /**
   * Make sure sets are up-to-date with any filter changes
   */
  private _updateSets(filters: Partial<IRuleBasedFilters> = {}) {
    const keys = Object.keys(filters) as RuleBasedFilterType[];
    const newSets: Partial<IRuleBasedFilterSets> = {};
    for (let i = 0; i < keys.length; i++) {
      const values = filters[keys[i]];
      if (values !== undefined) {
        newSets[keys[i]] = new Set(
          values.map((itemName) => this._normalizeItemName(itemName)),
        );
      }
    }
  }
}
