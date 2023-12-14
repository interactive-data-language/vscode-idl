import { IDL_JSON_URI, TASK_FILE_EXTENSION } from '@idl/shared';
import { existsSync } from 'fs';
import { join } from 'path';

import { IPackageJSON, IPackageNLS } from '../package.interface';

export const JSON_VALIDATORS = [
  {
    fileMatch: `*${TASK_FILE_EXTENSION}`,
    url: './extension/language/schemas/tasks/schema.json',
  },
  {
    fileMatch: `*${IDL_JSON_URI}`,
    url: './extension/language/schemas/config/schema.json',
  },
];

/**
 * Updates the package.json file for our JSON validators which are JSON
 * schemas for things such as task files
 */
export function ProcessJSONValidators(
  packageJSON: IPackageJSON,
  nls: IPackageNLS
) {
  // get all of our contribution points
  const contrib = packageJSON['contributes'];

  // verify each theme
  for (let i = 0; i < JSON_VALIDATORS.length; i++) {
    const validator = JSON_VALIDATORS[i];

    // make sure we have absolute path
    if (!validator.url.startsWith('./')) {
      throw new Error(
        `jsonValidator at index ${i} does not start with "./" as required`
      );
    }

    // make sure that the theme file exists
    const url = join(process.cwd(), validator.url);
    if (!existsSync(url)) {
      throw new Error(
        `jsonValidator at index ${i} missing path file where expected "${validator.url}"`
      );
    }
  }

  // made it here so lets update our package file
  contrib['jsonValidation'] = JSON_VALIDATORS;
}
