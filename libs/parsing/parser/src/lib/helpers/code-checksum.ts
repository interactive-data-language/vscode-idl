import { createHash } from 'crypto';

/**
 * Generates a checksum for code to see if values have changed
 * so that we can determine if we need to re-process or not
 */
export function CodeChecksum(code: string | string[]) {
  return createHash('sha256')
    .update(Array.isArray(code) ? code.join('\n') : code)
    .digest('hex');
}
