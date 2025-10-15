import { IInitializeClientResult } from '@idl/vscode/client';
import { IInitializeDebuggerResult } from '@idl/vscode/debug';
import { IDLDecorationsManager } from '@idl/vscode/decorations';
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
  /** Notebook initialization values */
  notebooks: IInitializeNotebooks;
  /** Webview panel for VSCode */
  webview: typeof IDLWebView;
}
