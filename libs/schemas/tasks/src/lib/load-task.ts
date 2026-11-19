import { IDL_TRANSLATION } from '@idl/translation';
import type { ParsedTask } from '@idl/types/tasks';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

import { ValidateTaskFile } from './schemas/task.schema';

/**
 * Loads a config file from disk that controls formatting within
 * the VSCode extension
 */
export async function LoadTask(
  fsPath: string,
  content?: string,
): Promise<ParsedTask> {
  // check if we have a file to read
  if (content === undefined) {
    // verify file exists
    if (!existsSync(fsPath)) {
      throw new Error(
        `${IDL_TRANSLATION.tasks.parsing.errors.fileNotFound}: "${fsPath}"`,
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
  /**
   * Make all parameters lower case
   *
   * DONT do this when we have a version key, because thats with the old
   * schema that IS case sensitive
   */
  if ('parameters' in parsed && !('version' in parsed)) {
    const params = parsed['parameters'];
    for (let i = 0; i < params.length; i++) {
      const lowercaseParam: { [key: string]: any } = {};
      const keys = Object.keys(params[i]);
      for (let j = 0; j < keys.length; j++) {
        lowercaseParam[keys[j].toLowerCase()] = params[i][keys[j]];
      }
      params[i] = lowercaseParam;
    }
    parsed['parameters'] = params;
  }

  /** Validate parsed JSON via schema */
  const result = ValidateTaskFile(parsed);

  // check if we are valid or not
  if (!result.success) {
    // get useful error information
    const useErrors = result.issues.map((issue) => {
      return {
        message: `Property '${issue.path.join('/')}' ${issue.message}`,
      };
    });

    // throw actual error
    throw new Error(
      `${IDL_TRANSLATION.tasks.parsing.errors.invalidTaskFile}. File: "${fsPath}"\n  ${JSON.stringify(useErrors, null, 2)}`,
    );
  }

  // merge and return
  return parsed;
}
