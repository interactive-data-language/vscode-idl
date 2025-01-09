/**
 * Get the indices of case-insensitive sorting of array values
 */
export function GetSortIndexForStrings(arr: string[]) {
  const lc = arr.map((el) => el.trim().toLowerCase());
  return Array.from(lc.keys()).sort((a, b) => lc[a].localeCompare(lc[b]));
}

/**
 * Creates a shallow-copy of an object where the keys are sorted
 */
export function SortObject<T>(obj: { [key: string]: T }): { [key: string]: T } {
  // get keys
  let keys = Object.keys(obj);

  // sort keys
  keys = GetSortIndexForStrings(keys).map((idx) => keys[idx]);

  // copy array
  const sorted: { [key: string]: any } = {};

  // set keys
  for (let i = 0; i < keys.length; i++) {
    sorted[keys[i]] = obj[keys[i]];
  }

  return sorted;
}
