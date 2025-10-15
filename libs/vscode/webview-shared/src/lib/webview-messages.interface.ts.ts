/**
 * Message command (i.e. type)
 */
export type IMessageCommand =
  | 'alert'
  | 'error'
  | 'nothing'
  | 'profiler'
  | 'recolor'
  | 'show-on-startup-setting'
  | 'started';

/**
 * Interface for VSCode messages that we send back and forth
 */
export interface VSCodeWebViewMessage {
  command: IMessageCommand;
  data?: any;
}

/**
 * Message for profilers
 */
export interface IProfilerMessage extends VSCodeWebViewMessage {
  data: string;
}

/**
 * Default message stored in VSCode
 */
export const DEFAULT_VSCODE_MESSAGE: VSCodeWebViewMessage = {
  command: 'nothing',
};
