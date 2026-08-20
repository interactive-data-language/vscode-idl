/**
 * This module is responsible on handling all the setup events that is submitted by squirrel.
 */

import { spawn } from 'child_process';
import { app } from 'electron';
import { basename, join, resolve } from 'path';

import { environment } from '../../environments/environment';

export default class SquirrelEvents {
  // app paths
  private static appFolder = resolve(process.execPath, '..');

  private static appRootFolder = resolve(SquirrelEvents.appFolder, '..');
  private static exeName = resolve(
    join(
      SquirrelEvents.appRootFolder,
      'app-' + environment.version,
      basename(process.execPath),
    ),
  );
  private static isAppFirstRun = false;
  private static updateExe = resolve(
    join(SquirrelEvents.appRootFolder, 'Update.exe'),
  );

  static handleEvents(): boolean {
    if (process.argv.length === 1 || process.platform !== 'win32') {
      return false;
    }

    switch (process.argv[1]) {
      case '--squirrel-firstrun':
        // Check if it the first run of the software
        SquirrelEvents.isAppFirstRun = true;
        return false;

      case '--squirrel-obsolete':
        app.quit();
        return true;

      // eslint-disable-next-line perfectionist/sort-switch-case
      case '--squirrel-install':
      case '--squirrel-updated':
        // Install desktop and start menu shortcuts
        SquirrelEvents.update(['--createShortcut', SquirrelEvents.exeName]);

        return true;

      case '--squirrel-uninstall':
        // Remove desktop and start menu shortcuts
        SquirrelEvents.update(['--removeShortcut', SquirrelEvents.exeName]);
        return true;
    }

    return false;
  }

  static isFirstRun(): boolean {
    return SquirrelEvents.isAppFirstRun;
  }

  private static update(args: Array<string>) {
    try {
      spawn(SquirrelEvents.updateExe, args, { detached: true }).on(
        'close',
        () => setTimeout(app.quit, 1000),
      );
    } catch (error) {
      setTimeout(app.quit, 1000);
    }
  }
}
