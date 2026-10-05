/** Console methods we patch to serialize non-string arguments */
type ConsoleMethod = 'debug' | 'error' | 'log' | 'warn';

/** Console methods we patch to serialize non-string arguments */
const PATCHED_METHODS: ConsoleMethod[] = ['debug', 'error', 'log', 'warn'];

/**
 * Converts a single console argument to a readable string.
 *
 * Objects are JSON-stringified (falling back to `String()` for circular
 * references or other serialization failures) since Electron's
 * `console-message` event only forwards a flattened string to the main
 * process and otherwise reports objects as `[object Object]`.
 */
function FormatConsoleArg(arg: unknown): unknown {
  if (typeof arg !== 'object' || arg === null) {
    return arg;
  }
  if (arg instanceof Error) {
    return arg.stack ?? arg.message;
  }
  try {
    return JSON.stringify(arg, undefined, 2);
  } catch {
    return String(arg);
  }
}

/**
 * Patches `console.log/warn/error/debug` so that object arguments are
 * serialized to readable strings before Electron forwards them to the main
 * process via the `console-message` WebContents event.
 *
 * No-op outside of Electron's renderer (e.g. `ng serve` in a regular
 * browser) so normal devtools object inspection is left untouched.
 */
export function PatchConsoleForElectron(): void {
  if (!navigator.userAgent.includes('Electron')) {
    return;
  }
  for (const method of PATCHED_METHODS) {
    const original = console[method].bind(console);
    console[method] = (...args: unknown[]) => {
      original(...args.map(FormatConsoleArg));
    };
  }
}
