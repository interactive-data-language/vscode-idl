import { IDLFileHelper } from '@idl/shared';
import { IDL_DOCS_PROBLEMS, SyntaxProblems } from '@idl/types/problem-codes';
import copy from 'fast-copy';
import { deepEqual } from 'fast-equals';

import { IDL_INDEX } from '../events/initialize-document-manager';
import { CAN_SEND_PROBLEMS } from '../events/is-initialized';
import { SERVER_CONNECTION } from '../initialize-server';
import {
  IDL_PATH_FOLDERS,
  IGNORE_PROBLEM_CODES,
  INCLUDE_PROBLEMS_FOR,
} from './merge-config';
import { SyntaxProblemsToDiagnostic } from './syntax-problem-to-diagnostic';
import { URIFromIDLIndexFile } from './uri-from-idl-index-file';

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
 * Determines if we can report problems for a file or not
 */
export function CanReportProblems(file: string) {
  /** Flag if we can report problems for our file */
  let report = true;

  // filter using IDL packages
  if (report && !INCLUDE_PROBLEMS_FOR.IDL_PACKAGES) {
    report = !IDL_PACKAGES_REGEX.test(file);
  }

  // filter using files
  if (report && !INCLUDE_PROBLEMS_FOR.IDL_PATH) {
    report = false;
    const folders = Object.keys(IDL_PATH_FOLDERS);
    for (let z = 0; z < folders.length; z++) {
      if (file.startsWith(folders[z])) {
        report = true;
        break;
      }
    }
  }

  return report;
}

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

  // process each file
  for (let i = 0; i < files.length; i++) {
    // init problems
    let problems: SyntaxProblems = [];

    // skip files we cant report problems for
    if (!CanReportProblems(files[i])) {
      continue;
    }

    // make sure we have a valid file that we can report problems for
    if (
      !(
        IDLFileHelper.isPROCode(files[i]) ||
        IDLFileHelper.isPRODef(files[i]) ||
        IDLFileHelper.isIDLNotebookFile(files[i])
      )
    ) {
      continue;
    }

    /**
     * Are our tokens in another thread and we have stored the problems directly in parseProblems
     *
     * We use parseProblems to store "undefined" as a flag to sync files so we need an extra check
     */
    if (parseProblems[files[i]]) {
      problems = problems.concat(parseProblems[files[i]]);
    }

    // check for global problems
    if (globalProblems[files[i]]) {
      problems = problems.concat(globalProblems[files[i]]);
    }

    // filter problems by problem code
    if (problems.length > 0) {
      if (IDLFileHelper.isPRODef(files[i])) {
        problems = problems.filter(
          (problem) =>
            !(
              problem.code in IDL_DOCS_PROBLEMS ||
              problem.code in IGNORE_PROBLEM_CODES
            ) && problem.canReport
        );
      } else {
        problems = problems.filter(
          (problem) =>
            !(problem.code in IGNORE_PROBLEM_CODES) && problem.canReport
        );
      }
    }

    // sync problems
    SERVER_CONNECTION.sendDiagnostics({
      uri: URIFromIDLIndexFile(files[i]),
      diagnostics: SyntaxProblemsToDiagnostic(
        INCLUDE_PROBLEMS_FOR.ALL ? problems : []
      ),
    });
  }
}
