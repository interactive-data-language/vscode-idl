import { FromIDLMachineRequestHandler } from '@idl/idl/idl-machine';
import * as vscode from 'vscode';

/**
 * Make the request handler
 */
export const IDLMachineReadIOLineRequestHandler: FromIDLMachineRequestHandler<
  'readIOLine'
> = async (params) => {
  try {
    /** Create cancellation token */
    const tokenSource = new vscode.CancellationTokenSource();

    /** Ask user for input */
    const resp = await vscode.window.showInputBox(
      {
        title: params.prompt,
      },
      tokenSource.token
    );

    /**
     * Handle response and check to see if it was canceled
     */
    switch (true) {
      // input was canceled programmatically
      case tokenSource.token.isCancellationRequested:
        return '';
      // user canceled (escape)
      case resp === undefined:
        return '';
      // return the user response
      default:
        return resp;
    }
  } catch (err) {
    return '';
  }
};
