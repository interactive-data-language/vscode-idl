import { IServerConfig } from './electron-config.interface';

/**
 * Helpers added to the web application that we can call to communicate
 * with the main electron app
 */
export interface IElectronBridge {
  getAppVersion: () => Promise<string>;
  /** Host/port of the embedded REST API server, used to bootstrap all other config over HTTP */
  getServerInfo: () => Promise<IServerConfig>;
  platform: string;
}

declare global {
  interface Window {
    electron?: IElectronBridge;
  }
}
