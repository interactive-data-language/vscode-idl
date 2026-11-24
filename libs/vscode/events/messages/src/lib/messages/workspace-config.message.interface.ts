import type { IDLExtensionConfig } from '@idl/vscode/extension-config';

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

/** Config files that we can initialize in a workspace folder */
export type InitWorkspaceConfigType = 'formatting' | 'package' | 'test';

/**
 * Information we expect to send back and forth for our workspace config
 */
export interface IInitWorkspaceConfigPayload {
  /** Folder we are initializing */
  folder: string;
  /** Which config file to create */
  type: InitWorkspaceConfigType;
}
