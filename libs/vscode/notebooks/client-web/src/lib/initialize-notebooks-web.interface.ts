import { IDLNotebookSerializer } from '@idl/vscode/notebooks/shared';

/**
 * Result when we initialize notebooks
 */
export interface IInitializeNotebooksWeb {
  /**
   * Serializer to load/save notebooks
   */
  serializer: IDLNotebookSerializer;
}
