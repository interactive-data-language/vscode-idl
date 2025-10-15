/**
 * Notification that a modal message should be displayed
 */
export type ModalMessageNotification = 'modalMessage';

/** The runtime error */
export type ModalMessageParams = {
  /** Title of the message */
  title: string;
  /** Content to display */
  text: string;
  /** Information or warning? */
  isInfo: boolean;
  willExit: boolean;
};
