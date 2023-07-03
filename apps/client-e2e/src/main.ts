import { Sleep } from '@idl/test-helpers';
import { IInitializeType } from '@idl/vscode/initialize-types';
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
    // get extension
    const ext = vscode.extensions.getExtension('idl.idl');

    // activate extension
    ACTIVATION_RESULT = await ext.activate();

    // wait for language server to start
    console.log(` `);
    console.log('Waiting for language server start');
    await Sleep(3000);

    // make sure the language server starts
    if (ACTIVATION_RESULT.client.failedStart) {
      throw new Error('Language server failed to start, cannot proceed');
    }

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
