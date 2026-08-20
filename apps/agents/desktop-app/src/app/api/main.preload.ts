import {
  ELECTRON_EVENTS,
  type IElectronBridge,
  type IElectronConfig,
} from '@idl/types/electron';
import { contextBridge, ipcRenderer } from 'electron';

const bridge: IElectronBridge = {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getConfig: () => ipcRenderer.invoke(ELECTRON_EVENTS.GET_CONFIG),
  onConfigChanged: (cb: (cfg: IElectronConfig) => void) => {
    ipcRenderer.on(ELECTRON_EVENTS.CONFIG_CHANGED, (_e, cfg: IElectronConfig) =>
      cb(cfg),
    );
  },
  platform: process.platform,
  setConfig: (patch) => ipcRenderer.invoke(ELECTRON_EVENTS.SET_CONFIG, patch),
};

contextBridge.exposeInMainWorld('electron', bridge);
