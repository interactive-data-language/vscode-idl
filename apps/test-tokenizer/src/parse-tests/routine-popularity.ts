import { CancellationToken } from '@idl/cancellation-tokens';
import { GetRoutine, IDLIndex } from '@idl/parsing/index';
import { IParsed, TreeRecurserBasic } from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES } from '@idl/parsing/tokenizer';
import { GLOBAL_TOKEN_TYPES } from '@idl/types/core';
import { writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Track the total number of counts for a routine by type
 */
const POPULARITY_CONTEST: { [key: string]: { [key: string]: number } } = {};

// set all global tokens
const GLOBAL_TYPES = Object.values(GLOBAL_TOKEN_TYPES);
for (let i = 0; i < GLOBAL_TYPES.length; i++) {
  POPULARITY_CONTEST[GLOBAL_TYPES[i]] = {};
}

/**
 * Sort by popularity values
 */
function SortByPopularity() {
  // set all global tokens
  for (let i = 0; i < GLOBAL_TYPES.length; i++) {
    // get current values
    const usage = POPULARITY_CONTEST[GLOBAL_TYPES[i]];

    // sort keys
    const keysSorted = Object.keys(usage).sort((a, b) => usage[b] - usage[a]);

    const newVals: { [key: string]: number } = {};

    // re-order
    for (let j = 0; j < keysSorted.length; j++) {
      newVals[keysSorted[j]] = usage[keysSorted[j]];
    }

    POPULARITY_CONTEST[GLOBAL_TYPES[i]] = newVals;
  }
}

/**
 * Writes out popularity information
 */
export function ExportPopularity() {
  // sort
  SortByPopularity();

  // write out
  writeFileSync(
    join(process.cwd(), 'parse-test', 'popularity.json'),
    JSON.stringify(POPULARITY_CONTEST, null, 2)
  );
}

const ROUTINES: { [key: string]: any } = {};
ROUTINES[TOKEN_NAMES.CALL_FUNCTION] = true;
ROUTINES[TOKEN_NAMES.CALL_FUNCTION_METHOD] = true;
ROUTINES[TOKEN_NAMES.CALL_PROCEDURE] = true;
ROUTINES[TOKEN_NAMES.CALL_PROCEDURE_METHOD] = true;

/**
 * Tracks the usage stats for routines
 */
export function TrackPopularity(index: IDLIndex, parsed: IParsed) {
  TreeRecurserBasic(parsed.tree, new CancellationToken(), {
    onBranchToken: (token) => {
      if (token.name in ROUTINES) {
        const defs = GetRoutine(index, parsed, token);
        if (defs.length > 0) {
          const match = POPULARITY_CONTEST[defs[0].type];
          if (!(defs[0].name in match)) {
            match[defs[0].name] = 1;
          } else {
            match[defs[0].name]++;
          }
        }
      }
    },
  });
}
