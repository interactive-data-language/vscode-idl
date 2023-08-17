import {
  IDLRawNotebook,
  IDLRawNotebookCell,
  IDLRawNotebookCellType,
  IDLRawNotebookVersion_2_0_0,
} from '@idl/notebooks/types';
import { IRetrieveDocsPayload } from '@idl/vscode/events/messages';

import { CreateCodeForNotebooks } from './create-code-for-notebooks';
import { EncodeNotebook } from './encode-notebook';

/**
 * When does code block start
 */
const START_CODE = /^\s*```idl/i;

/**
 * Code blocks end (or basic start)
 */
const END_CODE = /^\s*```/i;

/**
 * Converts docs to a nice looking notebook
 *
 * Returns `undefined` if there are no example code cells
 */
export async function ConvertDocsToNotebook(
  info: IRetrieveDocsPayload,
  docs: string
) {
  /** Notebook cells */
  const cells: IDLRawNotebookCell<IDLRawNotebookVersion_2_0_0>[] = [];

  cells.push({
    type: 'markdown',
    content: [`#### ${info.name}`],
  });

  // split on new lines
  const split = docs.split('\n');

  /** Strings for blocks */
  const blocks: string[][] = [];

  /** Types of blocks */
  const types: IDLRawNotebookCellType[] = [];

  /** last text content for markdown */
  const lastContent: string[] = [];

  /** Check if first code block (indicates syntax example) */
  let first = true;

  /** Flag if we skip (bad header we should ignore) */
  let skip = false;

  // process each line
  for (let i = 0; i < split.length; i++) {
    /** Get the current line */
    const line = split[i];

    // check if we need to skip
    if (line.startsWith('#')) {
      skip = line === '#### Arguments' || line === '#### Keywords';
    }

    // skip if we skip :)
    if (skip) {
      continue;
    }

    switch (true) {
      /**
       * Are we starting a code block?
       */
      case START_CODE.test(line):
        if (!first && lastContent.length > 0) {
          types.push('markdown');
          blocks.push(lastContent.splice(0, lastContent.length));
        }
        if (first) {
          lastContent.push(line);
        }
        break;

      /**
       * Are we ending a code block?
       */
      case END_CODE.test(line):
        if (first) {
          lastContent.push(line);
          first = false;
        } else {
          if (lastContent.length > 0) {
            // get code block
            const codeBlock = lastContent.splice(0, lastContent.length);

            // check to make sure kosher
            const checked = await CreateCodeForNotebooks(codeBlock);

            // see how we include
            if (checked !== undefined) {
              types.push('code');
              blocks.push(checked);
            } else {
              types.push('markdown');
              codeBlock.unshift('```');
              codeBlock.push('```');
              blocks.push(codeBlock);
            }
          }
        }
        break;
      default:
        lastContent.push(line);
    }
  }

  // check if extra content to inject
  if (lastContent.length > 0) {
    types.push('markdown');
    blocks.push(lastContent.splice(0, lastContent.length));
  }

  // return if only one block or no code blocks
  if (blocks.length === 1 || types.findIndex((el) => el === 'code') === -1) {
    return undefined;
  }

  // add warning block at beginning
  blocks.unshift([
    '### Notebook Preview',
    '',
    'Please note that this is a preview feature of notebooks for IDL.',
    '',
    "Our Notebook API and file format are not set in stone, so please don't start creating many notebooks for personal use quite yet.",
    '',
    'Use the examples from documentation as a way to learn about how to use notebooks and see if you like them!',
    '',
    'If you have questions, comments, or concerns, let us know [here](https://github.com/interactive-data-language/vscode-idl/discussions/6) on GitHub.',
  ]);
  types.unshift('markdown');

  /**
   * Create raw notebook
   */
  const raw: IDLRawNotebook<IDLRawNotebookVersion_2_0_0> = {
    version: '2.0.0',
    cells: blocks.map((block, idx) => {
      return {
        type: types[idx],
        content: block,
      };
    }),
  };

  // return encoded
  return EncodeNotebook(raw);
}
