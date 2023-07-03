import {
  DEFAULT_VSCODE_MESSAGE,
  IVSCodeMessage,
} from '@idl/vscode/webview-shared';

export interface IVSCodeState {
  lastMessage: IVSCodeMessage;
}

export const DEFAULT_VSCODE_STATE: IVSCodeState = {
  lastMessage: { ...DEFAULT_VSCODE_MESSAGE },
};
