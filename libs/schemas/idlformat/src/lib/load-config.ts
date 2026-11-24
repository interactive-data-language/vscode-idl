import { IDL_TRANSLATION } from '@idl/translation';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

import { MergeConfig } from './merge-config';
import { IDLConfigSchema } from './schemas/idl-config.schema';

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
        `${IDL_TRANSLATION.tasks.parsing.errors.fileNotFound}: "${uri}"`,
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

  /** Validate parsed JSON via schema */
  const result = IDLConfigSchema.safeParse(parsed);

  // check if we are valid or not
  if (!result.success) {
    // get useful error information
    const useErrors = result.error.issues.map((issue) => {
      return {
        message: `Property '${issue.path.join('/')}' ${issue.message}`,
      };
    });

    // throw actual error
    throw new Error(
      `${IDL_TRANSLATION.assembling.config.errors.invalidConfigFile}. File: "${uri}"\n  ${JSON.stringify(useErrors, null, 2)}`,
    );
  }

  const merged = MergeConfig(parsed);

  // merge and return
  return merged;
}
