import { IElectronConfig } from "./electron-config.interface";

/** 
 * Helpers added to the web application that we can call to communicate 
 * with the main electron app
 */
export interface IElectronBridge {
  getAppVersion: () => Promise<string>;
  getConfig: () => Promise<IElectronConfig>;
  onConfigChanged: (cb: (cfg: IElectronConfig) => void) => void;
  platform: string;
  setConfig: (patch: Partial<IElectronConfig>) => Promise<void>;
}

declare global {
  interface Window {
    electron?: IElectronBridge;
  }
}
