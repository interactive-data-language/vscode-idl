import { IDLRawNotebook, IDLRawNotebookVersion } from '@idl/notebooks/types';
import * as vscode from 'vscode';

/**
 * Function signature to convert raw notebooks to vscode Notebooks
 */
export type FromIDLRawNotebook<T extends IDLRawNotebookVersion> = (
  notebook: IDLRawNotebook<T>,
  _token: vscode.CancellationToken
) => Promise<vscode.NotebookData>;
