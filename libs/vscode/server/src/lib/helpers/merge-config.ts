import { IFolderRecursion } from '@idl/parsing/index';
import {
  IDL_PROBLEM_CODE_SHORTHAND_CODE_LOOKUP,
  IDL_PROBLEM_CODE_SHORTHAND_LOOKUP,
  IDL_PROBLEM_CODES,
  IDL_REVERSE_PROBLEM_CODE_ALIAS_LOOKUP,
} from '@idl/types/problem-codes';
import copy from 'fast-copy';

import { GLOBAL_SERVER_SETTINGS } from '../initialize-server';
import {
  IDL_CLIENT_CONFIG,
  WORKSPACE_FOLDER_CONFIGS,
} from './track-workspace-config';

/**
 * Track all problem codes that we want to filter out from being reported to the user
 */
export const IGNORE_PROBLEM_CODES: { [key: number]: boolean } = {};

/**
 * Track cases where we exclude problem reporting
 */
export const INCLUDE_PROBLEMS_FOR = {
  ALL: true,
  IDL_PATH: true,
  IDL_PACKAGES: true,
  DOCS: true,
};

/**
 * Track all problem codes that we want to filter out from being reported to the user
 */
export const IDL_PATH_FOLDERS: IFolderRecursion = {};

/**
 * Regex to test folder path for recursion or not
 */
const RECURSIVE_REGEX = /^\+/i;

/**
 * Takes multiple workspace configs and merges them into a single entity
 */
export function MergeConfig() {
  // get all configs
  const configs = Object.values(WORKSPACE_FOLDER_CONFIGS).concat(
    IDL_CLIENT_CONFIG
  );

  // copy existing folders
  const oldFolders = copy(IDL_PATH_FOLDERS);

  // empty problem codes in case we have new ones coming through
  const currentCodes = Object.keys(IGNORE_PROBLEM_CODES);
  for (let i = 0; i < currentCodes.length; i++) {
    delete IGNORE_PROBLEM_CODES[currentCodes[i]];
  }

  // empty folders
  const currentFolders = Object.keys(IDL_PATH_FOLDERS);
  for (let i = 0; i < currentFolders.length; i++) {
    delete IDL_PATH_FOLDERS[currentFolders[i]];
  }

  // always turn off implied print problem
  IGNORE_PROBLEM_CODES[IDL_PROBLEM_CODES.IMPLIED_PRINT_NOTEBOOK] = undefined;

  // reset config for problems
  let pathFlag = false;
  let packagesFlag = false;
  let fullParseFlag = false;

  // process each config
  for (let i = 0; i < configs.length; i++) {
    // get current config
    const el = configs[i];

    // process all ignore codes
    for (let j = 0; j < el.problems.ignoreProblems.length; j++) {
      const code: string | number = el.problems.ignoreProblems[j];

      // map code if string
      if (typeof code === 'string') {
        if (code in IDL_REVERSE_PROBLEM_CODE_ALIAS_LOOKUP) {
          IGNORE_PROBLEM_CODES[IDL_REVERSE_PROBLEM_CODE_ALIAS_LOOKUP[code]] =
            true;
        }
      } else {
        IGNORE_PROBLEM_CODES[code] = true;
      }
    }

    // save IDL path folders
    for (let j = 0; j < el.IDL.path.length; j++) {
      // replace plus sign
      const pathEntry = el.IDL.path[j].replace(RECURSIVE_REGEX, '');

      // check if recursive
      const isRecursive = RECURSIVE_REGEX.test(el.IDL.path[j]);

      // if not in, then save
      if (!(pathEntry in IDL_PATH_FOLDERS)) {
        IDL_PATH_FOLDERS[pathEntry] = isRecursive;
      } else {
        // if we have another entry that is not recursive, and we are, replace it with recursion
        if (isRecursive && !IDL_PATH_FOLDERS[pathEntry]) {
          IDL_PATH_FOLDERS[pathEntry] = isRecursive;
        }
      }
    }

    // update problem exclusion rules
    pathFlag = pathFlag || el.problems.includeProblemsFromIDLPath;
    packagesFlag = packagesFlag || el.problems.includeProblemsFromIDLPackages;

    // check for full parse
    fullParseFlag = fullParseFlag || el.languageServer.fullParse;
  }

  // update global flags
  INCLUDE_PROBLEMS_FOR.IDL_PATH = pathFlag;
  INCLUDE_PROBLEMS_FOR.IDL_PACKAGES = packagesFlag;
  INCLUDE_PROBLEMS_FOR.DOCS =
    configs.filter((config) => !config.problems.reportDocsProblems).length ===
    0;
  INCLUDE_PROBLEMS_FOR.ALL =
    configs.filter((config) => !config.problems.reportProblems).length === 0;

  /**
   * If we dont track problems for user docs, update ignore codes
   */
  if (!INCLUDE_PROBLEMS_FOR.DOCS) {
    /**
     * Get the codes that we add
     */
    const add =
      IDL_PROBLEM_CODE_SHORTHAND_CODE_LOOKUP[
        IDL_PROBLEM_CODE_SHORTHAND_LOOKUP.IDL_DOCS
      ];

    // add them!
    for (let i = 0; i < add.length; i++) {
      IGNORE_PROBLEM_CODES[add[i]] = true;
    }
  }

  // check which folders we need to
  const added: IFolderRecursion = {};
  const removed: IFolderRecursion = {};

  // populate new ones
  const current = Object.keys(IDL_PATH_FOLDERS);
  for (let i = 0; i < current.length; i++) {
    // check if we have a new folder
    if (!(current[i] in oldFolders)) {
      added[current[i]] = IDL_PATH_FOLDERS[current[i]];
    } else {
      // if recursion change, remove and add again
      if (IDL_PATH_FOLDERS[current[i]] !== oldFolders[current[i]]) {
        removed[current[i]] = oldFolders[current[i]];
        added[current[i]] = IDL_PATH_FOLDERS[current[i]];
      }
    }
  }

  // populate removed folders
  const old = Object.keys(oldFolders);
  for (let i = 0; i < old.length; i++) {
    // check if we no longer have the folder
    if (!(old[i] in IDL_PATH_FOLDERS)) {
      // save, but also check if we already have the folder marked as remove
      // if it is marked as remove, then use the highest recursion level between the two
      removed[old[i]] =
        old[i] in removed
          ? removed[old[i]] || oldFolders[old[i]]
          : oldFolders[old[i]];
    }
  }

  // update setting for language server
  GLOBAL_SERVER_SETTINGS.fullParse = fullParseFlag;

  return {
    folders: {
      added,
      removed,
    },
  };
}
