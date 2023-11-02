import { FindIDL } from '@idl/idl';
import { EXTENSION_FULL_NAME, GetExtensionPath } from '@idl/shared';
import { Sleep } from '@idl/test-helpers';
import { GetWorkspaceConfig, IIDLWorkspaceConfig } from '@idl/vscode/config';
import { IDL_EXTENSION_CONFIG_KEYS } from '@idl/vscode/extension-config';
import { IInitializeType } from '@idl/vscode/initialize-types';
import { OpenFileInVSCode, VSCODE_COMMANDS } from '@idl/vscode/shared';
import expect from 'expect';
import { performance } from 'perf_hooks';
import * as vscode from 'vscode';

import { TestRunner } from './tests/runner';

/**
 * Value returned from activating our extension
 */
export let ACTIVATION_RESULT: IInitializeType;

/**
 * Indicates if the tests are silenced or not
 */
const SILENCE_LOGS = true;

/**
 * If our logs are not silenced, do we print debug statements
 */
const DEBUG_LOGS = false;

/**
 * Test runner
 *
 * https://code.visualstudio.com/api/working-with-extensions/testing-extension
 */
export async function run(): Promise<void> {
  /** Overall exit code, indicating if we passed or failed tests */
  let code = 0;

  // run our tests
  try {
    /**
     * Manually specify IDL folder
     */
    const idlDir = FindIDL();

    // validate we know where it is
    if (!idlDir) {
      throw new Error('Unable to find IDL, cannot run tests');
    }

    // alert user which IDL we are using
    console.log(` `);
    console.log(`Test are using this IDL: "${idlDir}"`);

    // get extension
    const ext = vscode.extensions.getExtension(EXTENSION_FULL_NAME);

    // activate extension
    ACTIVATION_RESULT = await ext.activate();

    // wait for language server to start
    console.log(` `);
    console.log('Waiting for language server start');

    /** Open PRO code */
    const doc = await OpenFileInVSCode(
      GetExtensionPath('idl/test/client-e2e/load_first_problems.pro')
    );

    // flag if we have started or not
    let started = false;

    /** Get start time */
    const t0 = performance.now();

    // get start time
    while (!started) {
      // make sure the language server starts
      if (ACTIVATION_RESULT.client.failedStart) {
        throw new Error('Language server failed to start, cannot proceed');
      }

      // make sure we dont wait forever
      if (performance.now() - t0 > 10000) {
        throw new Error(
          'Language server took longer than 10 seconds to return diagnostics, assuming failed start'
        );
      }

      // check if we have problems
      started = vscode.languages.getDiagnostics(doc.uri).length > 0;

      // pause
      await Sleep(100);
    }

    // track how long it took to start
    console.log(
      `Language server started in ${Math.floor(performance.now() - t0)} ms`
    );

    // verify we have problems
    expect(vscode.languages.getDiagnostics(doc.uri).length).toEqual(3);

    // close editor
    await vscode.commands.executeCommand(VSCODE_COMMANDS.CLOSE_EDITOR);

    // get the current workspace config
    const config = GetWorkspaceConfig();

    // set latest IDL folder
    (config as IIDLWorkspaceConfig).update(
      IDL_EXTENSION_CONFIG_KEYS.IDLDirectory,
      idlDir,
      true
    );

    // check if we allow debug logs
    if (DEBUG_LOGS) {
      ACTIVATION_RESULT.client.logger.setDebug(DEBUG_LOGS);
    }

    // silence logs
    if (SILENCE_LOGS) {
      console.log(`Silencing extension logs`);
    }
    ACTIVATION_RESULT.client.logger.setQuiet(SILENCE_LOGS);
    console.log(` `);
    console.log(`-----------------------------------------`);
    console.log(`Running tests`);
    console.log(`-----------------------------------------`);
    console.log(` `);

    // execute our test runner
    const failed = await TestRunner();
    if (failed > 0) {
      throw new Error('Failed tests! See above for more details');
    }
  } catch (err) {
    code = 1;
    console.log(err);
  }

  // sleep before exit, otherwise console output does not always get returned
  await Sleep(500);

  // nonzero exit to indicate we failed
  process.exit(code);
}
