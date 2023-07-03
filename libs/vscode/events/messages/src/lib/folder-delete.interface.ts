/**
 * Message for indicating that we will delete files within VSCode
 */
export type FolderDeleteMessage = 'will-delete-folders';

/**
 * Payload when we will delete folders
 */
export interface IFolderDeletePayload {
  folders: string[];
}
