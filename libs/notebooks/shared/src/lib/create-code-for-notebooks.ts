import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { IDL_PROBLEM_CODES } from '@idl/types/problem-codes';

/**
 * Track problems that prevents us from embedding code
 */
const BAD_PROBLEMS: { [key: number]: undefined } = {};
BAD_PROBLEMS[IDL_PROBLEM_CODES.DOUBLE_TOKEN] = undefined;
BAD_PROBLEMS[IDL_PROBLEM_CODES.UNKNOWN_TOKEN] = undefined;
BAD_PROBLEMS[IDL_PROBLEM_CODES.ILLEGAL_ARROW] = undefined;
BAD_PROBLEMS[IDL_PROBLEM_CODES.ILLEGAL_BRACKET] = undefined;
BAD_PROBLEMS[IDL_PROBLEM_CODES.ILLEGAL_CHAIN] = undefined;
BAD_PROBLEMS[IDL_PROBLEM_CODES.ILLEGAL_COLON] = undefined;
BAD_PROBLEMS[IDL_PROBLEM_CODES.ILLEGAL_COMMA] = undefined;
BAD_PROBLEMS[IDL_PROBLEM_CODES.ILLEGAL_INCLUDE] = undefined;
BAD_PROBLEMS[IDL_PROBLEM_CODES.ILLEGAL_PARENTHESES] = undefined;
BAD_PROBLEMS[IDL_PROBLEM_CODES.ILLEGAL_STRUCTURE] = undefined;

const REGEX_START = /[^\s]/im;

/**
 * Creates code for embedding in notebooks
 *
 * Returns undefined if we dont have code to embed
 */
export async function CreateCodeForNotebooks(
  code: string[]
): Promise<string[] | undefined> {
  if (code.length === 0) {
    return undefined;
  }

  // get first non-white-space character
  const start = REGEX_START.exec(code[0]);
  let posStart = 0;
  if (start !== null) {
    posStart = start.index;
  }

  // make clear single line of code
  const combined = code
    .map((codeLine) => codeLine.substring(posStart))
    .join('\n');

  // parse
  const parsed = Parser(combined, new CancellationToken());

  // check for problems
  for (let i = 0; i < parsed.parseProblems.length; i++) {
    if (parsed.parseProblems[i].code in BAD_PROBLEMS) {
      return undefined;
    }
  }

  return combined.split('\n');
}
