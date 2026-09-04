import { GetExtensionPath } from '@idl/idl/files';
import {
  IStartAgentsServerResult,
  StartAgentsServer,
} from '@idl/mcp/standalone-server';
import { getPorts } from '@idl/server-helpers';
import { DEFAULT_AGENT_SERVER_CONFIG } from '@idl/types/agents';
import { ELECTRON_EVENTS } from '@idl/types/electron';
import { BrowserWindow, ipcMain, screen, shell } from 'electron';
import { copy } from 'fast-copy';
import { readFileSync } from 'fs';
import { join } from 'path';
import { format } from 'url';

import { environment } from '../environments/environment';
import { rendererAppName, rendererAppPort } from './constants';

export default class App {
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  static agentsServer: IStartAgentsServerResult | undefined = undefined;
  static application: Electron.App;
  static BrowserWindow: typeof BrowserWindow;

  /** Config for the electron app */
  static config = copy(DEFAULT_AGENT_SERVER_CONFIG);

  static mainWindow: BrowserWindow | null = null;
  static splashWindow: BrowserWindow | null = null;

  public static isDevelopmentMode() {
    const isEnvironmentSet: boolean = 'ELECTRON_IS_DEV' in process.env;
    const getFromEnvironment = () =>
      parseInt(process.env.ELECTRON_IS_DEV!, 10) === 1;

    return isEnvironmentSet ? getFromEnvironment() : !environment.production;
  }

  static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
    // we pass the Electron.App object and the
    // Electron.BrowserWindow into this function
    // so this class has no dependencies. This
    // makes the code easier to write tests for

    App.BrowserWindow = browserWindow;
    App.application = app;

    App.application.on('window-all-closed', App.onWindowAllClosed); // Quit when all windows are closed.
    App.application.on('ready', App.onReady); // App is ready to load data
    App.application.on('activate', App.onActivate); // App is activated
    App.application.on('before-quit', async () => {
      if (App.agentsServer !== undefined) {
        await App.agentsServer.stop();
      }
    });

    // try to load our config from disk
    try {
      const file = GetExtensionPath('desktop-agents.config.json');
      console.log('Loading config from file on disk');
      this.config = JSON.parse(readFileSync(file, 'utf-8'));
    } catch (err) {
      console.log('Problem loading config from file');
      console.log(err);
    }
  }

  private static createSplashWindow() {
    App.splashWindow = new BrowserWindow({
      width: 258,
      height: 451,
      frame: false,
      resizable: false,
      movable: false,
      show: false,
      transparent: true,
      icon: join(__dirname, 'assets', 'splash-screen.png'),
      webPreferences: {
        contextIsolation: true,
      },
    });
    App.splashWindow.setMenu(null);
    App.splashWindow.center();
    App.splashWindow.loadFile(join(__dirname, 'assets', 'splash.html'));
    App.splashWindow.once('ready-to-show', () => {
      App.splashWindow?.show();
    });
    App.splashWindow.on('closed', () => {
      App.splashWindow = null;
    });
  }

  private static initMainWindow() {
    const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
    const width = Math.min(1280, workAreaSize.width || 1280);
    const height = Math.min(720, workAreaSize.height || 720);

    // Create the browser window.
    App.mainWindow = new BrowserWindow({
      width: width,
      height: height,
      minWidth: 392,
      minHeight: 700,
      show: false,
      icon: join(__dirname, 'assets', 'icon.png'),
      webPreferences: {
        contextIsolation: true,
        backgroundThrottling: false,
        preload: join(__dirname, 'main.preload.js'),
      },
    });
    App.mainWindow.setMenu(null);
    App.mainWindow.center();

    // Handle keyboard shortcuts for zooming (Ctrl/Cmd + '+', '-', '0')
    App.mainWindow.webContents.on('before-input-event', (event, input) => {
      if (input.type === 'keyDown' && (input.control || input.meta)) {
        if (
          input.key === '=' ||
          input.key === '+' ||
          input.key === 'NumpadAdd'
        ) {
          const currentZoom = App.mainWindow?.webContents.getZoomFactor() ?? 1;
          App.mainWindow?.webContents.setZoomFactor(currentZoom + 0.1);
          event.preventDefault();
        } else if (input.key === '-' || input.key === 'NumpadSubtract') {
          const currentZoom = App.mainWindow?.webContents.getZoomFactor() ?? 1;
          App.mainWindow?.webContents.setZoomFactor(
            Math.max(0.2, currentZoom - 0.1),
          );
          event.preventDefault();
        } else if (input.key === '0' || input.key === 'Numpad0') {
          App.mainWindow?.webContents.setZoomFactor(1);
          event.preventDefault();
        }
      }
    });

    // if main window is ready to show, close the splash window and show the main window
    App.mainWindow.once('ready-to-show', () => {
      App.splashWindow?.close();
      App.mainWindow!.show();
    });

    // handle all external redirects in a new browser window
    // App.mainWindow.webContents.on('will-navigate', App.onRedirect);
    // App.mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options) => {
    //     App.onRedirect(event, url);
    // });

    // Emitted when the window is closed.
    App.mainWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      App.mainWindow = null;
    });
  }

  private static loadMainWindow() {
    // load the index.html of the app.
    if (!App.application.isPackaged) {
      App.mainWindow!.loadURL(`http://localhost:${rendererAppPort}`);
    } else {
      App.mainWindow!.loadURL(
        format({
          // @angular/build:application outputs under a "browser" subfolder
          pathname: join(
            __dirname,
            '..',
            rendererAppName,
            'browser',
            'index.html',
          ),
          protocol: 'file:',
          slashes: true,
        }),
      );
    }
  }

  private static onActivate() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (App.mainWindow === null) {
      App.onReady();
    }
  }

  // boilerplate method. Can be safely deleted if not needed
  private static onClose() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    App.mainWindow = null;
  }

  private static async onReady() {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.

    // show a splash screen right away while the agents server starts and the main window loads
    App.createSplashWindow();

    // Start the embedded agents server (MCP + chat routes)
    try {
      // get port to use
      App.config.server.port = await getPorts();

      App.agentsServer = await StartAgentsServer(App.config);
    } catch (err) {
      console.error('[desktop-app] Failed to start agents server:', err);
    }

    // bootstrap the renderer with the REST API server's host/port; the
    // renderer fetches/updates the rest of the config over HTTP from there
    ipcMain.handle(ELECTRON_EVENTS.GET_SERVER_INFO, () =>
      copy(App.config.server),
    );

    if (rendererAppName) {
      App.initMainWindow();
      App.loadMainWindow();
    }

    // Open DevTools immediately
    if (process.env.ELECTRON_IS_DEV) {
      App.mainWindow?.webContents.openDevTools();
    }
  }

  // boilerplate method. Can be safely deleted if not needed
  private static onRedirect(event: any, url: string) {
    if (url !== App.mainWindow!.webContents.getURL()) {
      // this is a normal external redirect, open it in a new browser window
      event.preventDefault();
      shell.openExternal(url);
    }
  }

  private static onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      App.application.quit();
    }
  }
}
