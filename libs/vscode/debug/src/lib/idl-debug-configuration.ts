import { IDL_DEBUG_CONFIGURATION_LOG } from '@idl/logger';
import { CleanPath } from '@idl/shared';
import { IDL_LOGGER } from '@idl/vscode/client';
import { IDL_EXTENSION_CONFIG } from '@idl/vscode/config';
import { IDLExtensionConfig } from '@idl/vscode/extension-config';
import { VariablesReferenceSubstitution } from '@idl/vscode/shared';
import copy from 'fast-copy';
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

import {
  DEFAULT_IDL_DEBUG_CONFIGURATION,
  IDLDebugConfiguration,
} from './idl-debug-adapter.interface';

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
    folder: WorkspaceFolder | undefined,
    config: DebugConfiguration,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    token?: CancellationToken
  ): ProviderResult<IDLDebugConfiguration> {
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

    // get the addition to our path
    let folders: string[] = [];
    let folderAdd = '';

    // check if we have workspace folders
    if (vscode.workspace.workspaceFolders !== undefined) {
      // get the paths of folders to add to IDLs search path
      folders = vscode.workspace.workspaceFolders.map((iFolder) =>
        CleanPath(URI.parse(iFolder.uri.toString()).fsPath)
      );
    }

    // check if we have workspace folders to add
    // do this first so the routines take priority in IDL
    if (useConfig.config.IDL.addWorkspaceFoldersToPath) {
      folderAdd += `+${folders.join(joinchar)}${path.delimiter}`;
    }

    // set the start directory - always do if we have a start folder
    if (folders.length > 0) {
      useConfig.env.IDL_START_DIR = folders[0];
      useConfig.cwd = folders[0];
    }

    // check if the user has configured their own folders for IDL's search path
    // up to them if they recursively add folders or not
    if (useConfig.config.IDL.path.length > 0) {
      folderAdd += `${useConfig.config.IDL.path.join(path.delimiter)}${
        path.delimiter
      }`;
    }

    // check for existing environment variable for path
    if ('IDL_PATH' in useConfig.env) {
      folderAdd += useConfig.env.IDL_PATH + path.delimiter;
    }

    // check if we already set the default idl path
    if (folderAdd.toLocaleLowerCase().includes('<idl_default>')) {
      useConfig.env.IDL_PATH = folderAdd;
    } else {
      // no default path, so add it
      if (useConfig.config.IDL.appendOrPrependWorkspaceFolders === 'prepend') {
        useConfig.env.IDL_PATH = `${folderAdd}<IDL_DEFAULT>`;
      } else {
        useConfig.env.IDL_PATH = `<IDL_DEFAULT>${path.delimiter}${folderAdd}`;
      }
    }

    // log details
    IDL_LOGGER.log({
      log: IDL_DEBUG_CONFIGURATION_LOG,
      content: 'Resolving debug configuration',
    });

    return useConfig;
  }
}
