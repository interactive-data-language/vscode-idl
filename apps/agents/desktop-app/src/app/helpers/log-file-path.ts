import { tmpdir } from 'os';
import { join } from 'path';

/** Name of the log file we write to when no "--log-file" flag is given */
const DEFAULT_LOG_FILE_NAME = 'idl-agent-envi-agent.log';

/** Prefix for the command line flag that overrides the log file location */
const LOG_FILE_ARG_PREFIX = '--log-file=';

/**
 * Gets the path, on disk, that we mirror console output to.
 *
 * Checks "process.argv" for a "--log-file=<path>" flag and, if not present,
 * falls back to a file in the OS temp directory.
 */
export function GetLogFilePath(): string {
  const fromArgs = process.argv.find((arg) =>
    arg.startsWith(LOG_FILE_ARG_PREFIX),
  );

  if (fromArgs !== undefined) {
    return fromArgs.slice(LOG_FILE_ARG_PREFIX.length);
  }

  return join(tmpdir(), DEFAULT_LOG_FILE_NAME);
}
