import { IInitializeClientResult } from '@idl/vscode/client';
import { IInitializeDebuggerResult } from '@idl/vscode/debug';
import { IInitializeNotebooks } from '@idl/vscode/notebooks';

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
  /** Notebook initialization values */
  notebooks: IInitializeNotebooks;
}
