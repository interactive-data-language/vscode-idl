import { GetExtensionPath } from '@idl/idl/files';
import { IDL_COMMANDS, Sleep } from '@idl/shared/extension';
import { OpenFileInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import { readFileSync } from 'fs';
import * as vscode from 'vscode';

import { RunnerFunction } from '../../runner.interface';
import { TEST_CLIENT_CONFIG } from '../../test-client-config.interface';

/**
 * Function that verifies we can correctly migrate code to ENVI DL 3.0 API
 */
export const MigrateCodeDL40: RunnerFunction = async (init) => {
  const doc = await OpenFileInVSCode(
    GetExtensionPath('apps/test/idl/client-e2e/migration/dl40_1_start.pro'),
  );

  // short pause to make sure we open and parse
  await Sleep(TEST_CLIENT_CONFIG.DELAYS.DEFAULT);

  // add docs
  await vscode.commands.executeCommand(IDL_COMMANDS.CODE.MIGRATE_TO_DL40_API);

  // short pause
  await Sleep(TEST_CLIENT_CONFIG.DELAYS.DEFAULT);

  // make sure output is correct
  expect(doc.getText()).toEqual(
    readFileSync(
      GetExtensionPath(
        'apps/test/idl/client-e2e/migration/dl40_1_expected.pro',
      ),
      'utf-8',
    ),
  );

  // add docs again
  await vscode.commands.executeCommand(IDL_COMMANDS.CODE.MIGRATE_TO_DL40_API);

  // short pause
  await Sleep(TEST_CLIENT_CONFIG.DELAYS.DEFAULT);

  // verify we have the same code
  expect(doc.getText()).toEqual(
    readFileSync(
      GetExtensionPath(
        'apps/test/idl/client-e2e/migration/dl40_1_expected.pro',
      ),
      'utf-8',
    ),
  );
};

/**
 * Function that verifies we can correctly migrate code to ENVI DL 3.0 API
 */
export const MigrateCodeDL40_2: RunnerFunction = async (init) => {
  const doc = await OpenFileInVSCode(
    GetExtensionPath('apps/test/idl/client-e2e/migration/dl40_2_start.pro'),
  );

  // short pause to make sure we open and parse
  await Sleep(TEST_CLIENT_CONFIG.DELAYS.DEFAULT);

  // add docs
  await vscode.commands.executeCommand(IDL_COMMANDS.CODE.MIGRATE_TO_DL40_API);

  // short pause
  await Sleep(TEST_CLIENT_CONFIG.DELAYS.DEFAULT);

  // make sure output is correct
  expect(doc.getText()).toEqual(
    readFileSync(
      GetExtensionPath(
        'apps/test/idl/client-e2e/migration/dl40_2_expected.pro',
      ),
      'utf-8',
    ),
  );

  // add docs again
  await vscode.commands.executeCommand(IDL_COMMANDS.CODE.MIGRATE_TO_DL40_API);

  // short pause
  await Sleep(TEST_CLIENT_CONFIG.DELAYS.DEFAULT);

  // verify we have the same code
  expect(doc.getText()).toEqual(
    readFileSync(
      GetExtensionPath(
        'apps/test/idl/client-e2e/migration/dl40_2_expected.pro',
      ),
      'utf-8',
    ),
  );
};
