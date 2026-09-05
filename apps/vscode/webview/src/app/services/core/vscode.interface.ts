import {
  DEFAULT_VSCODE_MESSAGE,
  VSCodeWebViewMessage,
} from '@idl/vscode/webview-shared';

export interface IVSCodeState {
  lastMessage: VSCodeWebViewMessage;
}

export const DEFAULT_VSCODE_STATE: IVSCodeState = {
  lastMessage: { ...DEFAULT_VSCODE_MESSAGE },
};
