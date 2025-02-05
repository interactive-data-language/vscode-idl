import { NOTEBOOK_OUTPUT_METADATA_DONT_SAVE_THESE } from '@idl/types/notebooks';

/**
 * Removes keys from metadata that should not be saved
 */
export function CleanOutputMetadata(meta?: { [key: string]: any }) {
  if (meta === undefined) {
    return;
  }
  for (let j = 0; j < NOTEBOOK_OUTPUT_METADATA_DONT_SAVE_THESE.length; j++) {
    delete meta[NOTEBOOK_OUTPUT_METADATA_DONT_SAVE_THESE[j]];
  }
}
