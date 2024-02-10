import { FindIDL } from '@idl/idl';
import { GetExtensionPath, IDL_LANGUAGE_NAME } from '@idl/shared';
import { IIDLWorkspaceConfig } from '@idl/vscode/config';
import {
  DEFAULT_IDL_EXTENSION_CONFIG,
  IDL_EXTENSION_CONFIG_KEYS,
} from '@idl/vscode/extension-config';
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
 * Wrapper to correctly set config because of nonsense settings API
 */
async function ResetConfigToDefault(config: IIDLWorkspaceConfig, key: string) {
  // starting point to descend
  let nested = DEFAULT_IDL_EXTENSION_CONFIG;

  /** remove BS from keys from package */
  const cleanKey = key.replace(`${IDL_LANGUAGE_NAME}.`, '');

  /** get key path */
  const split = cleanKey.split(/\./g);

  // descend to get value
  for (let i = 0; i < split.length; i++) {
    nested = nested[split[i]];
  }

  // reset key
  await config.update(cleanKey, nested, SCOPE);
}

/**
 * Reset extension config for running tests to make sure it is always fresh and consistent
 */
export async function ResetSettingsForTests(config: IIDLWorkspaceConfig) {
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
