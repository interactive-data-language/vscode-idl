/**
 * Message for renaming files
 */
export type FileRenameMessage = 'textDocument/didRename';

/**
 * Payload when we rename files
 */
export interface IFileRenamePayload {
  files: {
    /** Old FS Path to file, should already account for symbolic links */
    oldUri: string;
    /** New FS path to file, should already account for symbolic links */
    newUri: string;
  }[];
}
