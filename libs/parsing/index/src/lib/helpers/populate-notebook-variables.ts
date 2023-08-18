import { IParsedIDLNotebook } from '@idl/notebooks/shared';
import copy from 'fast-copy';

/**
 * If we have a notebook (from our file pattern) determines if we
 * have variables to add from main level programs above
 */
export function PopulateNotebookVariables(
  file: string,
  byCell: IParsedIDLNotebook,
  firstPass: boolean
) {
  /**
   * Get our notebook files, should be in order
   */
  const files = Object.keys(byCell);

  /**
   * Get our main level
   */
  const ourMain = byCell[file].local.main;

  // if our first pass, process variables in a special way
  if (firstPass) {
    // process each file
    for (let i = 0; i < files.length; i++) {
      // check if same file
      if (files[i] === file) {
        return;
      }

      // skip if not-code
      if (byCell[files[i]] === undefined) {
        continue;
      }

      /**
       * Get variables in other main level program
       */
      const otherMain = byCell[files[i]].local.main;

      /** Get our variables */
      const ourVars = Object.keys(ourMain);

      // process all of our variables
      for (let j = 0; j < ourVars.length; j++) {
        // if found, track usage to turn off problem reporting
        if (ourVars[j] in otherMain) {
          otherMain[ourVars[j]].meta.usage.push([-1, -1, -1]);
        }
      }
    }
  } else {
    /**
     * Track variables that we have set so we only update them once
     */
    const weSet: { [key: string]: undefined } = {};

    // process each file
    for (let i = 0; i < files.length; i++) {
      // check if same file
      if (files[i] === file) {
        return;
      }

      // skip if not-code
      if (byCell[files[i]] === undefined) {
        continue;
      }

      /**
       * Get variables in other main level program
       */
      const otherMain = byCell[files[i]].local.main;

      /**
       * Get variables in other file
       */
      const otherVars = Object.keys(otherMain);

      // process each other variable
      for (let j = 0; j < otherVars.length; j++) {
        /**
         * Get our variable name
         */
        const otherVarName = otherVars[j];

        // inherit variable
        if (otherVarName in ourMain) {
          /**
           * Check if we need to set the variable (it hasnt been processed already)
           */
          if (!(otherVarName in weSet)) {
            // set position
            ourMain[otherVarName].file = files[i];
            ourMain[otherVarName].filePos = otherMain[otherVarName].pos;

            // inherit properties for consistent formatting across the notebook
            ourMain[otherVarName].meta.display =
              otherMain[otherVarName].meta.display;

            // inherit docs
            if (!ourMain[otherVarName].meta.docs) {
              ourMain[otherVarName].meta.docs =
                otherMain[otherVarName].meta.docs;
            }

            // mark as processed
            weSet[otherVarName] = undefined;
          }

          // if we arent defined, inherit
          if (!ourMain[otherVarName].meta.isDefined) {
            ourMain[otherVarName].meta.isDefined =
              otherMain[otherVarName].meta.isDefined;
            ourMain[otherVarName].meta.type = otherMain[otherVarName].meta.type;
            ourMain[otherVarName].meta.isStaticClass =
              otherMain[otherVarName].meta.isStaticClass;
          }
        } else {
          // copy
          ourMain[otherVarName] = copy(otherMain[otherVarName]);

          // reset usage
          const usage = ourMain[otherVarName].meta.usage;
          for (let z = 0; z < usage.length; z++) {
            usage[z] = [-1, -1, -1];
          }

          // update location
          ourMain[otherVarName].file = files[i];
          ourMain[otherVarName].filePos = otherMain[otherVarName].pos;
        }
      }
    }
  }
}
