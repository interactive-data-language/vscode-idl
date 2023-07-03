import { GetRuntimePath } from '@idl/shared';
import { existsSync, readFileSync, writeFileSync } from 'fs';

/**
 * Path for our cache file
 */
const CACHE_URI = GetRuntimePath(
  'apps/test-tokenizer/src/test-maker/cache/cache.json'
);

/**
 * Cache read from disk
 */
let CACHE = existsSync(CACHE_URI)
  ? JSON.parse(readFileSync(CACHE_URI, 'utf-8'))
  : {};

/**
 * Resets the cache so all tests are generated again
 */
export function ResetCache() {
  CACHE = {};

  // also reset cache on disk
  SaveTestCache();
}

/**
 * Returns a boolean if our cache has changed.
 *
 * Saves new values if we have them as well
 */
export function HasTestCacheChanged(
  testGroup: string,
  file: string,
  value: any
) {
  /** Flag if we have changes */
  let changes = true;

  // make if it doesnt exist
  if (!(testGroup in CACHE)) {
    CACHE[testGroup] = {};
  }

  // get the parent
  const p = CACHE[testGroup];

  // convert our value to a string
  const newVal = JSON.stringify(value);

  // check if we have in our cache
  if (file in p) {
    // if same value, we have no changes
    if (p[file] === newVal) {
      changes = false;
    } else {
      p[file] = newVal;
    }
  } else {
    p[file] = newVal;
  }

  // return flag if we have had changes
  return changes;
}

/**
 * Saves our cache to disk
 */
export function SaveTestCache() {
  writeFileSync(CACHE_URI, JSON.stringify(CACHE));
}
