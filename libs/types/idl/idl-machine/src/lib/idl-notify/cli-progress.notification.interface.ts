/** Type of progress bar, 0 = standard bar, 1 = ping-pong spinner */
type BarType = 0 | 1;

/**
 * Data type for the progress notification
 */
export interface ICLIProgressNotification {
  /** Type of bar */
  bartype: BarType;
  /** Character used to fill "completed" segments */
  complete_char: string;
  /** Did this come from the erase method? */
  erase: boolean; // bool: did this come from the erase method?
  /** Character used for "incomplete" segments */
  incomplete_char: string;
  /** Total steps to reach completion */
  maximum: number; // double: total number of steps to reach completion
  /** Did this come from the newline method? */
  newline: boolean; // bool: did this come from the newline method?
  /** Percent complete, empty string if no percentage provided */
  percent: string;
  /** String for remaining time, if no percentage then empty string */
  remaining: string;
  /** Single element of the spinners value */
  spinner: string;
  /** String for the progress bar */
  string: string;
  /** Trailing message after the bar */
  text: string;
  /** Label before the bar */
  title: string;
  /** Current progress step */
  value: 199;
  /** Bar width in characters */
  width: 40;
}
