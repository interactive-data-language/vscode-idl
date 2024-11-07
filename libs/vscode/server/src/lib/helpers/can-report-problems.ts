import { IsFileOnPath } from './is-file-on-path';
import {
  IDL_PATH_FOLDERS,
  IDL_PROBLEM_EXCLUSION_FOLDERS,
  INCLUDE_PROBLEMS_FOR,
} from './merge-config';

/**
 * Regex to check if we are in a package file
 */
const IDL_PACKAGES_REGEX = /(?:\\|\/)idl_packages(?:$|\\|\/)/i;

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
    report = IsFileOnPath(file, IDL_PATH_FOLDERS);
  }

  // filter folders that we should exclude from user settings
  if (report) {
    report = IsFileOnPath(file, IDL_PROBLEM_EXCLUSION_FOLDERS);
  }

  return report;
}
