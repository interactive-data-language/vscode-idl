import { IDLExtensionConfig } from '@idl/vscode/extension-config';
import * as vscode from 'vscode';

/**
 * Workspace config for IDL
 */
export interface IIDLWorkspaceConfig
  extends IDLExtensionConfig,
    vscode.WorkspaceConfiguration {}
