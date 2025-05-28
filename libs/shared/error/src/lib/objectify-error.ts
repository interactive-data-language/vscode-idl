import stripAnsi from 'strip-ansi';

/**
 * Extracts properties of our error message so that
 * it correctly gets logged, serialized, and/or sent back
 * to the VSCode client
 */
export function ObjectifyError(err: Error) {
  return {
    message:
      typeof err.message === 'string'
        ? stripAnsi(err.message).split('\n')
        : err.message,
    stack:
      typeof err.stack === 'string'
        ? stripAnsi(err.stack).split('\n')
        : err.stack,
  };
}
