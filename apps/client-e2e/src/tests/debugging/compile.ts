import { CleanIDLOutput } from '@idl/idl';
import { IDL_COMMANDS } from '@idl/shared';
import { Sleep } from '@idl/test-helpers';
import { GetActivePROCodeWindow, VSCODE_COMMANDS } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';
import { DEBUG_PAUSE } from './_shared.interface';

/**
 * Function that verifies that we can detect compile and edit commands and they do what
 * they are supposed to
 */
export const Compile: RunnerFunction = async (init) => {
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
    await init.debug.adapter.evaluate(`.compile plot`, { echo: true })
  );

  // make sure we compile
  expect(res).toEqual('% Compiled module: PLOT.');

  // pause momentarily
  await Sleep(DEBUG_PAUSE);

  // get current editor window
  const editor = GetActivePROCodeWindow();

  // make sure we opened a window
  expect(editor).not.toBeUndefined();

  // make sure it is the plot file
  expect(editor.uri.fsPath.endsWith('plot.pro')).toBeTruthy();

  // close editor
  await vscode.commands.executeCommand(VSCODE_COMMANDS.CLOSE_EDITOR);

  // pause momentarily
  await Sleep(DEBUG_PAUSE);

  // verify we cleaned up
  expect(GetActivePROCodeWindow(false)).toBeUndefined();
};
