import { IDL_LANGUAGE_NAME } from '@idl/shared';
import { DocumentSelector } from 'vscode';

/**
 * Document selector for notebook
 */
export const IDL_NOTEBOOK_SELECTION_SCHEME: DocumentSelector = {
  scheme: 'vscode-notebook-cell', // only notebook cells
  language: IDL_LANGUAGE_NAME,
};
