import {
  DEFAULT_NOTEBOOK,
  IDLRawNotebook,
  IDLRawNotebookVersion,
} from '@idl/notebooks/types';
import copy from 'fast-copy';

/**
 * Decodes byte data for a notebook and restores it as a raw notebook
 */
export function DecodeNotebook(
  content: Uint8Array
): IDLRawNotebook<IDLRawNotebookVersion> {
  if (content.length > 0) {
    return JSON.parse(new TextDecoder().decode(content));
  } else {
    return copy(DEFAULT_NOTEBOOK);
  }
}
