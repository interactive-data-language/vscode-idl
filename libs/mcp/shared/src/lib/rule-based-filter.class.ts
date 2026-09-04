import { copy } from 'fast-copy';

import {
  DEFAULT_FILTER_SETS,
  IRuleBasedFilters,
  RuleBasedFilterType,
} from './rule-based-filter.interface';

export class RuleBasedFilter {
  /** Express the filters as unique sets */
  sets = copy(DEFAULT_FILTER_SETS);

  constructor(filters?: Partial<IRuleBasedFilters>) {
    if (filters) {
      this._updateSets(filters);
    }
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
  private _updateSets(filters: Partial<IRuleBasedFilters>) {
    // get filters we are updating and return if nothing
    const keys = Object.keys(filters) as RuleBasedFilterType[];
    if (keys.length === 0) {
      return;
    }

    // build sets
    for (let i = 0; i < keys.length; i++) {
      // get values of filters
      const values = filters[keys[i]];

      // if we have values, then update our existing set
      if (values !== undefined) {
        this.sets[keys[i]] = new Set(
          values.map((itemName) => this._normalizeItemName(itemName)),
        );
      }
    }
  }
}
