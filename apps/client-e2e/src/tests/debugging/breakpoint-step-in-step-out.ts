import { GetExtensionPath, IDL_COMMANDS } from '@idl/shared';
import { Sleep } from '@idl/tests/helpers';
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
 * Test that makes sure we can set breakpoints, stop on them, step into routines, and step
 * out of them
 */
export const BreakpointStepInStepOut: RunnerFunction = async (init) => {
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

  // reset breakpoints
  await init.debug.adapter._breakpoints.resetBreakpoints();

  /** Get the file we need to work with */
  const file = GetExtensionPath('idl/test/client-e2e/step_in.pro');

  // open editor and display
  await OpenFileInVSCode(file);

  // get current editor window
  const editor = GetActivePROCodeWindow();

  // make sure we opened a window
  expect(editor).not.toBeUndefined();

  // make sure it is the plot file
  expect(editor.uri.fsPath.endsWith('step_in.pro')).toBeTruthy();

  // pause momentarily
  await Sleep(DEBUG_PAUSE);

  // set breakpoint
  await init.debug.adapter._breakpoints.setBreakpoints({
    source: {
      path: file,
    },
    lines: [19],
  });

  /** Run our file */
  await vscode.commands.executeCommand(IDL_COMMANDS.DEBUG.RUN);
  await Sleep(DEBUG_PAUSE);
  expect(init.debug.adapter.stopped?.stack?.line).toEqual(19);

  // step in
  await vscode.commands.executeCommand(VSCODE_COMMANDS.DEBUG_STEP_INTO);
  await Sleep(DEBUG_PAUSE);
  expect(init.debug.adapter.stopped?.stack?.line).toEqual(9);

  // step over
  await vscode.commands.executeCommand(VSCODE_COMMANDS.DEBUG_STEP_OVER);
  await Sleep(DEBUG_PAUSE);
  expect(init.debug.adapter.stopped?.stack?.line).toEqual(11);

  // step in
  await vscode.commands.executeCommand(VSCODE_COMMANDS.DEBUG_STEP_OVER);
  await Sleep(DEBUG_PAUSE);
  expect(init.debug.adapter.stopped?.stack?.line).toEqual(12);

  // step in
  await vscode.commands.executeCommand(VSCODE_COMMANDS.DEBUG_STEP_OUT);
  await Sleep(DEBUG_PAUSE);
  expect(init.debug.adapter.stopped?.stack?.line).toEqual(21);

  // remove all breakpoints
  await init.debug.adapter._breakpoints.resetBreakpoints();

  // reset
  await init.debug.adapter.evaluate('.reset');
};
