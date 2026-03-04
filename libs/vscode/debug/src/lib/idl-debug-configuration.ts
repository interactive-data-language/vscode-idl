import { IDL_DEBUG_CONFIGURATION_LOG } from '@idl/logger';
import { CleanPath } from '@idl/shared/extension';
import { IDL_EXTENSION_CONFIG } from '@idl/vscode/config';
import { IDLExtensionConfig } from '@idl/vscode/extension-config';
import { IDL_LOGGER } from '@idl/vscode/logger';
import { copy } from 'fast-copy';
import { platform } from 'os';
import * as path from 'path';
import {
  CancellationToken,
  DebugConfiguration,
  DebugConfigurationProvider,
  ProviderResult,
  WorkspaceFolder,
} from 'vscode';
import * as vscode from 'vscode';
import { URI } from 'vscode-uri';

import { VariablesReferenceSubstitution } from './helpers/variables-reference-substitution';
import {
  DEFAULT_IDL_DEBUG_CONFIGURATION,
  IDLDebugConfiguration,
} from './idl-debug-adapter.interface';

/**
 * Regular expression for path separators
 *
 * Handles cross-platform
 */
const SEP_REGEX = platform() === 'win32' ? /;/g : /:/g;

/**
 * Class that manages setting IDL's configuration prior to launching a
 * debug session.
 *
 * Mainly manages setting up the path when we launch IDL.
 *
 * This is where any VSCode related logic for configuration should go. Anything
 * not related to VSCode, and only related to IDL, should be in the
 * `idl.class.ts::start` method.
 */
export class IDLDebugConfigurationProvider
  implements DebugConfigurationProvider
{
  /**
   * Massage a debug configuration just before a debug session is being launched,
   * e.g. add all missing attributes to the debug configuration.
   */
  resolveDebugConfiguration(
    folder: undefined | WorkspaceFolder,
    config: DebugConfiguration,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    token?: CancellationToken
  ): ProviderResult<IDLDebugConfiguration> {
    // log details
    IDL_LOGGER.log({
      log: IDL_DEBUG_CONFIGURATION_LOG,
      content: 'Resolving debug configuration',
    });

    // merge properties
    const useConfig: IDLDebugConfiguration = {
      ...DEFAULT_IDL_DEBUG_CONFIGURATION,
      ...config,
      ...{ config: copy(IDL_EXTENSION_CONFIG) as IDLExtensionConfig },
    };

    // set environment
    useConfig.env = Object.assign(
      {},
      DEFAULT_IDL_DEBUG_CONFIGURATION.env, // from `process.env`
      IDL_EXTENSION_CONFIG.IDL.environment
    );

    // do substitution for all environment variables
    const vars = Object.keys(IDL_EXTENSION_CONFIG.IDL.environment);
    for (let i = 0; i < vars.length; i++) {
      useConfig.env[vars[i]] = VariablesReferenceSubstitution(
        useConfig.env[vars[i]]
      );

      // update copied config so VSCode doesnt try to map it
      useConfig.config.IDL.environment[vars[i]] = useConfig.env[vars[i]];
    }

    // string to use to join workspace folders
    const joinchar = `${path.delimiter}+`;

    /** Track path folders */
    const pathFolders: { [key: string]: any } = {};

    // check if we have workspace folders
    if (vscode.workspace.workspaceFolders !== undefined) {
      // get the paths of folders to add to IDLs search path
      const folders = vscode.workspace.workspaceFolders.map((iFolder) =>
        CleanPath(URI.parse(iFolder.uri.toString()).fsPath)
      );

      // see if we have folders to update/set
      if (folders.length > 0) {
        // check if we have workspace folders to add
        // do this first so the routines take priority in IDL
        if (useConfig.config.IDL.addWorkspaceFoldersToPath) {
          pathFolders[`+${folders.join(joinchar)}`] = true;
        }

        // set the start directory - always do if we have a start folder
        useConfig.env.IDL_START_DIR = folders[0];
        useConfig.cwd = folders[0];
      }
    }

    // check if the user has configured their own folders for IDL's search path
    // up to them if they recursively add folders or not
    if (useConfig.config.IDL.path.length > 0) {
      /** FIlter user preferences for path */
      const addPath = useConfig.config.IDL.path
        .map((item) => item.trim())
        .filter((item) => item);

      // save all filtered folders
      for (let i = 0; i < addPath.length; i++) {
        pathFolders[addPath[i]] = true;
      }
    }

    // check for existing environment variable for path
    if ('IDL_PATH' in useConfig.env) {
      const existingFolders: string[] = useConfig.env.IDL_PATH.split(SEP_REGEX)
        .map((item) => item.trim())
        .filter((item) => item);
      for (let i = 0; i < existingFolders.length; i++) {
        pathFolders[existingFolders[i]] = true;
      }
    }

    /** Flag if we have a default */
    let hadDefault = false;

    // convert to folders
    const folders = Object.keys(pathFolders)
      // trim items
      .map((item) => item.trim())
      // remove empty strings
      .filter((item) => item)
      // remove idl default statements so we can order
      .filter((item) => {
        const isDefault = /<idl_default>/i.test(item);
        if (isDefault) {
          hadDefault = true;
        }
        return !isDefault;
      });

    // check if we already set the default idl path
    if (hadDefault) {
      folders.push('<IDL_DEFAULT>;');
    } else {
      // no default path, so add it to the beginning
      if (useConfig.config.IDL.appendOrPrependWorkspaceFolders === 'prepend') {
        folders.unshift('<IDL_DEFAULT>;');
      } else {
        folders.push('<IDL_DEFAULT>;');
      }
    }

    // update path environment variable
    useConfig.env.IDL_PATH = folders.join(path.delimiter);

    // check if light mode or dark mode
    if (!('IDL_THEME' in useConfig.env) && useConfig.config.IDL.themeMatch) {
      switch (vscode.window.activeColorTheme.kind) {
        case vscode.ColorThemeKind.Dark:
          useConfig.env['IDL_THEME'] = '1';
          break;
        default:
          useConfig.env['IDL_THEME'] = '0';
          break;
      }
    }

    return useConfig;
  }
}
