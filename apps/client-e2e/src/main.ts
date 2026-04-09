import { FindFiles, FindIDL, GetExtensionPath } from '@idl/idl/files';
import {
  EXTENSION_FULL_NAME,
  SAVE_FILE_GLOB_PATTERN,
} from '@idl/shared/extension';
import { Sleep } from '@idl/tests/helpers';
import { VSCODE_COMMANDS } from '@idl/types/vscode';
import { GetWorkspaceConfig } from '@idl/vscode/config';
import { IInitializeType } from '@idl/vscode/initialize-types';
import { OpenFileInVSCode } from '@idl/vscode/shared';
import expect from 'expect';
import { performance } from 'perf_hooks';
import * as vscode from 'vscode';

import { ResetSettingsForTests } from './tests/helpers/reset-settings-for-tests';
import { TestRunner } from './tests/test-runner';

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
 * IDL install folder for extension testing
 */
export let IDL_DIR: string;
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
    IDL_DIR = FindIDL();

    // validate we know where it is
    if (!IDL_DIR) {
      throw new Error('Unable to find IDL, cannot run tests');
    }

    // alert user which IDL we are using
    console.log(` `);
    console.log(`Test are using this IDL: "${IDL_DIR}"`);

    // wait for language server to start
    console.log(` `);
    console.log('Verifying compiled MCP tools');

    /** Get folder */
    const mcp = GetExtensionPath('idl/vscode/mcp/src');

    /** Verify we have SAVE files in folder */
    const files = await FindFiles(mcp, SAVE_FILE_GLOB_PATTERN);

    // make sure we found files
    if (files.length === 0) {
      console.log(
        ` ERROR: MCP tools not found where expected, build with "npm run build-mcp-tools"`,
      );
      await Sleep(500);
      process.exit(1);
    }

    // get extension
    const ext = vscode.extensions.getExtension(EXTENSION_FULL_NAME);

    // activate extension
    ACTIVATION_RESULT = await ext.activate();

    // wait for language server to start
    console.log(` `);
    console.log('Waiting for language server start');

    /** Open PRO code */
    const doc = await OpenFileInVSCode(
      GetExtensionPath('idl/test/client-e2e/load_first_problems.pro'),
    );

    // get the current workspace config
    const config = GetWorkspaceConfig();

    // reset config
    await ResetSettingsForTests(config, IDL_DIR);

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
          'Language server took longer than 10 seconds to return diagnostics, assuming failed start',
        );
      }

      // check if we have problems
      started = vscode.languages.getDiagnostics(doc.uri).length > 0;

      // pause
      await Sleep(100);
    }

    // track how long it took to start
    console.log(
      `Language server started in ${Math.floor(performance.now() - t0)} ms`,
    );

    // verify we have problems
    expect(vscode.languages.getDiagnostics(doc.uri).length).toEqual(3);

    // close editor
    await vscode.commands.executeCommand(VSCODE_COMMANDS.CLOSE_EDITOR);

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
  console.log('');
  console.log('-----------------------------------------');
  console.log('  LLM QA Tests still need to be run.');
  console.log('');
  console.log('  1. Open this repo in VS Code');
  console.log('  2. Make sure you are signed into GitHub Copilot');
  console.log('  3. Press F5 to launch the Extension Development Host');
  console.log('  4. Open the Command Palette (Ctrl+Shift+P)');
  console.log('  5. Run: "IDL: Run Copilot QC Tests"');
  console.log('  6. Click "Allow" when the LM consent dialog appears');
  console.log('  7. Check the Output panel for results');
  console.log('-----------------------------------------');

  await Sleep(500);

  // nonzero exit to indicate we failed
  process.exit(code);
}
