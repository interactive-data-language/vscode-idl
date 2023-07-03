import { CleanIDLOutput } from '@idl/idl';
import { IDL_COMMANDS } from '@idl/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';

/**
 * Function that verifies that we can do basic debugging of IDL sessions
 * and launch a new debugging session.
 */
export const StartDebugging: RunnerFunction = async (init) => {
  /**
   * Start IDL
   */
  const started = await vscode.commands.executeCommand(
    IDL_COMMANDS.DEBUG.START
  );

  // verify we started
  expect(started).toBeTruthy();

  /**
   * Evaluate something and get result
   */
  const res = CleanIDLOutput(
    await init.debug.adapter.evaluate(`print, 'Hello world'`, { echo: true })
  );

  // verify we get the right output
  expect(res).toEqual('Hello world');
};
