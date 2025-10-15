/**
 * Notification that we have output from IDL
 */
export type TOutNotification = 'tout';

/** Standard error instead of stdout */
type StderrOut = 0x001;

/** New line at beginning of the line */
type NewLineBeginningOut = 0x002;

/** New line at end of the line */
type NewLineEndOut = 0x004;

/** Output comes from the more facility */
type MoreOut = 0x008;

/** Hint there might be form feed characters */
type FormFeedOut = 0x010;

/** Flush buffer immediately */
type FlushBufferOut = 0x020;

/** Output not from IDL's main thread */
type NotIDLOut = 0x040;

/** Use base output function */
type BaseOut = 0x080;

/** From help, /full and more */
type HelpOut = 0x080;

/** Output flag from IDL */
type OutputFlag =
  | BaseOut
  | FlushBufferOut
  | FormFeedOut
  | HelpOut
  | MoreOut
  | NewLineBeginningOut
  | NewLineEndOut
  | NotIDLOut
  | StderrOut;

/** Parameters from the server being ready */
export type TOutParams = {
  /** String output from IDL */
  s: string;
  /** Flag from IDL */
  f: OutputFlag;
};
