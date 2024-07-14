/** Message to send progress */
export type ProgressMessage = 'progress';

/**
 * Payload when sending progress information
 */
export interface ProgressMessagePayload {
  /** ID of the progress we are sending a message for */
  progressId: string;
  /** Progress message percentage from 0 to 100 */
  increment: number;
  /** Title of the progress message */
  title: string;
  /** If set, the indicated progress message is finished */
  finished?: boolean;
}
