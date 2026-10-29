import type { IVSCodeServerPorts } from '@idl/types/vscode';
import type { IInitializeClientResult } from '@idl/vscode/client';
import type { IInitializeDebuggerResult } from '@idl/vscode/debug';
import type { IDLDecorationsManager } from '@idl/vscode/decorations';
import type { IInitializeMCPResult } from '@idl/vscode/mcp';
import type { IInitializeNotebooks } from '@idl/vscode/notebooks/client';
import type { IDLWebView } from '@idl/vscode/webview';

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
