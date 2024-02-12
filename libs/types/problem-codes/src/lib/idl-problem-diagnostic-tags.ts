import { DiagnosticTag } from 'vscode-languageserver';

import { IDL_PROBLEM_CODES } from './idl-problem-codes.interface';

/**
 * Optional diagnostic tags that you can specify/configure for each problem
 * that IDL detects.
 *
 * This is used for things like strike throughs (for deprecation) or unused variables
 */
export const IDL_PROBLEM_DIAGNOSTIC_TAGS: {
  [key: number]: DiagnosticTag[];
} = {};

IDL_PROBLEM_DIAGNOSTIC_TAGS[IDL_PROBLEM_CODES.UNUSED_VARIABLE] = [
  DiagnosticTag.Unnecessary,
];
