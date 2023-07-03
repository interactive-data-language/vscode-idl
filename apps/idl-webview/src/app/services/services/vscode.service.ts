import { Injectable } from '@angular/core';
import {
  DEFAULT_VSCODE_MESSAGE,
  IProfilerMessage,
  IVSCodeMessage,
} from '@idl/vscode/webview-shared';
import { BehaviorSubject } from 'rxjs';

import { DEFAULT_VSCODE_STATE, IVSCodeState } from '../core/vscode.interface';

@Injectable({
  providedIn: 'root',
})
export class VSCodeService {
  // things that we emit that others can listen to
  messages = new BehaviorSubject<IVSCodeMessage>(DEFAULT_VSCODE_MESSAGE);
  newTheme = new BehaviorSubject<boolean>(false);
  profiler = new BehaviorSubject<IProfilerMessage>({
    command: 'profiler',
    data: '[]',
  });
  vscodeApi: {
    postMessage: (msg: IVSCodeMessage) => void;
    getState(): IVSCodeState;
    setState(state: IVSCodeState): void;
  };
  firstState = true;
  dontShowOnStartup = false;

  constructor() {
    // put API reference in vscode service
    // actually defined in the index.html file
    this.vscodeApi = (window as any).vscode;
    // get our state
    const state = this.getState();

    // listen for messages from VSCode
    window.addEventListener('message', (ev) => {
      // get our actual message
      const message: IVSCodeMessage = ev.data;
      this.handleMessage(message);

      // save our state
      this.setState({ lastMessage: message });
    });

    // alert vscode that we are ready
    this.vscodeApi.postMessage({ command: 'started' });

    // handle the last message if we had one
    this.handleMessage(state.lastMessage);
  }

  handleMessage(message: IVSCodeMessage) {
    // determine what to do with the events
    switch (message.command) {
      case 'show-on-startup-setting':
        this.dontShowOnStartup = message.data;
        break;
      case 'recolor':
        this.newTheme.next(true);
        break;
      case 'profiler':
        this.profiler.next(message as IProfilerMessage);
        break;

      // do nothing
      default:
        break;
    }

    // emit the message
    this.messages.next(message);
  }

  getState(): IVSCodeState {
    let state = this.vscodeApi.getState();
    if (this.firstState) {
      // patch the state and saved patch to account for
      // changes in the state
      state = { ...DEFAULT_VSCODE_STATE, ...state };
      this.vscodeApi.setState(state);
      this.firstState = false;
    }
    return state;
  }

  setState(state: IVSCodeState) {
    this.vscodeApi.setState(state);
  }
}
