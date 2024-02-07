import { ApplyDisabledProblems } from '@idl/parser';
import { IParsed } from '@idl/parsing/syntax-tree';

/**
 * From a parsed file, returns all syntax problems.
 *
 * Simple helper because we track these problems in more than one place
 * and this makes sure problems are up-to-date with what can be reported
 * or not
 */
export function GetSyntaxProblems(parsed: IParsed) {
  ApplyDisabledProblems(parsed);
  return parsed.parseProblems.concat(parsed.postProcessProblems);
}
