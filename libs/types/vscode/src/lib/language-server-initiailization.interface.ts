import { IVSCodeServerPorts } from './vscode-server-ports.interface';

/**
 * Options for initializing the language server
 */
export interface ILanguageServerInitializationOptions {
  /** Server ports */
  serverPorts: IVSCodeServerPorts;
}
