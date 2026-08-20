/** Configuration shared between the Electron main process and the Angular renderer */
export interface IElectronConfig {
  /** TCP port the embedded agents server is listening on */
  agentsPort: number;
}

/**
 * Default config for our electron app
 */
export const DEFAULT_ELECTRON_CONFIG: IElectronConfig = {
  agentsPort: 4142
}