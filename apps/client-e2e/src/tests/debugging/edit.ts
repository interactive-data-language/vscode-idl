import { IDL_COMMANDS } from '@idl/shared';
import { Sleep } from '@idl/tests/helpers';
import { GetActivePROCodeWindow } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';
import { DEBUG_PAUSE } from './_shared.interface';

/**
 * Function that verifies that we can detect compile and edit commands and they do what
 * they are supposed to
 */
export const Edit: RunnerFunction = async (init) => {
  /**
   * Start IDL
   */
  const started = await vscode.commands.executeCommand(
    IDL_COMMANDS.DEBUG.START
  );

  // verify we started
  expect(started).toBeTruthy();

  // compile file
  await init.debug.adapter.evaluate(`.edit plot`, { echo: true });

  // pause momentarily
  await Sleep(DEBUG_PAUSE);

  // get current editor window
  const editor = GetActivePROCodeWindow();

  // make sure we opened a window
  expect(editor).not.toBeUndefined();

  // make sure it is the plot file
  expect(editor.uri.fsPath.endsWith('plot.pro')).toBeTruthy();
};
