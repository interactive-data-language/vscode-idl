import { IVSCodeServerPorts } from '@idl/types/vscode';
import { IInitializeClientResult } from '@idl/vscode/client';
import { IInitializeDebuggerResult } from '@idl/vscode/debug';
import { IDLDecorationsManager } from '@idl/vscode/decorations';
import { IInitializeMCPResult } from '@idl/vscode/mcp';
import { IInitializeNotebooks } from '@idl/vscode/notebooks/client';
import { IDLWebView } from '@idl/vscode/webview';

/**
 * Data returned from initializing the VSCode extension.
 *
 * Lib must contain this so we dont have circular dependencies
 */
export interface IInitializeType {
  /** Language client initialization */
  client: IInitializeClientResult;
  /** Debugger initialization values */
  debug: IInitializeDebuggerResult;
  /** Direct access to decorations management */
  decorations: IDLDecorationsManager;
  /** Value from initializing MCP */
  mcp: IInitializeMCPResult;
  /** Notebook initialization values */
  notebooks: IInitializeNotebooks;
  /** Ports selected for active servers */
  ports: IVSCodeServerPorts;
  /** Webview panel for VSCode */
  webview: typeof IDLWebView;
}
