import { SyntaxProblems } from '@idl/parsing/problem-codes';
import copy from 'fast-copy';
import { deepEqual } from 'fast-equals';

import { IDL_INDEX } from '../file-management/initialize-file-manager';
import { CAN_SEND_PROBLEMS } from '../file-management/is-initialized';
import { SERVER_CONNECTION } from '../initialize-server';
import { IGNORE_PROBLEM_CODES, INCLUDE_PROBLEMS_FOR } from './merge-config';
import { SyntaxProblemsToDiagnostic } from './syntax-problem-to-diagnostic';
import { WORKSPACE_FOLDER_CONFIGS } from './track-workspace-config';
import { URIFromFSPath } from './uri-from-fspath';

/**
 * Regex to check if we are in a package file
 */
const IDL_PACKAGES_REGEX = /(?:\\|\/)idl_packages(?:$|\\|\/)/i;

/**
 * Last value of old exclude
 */
let OLD_INCLUDE = copy(INCLUDE_PROBLEMS_FOR);

/**
 * Last copy of old ignore codes
 */
let OLD_IGNORE = copy(IGNORE_PROBLEM_CODES);

/**
 * Sends problems to the current VSCode session
 */
export function SendProblems(inFiles: string[]) {
  // make sure we can send problems
  if (!CAN_SEND_PROBLEMS) {
    return;
  }

  // determine if we need to sync problems for all files or not
  const syncAllProblems =
    !deepEqual(OLD_INCLUDE, INCLUDE_PROBLEMS_FOR) ||
    !deepEqual(OLD_IGNORE, IGNORE_PROBLEM_CODES);

  // update last versions
  OLD_INCLUDE = copy(INCLUDE_PROBLEMS_FOR);
  OLD_IGNORE = copy(IGNORE_PROBLEM_CODES);

  /** Files with changes to global problems */
  const globalChanges = Object.keys(IDL_INDEX.globalIndex.changedFiles);
  IDL_INDEX.globalIndex.changedFiles = {};

  /** Files with updated problems from indexing */
  const indexChanges = Object.keys(IDL_INDEX.changedFiles);
  IDL_INDEX.changedFiles = {};

  // get changed files
  const files = syncAllProblems
    ? Object.keys(IDL_INDEX.knownFiles)
    : Array.from(new Set(inFiles.concat(indexChanges).concat(globalChanges)));

  // get our syntax problems - as a flat array
  const parseProblems = IDL_INDEX.getSyntaxProblems();
  const globalProblems = IDL_INDEX.getGlobalTokenSyntaxProblems();

  // get workspace folders - exclude first which is the default config
  const workspaces = Object.keys(WORKSPACE_FOLDER_CONFIGS);

  // process each file
  for (let i = 0; i < files.length; i++) {
    // skip file if we cant process it
    if (!IDL_INDEX.isPROCode(files[i])) {
      continue;
    }

    // init problems
    let problems: SyntaxProblems = [];

    /** Flag if we can report problems for our file */
    let report = true;

    // filter using IDL packages
    if (report && !INCLUDE_PROBLEMS_FOR.IDL_PACKAGES) {
      report = !IDL_PACKAGES_REGEX.test(files[i]);
    }

    // filter using files
    if (report && !INCLUDE_PROBLEMS_FOR.IDL_PATH) {
      report = false;
      for (let z = 0; z < workspaces.length; z++) {
        if (files[i].startsWith(workspaces[z])) {
          report = true;
          break;
        }
      }
    }

    // check if we can report problems
    if (report) {
      /**
       * Are our tokens in another thread and we have stored the problems directly in parseProblems
       *
       * We use parseProblems to store "undefined" as a flag to sync files so we need an extra check
       */
      if (files[i] in parseProblems) {
        problems = parseProblems[files[i]];
      }

      // check for global problems
      if (files[i] in globalProblems) {
        problems = problems.concat(globalProblems[files[i]]);
      }

      // filter problems by problem code
      if (problems.length > 0) {
        problems = problems.filter(
          (problem) => !(problem.code in IGNORE_PROBLEM_CODES)
        );
      }
    }

    // sync problems
    SERVER_CONNECTION.sendDiagnostics({
      uri: URIFromFSPath(files[i]).toString(),
      diagnostics: SyntaxProblemsToDiagnostic(problems),
    });
  }
}
