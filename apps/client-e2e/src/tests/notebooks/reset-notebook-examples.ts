import { EXAMPLE_NOTEBOOKS } from '@idl/notebooks/shared';
import { IDL_COMMANDS, Sleep } from '@idl/shared';
import expect from 'expect';
import { existsSync, rmSync } from 'fs';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';

/**
 * Reset example notebooks
 */
export const ResetNotebookExamples: RunnerFunction = async (init) => {
  // verify the folder exists after opening examples
  expect(existsSync(EXAMPLE_NOTEBOOKS)).toBeTruthy();

  // delete
  rmSync(EXAMPLE_NOTEBOOKS, { recursive: true });

  // make sure gone
  expect(existsSync(EXAMPLE_NOTEBOOKS)).toBeFalsy();

  // close
  await vscode.commands.executeCommand(
    IDL_COMMANDS.NOTEBOOKS.RESET_NOTEBOOK_EXAMPLES
  );

  // pause momentarily
  await Sleep(100);

  // reset and make sure there
  expect(existsSync(EXAMPLE_NOTEBOOKS)).toBeTruthy();
};
