import { GetExtensionPath, IDL_COMMANDS, Sleep } from '@idl/shared';
import { OpenFileInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';

/**
 * Function that makes sure we return from main on compiling main
 */
export const ReturnFromMain: RunnerFunction = async (init) => {
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
  const file = GetExtensionPath(
    'idl/test/client-e2e/debug/return_from_main.pro'
  );

  // open file
  await OpenFileInVSCode(file, true);

  // short pause
  await Sleep(100);

  // run
  const res = await vscode.commands.executeCommand(IDL_COMMANDS.DEBUG.RUN);

  // make sure that we could run
  expect(res).toBeTruthy();

  // get call stack
  const stack = (await init.debug.adapter._runtime.getCallStack()).frames.map(
    (item) => {
      return { line: item.line, file: item.file };
    }
  );

  // make sure our call stack matches
  expect(stack).toEqual([{ line: 3, file }]);

  // compile
  const recompile = await vscode.commands.executeCommand(
    IDL_COMMANDS.DEBUG.COMPILE
  );

  // make sure that we could run
  expect(recompile).toBeTruthy();

  // get call stack
  const stack2 = (await init.debug.adapter._runtime.getCallStack()).frames.map(
    (item) => {
      return { line: item.line, file: item.file };
    }
  );

  // make sure our call stack matches
  expect(stack2).toEqual([{ line: 1, file }]);
};
