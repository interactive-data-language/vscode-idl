import { IDL_COMMANDS } from '@idl/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';

/**
 * Verifies that, when we type `exit` we exit
 */
export const Exit: RunnerFunction = async (init) => {
  /**
   * Start IDL
   */
  const started = await vscode.commands.executeCommand(
    IDL_COMMANDS.DEBUG.START
  );

  // verify we started
  expect(started).toBeTruthy();

  // manually type exit
  await init.debug.adapter.evaluate(`exit`, { echo: true });

  // verify we get the right output
  expect(init.debug.adapter.isStarted()).toBeFalsy();
};
