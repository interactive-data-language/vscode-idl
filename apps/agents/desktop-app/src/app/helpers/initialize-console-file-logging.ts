import { StripANSI } from '@idl/strip-ansi';
import { app } from 'electron';
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  renameSync,
  statSync,
  WriteStream,
} from 'fs';
import { dirname } from 'path';
import { format } from 'util';

import { GetLogFilePath } from './log-file-path';

/** Console methods that we mirror to disk */
const CONSOLE_METHODS = ['log', 'warn', 'error', 'info', 'debug'] as const;

/** Console method we mirror to disk */
type ConsoleMethod = (typeof CONSOLE_METHODS)[number];

/** Rotate the log file once it grows past this size, in bytes */
const MAX_LOG_SIZE_BYTES = 5 * 1024 * 1024;

/** Suffix applied to the previous log file when we rotate */
const ROTATED_SUFFIX = '.old';

/** Command line flag that also strips ANSI color codes from console output */
const NO_COLOR_FLAG = '--no-color';

/**
 * Monkey-patches the console so that every call still prints normally
 * and is also mirrored, as a timestamped line, to a log file on disk.
 */
export class ConsoleFileLogger {
  /** Path, on disk, that we are writing to */
  private static filePath: string;

  /** Unpatched console methods, used to print and to report our own write failures */
  private static originals: Record<ConsoleMethod, (...args: any[]) => void>;

  /** Number of bytes written to the current log file since it was opened/rotated */
  private static sizeBytes = 0;

  /** Stream we append log lines to */
  private static stream: WriteStream;

  /** If set via "--no-color", also strip ANSI codes from console output */
  private static stripColor = false;

  /**
   * Patches console.log/warn/error/info/debug and opens the log file for writing.
   *
   * Safe to call once, as early as possible in the app lifecycle.
   */
  static initialize(): void {
    ConsoleFileLogger.stripColor = process.argv.includes(NO_COLOR_FLAG);

    // get the path for where we write
    ConsoleFileLogger.filePath = GetLogFilePath();

    // make file
    mkdirSync(dirname(ConsoleFileLogger.filePath), { recursive: true });

    // check if we need to clear the content
    ConsoleFileLogger.rotateIfNeeded();
    ConsoleFileLogger.sizeBytes = existsSync(ConsoleFileLogger.filePath)
      ? statSync(ConsoleFileLogger.filePath).size
      : 0;
    ConsoleFileLogger.stream = createWriteStream(ConsoleFileLogger.filePath, {
      flags: 'a',
    });

    ConsoleFileLogger.originals = {} as Record<
      ConsoleMethod,
      (...args: any[]) => void
    >;

    for (const method of CONSOLE_METHODS) {
      ConsoleFileLogger.originals[method] = console[method].bind(console);
      console[method] = (...args: any[]) => {
        if (ConsoleFileLogger.stripColor) {
          ConsoleFileLogger.originals[method](StripANSI(format(...args)));
        } else {
          ConsoleFileLogger.originals[method](...args);
        }
        ConsoleFileLogger.writeLine(method, args);
      };
    }

    app.on('before-quit', () => ConsoleFileLogger.stream.end());
  }

  /**
   * Renames the current log file out of the way if it has grown past our size limit,
   * overwriting whatever was previously rotated out.
   */
  private static rotateIfNeeded(): void {
    if (!existsSync(ConsoleFileLogger.filePath)) {
      return;
    }

    if (statSync(ConsoleFileLogger.filePath).size > MAX_LOG_SIZE_BYTES) {
      renameSync(
        ConsoleFileLogger.filePath,
        ConsoleFileLogger.filePath + ROTATED_SUFFIX,
      );
    }
  }

  /**
   * Formats and appends a single log line, rotating the file if we have
   * grown past our size limit.
   */
  private static writeLine(type: ConsoleMethod, args: any[]): void {
    try {
      const line = `[${new Date().toISOString()}] [${type.toUpperCase()}] ${StripANSI(format(...args))}\n`;
      ConsoleFileLogger.stream.write(line);
      ConsoleFileLogger.sizeBytes += Buffer.byteLength(line);

      if (ConsoleFileLogger.sizeBytes > MAX_LOG_SIZE_BYTES) {
        ConsoleFileLogger.stream.end();
        renameSync(
          ConsoleFileLogger.filePath,
          ConsoleFileLogger.filePath + ROTATED_SUFFIX,
        );
        ConsoleFileLogger.stream = createWriteStream(
          ConsoleFileLogger.filePath,
          { flags: 'a' },
        );
        ConsoleFileLogger.sizeBytes = 0;
      }
    } catch (err) {
      // use the original console so we don't recurse back into ourselves
      ConsoleFileLogger.originals.error('Failed to write log to disk', err);
    }
  }
}
