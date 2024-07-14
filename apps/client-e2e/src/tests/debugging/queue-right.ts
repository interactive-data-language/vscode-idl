import { IDL_COMMANDS } from '@idl/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';

/**
 * Function that verifies that our queueing works right
 */
export const QueueRight: RunnerFunction = async (init) => {
  /**
   * Start IDL
   */
  const started = await vscode.commands.executeCommand(
    IDL_COMMANDS.DEBUG.START
  );

  // verify we started
  expect(started).toBeTruthy();

  /**
   * Execute two commands at once
   */
  const p1 = init.debug.adapter.evaluate(`wait, 1`);
  const p2 = init.debug.adapter.evaluate(`wait, 1`);

  // wait for everything to finish
  await Promise.all([p1, p2]);

  // make sure the outputs are the same
  expect((await p1).trim()).toEqual('');
  expect((await p2).trim()).toEqual('');
};
