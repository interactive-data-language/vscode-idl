import { CleanIDLOutput } from '@idl/idl';
import { IDL_COMMANDS } from '@idl/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';

/**
 * Verifies that simple statements that should be executed as implied print are
 * indeed interpreted like that
 */
export const ImpliedPrint: RunnerFunction = async (init) => {
  /**
   * Start IDL
   */
  const started = await vscode.commands.executeCommand(
    IDL_COMMANDS.DEBUG.START
  );

  // verify we started
  expect(started).toBeTruthy();

  // compile file
  const res = CleanIDLOutput(
    await init.debug.adapter.evaluate(`!version`, { echo: true })
  ).toLowerCase();

  // make sure we compile
  expect(res.includes('attempt to call undefined procedure')).toBeFalsy();
};
