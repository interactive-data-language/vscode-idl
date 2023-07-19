import { IParsed } from '@idl/parsing/syntax-tree';
import copy from 'fast-copy';

import { IDLIndex } from '../idl-index.class';

/**
 * If we have a notebook (from our file pattern) determines if we
 * have variables to add from main level programs above
 */
export function PopulateNotebookVariables(
  index: IDLIndex,
  file: string,
  parsed: IParsed
) {
  /**
   * Split to see if notebook cell
   */
  const split = file.split('#');

  // check if notebook
  if (split.length === 2) {
    /**
     * get our cell index
     */
    const idx = +split[1];

    // return if first cell
    if (idx === 0) {
      return;
    }

    /**
     * get our main level variables
     */
    const main = parsed.local.main;

    /**
     * Get other notebook cells
     */
    const otherCells = index.getNotebookFiles(split[0]);

    // process each other cell
    for (let i = 0; i < otherCells.length; i++) {
      /**
       * Get index of other cell
       */
      const otherIdx = +otherCells[i].split('#')[1];

      // check if it comes before
      if (otherIdx < idx) {
        // skip if we haven't encountered our other cells
        if (!index.tokensByFile.has(otherCells[i])) {
          continue;
        }

        // get other cell
        const otherMain = index.tokensByFile.get(otherCells[i]).local.main;

        /** Names of other variables */
        const otherVars = Object.keys(otherMain);

        // process all other variables
        for (let j = 0; j < otherVars.length; j++) {
          if (!(otherVars[j] in main)) {
            // inherit variable
            main[otherVars[j]] = copy(otherMain[otherVars[j]]);
          } else {
            // update usage for both
            main[otherVars[j]].meta.usage.push([-1, -1, -1]);
            otherMain[otherVars[j]].meta.usage.push([-1, -1, -1]);
          }

          // if we dont have a file, inherit position
          if (main[otherVars[j]].file === undefined) {
            main[otherVars[j]].file = otherCells[i];
            main[otherVars[j]].pos = otherMain[otherVars[j]].pos;
          }
        }

        console.log(main);
      }
    }
  }
}
