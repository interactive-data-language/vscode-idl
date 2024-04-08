import { GetExtensionPath, IDL_COMMANDS, Sleep } from '@idl/shared';
import { OpenFileInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';

/**
 * Track the files we need to run
 */
const TO_RUN: { file: string; result: boolean }[] = [
  /**
   * Main level tests
   */
  {
    file: GetExtensionPath('idl/test/client-e2e/debug/run-file/main.pro'),
    result: true,
  },
  {
    file: GetExtensionPath(
      'idl/test/client-e2e/debug/run-file/syntax_error.pro'
    ),
    result: false,
  },

  /**
   * Procedure tests
   */
  {
    file: GetExtensionPath('idl/test/client-e2e/debug/run-file/procedure.pro'),
    result: true,
  },
  {
    file: GetExtensionPath(
      'idl/test/client-e2e/debug/run-file/procedure_with_main.pro'
    ),
    result: true,
  },

  /**
   * Function tests
   */
  {
    file: GetExtensionPath('idl/test/client-e2e/debug/run-file/function.pro'),
    result: true,
  },
  {
    file: GetExtensionPath(
      'idl/test/client-e2e/debug/run-file/function_with_main.pro'
    ),
    result: true,
  },

  /**
   * When our file doesnt match routine name we dont care
   */
  {
    file: GetExtensionPath(
      'idl/test/client-e2e/debug/run-file/name mismatch.pro'
    ),
    result: true,
  },

  /**
   * Procedure method tests
   */
  {
    file: GetExtensionPath(
      'idl/test/client-e2e/debug/run-file/procedure_method.pro'
    ),
    result: false,
  },
  {
    file: GetExtensionPath(
      'idl/test/client-e2e/debug/run-file/procedure_method_with_main.pro'
    ),
    result: true,
  },

  /**
   * Function method tests
   */
  {
    file: GetExtensionPath(
      'idl/test/client-e2e/debug/run-file/function_method.pro'
    ),
    result: false,
  },
  {
    file: GetExtensionPath(
      'idl/test/client-e2e/debug/run-file/function_method_with_main.pro'
    ),
    result: true,
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
    const res = await vscode.commands.executeCommand(IDL_COMMANDS.DEBUG.RUN);

    // verify result
    if (TO_RUN[i].result) {
      expect(res).toBeTruthy();
    } else {
      expect(res).toBeFalsy();
    }

    // close
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
  }
};
