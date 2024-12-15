/**
 * Notification to set the TTY size for IDL
 */
export type SetTTYSizeNotification = 'setTTYSize';

/** Number of items to return */
export type SetTTYSizeParams = {
  /** Lines (height?) */
  lines: number;
  /** Width in characters */
  columns: number;
};
