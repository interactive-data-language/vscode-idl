import { IDL_TRANSLATION } from '@idl/translation';
import {
  IDL_PROBLEM_CODE_ALIAS_LOOKUP,
  IDLProblemCode,
  ISyntaxProblem,
} from '@idl/types/problem-codes';
import { PositionArray } from '@idl/types/tokenizer';

/**
 * Makes problem code pretty for nice presentation to users
 */
function MakeProblemCodePretty(code: IDLProblemCode) {
  return code in IDL_PROBLEM_CODE_ALIAS_LOOKUP
    ? '"' + IDL_PROBLEM_CODE_ALIAS_LOOKUP[code] + '"'
    : code;
}

/**
 * Takes problem information and maps to information to be presented to the user.
 *
 * Behind the scenes it uses the translation file to map the code to consistent text
 */
export function SyntaxProblemWithTranslation(
  code: IDLProblemCode,
  start: PositionArray,
  end: PositionArray,
  file?: string
): ISyntaxProblem {
  return {
    // _id: nanoid(),
    code,
    // info: `idl(${MakeProblemCodePretty(code)}): ${
    //   IDL_TRANSLATION.parsing.errors[code]
    // }`,
    info: IDL_TRANSLATION.parsing.errors[code],
    start,
    end,
    canReport: true,
    file: file,
  };
}

/**
 * Takes problem information and maps to information to be presented to the user.
 *
 * Allows custom text instead of translation
 */
export function SyntaxProblemWithoutTranslation(
  code: IDLProblemCode,
  info: string,
  start: PositionArray,
  end: PositionArray,
  file?: string
): ISyntaxProblem {
  return {
    // _id: nanoid(),
    code,
    // info: `idl(${MakeProblemCodePretty(code)}): ${info}`,
    info,
    start,
    end,
    canReport: true,
    file: file,
  };
}
