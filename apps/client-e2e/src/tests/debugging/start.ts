import { CleanIDLOutput } from '@idl/idl';
import { IDL_COMMANDS, Sleep } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';

/**
 * Function that verifies that we can do basic debugging of IDL sessions
 * and launch a new debugging session.
 */
export const StartDebugging: RunnerFunction = async (init) => {
  // check status bar before running test
  expect(
    init.debug.statusBar.bar.text.endsWith(
      IDL_TRANSLATION.statusBar.startQuestion
    )
  ).toBeTruthy();

  /**
   * Start IDL
   */
  const started = await vscode.commands.executeCommand(
    IDL_COMMANDS.DEBUG.START
  );

  // verify we started
  expect(started).toBeTruthy();

  // short pause
  await Sleep(100);

  // check status bar before running test
  expect(
    init.debug.statusBar.bar.text.endsWith(IDL_TRANSLATION.statusBar.ready)
  ).toBeTruthy();

  /**
   * Evaluate something and get result
   */
  const res = CleanIDLOutput(
    await init.debug.adapter.evaluate(`print, 'Hello world'`, { echo: true })
  );

  // verify we get the right output
  expect(res).toEqual('Hello world');

  // short pause
  await Sleep(100);

  // tell IDL to wait for a second
  const waitProm = init.debug.adapter.evaluate(`wait, 1`, { echo: true });

  // pause to let the status bar show busy
  await Sleep(500);

  // check status bar before running test
  expect(
    init.debug.statusBar.bar.text.endsWith(IDL_TRANSLATION.statusBar.running)
  ).toBeTruthy();

  // wait for it to end
  await waitProm;
};
