import { IDL_LANGUAGE_NAME } from '@idl/shared';
import { existsSync } from 'fs';
import { join } from 'path';

import { IPackageJSON, IPackageNLS } from '../package.interface';

export const SNIPPETS = [
  {
    language: IDL_LANGUAGE_NAME,
    path: 'extension/language/snippets/comment-block.json',
  },
  {
    language: IDL_LANGUAGE_NAME,
    path: 'extension/language/snippets/idl.json',
  },
  {
    language: IDL_LANGUAGE_NAME,
    path: 'extension/language/snippets/loops.json',
  },
  {
    language: IDL_LANGUAGE_NAME,
    path: 'extension/language/snippets/conditionals.json',
  },
  {
    language: IDL_LANGUAGE_NAME,
    path: 'extension/language/snippets/envi.json',
  },
  {
    language: IDL_LANGUAGE_NAME,
    path: 'extension/language/snippets/objects.json',
  },
  // {
  //   language: IDL_LANGUAGE_NAME,
  //   path: 'extension/language/snippets/tests.json',
  // },
];

/**
 * Updates the package.json file for our themes and makes sure everything exists
 */
export function ProcessSnippets(packageJSON: IPackageJSON, nls: IPackageNLS) {
  // get all of our contribution points
  const contrib = packageJSON['contributes'];

  // verify each theme
  for (let i = 0; i < SNIPPETS.length; i++) {
    const snippet = SNIPPETS[i];

    // make sure that the theme file exists
    const snippetUri = join(process.cwd(), snippet.path);
    if (!existsSync(snippetUri)) {
      throw new Error(
        `Snippet at index ${i} missing path file where expected "${snippet.path}"`
      );
    }
  }

  // made it here so lets update our package file
  contrib['snippets'] = SNIPPETS;
}
