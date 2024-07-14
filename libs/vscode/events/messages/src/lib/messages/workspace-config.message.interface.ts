import { IDLExtensionConfig } from '@idl/vscode/extension-config';

/** Message to update workspace config */
export type WorkspaceConfigMessage = 'workspace-config';

/**
 * Information we expect to send back and forth for our workspace config
 */
export interface IWorkspaceConfigPayload {
  /** Configuration for IDL */
  config: IDLExtensionConfig;
}

/** Message to initialize workspace config */
export type InitWorkspaceConfigMessage = 'init-workspace-config';

/**
 * Information we expect to send back and forth for our workspace config
 */
export interface IInitWorkspaceConfigPayload {
  /** Folder we are initializing */
  folder: string;
}
