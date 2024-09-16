import { CancellationToken } from '@idl/cancellation-tokens';
import { IParsed, TreeToken } from '@idl/parsing/syntax-tree';
import { NonBasicTokenNames } from '@idl/tokenizer';
import { applyPatch, PatchItem } from 'fast-array-diff';
import copy from 'fast-copy';

import { ConditionalLineNumberIncrement } from './helpers/conditional-line-number-increment';
import { GetOverlappingTokens } from './helpers/get-overlapping-tokens';
import { TOKEN_EDIT_TYPE_LOOKUP } from './helpers/get-overlapping-tokens.interface';
import { IncrementLineNumbers } from './helpers/increment-line-numbers';
import { Parser } from './parser';
import { IParserOptions } from './parser.interface';

/**
 * Partially parse code
 *
 * If we can't partially parse, then we return undefined and should
 * continue as if we didnt do anything first
 */
export function ParserPartial(
  code: string | string[],
  cancel: CancellationToken,
  options: IParserOptions
): IParsed {
  const changes = options.changes;

  /** Flag if we can do a partial parse */
  let canPartial = true;

  /** Tokens we remove */
  const idxRemove: { [key: string]: undefined } = {};

  /** Tokens we update */
  const idxUpdate: { [key: string]: PatchItem<string>[] } = {};

  // process all changes and get extents
  for (let i = 0; i < changes.delta.length; i++) {
    // stop if we cant partially parse
    if (!canPartial) {
      break;
    }

    // get the change
    const change = changes.delta[i];

    /**
     * Check if we are removing tokens
     */
    if (change.type === 'remove') {
      const res = GetOverlappingTokens(
        options.previous.tree,
        change.oldPos,
        change.oldPos + change.items.length
      );

      /**
       * If no matching tokens, then re-parse
       *
       * TODO: This is where we may need to just adjust line numbers in
       * current tree for lines removed
       */
      if (res.found.length === 0) {
        canPartial = false;
        break;
      }

      /**
       * Process all overlapping tokens
       */
      for (let j = 0; j < res.found.length; j++) {
        /** The current edit */
        const edit = res.editTypes[j];

        // if partial, stop everything
        if (edit === TOKEN_EDIT_TYPE_LOOKUP.PARTIAL) {
          canPartial = false;
          break;
        }

        // check for edit or removal
        if (edit === TOKEN_EDIT_TYPE_LOOKUP.INTERIOR) {
          if (!(res.found[j] in idxUpdate)) {
            idxUpdate[res.found[j]] = [];
          }
          idxUpdate[res.found[j]].push(copy(change));
        } else {
          idxRemove[res.found[j]] = undefined;
        }
      }
    } else {
      /**
       * Find parents over where we added new code
       */
      const res = GetOverlappingTokens(
        options.previous.tree,
        change.oldPos,
        change.oldPos
      );

      /**
       * If we don't overlap with tokens, re-parse
       *
       * This is where we would parse the code and attempt to
       * insert it into the top-level syntax tree in the correct
       * location (i.e. we add a new comment above routines)
       */
      if (res.found.length === 0) {
        canPartial = false;
        break;
      }

      /**
       * Process all overlapping tokens
       */
      for (let j = 0; j < res.found.length; j++) {
        // skip ones we remove
        if (res.found[j] in idxRemove) {
          continue;
        }

        /** The current edit */
        const edit = res.editTypes[j];

        // only allow interior edits for additions
        if (edit !== TOKEN_EDIT_TYPE_LOOKUP.INTERIOR) {
          canPartial = false;
          break;
        }

        // save original change to re-create code
        if (!(res.found[j] in idxUpdate)) {
          idxUpdate[res.found[j]] = [];
        }
        idxUpdate[res.found[j]].push(copy(change));
      }
    }
  }

  /**
   * Track issues updating
   */
  let issueUpdating = false;

  /**
   * Additional tokens we added to the tree
   */
  let offset = 0;

  /**
   * Check if we can partial parse
   */
  if (canPartial) {
    /** Previous syntax tree */
    const tree = options.previous.tree;

    /** Get elements we need to update */
    const idxU = Object.keys(idxUpdate);

    // process all re-parses
    for (let j = 0; j < idxU.length; j++) {
      if (issueUpdating) {
        break;
      }

      /** Get as i */
      const i = +idxU[j] + offset;

      /** Index in our syntax tree */
      const tIdx = i + offset;

      // skip if we are removing
      if (i in idxRemove) {
        continue;
      }

      /** Get changes */
      const updates = idxUpdate[i];

      // get token - assumed branch from overlap logic
      const token = tree[tIdx] as TreeToken<NonBasicTokenNames>;

      // update positions
      for (let z = 0; z < updates.length; z++) {
        // offset positions
        updates[z].oldPos -= token.pos[0];
        updates[z].newPos -= token.pos[0];
      }

      /** code before */
      const before = options.changes.original.slice(
        token.pos[0],
        token.end.pos[0] + 1
      );

      /** Merge changes with code */
      const iCode = applyPatch(before, updates);

      /**
       * Re-parse our segment of code
       */
      const replace = Parser(iCode, cancel, { onlyParse: true });

      // check if bad
      if (replace.tree.length > 1) {
        issueUpdating = true;
        break;
      }

      /**
       * Token offset for our tree
       */
      offset += replace.tree.length - 1;

      // increment line numbers
      IncrementLineNumbers(replace.tree, token.pos[0]);

      // merge
      tree.splice(tIdx, 1, ...replace.tree);

      // update overall line numbers after the token we replaced
      ConditionalLineNumberIncrement(
        tree,
        token.end.pos[0] + 1,
        iCode.length - before.length
      );
    }

    /**
     * Indices to remove, start from end
     */
    const idxR = Object.keys(idxRemove).sort().reverse();

    // remove all elements
    // TODO: i dont think the offset is quite right here
    // maybe we remove and track offsets after certain checkpoints?
    for (let i = 0; i < idxR.length; i++) {
      if (issueUpdating) {
        break;
      }
      tree.splice(+idxR[i] + offset, 1);
    }
  }

  // check if we had an issue updating
  if (issueUpdating) {
    /** Shallow copy */
    const shallow = Object.assign({}, options);

    // parse, but remove circular code
    delete shallow.changes;
    delete shallow.previous;

    return undefined;
  } else {
    return options.previous;
  }
}
