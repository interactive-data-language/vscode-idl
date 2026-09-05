import { Injectable, OnDestroy } from '@angular/core';
import { ObjectifyError } from '@idl/error-shared';
import {
  DEFAULT_VSCODE_MESSAGE,
  IProfilerMessage,
  VSCodeWebViewMessage,
} from '@idl/vscode/webview-shared';
import { BehaviorSubject } from 'rxjs';

import { DEFAULT_VSCODE_STATE, IVSCodeState } from '../core/vscode.interface';

@Injectable({
  providedIn: 'root',
})
export class VSCodeService implements OnDestroy {
  dontShowOnStartup = false;
  firstState = true;
  // things that we emit that others can listen to
  messages = new BehaviorSubject<VSCodeWebViewMessage>(DEFAULT_VSCODE_MESSAGE);
  newTheme = new BehaviorSubject<boolean>(false);
  profiler = new BehaviorSubject<IProfilerMessage>({
    command: 'profiler',
    data: '[]',
  });
  vscodeApi: {
    postMessage: (msg: VSCodeWebViewMessage) => void;
    getState(): IVSCodeState;
    setState(state: IVSCodeState): void;
  };

  constructor() {
    // put API reference in vscode service
    // actually defined in the index.html file
    this.vscodeApi = (window as any).vscode;

    // get our state
    const state = this.getState();

    // listen for messages from VSCode
    window.addEventListener('message', (ev) => {
      // get our actual message
      const message: VSCodeWebViewMessage = ev.data;
      this.handleMessage(message);

      // save our state
      this.setState({ lastMessage: message });
    });

    // alert vscode that we are ready
    this.vscodeApi.postMessage({ command: 'started' });

    /**
     * Console error function
     */
    const _error = console.error;

    // console.log = () => {
    //     logOfConsole.push({method: 'log', arguments: arguments});
    //     return _log.apply(console, arguments);
    // };

    // console.warn = () => {
    //     logOfConsole.push({method: 'warn', arguments: arguments});
    //     return _warn.apply(console, arguments);
    // };

    /**
     * replace console error message to catch unexpected errors
     */
    console.error = (...args) => {
      /** Second arg should be the message */
      const err = args[1];

      /** init payload */
      let data: any;

      /** Verify we have an error */
      if (err) {
        data = ObjectifyError(err);
      }
      this.vscodeApi.postMessage({
        command: 'error',
        data,
      });
      return _error.apply(console, args);
    };

    // handle the last message if we had one
    this.handleMessage(state.lastMessage);
  }

  /**
   * Get state of web app
   */
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

  /**
   * Handle message from VSCode
   */
  handleMessage(message: VSCodeWebViewMessage) {
    // determine what to do with the events
    switch (message.command) {
      case 'profiler':
        this.profiler.next(message as IProfilerMessage);
        break;
      case 'recolor':
        this.newTheme.next(true);
        break;
      case 'show-on-startup-setting':
        this.dontShowOnStartup = message.data;
        break;

      // do nothing
      default:
        break;
    }

    // emit the message
    this.messages.next(message);
  }

  /**
   * Clean up
   */
  ngOnDestroy() {
    this.messages.complete();
    this.newTheme.complete();
    this.profiler.complete();
  }

  /**
   * Set state of web app
   */
  setState(state: IVSCodeState) {
    this.vscodeApi.setState(state);
  }
}
