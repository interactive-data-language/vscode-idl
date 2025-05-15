import { GetExtensionPath } from '@idl/idl/files';
import { IDL_COMMANDS, Sleep } from '@idl/shared/extension';
import { IRunIDLCommandResult } from '@idl/types/vscode-debug';
import { OpenFileInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';

/**
 * Track the files we need to run
 */
const TO_RUN: { file: string; success: boolean }[] = [
  /**
   * Main level tests
   */
  {
    file: GetExtensionPath('idl/test/client-e2e/debug/run-file/main.pro'),
    success: true,
  },
  {
    file: GetExtensionPath(
      'idl/test/client-e2e/debug/run-file/syntax_error.pro'
    ),
    success: false,
  },

  /**
   * Procedure tests
   */
  {
    file: GetExtensionPath('idl/test/client-e2e/debug/run-file/procedure.pro'),
    success: true,
  },
  {
    file: GetExtensionPath(
      'idl/test/client-e2e/debug/run-file/procedure_with_main.pro'
    ),
    success: true,
  },

  /**
   * Function tests
   */
  {
    file: GetExtensionPath('idl/test/client-e2e/debug/run-file/function.pro'),
    success: true,
  },
  {
    file: GetExtensionPath(
      'idl/test/client-e2e/debug/run-file/function_with_main.pro'
    ),
    success: true,
  },

  /**
   * When our file doesnt match routine name we dont care
   */
  {
    file: GetExtensionPath(
      'idl/test/client-e2e/debug/run-file/name mismatch.pro'
    ),
    success: true,
  },

  /**
   * Procedure method tests
   */
  {
    file: GetExtensionPath(
      'idl/test/client-e2e/debug/run-file/procedure_method.pro'
    ),
    success: false,
  },
  {
    file: GetExtensionPath(
      'idl/test/client-e2e/debug/run-file/procedure_method_with_main.pro'
    ),
    success: true,
  },

  /**
   * Function method tests
   */
  {
    file: GetExtensionPath(
      'idl/test/client-e2e/debug/run-file/function_method.pro'
    ),
    success: false,
  },
  {
    file: GetExtensionPath(
      'idl/test/client-e2e/debug/run-file/function_method_with_main.pro'
    ),
    success: true,
  },
];

/**
 * Function that verifies all of our cases for running files
 */
export const RunFile: RunnerFunction = async (init) => {
  /**
   * Start IDL
   */
  const started = await vscode.commands.executeCommand(
    IDL_COMMANDS.DEBUG.START
  );

  // verify we started
  expect(started).toBeTruthy();

  // reset the IDL session
  await vscode.commands.executeCommand(IDL_COMMANDS.DEBUG.RESET);

  // close
  await vscode.commands.executeCommand('workbench.action.closeAllEditors');

  // process each case
  for (let i = 0; i < TO_RUN.length; i++) {
    console.log(`   Processing file: "${TO_RUN[i].file}"`);
    // open file
    await OpenFileInVSCode(TO_RUN[i].file, true);

    // short pause
    await Sleep(100);

    // run
    const res: IRunIDLCommandResult = await vscode.commands.executeCommand(
      IDL_COMMANDS.DEBUG.RUN
    );

    // verify result
    expect(res.success).toEqual(TO_RUN[i].success);

    // close
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');

    // reset the IDL session
    await vscode.commands.executeCommand(IDL_COMMANDS.DEBUG.RESET);
  }
};
