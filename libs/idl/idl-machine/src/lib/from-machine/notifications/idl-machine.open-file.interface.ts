/**
 * Notification that we have compiled a file
 */
export type OpenFileNotification = 'openFile';

/** Parameters for when we compile a file */
export type OpenFileParams = {
  /** File */
  file: string;
  /** Was it compiled? */
  isCompiled: boolean;
};
