/**
 * Message for renaming files
 */
export type FileRenameMessage = 'textDocument/didRename';

/**
 * Payload when we rename files
 */
export interface IFileRenamePayload {
  files: {
    oldUri: string;
    newUri: string;
  }[];
}
