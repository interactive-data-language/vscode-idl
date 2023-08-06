import { IDLRawNotebook, IDLRawNotebookVersion } from '@idl/notebooks/types';

/**
 * Encodes a raw notebook and data that can be written to disk
 */
export function EncodeNotebook(
  notebook: IDLRawNotebook<IDLRawNotebookVersion>
): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(notebook, null, 2));
}
