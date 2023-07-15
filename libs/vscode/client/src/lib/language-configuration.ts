import { IDL_LANGUAGE_NAME } from '@idl/shared';
import * as vscode from 'vscode';

import { LANGUAGE_CONFIGURATION } from './language-configuration.interface';

/**
 * Use the VSCode API to configure our language rather than the atrocious
 * JSON file for language configuration.
 *
 * TLDR: Way easier to do this than follow https://code.visualstudio.com/api/language-extensions/language-configuration-guide
 */
export function LoadLanguageConfiguration() {
  vscode.languages.setLanguageConfiguration(
    IDL_LANGUAGE_NAME,
    LANGUAGE_CONFIGURATION
  );
}
