import { StripANSI } from '@idl/strip-ansi';

/**
 * Extracts properties of our error message so that
 * it correctly gets logged, serialized, and/or sent back
 * to the VSCode client
 */
export function ObjectifyError(err: Error) {
  return {
    message:
      typeof err.message === 'string'
        ? StripANSI(err.message).split('\n')
        : err.message,
    stack:
      typeof err.stack === 'string'
        ? StripANSI(err.stack).split('\n')
        : err.stack,
  };
}
