import { IParsed } from '@idl/parsing/syntax-tree';

/**
 * From a parsed file, returns all syntax problems.
 *
 * Simple helper because we track these problems in more than one place
 */
export function GetSyntaxProblems(parsed: IParsed) {
  return parsed.parseProblems.concat(parsed.postProcessProblems);
}
