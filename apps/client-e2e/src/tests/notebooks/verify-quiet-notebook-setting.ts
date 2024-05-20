import { GetExtensionPath, IDL_COMMANDS, Sleep } from '@idl/shared';
import { GetWorkspaceConfig, IIDLWorkspaceConfig } from '@idl/vscode/config';
import { IDL_EXTENSION_CONFIG_KEYS } from '@idl/vscode/extension-config';
import { OpenNotebookInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';
import { ICompareCellOutputs } from './helpers/compare-cells.interface';
import { RunNotebookAndCompareCells } from './helpers/run-notebook-and-compare-cells';

/**
 * Types of outputs from cells that we expect to have
 */
export const QUIET_OUTPUT: ICompareCellOutputs[] = [
  {
    idx: 0,
    success: true,
    mimeTypes: [],
  },
];

/**
 * Types of outputs from cells that we expect to have
 */
export const NOT_QUIET_OUTPUT: ICompareCellOutputs[] = [
  {
    idx: 0,
    success: true,
    mimeTypes: ['text/plain'],
  },
];

/**
 * Function that runs basic tests for ENVI message listeners
 */
export const VerifyQuietNotebookSetting: RunnerFunction = async (init) => {
  const quietFile = GetExtensionPath(
    'idl/test/client-e2e/notebooks/quiet-preference.idlnb'
  );
  // get the current workspace config
  const config = GetWorkspaceConfig();

  // make sure we are quiet
  (config as IIDLWorkspaceConfig).update(
    IDL_EXTENSION_CONFIG_KEYS.notebooksQuietMode,
    true,
    true
  );

  // run in quiet mode
  await RunNotebookAndCompareCells(
    quietFile,
    QUIET_OUTPUT,
    init.notebooks.controller
  );

  // turn off
  (config as IIDLWorkspaceConfig).update(
    IDL_EXTENSION_CONFIG_KEYS.notebooksQuietMode,
    false,
    true
  );

  // reset
  await vscode.commands.executeCommand(IDL_COMMANDS.NOTEBOOKS.RESET);

  // short pause
  await Sleep(100);

  // run in quiet mode
  await RunNotebookAndCompareCells(
    quietFile,
    NOT_QUIET_OUTPUT,
    init.notebooks.controller
  );

  // turn on again
  (config as IIDLWorkspaceConfig).update(
    IDL_EXTENSION_CONFIG_KEYS.notebooksQuietMode,
    true,
    true
  );

  // stop execution
  await vscode.commands.executeCommand(IDL_COMMANDS.NOTEBOOKS.STOP);

  // short pause
  await Sleep(100);

  // open NB
  const nb = await OpenNotebookInVSCode(quietFile);

  // make sure stopped
  expect(init.notebooks.controller.isStarted(nb)).toBeFalsy();
};
