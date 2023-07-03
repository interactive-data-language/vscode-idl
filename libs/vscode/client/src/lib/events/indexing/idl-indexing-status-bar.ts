import { IDL_TRANSLATION } from '@idl/translation';
import * as vscode from 'vscode';

/** Icon when IDL is busy/executing */
const BUSY_ICON = '$(sync~spin)';

/** Delay between showing busy status and not */
const TIMEOUT_MS = 200;

/**
 * Class that creates and manages a status bar item used in
 * conjunction with running IDL in a debug session.
 */
export class IDLIndexingStatusBar {
  /**
   * Status bar that we create
   */
  bar: vscode.StatusBarItem;

  /**
   * Track pending index options
   */
  pending = 0;

  /**
   * Timeout for a slight delay when we change the status bar entry
   */
  private _timeout: any;

  constructor() {
    // create the bar - right-most on the left
    const bar = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      -10
    );

    // set our text
    bar.text = `${BUSY_ICON} IDL: ${IDL_TRANSLATION.statusBar.indexing}`;

    // save
    this.bar = bar;
  }

  /**
   * When we start indexing something
   */
  startedIndexing() {
    this.pending++;

    // if we don't have a timeout, clear it
    if (this._timeout === undefined) {
      this._timeout = setTimeout(() => {
        this._timeout = undefined;
        this.bar.show();
      }, TIMEOUT_MS);
    }
  }

  /**
   * When we stop indexing
   */
  finishedIndexing() {
    this.pending--;

    // hide if we have nothing to do
    if (this.pending === 0) {
      this.bar.hide();
      this.clearTimeout();
    }
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
}
