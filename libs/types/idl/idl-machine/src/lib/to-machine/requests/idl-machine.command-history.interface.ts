/**
 * Retrieve history from IDL Sessions
 */
export type CommandHistoryRequest = 'history';

/** Number of items to return for history */
export type CommandHistoryParams = number;

/**
 * Individual command history item
 */
interface ICommandHistoryItem {
  /** Command executed */
  command: string;
  /** Date, YYY-MM-DD */
  date: string;
  /** Time: HH:MM:SS */
  time: string;
}

/**
 * Response when asking for command history
 */
export type CommandHistoryResponse = ICommandHistoryItem[];
