import { GetExtensionPath, IDL_COMMANDS, Sleep } from '@idl/shared/extension';
import { OpenFileInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import { readFileSync } from 'fs';
import * as vscode from 'vscode';

import { CLIENT_E2E_CONFIG } from '../../client-e2e-config.interface';
import { RunnerFunction } from '../../runner.interface';

/**
 * Function that verifies we can correctly migrate code to ENVI DL 3.0 API
 */
export const MigrateCodeDL30: RunnerFunction = async (init) => {
  const doc = await OpenFileInVSCode(
    GetExtensionPath('idl/test/client-e2e/migration/dl30_1_start.pro')
  );

  // short pause to make sure we open and parse
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.DEFAULT);

  // add docs
  await vscode.commands.executeCommand(IDL_COMMANDS.CODE.MIGRATE_TO_DL30_API);

  // short pause
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.DEFAULT);

  // make sure output is correct
  expect(doc.getText()).toEqual(
    readFileSync(
      GetExtensionPath('idl/test/client-e2e/migration/dl30_1_expected.pro'),
      'utf-8'
    )
  );

  // add docs again
  await vscode.commands.executeCommand(IDL_COMMANDS.CODE.MIGRATE_TO_DL30_API);

  // short pause
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.DEFAULT);

  // verify we have the same code
  expect(doc.getText()).toEqual(
    readFileSync(
      GetExtensionPath('idl/test/client-e2e/migration/dl30_1_expected.pro'),
      'utf-8'
    )
  );
};

/**
 * Function that verifies we can correctly migrate code to ENVI DL 3.0 API
 */
export const MigrateCodeDL30_2: RunnerFunction = async (init) => {
  const doc = await OpenFileInVSCode(
    GetExtensionPath('idl/test/client-e2e/migration/dl30_2_start.pro')
  );

  // short pause to make sure we open and parse
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.DEFAULT);

  // add docs
  await vscode.commands.executeCommand(IDL_COMMANDS.CODE.MIGRATE_TO_DL30_API);

  // short pause
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.DEFAULT);

  // make sure output is correct
  expect(doc.getText()).toEqual(
    readFileSync(
      GetExtensionPath('idl/test/client-e2e/migration/dl30_2_expected.pro'),
      'utf-8'
    )
  );

  // add docs again
  await vscode.commands.executeCommand(IDL_COMMANDS.CODE.MIGRATE_TO_DL30_API);

  // short pause
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.DEFAULT);

  // verify we have the same code
  expect(doc.getText()).toEqual(
    readFileSync(
      GetExtensionPath('idl/test/client-e2e/migration/dl30_2_expected.pro'),
      'utf-8'
    )
  );
};
