import {
  IDL_LANGUAGE_NAME,
  LANGUAGE_TOKEN_SCOPE_NAME,
  LOG_LANGUAGE_NAME,
  LOG_LANGUAGE_TOKEN_SCOPE_NAME,
} from '@idl/shared';
import { existsSync } from 'fs';
import { join } from 'path';

import { IPackageJSON, IPackageNLS } from '../package.interface';

export const GRAMMARS = [
  {
    language: IDL_LANGUAGE_NAME,
    scopeName: LANGUAGE_TOKEN_SCOPE_NAME,
    path: 'extension/language/syntaxes/idl.tmLanguage',
  },
  {
    language: LOG_LANGUAGE_NAME,
    scopeName: LOG_LANGUAGE_TOKEN_SCOPE_NAME,
    path: 'extension/language/syntaxes/idl-log.tmLanguage',
  },
  // from https://github.com/mjbvz/vscode-fenced-code-block-grammar-injection-example
  {
    language: `${IDL_LANGUAGE_NAME}-md-injection`,
    scopeName: `markdown.idl.codeblock`,
    path: 'extension/language/syntaxes/code-blocks.json',
    injectTo: ['text.html.markdown'],
    embeddedLanguages: {
      'meta.embedded.block.idl': IDL_LANGUAGE_NAME,
    },
  },
];

/**
 * Updates the package.json file for our grammars which controls syntax highlighting
 */
export function ProcessGrammars(packageJSON: IPackageJSON, nls: IPackageNLS) {
  // get all of our contribution points
  const contrib = packageJSON['contributes'];

  // verify each theme
  for (let i = 0; i < GRAMMARS.length; i++) {
    const grammar = GRAMMARS[i];

    // make sure that the theme file exists
    const url = join(process.cwd(), grammar.path);
    if (!existsSync(url)) {
      throw new Error(
        `grammar at index ${i} missing path file where expected "${grammar.path}"`
      );
    }
  }

  // made it here so lets update our package file
  contrib['grammars'] = GRAMMARS;
}
