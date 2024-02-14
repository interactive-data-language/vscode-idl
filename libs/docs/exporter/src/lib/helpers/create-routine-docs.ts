import {
  ExportedGlobalTokensByType,
  GlobalIndexedToken,
} from '@idl/parsing/index';
import {
  CapitalizeWord,
  CreateRoutineSyntax,
  IDL_DOCS_HEADERS,
} from '@idl/parsing/syntax-tree';
import { GLOBAL_TOKEN_TYPES, GlobalRoutineToken } from '@idl/types/core';

import { CleanDocs } from './clean-docs';
import { DocsForParameter } from './docs-for-parameter';
import { GetClassLink } from './get-class-link';

/**
 * Generates routine docs from a global token
 */
export function CreateRoutineDocs(
  item: GlobalIndexedToken,
  exported: ExportedGlobalTokensByType
) {
  /** Get the structures we are exporting */
  const structures = exported[GLOBAL_TOKEN_TYPES.STRUCTURE];

  /** Fix type, silly workaround for where we call this */
  const typed = item as GlobalRoutineToken;

  /** Get metadata */
  const meta = typed.meta;

  /** Get docs lookup */
  const docsLookup = meta.docsLookup || {};

  /** Track the keys for the docs that we have processed */
  const usedKeys: { [key: string]: any } = {};

  /** Check if we are a function or not */
  const isFunction =
    item.type === GLOBAL_TOKEN_TYPES.FUNCTION ||
    item.type === GLOBAL_TOKEN_TYPES.FUNCTION_METHOD;

  /** Text to add to the display name */
  const add = isFunction ? '()' : '';

  /** Create docs  */
  const docs: string[] = [
    `---`,
    `outline: deep`,
    `---`,
    ``,
    `# ${meta.display}${add}`,
    '',
  ];

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

  /**
   * Check for special additions to the header
   */
  switch (true) {
    /**
     * Class method
     */
    case meta.display.includes('::'): {
      const className = meta.display.split('::')[0];
      docs.push(`Member of [${className}](${GetClassLink(className)})`);
      docs.push('');
      break;
    }
    /**
     * Init method
     */
    case structures.find((struct) => struct.name === item.name) !== undefined:
      docs.push(
        `Returns an instance of the class [${item.meta.display}](${GetClassLink(
          item.name
        )})`
      );
      docs.push('');
      break;
    default:
      break;
  }

  /**
   * Add routine syntax
   */
  docs.push('');
  docs.push('```idl:no-line-numbers');
  if (IDL_DOCS_HEADERS.RETURNS in docsLookup) {
    usedKeys[IDL_DOCS_HEADERS.RETURNS] = undefined;
  }
  docs.push(
    CreateRoutineSyntax(
      {
        name: meta.display,
        meta: meta,
      },
      true
    )
  );
  docs.push('```');
  docs.push('');

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

  // /**
  //  * Add return value
  //  */
  // if (IDL_DOCS_HEADERS.RETURNS in docsLookup) {
  //   docs.push(
  //     `### Return Value:${GetReturnsBadge(
  //       ParseIDLType(docsLookup[IDL_DOCS_HEADERS.RETURNS])
  //     )}`
  //   );
  //   usedKeys[IDL_DOCS_HEADERS.RETURNS] = undefined;
  // }

  // add arguments
  const args = Object.values(meta.args || {});
  if (args.length > 0) {
    docs.push('## Arguments');
    docs.push('');

    // add all args
    for (let i = 0; i < args.length; i++) {
      docs.push(DocsForParameter(args[i], `arg-${i}`));
    }
  }

  // add keywords
  const kws = Object.values(meta.kws || {});
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
