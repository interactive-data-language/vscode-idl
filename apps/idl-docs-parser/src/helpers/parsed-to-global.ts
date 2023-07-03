import { GlobalTokens, IRoutineMetadata } from '@idl/data-types/core';
import { IGlobalFromIDL } from '@idl/parsing/routines';
import { DocsToMarkdown, MARKDOWN_TYPE_LOOKUP } from '@idl/parsing/syntax-tree';
import { existsSync, readFileSync } from 'fs';
import * as progressBar from 'progress';

import { BorrowKeywordsFrom } from './borrow-keywords-from';
import { GlobalFromIDLToDisplayNames } from './global-to-display-names';
import { RESOLVED_METHODS } from './resolve-methods';
import {
  RoutineToGlobal,
  RoutineToGlobalAddMissingStructures,
} from './routine-to-global';
import { SetKeywordsFromProperties } from './set-keywords-from-properties';

/**
 * Converts our pre-parsed IDL routine and docs information into global tokens that can plug directly
 * into our index for use like any other routine
 */
export async function ParsedToGlobal(
  jsonUri: string,
  helpDir: string
): Promise<GlobalTokens> {
  // verify that our help folder is present
  if (!existsSync(jsonUri)) {
    throw new Error(
      `Pre-parsed JSON help content does not exist where expected`
    );
  }

  // verify that our help folder is present
  if (!existsSync(helpDir)) {
    throw new Error(`IDL's help content folder does not exist where expected'`);
  }

  /** Parsed routines */
  const parsedRoutines: IGlobalFromIDL[] = JSON.parse(
    readFileSync(jsonUri, { encoding: 'utf-8' })
  );

  /**
   * Display names for our routines from IDL, to track what we have initially
   * and make sure we don't duplicate additional items we parse
   */
  const parsedDisplay = GlobalFromIDLToDisplayNames(parsedRoutines);

  /** initialize global token information */
  const global: GlobalTokens = [];

  //  create progress bar
  const bar = new progressBar('Parsing help content [:bar] :etas :title', {
    total: parsedRoutines.length,
    width: 25,
  });

  // process all of our parsed routines
  for (let i = 0; i < parsedRoutines.length; i++) {
    // get the parsed routine
    const r = parsedRoutines[i];

    // increment our progress bar
    bar.tick({
      title: `"${r.name}": "${r.type}"`,
    });

    // convert our parsed content to global entries
    await RoutineToGlobal(r, helpDir, global, parsedDisplay);
  }

  // add missing structures
  RoutineToGlobalAddMissingStructures(global);

  // finish our progress bar
  bar.complete = true;
  bar.render();

  //  create progress bar
  const bar2 = new progressBar('Resolving methods [:bar] :etas :title', {
    total: RESOLVED_METHODS.length,
    width: 25,
  });

  // process all of our parsed routines
  for (let i = 0; i < RESOLVED_METHODS.length; i++) {
    // get the parsed routine
    const r = RESOLVED_METHODS[i];

    // increment our progress bar
    bar2.tick({
      title: `"${r.name}": "${r.type}"`,
    });

    // convert our parsed content to global entries
    await RoutineToGlobal(r, helpDir, global, parsedDisplay);
  }

  // add missing structures
  RoutineToGlobalAddMissingStructures(global);

  // add missing keywords
  SetKeywordsFromProperties(global);

  // borrow other keywords
  BorrowKeywordsFrom(global);

  // clear docs lookup
  for (let i = 0; i < global.length; i++) {
    const token = global[i];

    // check if we have docs lookup, indicating we are a routine
    if ('docsLookup' in global[i].meta) {
      // get typed metadata
      const meta = token.meta as IRoutineMetadata;

      // get URL from our hack to store
      const url = meta.docsLookup['url'];
      delete meta.docsLookup['url'];

      // update docs
      token.meta.docs = DocsToMarkdown(MARKDOWN_TYPE_LOOKUP.ROUTINE, {
        name: meta.display,
        meta: meta,
        link: url,
      });

      // clear docs lookup
      meta.docsLookup = {};
    }
  }

  // finish our progress bar
  bar2.complete = true;
  bar2.render();

  return global;
}
