import { IDL_TRANSLATION } from '@idl/translation';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

import { LoadSchema } from './load-schema';
import { MergeConfig } from './merge-config';

/**
 * Loads a config file from disk that controls formatting within
 * the VSCode extension
 */
export async function LoadConfig(uri: string, content?: string) {
  // check if we have a file to read
  if (content === undefined) {
    // verify file exists
    if (!existsSync(uri)) {
      throw new Error(
        `${IDL_TRANSLATION.tasks.parsing.errors.fileNotFound}: "${uri}"`
      );
    }

    content = await readFile(uri, { encoding: 'utf-8' });
  }

  // if empty string, give it a default value
  if (content.replace(/\s/g, '').trim() === '') {
    content = '{}';
  }

  /** Read and parsed file */
  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch (err) {
    throw new Error(IDL_TRANSLATION.assembling.config.errors.invalidJSON);
  }

  /** Load our schema validation function */
  const validator = await LoadSchema();

  /** Validate parsed JSON via schema */
  const valid = validator(parsed);

  // check if we are valid or not
  if (!valid) {
    let errAdd = '';
    // check for error details
    if (validator.errors !== undefined) {
      // get useful error information
      const useErrors = validator.errors.map((val) => {
        return {
          message: `Property '${val.instancePath.substring(1)}' ${val.message}`,
          params: val.params,
        };
      });

      errAdd = JSON.stringify(useErrors, null, 2);
    }

    // throw actual error
    throw new Error(
      `${IDL_TRANSLATION.assembling.config.errors.invalidConfigFile}. File: "${uri}"\n  ${errAdd}`
    );
  }

  const merged = MergeConfig(parsed);

  // merge and return
  return merged;
}
