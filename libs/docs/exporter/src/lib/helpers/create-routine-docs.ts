import { GlobalIndexedToken } from '@idl/parsing/index';
import {
  CreateRoutineSyntax,
  IDL_DOCS_HEADERS,
} from '@idl/parsing/syntax-tree';
import { GlobalRoutineToken } from '@idl/types/core';

import { CleanDocs } from './clean-docs';
import { DocsForParameter } from './docs-for-parameter';

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
  const docs: string[] = [`# ${meta.display}`, ''];

  // check for special docs to add
  if (IDL_DOCS_HEADERS.DEFAULT in docsLookup) {
    docs.push(CleanDocs(docsLookup[IDL_DOCS_HEADERS.DEFAULT]));
    docs.push('\n');
  }

  // check for examples
  if (IDL_DOCS_HEADERS.EXAMPLES in docsLookup) {
    docs.push('## Examples');
    docs.push(CleanDocs(docsLookup[IDL_DOCS_HEADERS.EXAMPLES]));
    docs.push('\n');
  }

  docs.push('## Syntax');
  docs.push('```idl');
  docs.push(
    CreateRoutineSyntax({
      name: meta.display,
      meta: meta,
    })
  );
  docs.push('```');
  docs.push('\n');

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

  // combine and return
  return docs.join('\n');
}
