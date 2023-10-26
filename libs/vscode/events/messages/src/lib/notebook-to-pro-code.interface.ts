/**
 * Message for converting a notebook to PRO code
 */
export type NotebookToProCodeMessage = 'notebook/to-pro-code';

/**
 * Payload when we convert notebooks to PRO code
 */
export interface INotebookToProCodePayload {
  /**
   * Notebook URI
   */
  uri: string;
}

/**
 * Response when we convert a notebooks to PRO code
 */

export interface INotebookToProCodeResponse {
  /**
   * The contents of the notebook as a PRO file
   */
  code: string;
}
