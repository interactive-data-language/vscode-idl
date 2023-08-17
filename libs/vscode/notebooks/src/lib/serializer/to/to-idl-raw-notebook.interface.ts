import { IDLRawNotebook, IDLRawNotebookVersion } from '@idl/notebooks/types';
import * as vscode from 'vscode';

/**
 * Function to convert a notebook to and IDL Raw Notebook format
 */
export type ToIDLRawNotebook<T extends IDLRawNotebookVersion> = (
  data: vscode.NotebookData,
  _token: vscode.CancellationToken
) => Promise<IDLRawNotebook<T>>;
