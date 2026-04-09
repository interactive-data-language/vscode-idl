import { IDL_DOCS_HEADERS } from '../../docs.interface';
import {
  RoutineMarkdownInfo,
  StructureMarkdown,
} from '../docs-to-markdown.interface';
import { CapitalizeWord } from '../helpers/capitalize-word';
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

/**
 * Converts routine information to markdown (procedures or functions)
 */
export function StructureToMarkdown(
  info: RoutineMarkdownInfo<StructureMarkdown>,
): string {
  /** Metadata */
  const meta = info.meta;

  /** Markdown for our documentation */
  const markdown: string[] = [];

  // process args
  const propNames = Object.keys(meta.props);

  // extract other docs to process
  const docs = meta.docsLookup || {};

  if (info.link !== undefined) {
    markdown.push(`[Online Docs](${info.link})`);
  }

  // make the fancy markdown for our routine
  if (IDL_DOCS_HEADERS.DEFAULT in docs) {
    markdown.push(docs[IDL_DOCS_HEADERS.DEFAULT]);
    markdown.push('');
  }

  // check if we need to add arguments or parameters
  if (propNames.length > 0) {
    markdown.push(``);
    markdown.push(`### Properties`);
    markdown.push(``);
    for (let i = 0; i < propNames.length; i++) {
      // get the argument
      const prop = meta.props[propNames[i]];

      // skip if fake
      if (!prop.code) {
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
