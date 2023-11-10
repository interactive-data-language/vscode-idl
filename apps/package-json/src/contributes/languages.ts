import {
  EPT_FILE_EXTENSION,
  EVS_FILE_EXTENSION,
  IDL_LANGUAGE_NAME,
  IDL_NOTEBOOK_EXTENSION,
  IDL_NOTEBOOK_LANGUAGE_NAME,
  LOG_LANGUAGE_NAME,
  MODEL_FILE_EXTENSION,
  PRO_FILE_EXTENSION,
  TASK_FILE_EXTENSION,
  TASK_STYLE_FILE_EXTENSION,
} from '@idl/shared';
import { existsSync } from 'fs';
import { join } from 'path';

import { IPackageJSON, IPackageNLS } from '../package.interface';

export const LANGUAGES = [
  {
    id: IDL_LANGUAGE_NAME,
    aliases: ['IDL', 'idl'],
    extensions: [PRO_FILE_EXTENSION],
    configuration: 'extension/language/syntaxes/language-configuration.json',
    mimetypes: ['text/idl', 'application/idl'],
    // icons moved into icon themes
    // icon: {
    //   light: 'extension/images/idlicon.png',
    //   dark: 'extension/images/idlicon.png',
    // },
  },
  {
    id: `${IDL_LANGUAGE_NAME}-md-injection`,
  },
  {
    id: IDL_NOTEBOOK_LANGUAGE_NAME,
    extensions: [IDL_NOTEBOOK_EXTENSION],
  },
  {
    id: LOG_LANGUAGE_NAME,
    mimetypes: ['text/idl-log', 'application/idl-log'],
    extensions: ['.idllog'],
    configuration: 'extension/language/syntaxes/language-configuration.json',
  },
  {
    id: 'json',
    aliases: ['Task', 'task'],
    extensions: [TASK_FILE_EXTENSION],
  },
  {
    id: 'json',
    aliases: ['Style', 'style'],
    extensions: [TASK_STYLE_FILE_EXTENSION],
  },
  {
    id: 'json',
    aliases: ['Model', 'model'],
    extensions: [MODEL_FILE_EXTENSION],
  },
  {
    id: 'json',
    aliases: ['EVS', 'evs'],
    extensions: [EVS_FILE_EXTENSION],
  },
  {
    id: 'json',
    aliases: ['EPT', 'ept'],
    extensions: [EPT_FILE_EXTENSION],
  },
];

/**
 * Updates the package.json file for our languages which controls how different file
 * extensions are handled
 */
export function ProcessLanguages(packageJSON: IPackageJSON, nls: IPackageNLS) {
  // get all of our contribution points
  const contrib = packageJSON['contributes'];

  // verify each theme
  for (let i = 0; i < LANGUAGES.length; i++) {
    const language = LANGUAGES[i];

    // check if we have a language configuration
    if ('configuration' in language) {
      // make sure that the theme file exists
      const languageUri = join(process.cwd(), language.configuration);
      if (!existsSync(languageUri)) {
        throw new Error(
          `Language at index ${i} missing path file where expected "${language.configuration}"`
        );
      }
    }
  }

  // made it here so lets update our package file
  contrib['languages'] = LANGUAGES;
}
