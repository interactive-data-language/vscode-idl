import { SerializeIDLType } from '@idl/types/core';

import { IDL_DOCS_HEADERS } from '../../docs.interface';
import { MarkdownInfo, RoutineMarkdown } from '../docs-to-markdown.interface';
import { CapitalizeWord } from '../helpers/capitalize-word';
import { CreateRoutineSyntax } from '../helpers/create-routine-syntax';
import { NormalizeIndent } from '../helpers/normalize-indent';

/**
 * Specify docs tags that we should skip because they are manually handled or
 * processed before we get here
 */
const SKIP_THESE: { [key: string]: boolean } = {};
SKIP_THESE[IDL_DOCS_HEADERS.DEFAULT] = true;
SKIP_THESE[IDL_DOCS_HEADERS.ARGS] = true;
SKIP_THESE[IDL_DOCS_HEADERS.KEYWORDS] = true;
SKIP_THESE[IDL_DOCS_HEADERS.RETURNS] = true;
SKIP_THESE[IDL_DOCS_HEADERS.TOOLTIP] = true;

/**
 * Converts routine information to markdown (procedures or functions)
 */
export function RoutinesToMarkdown(
  info: MarkdownInfo<RoutineMarkdown>
): string {
  /** Metadata for routine */
  const meta = info.meta;

  /** Markdown for our documentation */
  const markdown: string[] = [];

  /** Check if we have a function or not */
  const isFunction = 'returns' in meta;

  // split the name of our routine
  const splitName = info.name.split('::');

  // process args
  const argNames = Object.keys(meta.args);

  // process args
  const kwNames = Object.keys(meta.kws);

  // extract other docs to process
  const docs = info.meta.docsLookup;

  if (info.link !== undefined) {
    markdown.push(`[Online Docs](${info.link})`);
  }

  // add in our syntax
  markdown.push('');
  markdown.push('```idl');
  markdown.push(`${CreateRoutineSyntax(info)}`);
  markdown.push('```');
  markdown.push('');

  // make the fancy markdown for our routine
  if (IDL_DOCS_HEADERS.DEFAULT in docs) {
    markdown.push(docs[IDL_DOCS_HEADERS.DEFAULT]);
    markdown.push('');
  }

  // check if we need to add arguments or parameters
  if (argNames.length > 0) {
    markdown.push(``);
    markdown.push(`#### Arguments`);
    markdown.push(``);
    for (let i = 0; i < argNames.length; i++) {
      // get the argument
      const arg = meta.args[argNames[i]];

      // skip if fake
      if (!arg.code) {
        continue;
      }

      // check if private or not - ignore for now since this is for developers
      // if (!arg.private) {
      markdown.push(
        `- **${arg.display}**: ${arg.direction || 'in'}, ${
          arg.req ? 'required' : 'optional'
        }, ${SerializeIDLType(arg.type)}`
      );
      markdown.push(``);
      markdown.push(NormalizeIndent(arg.docs, '  '));
      markdown.push(``);
      // }
    }
    markdown.push(``);
  }

  // check if we need to add arguments or parameters
  if (kwNames.length > 0) {
    markdown.push(``);
    markdown.push(`#### Keywords`);
    markdown.push(``);
    for (let i = 0; i < kwNames.length; i++) {
      // get the argument
      const kw = meta.kws[kwNames[i]];

      // skip if fake
      if (!kw.code) {
        continue;
      }

      // check if private or not - ignore for now since this is for developers
      // if (!arg.private) {
      markdown.push(
        `- **${kw.display}**: ${kw.direction || 'in'}, ${
          kw.req ? 'required' : 'optional'
        }, ${SerializeIDLType(kw.type)}`
      );
      markdown.push(``);
      markdown.push(NormalizeIndent(kw.docs, '    '));
      markdown.push(``);
      // }
    }
    markdown.push(``);
  }

  // get the keys for our other tags
  const keys = Object.keys(docs);

  // process each key
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] in SKIP_THESE) {
      continue;
    }
    markdown.push(``);
    markdown.push(`### ${CapitalizeWord(keys[i])}`);
    markdown.push('');
    markdown.push(docs[keys[i]]);
  }

  return markdown.join('\n');
}
