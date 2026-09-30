// import UpdateEvents from './app/events/update.events';
import { app, BrowserWindow } from 'electron';

import App from './app/app';
import ElectronEvents from './app/events/electron.events';
import SquirrelEvents from './app/events/squirrel.events';

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
