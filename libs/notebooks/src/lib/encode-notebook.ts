import { RawNotebook } from './raw-notebook.interface';

/**
 * Encodes a raw notebook and data that can be written to disk
 */
export function EncodeNotebook(notebook: RawNotebook): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(notebook));
}
