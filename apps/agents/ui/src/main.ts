import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { PatchConsoleForElectron } from './app/helpers/patch-console-for-electron';

// serialize logged objects before Electron forwards console messages to the main process
PatchConsoleForElectron();

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
