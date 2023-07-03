import { IDL_COMMANDS } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import * as vscode from 'vscode';

/** Prompts to show in status bar */
export const DEFAULT_IDL_PROMPT = 'IDL';

/** Icon when IDL is running and idle */
const IDLE_ICON = '$(sync)';

/** Icon when IDL couldn't start */
const PROBLEM_ICON = '$(alert)';

/** Icon when IDL is busy/executing */
const BUSY_ICON = '$(sync~spin)';

/** Icon when we first launch and IDL has not started */
const START_IDL_ICON = '$(run)';

/** Delay between showing busy status and not */
const TIMEOUT_MS = 200;

/**
 * Class that creates and manages a status bar item used in
 * conjunction with running IDL in a debug session.
 */
export class IDLDebugStatusBar {
  /**
   * Status bar that we create
   */
  bar: vscode.StatusBarItem;

  /**
   * The prompt to show in the status bar
   */
  private prompt = DEFAULT_IDL_PROMPT;

  /**
   * Timeout for a slight delay when we change the status bar entry
   */
  private _timeout: any;

  constructor() {
    // create the bar - right-most on the left
    const bar = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      -1
    );

    // set our text
    bar.text = `${START_IDL_ICON} IDL: ${IDL_TRANSLATION.statusBar.startQuestion}`;

    // add our command to start IDL
    bar.command = IDL_COMMANDS.DEBUG.START;

    // show
    bar.show();

    // save
    this.bar = bar;
  }

  /**
   * Clears existing timeout
   */
  clearTimeout() {
    if (this._timeout !== undefined) {
      clearTimeout(this._timeout);
      this._timeout = undefined;
    }
  }

  /**
   * Sets the status bar to a text string and activates the spinner
   * after a short delay
   */
  busy(text = IDL_TRANSLATION.statusBar.running, immediate = false) {
    this.clearTimeout();

    // check if we need to immediately set our status
    if (immediate) {
      this.bar.text = `${BUSY_ICON} ${this.prompt}: ${text}`;
    } else {
      // set new timeout
      this._timeout = setTimeout(() => {
        this._timeout = undefined;
        this.bar.text = `${BUSY_ICON} ${this.prompt}: ${text}`;
      }, TIMEOUT_MS);
    }
  }

  /**
   * Sets status text after a command has finished and stops the spinner
   */
  ready(text = IDL_TRANSLATION.statusBar.ready) {
    this.clearTimeout();
    this.bar.text = `${IDLE_ICON} ${this.prompt}: ${text}`;
  }

  /**
   * Sets status text after a command has finished and stops the spinner
   */
  setStoppedStatus(text: string) {
    this.clearTimeout();
    this.bar.text = `${START_IDL_ICON} IDL: ${text} :( ${IDL_TRANSLATION.statusBar.startAgainQuestion}`;
  }

  /**
   * Sets status text after a command has failed
   */
  setProblemStatus(text: string) {
    this.clearTimeout();
    this.bar.text = `${PROBLEM_ICON} IDL: ${text}`;
  }

  /**
   * Updates the IDL prompt
   */
  resetPrompt() {
    this.prompt = DEFAULT_IDL_PROMPT;
  }

  /**
   * Updates the IDL prompt
   */
  setPrompt(prompt: string) {
    this.prompt = prompt.replace('> ', '');
  }
}
