import { CleanIDLOutput } from '@idl/idl';
import { IDL_COMMANDS, Sleep } from '@idl/shared';
import { IDL_EXTENSION_CONFIG_KEYS } from '@idl/vscode/extension-config';
import { VSCODE_COMMANDS } from '@idl/vscode/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';

/**
 * Make sure that we replace values in the environment variable
 * preferences
 */
export const VariableReplacement: RunnerFunction = async (init) => {
  // set soe preferences
  init.client.config.update(
    IDL_EXTENSION_CONFIG_KEYS.IDLenvironment,
    {
      IDL_PREF1: '${.idl}',
      IDL_PREF2: '${userHome}',
      IDL_PREF3: '${workspaceFolder}',
    },
    true
  );

  // stop our IDL session
  await vscode.debug.stopDebugging();
  await Sleep(100);
  expect(init.debug.adapter.launched).toBeFalsy();
  vscode.commands.executeCommand(VSCODE_COMMANDS.SHOW_DEBUG_CONSOLE);

  /**
   * Start IDL
   */
  const started = await vscode.commands.executeCommand(
    IDL_COMMANDS.DEBUG.START
  );

  // verify we started
  expect(started).toBeTruthy();

  // verify we dont set literal value of variable
  const res1 = CleanIDLOutput(
    await init.debug.adapter.evaluate(`print, getenv('IDL_PREF1')`, {
      echo: true,
    })
  );

  // verify we get the right output
  expect(res1.includes('${.idl}')).toBeFalsy();

  // verify we dont set literal value of variable
  const res2 = CleanIDLOutput(
    await init.debug.adapter.evaluate(`print, getenv('IDL_PREF2')`, {
      echo: true,
    })
  );

  // verify we get the right output
  expect(res2.includes('${userHome}')).toBeFalsy();

  // verify we dont set literal value of variable
  const res3 = CleanIDLOutput(
    await init.debug.adapter.evaluate(`print, getenv('IDL_PREF3')`, {
      echo: true,
    })
  );

  // verify we get the right output
  expect(res3.includes('${workspaceFolder}')).toBeFalsy();

  // reset value
  init.client.config.update(IDL_EXTENSION_CONFIG_KEYS.IDLenvironment, {}, true);

  // stop IDL
  init.debug.adapter.terminate();
  await Sleep(100);
  expect(init.debug.adapter.launched).toBeFalsy();
};
