import * as vscode from 'vscode';

/**
 * Track known dialogs
 */
const dialogs: {
  [key: string]: {
    progress: vscode.Progress<{
      message?: string;
      increment?: number;
    }>;
    token: vscode.CancellationToken;
    resolve: (value: unknown) => void;
  };
} = {};

/**
 * Shows progress messages and.or updates progress for dialogs that exist
 */
export function VSCodeDisplayOrUpdateProgress(
  id: string,
  message: string,
  increment: number,
  finished?: boolean
) {
  // check for known progress
  if (id in dialogs) {
    // if finished, then close
    if (finished) {
      dialogs[id].resolve(null);
      delete dialogs[id];
    } else {
      // update progress
      dialogs[id].progress.report({ message: '', increment });
    }
    return;
  } else {
    // return if we have progress that is finished that we dont know
    if (finished) {
      return;
    }
  }

  /**
   * Create new progress dialog
   */
  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: message,
    },
    (progress, token) => {
      // get reference to callback for completion
      let resolver: (value: unknown) => void;

      // create promise to resolve when we are complete
      const prom = new Promise((res, rej) => {
        resolver = res;
      });

      // save as pending dialog
      dialogs[id] = { progress, token, resolve: resolver };

      // return overall promise
      return prom;
    }
  );
}
