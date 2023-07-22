import { FindIDL } from '@idl/idl';
import {
  IDL_EXTENSION_CONFIG_KEYS,
  IDLExtensionConfig,
} from '@idl/vscode/extension-config';
import { existsSync } from 'fs';

import { IIDLWorkspaceConfig } from '../idl-config.interface';
import { AskForIDLDir } from './ask-for-idl-dir';

/**
 * Validate's IDL's config and optionally updates workspace configutration
 * or works anny custom logic to make sure ev erything is valid
 */
export function ValidateConfig(config: IDLExtensionConfig) {
  // do we already have a folder or not?
  if (config.IDL.directory === '' || !existsSync(config.IDL.directory)) {
    // check usual locations for IDL
    const idlDir = FindIDL();

    // change setting if found
    if (idlDir !== undefined) {
      (config as IIDLWorkspaceConfig).update(
        IDL_EXTENSION_CONFIG_KEYS.IDLDirectory,
        idlDir,
        true
      );
    } else {
      if (!config.dontAsk.forIDLDir) {
        AskForIDLDir();
      }
    }
  }
}
