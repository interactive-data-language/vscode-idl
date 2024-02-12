import { GetExtensionPath, Sleep } from '@idl/shared';
import { OpenFileInVSCode, ReplaceDocumentContent } from '@idl/vscode/shared';
import expect from 'expect';
import { readFileSync } from 'fs';
import * as vscode from 'vscode';

import { CLIENT_E2E_CONFIG } from '../client-e2e-config.interface';
import { RunnerFunction } from '../runner.interface';

/**
 * Makes sure that we can disable reporting of all problems using comments in IDL
 */
export const IDLDisableAllFromComments: RunnerFunction = async (init) => {
  const doc = await OpenFileInVSCode(
    GetExtensionPath('idl/test/client-e2e/problems/idl_disable_all_before.pro')
  );

  // short pause to make sure we open and parse
  await Sleep(1000);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc.uri).length).toEqual(3);

  // replace the content in our document
  await ReplaceDocumentContent(
    doc,
    readFileSync(
      GetExtensionPath(
        'idl/test/client-e2e/problems/idl_disable_all_after.pro'
      ),
      'utf-8'
    )
  );

  // short pause
  await Sleep(1000);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc.uri).length).toEqual(0);
};

/**
 * Makes sure that we can disable reporting of problems using comments for specific lines in IDL
 */
export const IDLDisableLinesFromComments: RunnerFunction = async (init) => {
  const doc = await OpenFileInVSCode(
    GetExtensionPath(
      'idl/test/client-e2e/problems/idl_disable_lines_before.pro'
    )
  );

  // short pause to make sure we open and parse
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.DEFAULT);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc.uri).length).toEqual(3);

  // replace the content in our document
  await ReplaceDocumentContent(
    doc,
    readFileSync(
      GetExtensionPath(
        'idl/test/client-e2e/problems/idl_disable_lines_after.pro'
      ),
      'utf-8'
    )
  );

  // short pause
  await Sleep(CLIENT_E2E_CONFIG.DELAYS.DEFAULT);

  // verify problems
  expect(vscode.languages.getDiagnostics(doc.uri).length).toEqual(1);
};
