import { GetExtensionPath, IDL_COMMANDS } from '@idl/shared';
import { Sleep } from '@idl/tests/helpers';
import { OpenFileInVSCode, VSCODE_COMMANDS } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';
import { DEBUG_PAUSE } from './_shared.interface';

/**
 * Test that makes sure breakpoints can be set before IDL starts and then
 * we set them when IDL starts up
 */
export const BreakpointSetBeforeStart: RunnerFunction = async (init) => {
  /** Get the file we need to work with */
  const file = GetExtensionPath(
    'idl/test/client-e2e/debug/breakpoints/before_start.pro'
  );

  // open editor and display
  const doc = await OpenFileInVSCode(file);

  // make sure we opened a window
  expect(doc).not.toBeUndefined();

  // make sure it is the plot file
  expect(doc.uri.fsPath.endsWith('before_start.pro')).toBeTruthy();

  // stop our IDL session
  await vscode.commands.executeCommand(VSCODE_COMMANDS.DEBUG_STOP);

  // short pause
  await Sleep(100);

  // make sure stopped
  expect(init.debug.adapter.isStarted()).toBeFalsy();

  // set breakpoint
  const prom = init.debug.adapter._breakpoints.setBreakpoints({
    source: {
      path: file,
    },
    lines: [1, 3],
  });

  // short pause
  await Sleep(DEBUG_PAUSE);

  /**
   * Start IDL
   */
  const started = await vscode.commands.executeCommand(
    IDL_COMMANDS.DEBUG.START
  );

  // verify we started
  expect(started).toBeTruthy();

  // wait for breakpoints to actually be added
  await prom;

  // query breakpoints
  const bps = init.debug.adapter._breakpoints.VSCodeBreakpoints.map(
    (bp) => bp.line
  );

  // make sure we have the right breakpoints
  expect(bps.sort()).toEqual([1, 3]);

  // reset breakpoints
  await init.debug.adapter._breakpoints.resetBreakpoints();

  // reset
  await init.debug.adapter.evaluate('.reset');
};
