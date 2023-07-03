/**
 * Message command (i.e. type)
 */
export type IMessageCommand =
  | 'recolor'
  | 'profiler'
  | 'nothing'
  | 'alert'
  | 'started'
  | 'show-on-startup-setting';

/**
 * Interface for VSCode messages that we send back and forth
 */
export interface IVSCodeMessage {
  command: IMessageCommand;
  data?: any;
}

/**
 * Message for profilers
 */
export interface IProfilerMessage extends IVSCodeMessage {
  data: string;
}

/**
 * Default message stored in VSCode
 */
export const DEFAULT_VSCODE_MESSAGE: IVSCodeMessage = {
  command: 'nothing',
};
