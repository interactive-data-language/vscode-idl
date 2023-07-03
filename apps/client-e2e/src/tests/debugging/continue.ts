import { GetExtensionPath, IDL_COMMANDS } from '@idl/shared';
import { Sleep } from '@idl/test-helpers';
import {
  GetActivePROCodeWindow,
  OpenFileInVSCode,
  VSCODE_COMMANDS,
} from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';
import { DEBUG_PAUSE } from './_shared.interface';

/**
 * The number of times we continue execution and the lines
 * that we expect to be on each time.
 *
 * > **These lines start at one!!!!**
 */
const EXPECTED_LINES = [19, 20, 21, 22, 11, 13, 24];

/**
 * Function that verifies that we can detect compile and edit commands and they do what
 * they are supposed to
 */
export const Continue: RunnerFunction = async (init) => {
  /**
   * Start IDL
   */
  const started = await vscode.commands.executeCommand(
    IDL_COMMANDS.DEBUG.START
  );

  // verify we started
  expect(started).toBeTruthy();

  // show the debug console
  await vscode.commands.executeCommand(VSCODE_COMMANDS.SHOW_DEBUG_CONSOLE);

  /** Get the file we need to work with */
  const file = GetExtensionPath('idl/test/client-e2e/continue.pro');

  // open editor and display
  await OpenFileInVSCode(file);

  // get current editor window
  const editor = GetActivePROCodeWindow();

  // make sure we opened a window
  expect(editor).not.toBeUndefined();

  // make sure it is the plot file
  expect(editor.uri.fsPath.endsWith('continue.pro')).toBeTruthy();

  // pause momentarily
  await Sleep(DEBUG_PAUSE);

  /** Run our file */
  await vscode.commands.executeCommand(IDL_COMMANDS.DEBUG.RUN);

  // slight pause
  await Sleep(DEBUG_PAUSE);

  // verify all of our lines
  for (let i = 0; i < EXPECTED_LINES.length; i++) {
    // verify we are on the right line
    expect(init.debug.adapter.stopped?.stack?.line).toEqual(EXPECTED_LINES[i]);

    // continue running
    await vscode.commands.executeCommand(VSCODE_COMMANDS.DEBUG_CONTINUE);

    // wait a little bit
    await Sleep(DEBUG_PAUSE);
  }

  // close editor
  await vscode.commands.executeCommand(VSCODE_COMMANDS.CLOSE_EDITOR);

  // pause momentarily
  await Sleep(DEBUG_PAUSE);

  // verify we cleaned up
  expect(GetActivePROCodeWindow(false)).toBeUndefined();
};
