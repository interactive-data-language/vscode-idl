import copy from 'fast-copy';

import { DEFAULT_NOTEBOOK, RawNotebook } from './raw-notebook.interface';

/**
 * Decodes byte data for a notebook and restores it as a raw notebook
 */
export function DecodeNotebook(content: Uint8Array): RawNotebook {
  if (content.length > 0) {
    return JSON.parse(new TextDecoder().decode(content));
  } else {
    return copy(DEFAULT_NOTEBOOK);
  }
}
