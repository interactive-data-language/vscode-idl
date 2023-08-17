import { IDLRawNotebook, IDLRawNotebookVersion } from '@idl/notebooks/types';

/**
 * Encodes a raw notebook and data that can be written to disk
 */
export function EncodeNotebook(
  notebook: IDLRawNotebook<IDLRawNotebookVersion>
): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(notebook, null, 2));
}

/**
 * No pretty print with stringified GeoJSON
 */
// idl-notebook info It took 79 ms to serialize notebook to 4532 kb
// extensionHostProcess.js:108
// idl-notebook info It took 202 ms to serialize notebook to 10163 kb
// extensionHostProcess.js:108
// idl-notebook info It took 215 ms to serialize notebook to 10163 kb

/**
 * Pretty print with embedded GeoJSON
 */
// idl-notebook info It took 445 ms to serialize notebook to 30612 kb
// extensionHostProcess.js:108
// idl-notebook info It took 541 ms to serialize notebook to 30612 kb
