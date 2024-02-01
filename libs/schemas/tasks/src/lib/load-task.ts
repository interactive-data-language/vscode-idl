import { IDL_TRANSLATION } from '@idl/translation';
import { ParsedTask } from '@idl/types/tasks';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

import { LoadTaskSchema } from './load-task-schema';

/**
 * Loads a config file from disk that controls formatting within
 * the VSCode extension
 */
export async function LoadTask(
  fsPath: string,
  content?: string
): Promise<ParsedTask> {
  // check if we have a file to read
  if (content === undefined) {
    // verify file exists
    if (!existsSync(fsPath)) {
      throw new Error(
        `${IDL_TRANSLATION.tasks.parsing.errors.fileNotFound}: "${fsPath}"`
      );
    }

    content = await readFile(fsPath, { encoding: 'utf-8' });
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
    throw new Error(IDL_TRANSLATION.tasks.parsing.errors.invalidJSON);
  }

  /** Load our schema validation function */
  const validator = await LoadTaskSchema();

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
      `${IDL_TRANSLATION.tasks.parsing.errors.invalidTaskFile}. File: "${fsPath}"\n  ${errAdd}`
    );
  }

  // merge and return
  return parsed;
}
