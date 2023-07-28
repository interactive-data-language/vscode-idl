import { Parser } from '@idl/parser';
import { IDL_PROBLEM_CODES } from '@idl/parsing/problem-codes';

/**
 * Track problems that prevents us from embedding code
 */
const BAD_PROBLEMS: { [key: number]: undefined } = {};
BAD_PROBLEMS[IDL_PROBLEM_CODES.DOUBLE_TOKEN] = undefined;
BAD_PROBLEMS[IDL_PROBLEM_CODES.UNKNOWN_TOKEN] = undefined;

/**
 * Creates code for embedding in notebooks
 *
 * Returns undefined if we dont have code to embed
 */
export async function CreateCodeForNotebooks(
  code: string[]
): Promise<string | undefined> {
  // make clear single line of code
  const combined = code.map((codeLine) => codeLine.substring(2)).join('\n');

  // parse
  const parsed = Parser(combined);

  // check for problems
  for (let i = 0; i < parsed.parseProblems.length; i++) {
    if (parsed.parseProblems[i].code in BAD_PROBLEMS) {
      return undefined;
    }
  }

  return combined;
}
