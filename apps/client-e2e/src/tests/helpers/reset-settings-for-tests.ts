import { FindIDL } from '@idl/idl';
import { GetExtensionPath, IDL_LANGUAGE_NAME } from '@idl/shared';
import { IIDLWorkspaceConfig } from '@idl/vscode/config';
import {
  DEFAULT_IDL_EXTENSION_CONFIG,
  IDL_EXTENSION_CONFIG_KEYS,
} from '@idl/vscode/extension-config';
import copy from 'fast-copy';
import { deepEqual } from 'fast-equals';
import { readFileSync } from 'fs';

/**
 * Scope we reset at
 */
const SCOPE = true;

/** read in the package.json */
const PACKAGE = JSON.parse(
  readFileSync(GetExtensionPath('package.json'), 'utf-8')
);

/**
 * Copy the config
 */
let SAFE_COPY = copy(DEFAULT_IDL_EXTENSION_CONFIG);

/**
 * Wrapper to correctly set config because of nonsense settings API
 */
async function ResetConfigToDefault(config: IIDLWorkspaceConfig, key: string) {
  // starting point to descend
  let nested = SAFE_COPY;

  /** remove BS from keys from package */
  const cleanKey = key.replace(`${IDL_LANGUAGE_NAME}.`, '');

  /** get key path */
  const split = cleanKey.split(/\./g);

  // descend to get value
  for (let i = 0; i < split.length; i++) {
    nested = nested[split[i]];
  }

  // reset key if it has changed
  if (!deepEqual(config.get(cleanKey), nested)) {
    await config.update(cleanKey, nested, SCOPE);
  }
}

/**
 * Reset extension config for running tests to make sure it is always fresh and consistent
 */
export async function ResetSettingsForTests(config: IIDLWorkspaceConfig) {
  // reset our safe copy
  SAFE_COPY = copy(DEFAULT_IDL_EXTENSION_CONFIG);

  // track props to update
  let props: string[] = [];

  /** Get defaults */
  const fConfig = PACKAGE['contributes']['configuration'];

  // get all properties
  for (let i = 0; i < fConfig.length; i++) {
    props = props.concat(Object.keys(fConfig[i]['properties']));
  }

  // reset all properties
  for (let i = 0; i < props.length; i++) {
    await ResetConfigToDefault(config, props[i]);
  }

  // // open settings
  // await vscode.commands.executeCommand('workbench.action.openSettingsJson');

  // // get current editor
  // const activeEditor = vscode.window.activeTextEditor;

  // // get current document
  // const settings = activeEditor.document;

  // // replace with default content
  // // await ReplaceDocumentContent(settings, '{}');
  // // await ReplaceDocumentContent(
  // //   settings,
  // //   `{"${IDL_LANGUAGE_NAME}.${
  // //     IDL_EXTENSION_CONFIG_KEYS.IDLDirectory
  // //   }": ${JSON.stringify(idlDir)}}`
  // // );

  // // update settings
  // await settings.save();

  // // Close the active settings.json editor
  // await vscode.commands.executeCommand('workbench.action.closeActiveEditor');

  /**
   * Manually specify IDL folder
   */
  const idlDir = FindIDL();

  // validate we know where it is
  if (!idlDir) {
    throw new Error('Unable to find IDL, cannot run tests');
  }

  // set latest IDL folder
  await config.update(IDL_EXTENSION_CONFIG_KEYS.IDLDirectory, idlDir, true);
}
