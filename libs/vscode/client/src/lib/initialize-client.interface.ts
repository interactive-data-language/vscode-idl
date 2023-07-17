import { LogManager } from '@idl/logger';
import { IIDLWorkspaceConfig } from '@idl/vscode/config';
import { LanguageClient } from 'vscode-languageclient/node';

/** What we return from initializing the extension client */
export interface IInitializeClientResult {
  /** Reference to the language server connection */
  client: LanguageClient;
  /** Extension config */
  config: IIDLWorkspaceConfig;
  /** Flag that indicates if we failed to start the language server */
  failedStart: boolean;
  /** Reference to the IDL log manager */
  logger: LogManager;
}
