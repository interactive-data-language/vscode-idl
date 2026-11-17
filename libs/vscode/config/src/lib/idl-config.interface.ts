import type { IDLExtensionConfig } from '@idl/vscode/extension-config';
import type * as vscode from 'vscode';

/**
 * Workspace config for IDL
 */
export interface IIDLWorkspaceConfig
  extends IDLExtensionConfig,
    vscode.WorkspaceConfiguration {}
