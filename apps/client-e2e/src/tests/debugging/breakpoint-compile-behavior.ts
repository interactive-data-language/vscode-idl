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
 * Test that makes sure breakpoints behave as we expect when we compile a file
 */
export const BreakpointCompileBehavior: RunnerFunction = async (init) => {
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
  const file = GetExtensionPath(
    'idl/test/client-e2e/debug/breakpoints/on_compile.pro'
  );

  // open editor and display
  await OpenFileInVSCode(file);

  // get current editor window
  const editor = GetActivePROCodeWindow();

  // make sure we opened a window
  expect(editor).not.toBeUndefined();

  // make sure it is the plot file
  expect(editor.uri.fsPath.endsWith('on_compile.pro')).toBeTruthy();

  // pause momentarily
  await Sleep(DEBUG_PAUSE);

  // set breakpoint
  await init.debug.adapter._breakpoints.setBreakpoints({
    source: {
      path: file,
    },
    lines: [8, 10, 14, 19, 24],
  });

  /** Compile our file */
  await vscode.commands.executeCommand(IDL_COMMANDS.DEBUG.COMPILE);

  // pause momentarily
  await Sleep(DEBUG_PAUSE);

  // query breakpoints
  const bps = init.debug.adapter._breakpoints.VSCodeBreakpoints.map(
    (bp) => bp.line
  ).sort((a, b) => a - b);

  // make sure we have the right breakpoints
  expect(bps).toEqual([8, 10, 24]);

  // remove all breakpoints
  await init.debug.adapter._breakpoints.resetBreakpoints();

  // reset
  await init.debug.adapter.evaluate('.reset');
};
