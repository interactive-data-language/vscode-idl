import { GlobalIndexedToken } from '@idl/parsing/index';
import {
  CapitalizeWord,
  CreateRoutineSyntax,
  IDL_DOCS_HEADERS,
} from '@idl/parsing/syntax-tree';
import { GlobalRoutineToken, ParseIDLType } from '@idl/types/core';

import { CleanDocs } from './clean-docs';
import { DocsForParameter } from './docs-for-parameter';
import { GetClassLink } from './get-class-link';
import { GetReturnsBadge } from './get-returns-badge';

/**
 * Generates routine docs from a global token
 */
export function CreateRoutineDocs(item: GlobalIndexedToken) {
  /** Fix type, silly workaround for where we call this */
  const typed = item as GlobalRoutineToken;

  /** Get metadata */
  const meta = typed.meta;

  /** Get docs lookup */
  const docsLookup = meta.docsLookup;

  /** Create docs  */
  const docs: string[] = [
    `---`,
    `outline: deep`,
    `---`,
    ``,
    `# ${meta.display}`,
    '',
  ];

  if (meta.display.includes('::')) {
    const className = meta.display.split('::')[0];
    docs.push(`Member of [${className}](${GetClassLink(className)})`);
    docs.push('');
  }

  /**
   * Code to put link in the header
   */
  // if (meta.display.includes('::')) {
  //   const className = meta.display.split('::')[0];
  //   const methodName = meta.display.split('::')[1];
  //   docs.push('');
  //   docs.push(`# [${className}](${GetClassLink(className)})::${methodName}`);
  //   docs.push('');
  // } else {
  //   docs.push('');
  //   docs.push(`# ${meta.display}`);
  //   docs.push('');
  // }

  /** Track the keys for the docs that we have processed */
  const usedKeys: { [key: string]: any } = {};

  // check for special docs to add
  if (IDL_DOCS_HEADERS.DEFAULT in docsLookup) {
    docs.push(CleanDocs(docsLookup[IDL_DOCS_HEADERS.DEFAULT]));
    docs.push('\n');
    usedKeys[IDL_DOCS_HEADERS.DEFAULT] = undefined;
  }

  // check for examples
  if (IDL_DOCS_HEADERS.EXAMPLES in docsLookup) {
    docs.push('## Examples');
    docs.push(CleanDocs(docsLookup[IDL_DOCS_HEADERS.EXAMPLES]));
    docs.push('\n');
    usedKeys[IDL_DOCS_HEADERS.EXAMPLES] = undefined;
  }

  /**
   * Add routine syntax
   */
  docs.push('## Syntax');
  docs.push('');
  // if (IDL_DOCS_HEADERS.RETURNS in docsLookup) {
  //   docs.push(
  //     GetReturnsBadge(ParseIDLType(docsLookup[IDL_DOCS_HEADERS.RETURNS]))
  //   );
  //   docs.push('');
  //   usedKeys[IDL_DOCS_HEADERS.RETURNS] = undefined;
  // }
  docs.push('```idl');
  docs.push(
    CreateRoutineSyntax({
      name: meta.display,
      meta: meta,
    })
  );
  docs.push('```');
  docs.push('');

  /**
   * Add return value
   */
  if (IDL_DOCS_HEADERS.RETURNS in docsLookup) {
    docs.push(
      `### Return Value:${GetReturnsBadge(
        ParseIDLType(docsLookup[IDL_DOCS_HEADERS.RETURNS])
      )}`
    );
    usedKeys[IDL_DOCS_HEADERS.RETURNS] = undefined;
  }

  // add arguments
  const args = Object.values(meta.args);
  if (args.length > 0) {
    docs.push('## Arguments');
    docs.push('');

    // add all args
    for (let i = 0; i < args.length; i++) {
      docs.push(DocsForParameter(args[i], `arg-${i}`));
    }
  }

  // add keywords
  const kws = Object.values(meta.kws);
  if (kws.length > 0) {
    docs.push('## Keywords');
    docs.push('');

    // add all args
    for (let i = 0; i < kws.length; i++) {
      docs.push(DocsForParameter(kws[i], `kw-${kws[i].display.toLowerCase()}`));
    }
  }

  // add all of our additional docs keys to the content
  const docsKeys = Object.keys(docsLookup);
  for (let i = 0; i < docsKeys.length; i++) {
    if (docsKeys[i] in usedKeys) {
      continue;
    }

    // add the docs
    docs.push(
      `## ${CapitalizeWord(docsKeys[i])}\n\n${CleanDocs(
        docsLookup[docsKeys[i]]
      )}\n\n`
    );
  }

  // combine and return
  return docs.join('\n');
}
