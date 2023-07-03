import { dirname } from 'path';

import { HTMLToMarkdown } from './html-to-markdown';
import { JoinCode } from './join-code';
import { IParameterDocs, IParameterHTML } from './process-parameters.interface';

/**
 * Converts parameters to traditional docs
 */
export async function ProcessParameters(
  params: IParameterHTML,
  file: string
): Promise<IParameterDocs> {
  // get folder our file lives in
  const dir = dirname(file);

  // get all routines
  const keys = Object.keys(params);

  /** Docs for our parameters */
  const docs: IParameterDocs = {};

  // process all names
  for (let j = 0; j < keys.length; j++) {
    // get kids
    const res = params[keys[j]];

    // join any code blocks
    await JoinCode(res);

    // convert the rest to markdown and save
    docs[keys[j]] = HTMLToMarkdown(res, dir);
  }

  return docs;
}
