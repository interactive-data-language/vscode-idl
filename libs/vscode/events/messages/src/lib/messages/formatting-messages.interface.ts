/** Message to add docs to routines in file */
export type AddDocsMessage = 'add-docs';

/** Message to specify that we are formatting a file */
export type FormatFileMessage = 'format-file';

/** Message to format a workspace */
export type FormatWorkspaceMessage = 'format-workspace';

/**
 * Payload when formatting a workspace
 */
export interface FormatWorkspacePayload {
  /** One of more folders to format */
  folders: string[];
}

/**
 * Response when we format a workspace
 */
export interface FormatWorkspaceResponse {
  /** Failures */
  failures: string[];
}
