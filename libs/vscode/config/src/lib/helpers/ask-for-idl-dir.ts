import { IDL_COMMANDS } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  IDL_EXTENSION_CONFIG_KEYS,
  IDontAskConfig,
} from '@idl/vscode/extension-config';
import * as vscode from 'vscode';

import { QuestionAsker } from './question-asker';
import { UpdateConfigObject } from './update-config';

/**
 * Prompt user to pick IDL's folder
 */
export function AskForIDLDir() {
  QuestionAsker(
    IDL_TRANSLATION.configuration.idlDir.notFound,
    IDL_EXTENSION_CONFIG_KEYS.dontAskForIDLDir,
    true,
    () => {
      UpdateConfigObject<IDontAskConfig>(IDL_EXTENSION_CONFIG_KEYS.dontAsk, {
        forIDLDir: true,
      });
    },
    () => {
      vscode.commands.executeCommand(IDL_COMMANDS.CONFIG.IDL_DIR_USER);
    }
  );
}
