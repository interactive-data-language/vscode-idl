import { IDL_COMMANDS, Sleep } from '@idl/shared/extension';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';

/**
 * Make sure that profiling works at a basic level
 */
export const ProfileTest: RunnerFunction = async (init) => {
  /**
   * Start IDL
   */
  const started = await vscode.commands.executeCommand(
    IDL_COMMANDS.DEBUG.START
  );

  // verify we started
  expect(started).toBeTruthy();

  // short pause
  await Sleep(500);

  // start profiling
  await vscode.commands.executeCommand(IDL_COMMANDS.DEBUG.PROFILER_START);

  // short pause
  await Sleep(500);

  // stop profiling
  await vscode.commands.executeCommand(IDL_COMMANDS.DEBUG.PROFILER_STOP);

  // short pause
  await Sleep(2500);

  // make sure we have a debug panel
  const panel = init.webview.currentPanel;

  // verify panel
  expect(panel).toBeDefined();

  // verify it has started
  expect(panel.started).toBeTruthy();

  // verify we did not get an error
  expect(panel.wasError).toBeFalsy();

  // reset the IDL session
  await vscode.commands.executeCommand(IDL_COMMANDS.DEBUG.RESET);
};
