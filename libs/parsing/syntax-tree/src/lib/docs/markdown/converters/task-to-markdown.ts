import { IPropertyLookup } from '@idl/types/idl-data-types';

import { IDL_DOCS_HEADERS } from '../../docs.interface';
import { MarkdownInfo, TaskMarkdown } from '../docs-to-markdown.interface';
import { CapitalizeWord } from '../helpers/capitalize-word';
import { CreateTaskSyntax } from '../helpers/create-task-syntax';
import { NormalizeIndent } from '../helpers/normalize-indent';
import { SerializeTypeForDocs } from '../helpers/serialize-type-for-docs';

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
SKIP_THESE['input parameters'] = true;
SKIP_THESE['output parameters'] = true;

/**
 * Adds documentation for properties for a task
 */
export function TaskToMarkdownDocumentProperties(
  markdown: string[],
  props: IPropertyLookup,
) {
  // process args
  const propNames = Object.keys(props);

  // check if we need to add arguments or parameters
  if (propNames.filter((name) => props[name].direction === 'in').length > 0) {
    markdown.push(``);
    markdown.push(`### Input Parameters`);
    markdown.push(``);
    for (let i = 0; i < propNames.length; i++) {
      // get the argument
      const prop = props[propNames[i]];

      // skip if fake
      if (!prop.code) {
        continue;
      }

      // skip if not input
      if (!(prop.direction === 'in')) {
        continue;
      }

      // check if private or not - ignore for now since this is for developers
      // if (!arg.private) {
      markdown.push(
        `- **${prop.display}**: ${SerializeTypeForDocs(prop.type)}`,
      );
      markdown.push(``);
      markdown.push(NormalizeIndent(prop.docs, '  '));
      markdown.push(``);
      // }
    }
    markdown.push(``);
  }

  // check if we need to add output parameters
  if (propNames.filter((name) => props[name].direction === 'out').length > 0) {
    markdown.push(``);
    markdown.push(`### Output Parameters`);
    markdown.push(``);
    for (let i = 0; i < propNames.length; i++) {
      // get the argument
      const prop = props[propNames[i]];

      // skip if fake
      if (!prop.code) {
        continue;
      }

      // skip if not input
      if (!(prop.direction === 'out')) {
        continue;
      }

      // check if private or not - ignore for now since this is for developers
      // if (!arg.private) {
      markdown.push(
        `- **${prop.display}**: ${SerializeTypeForDocs(prop.type)}`,
      );

      markdown.push(``);
      markdown.push(NormalizeIndent(prop.docs, '  '));
      markdown.push(``);
      // }
    }
    markdown.push(``);
  }
}

/**
 * Converts routine information to markdown (procedures or functions)
 */
export function TaskToMarkdown(
  info: MarkdownInfo<TaskMarkdown>,
  onlyProps = false,
): string {
  /** Metadata */
  const meta = info.meta;

  /** Markdown for our documentation */
  const markdown: string[] = [];

  /** Task properties to document */
  const props = info?.taskProperties?.meta?.props || {};

  // check if we only need property docs
  if (onlyProps) {
    TaskToMarkdownDocumentProperties(markdown, props);
    return markdown.join('\n');
  }

  // extract other docs to process
  const docs = meta.docsLookup;

  if (info.link !== undefined) {
    markdown.push(`[Online Docs](${info.link})`);
    markdown.push('');
  }

  // make the fancy markdown for our routine
  if (IDL_DOCS_HEADERS.DEFAULT in docs) {
    markdown.push('');
    markdown.push(docs[IDL_DOCS_HEADERS.DEFAULT]);
    markdown.push('');
  }

  // check if we hae a structure to build syntax from
  if (info?.taskProperties) {
    markdown.push('### Syntax');
    markdown.push('');
    markdown.push('```idl');
    markdown.push(CreateTaskSyntax(info?.taskProperties));
    markdown.push('```');
    markdown.push('');
  }

  // add property syntax
  TaskToMarkdownDocumentProperties(markdown, props);

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
