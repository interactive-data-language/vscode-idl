import { GetExtensionPath, IDL_COMMANDS, Sleep } from '@idl/shared';
import { OpenFileInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';

/**
 * Function that runs a test and makes sure debugging stops and detects the line we are on
 */
export const TimerStop: RunnerFunction = async (init) => {
  /**
   * Start IDL
   */
  const started = await vscode.commands.executeCommand(
    IDL_COMMANDS.DEBUG.START
  );

  // verify we started
  expect(started).toBeTruthy();

  // close
  await vscode.commands.executeCommand('workbench.action.closeAllEditors');

  /** Get the file with timer callback */
  const file = GetExtensionPath('idl/test/client-e2e/debug/timer_stop.pro');

  // open file
  await OpenFileInVSCode(file, true);

  // short pause
  await Sleep(100);

  // run
  const res = await vscode.commands.executeCommand(IDL_COMMANDS.DEBUG.RUN);

  // make sure that we could run
  expect(res).toBeTruthy();

  // sleep and wait for our timer callback to get hit
  await Sleep(1500);

  // get call stack
  const stack = (await init.debug.adapter._runtime.getCallStack()).frames.map(
    (item) => {
      return { line: item.line, file: item.file };
    }
  );

  // make sure our call stack matches
  expect(stack).toEqual([
    { line: 12, file },
    { line: 19, file },
  ]);

  // return - IDL bug/behavior where we need to do it twice
  await init.debug.adapter.evaluate('retall');

  // sleep and wait for our timer callback to get hit
  await Sleep(500);

  // return again to work around windows bug
  await init.debug.adapter.evaluate('retall');
};
