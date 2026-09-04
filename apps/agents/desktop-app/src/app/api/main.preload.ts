import { ELECTRON_EVENTS, type IElectronBridge } from '@idl/types/electron';
import { contextBridge, ipcRenderer } from 'electron';

const bridge: IElectronBridge = {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getServerInfo: () => ipcRenderer.invoke(ELECTRON_EVENTS.GET_SERVER_INFO),
  platform: process.platform,
};

contextBridge.exposeInMainWorld('electron', bridge);
