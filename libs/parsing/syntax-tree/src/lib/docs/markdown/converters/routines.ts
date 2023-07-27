import {
  IDL_TYPE_LOOKUP,
  IDLTypeHelper,
  SerializeIDLType,
} from '@idl/data-types/core';

import {
  TASK_REGEX,
  TaskFunctionName,
} from '../../../helpers/task-function-name';
import { IDL_DOCS_HEADERS } from '../../docs.interface';
import { MarkdownInfo, RoutineMarkdown } from '../docs-to-markdown.interface';
import { CapitalizeWord } from '../helpers/capitalize-word';
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

  // initialize the call for syntax
  const syntax: string[] = [];

  /** Check if we have a function or not */
  const isFunction = 'returns' in meta;

  // split the name of our routine
  const splitName = info.name.split('::');

  // check if we are a function or not
  if (isFunction) {
    if (info.name.includes('::')) {
      syntax.push(`result = ${splitName[0]}.${splitName[1]}(`);
    } else {
      if (TASK_REGEX.test(info.name)) {
        syntax.push(`result = ${TaskFunctionName(info.name, "'")}`);
      } else {
        syntax.push(`result = ${info.name}(`);
      }
    }
  } else {
    if (info.name.includes('::')) {
      syntax.push(`${splitName[0]}.${splitName[1]}`);
    } else {
      syntax.push(info.name);
    }
  }

  // process args
  const argNames = Object.keys(meta.args);
  for (let i = 0; i < argNames.length; i++) {
    // add comma
    if (i === 0 && !isFunction) {
      syntax.push(',');
    } else {
      if (i > 0) {
        syntax.push(',');
      }
    }

    // get arg
    const arg = meta.args[argNames[i]];

    // skip if fake
    if (!arg.code) {
      continue;
    }

    // check how to display (depends on if required)
    if (arg.req) {
      syntax.push(` ${arg.display}`);
    } else {
      syntax.push(` [ ${arg.display} ]`);
    }
  }

  // process args
  const kwNames = Object.keys(meta.kws);
  for (let i = 0; i < kwNames.length; i++) {
    if (i === 0) {
      if (!isFunction || argNames.length > 0) {
        syntax.push(', $\n');
      }
    } else {
      syntax.push(`, $\n`);
    }

    // get keyword
    const kw = meta.kws[kwNames[i]];

    // skip if fake
    if (!kw.code) {
      continue;
    }

    // make our keyword syntax - special case if boolean/binary
    let kwSyntax: string;
    if (IDLTypeHelper.isType(kw?.type || [], IDL_TYPE_LOOKUP.BOOLEAN)) {
      kwSyntax = `/${kw.display}`;
    } else {
      kwSyntax = `${kw.display} = ${SerializeIDLType(kw?.type)}`;
    }

    // check how to display (depends on if required)
    if (kw.req) {
      syntax.push(` ${kwSyntax}`);
    } else {
      syntax.push(` [ ${kwSyntax} ]`);
    }
  }
  // check if we need to close our function syntax call
  if (isFunction && !TASK_REGEX.test(info.name)) {
    syntax.push(`)`);
  }

  // extract other docs to process
  const docs = info.meta.docsLookup;

  if (info.link !== undefined) {
    markdown.push(`[Online Docs](${info.link})`);
  }

  // add in our syntax
  markdown.push('');
  markdown.push('```idl');
  markdown.push(`${syntax.join('')}`);
  markdown.push('```');
  markdown.push('');

  // make the fancy markdown for our routine
  if (IDL_DOCS_HEADERS.DEFAULT in docs) {
    markdown.push(docs[IDL_DOCS_HEADERS.DEFAULT]);
    markdown.push('');
  }

  // check if we need to add arguments or parameters
  if (argNames.length > 0) {
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
    markdown.push(`### ${CapitalizeWord(keys[i])}`);
    markdown.push('');
    markdown.push(docs[keys[i]]);
  }

  return markdown.join('\n');
}
