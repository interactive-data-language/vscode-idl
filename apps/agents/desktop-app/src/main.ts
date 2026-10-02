// import UpdateEvents from './app/events/update.events';
import { app, BrowserWindow } from 'electron';

import App from './app/app';
import ElectronEvents from './app/events/electron.events';
import SquirrelEvents from './app/events/squirrel.events';
import { ConsoleFileLogger } from './app/helpers/initialize-console-file-logging';

// mirror console output to disk as early as possible so nothing is missed
ConsoleFileLogger.initialize();

// without these, an uncaught error/rejection in the main process crashes or
// hangs the app silently with nothing written to the log
process.on('uncaughtException', (err) => {
  console.error('[main] Uncaught exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[main] Unhandled promise rejection:', reason);
});

export default class Main {
  static bootstrapApp() {
    App.main(app, BrowserWindow);
  }

  static bootstrapAppEvents() {
    ElectronEvents.bootstrapElectronEvents();

    // initialize auto updater service
    if (!App.isDevelopmentMode()) {
      // UpdateEvents.initAutoUpdateService();
    }
  }

  static initialize() {
    if (SquirrelEvents.handleEvents()) {
      // squirrel event handled (except first run event) and app will exit in 1000ms, so don't do anything else
      app.quit();
    }
  }
}

// only allow a single instance of the app to run at a time
if (!app.requestSingleInstanceLock()) {
  // another instance (possibly a stuck/zombie one) already holds the lock
  console.log('[main] Another instance is already running, quitting');
  app.quit();
} else {
  app.on('second-instance', () => {
    App.focusMainWindow();
  });

  // handle setup events as quickly as possible
  Main.initialize();

  // bootstrap app
  Main.bootstrapApp();
  Main.bootstrapAppEvents();
}
