import { BrowserWindow } from 'electron';

/** Console methods we can forward renderer log messages to */
type ConsoleMethod = 'debug' | 'error' | 'log' | 'warn';

/** Maps the renderer console-message level to the console method we mirror it through */
const LEVEL_TO_METHOD: Record<string, ConsoleMethod> = {
  debug: 'debug',
  error: 'error',
  warning: 'warn',
};

/**
 * Forwards console messages logged by the renderer (the Angular UI) through
 * the main process console so they are captured by `ConsoleFileLogger` the
 * same way main-process log messages are.
 *
 * Relies on Electron's native `console-message` event, so no preload or IPC
 * changes are required in the renderer.
 */
export function PipeRendererConsoleToLog(window: BrowserWindow): void {
  window.webContents.on('console-message', (event) => {
    // Ignore CSS format-specifier log messages (e.g. from state loggers)
    if (typeof event.message === 'string' && event.message.includes('%c')) {
      return;
    }
    const method = LEVEL_TO_METHOD[event.level] ?? 'log';
    console[method](
      `[Renderer] ${event.message} (${event.sourceId}:${event.lineNumber})`,
    );
  });
}
