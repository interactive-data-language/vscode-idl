import { statSync } from 'fs';

/**
 * Find the smallest index
 */
function GetMinIdx(sizes: number[]) {
  let min = Math.max(...sizes);
  let minIdx = 0;
  for (let i = 0; i < sizes.length; i++) {
    if (sizes[i] === 0) {
      return i;
    }
    if (sizes[i] < min) {
      min = sizes[i];
      minIdx = i;
    }
  }
  return minIdx;
}

/**
 * Splits files evenly between n number of buckets
 *
 * Returns an array of string arrays that represent the files that
 * get processed on each worker or thread.
 */
export function SplitFiles(files: string[], nBuckets: number): string[][] {
  // return original
  if (nBuckets < 2) {
    return [files];
  }

  /** Track files by each bucket */
  const buckets: { [key: number]: string[] } = {};

  // set buckets
  for (let i = 0; i < nBuckets; i++) {
    buckets[i] = [];
  }

  /** Track overall sizes of files in each bucket */
  const sizes: number[] = new Array(nBuckets).fill(0);

  /** index we track in */
  let idx: number;

  // process each file
  for (let i = 0; i < files.length; i++) {
    idx = GetMinIdx(sizes);
    sizes[idx] += statSync(files[i]).size;
    buckets[idx].push(files[i]);
  }

  return Object.values(buckets);
}
