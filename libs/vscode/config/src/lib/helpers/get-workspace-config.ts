import { IDL_LANGUAGE_NAME } from '@idl/shared';
import { DEFAULT_IDL_EXTENSION_CONFIG } from '@idl/vscode/extension-config';
import * as vscode from 'vscode';

import { IIDLWorkspaceConfig } from '../idl-config.interface';

/**
 * Get's IDL's configuration for the current VSCode workspace
 * and combines with the default configuration
 */
export function GetWorkspaceConfig(): IIDLWorkspaceConfig {
  return {
    ...DEFAULT_IDL_EXTENSION_CONFIG,
    ...vscode.workspace.getConfiguration(IDL_LANGUAGE_NAME),
  } as IIDLWorkspaceConfig;
}
