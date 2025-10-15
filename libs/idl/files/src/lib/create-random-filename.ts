import { customAlphabet } from 'nanoid';
import { performance } from 'perf_hooks';

/** Custom nanoid with just numbers */
const nanoid = customAlphabet('1234567890', 10);

/**
 * Creates a random filename that should be unique
 */
export function CreateRandomFilename(base: string, extension: string) {
  /** Time in ms */
  const ms = Math.floor(performance.now());

  // add random and return
  return `${base}_${ms}_${nanoid()}${extension}`;
}
