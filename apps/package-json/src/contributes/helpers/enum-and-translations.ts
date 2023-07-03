import {
  IDL_PROBLEM_CODE_ALIAS_LOOKUP,
  IDL_PROBLEM_CODES,
  IDL_REVERSE_PROBLEM_CODE_ALIAS_LOOKUP,
} from '@idl/parsing/problem-codes';

/**
 * Adds all of our problem codes to the enum and translation list for our
 * settings
 */
export function IDLProblemCodeEnumAndTranslations(config: {
  [key: string]: any;
}) {
  // get the codes
  const codes = Object.values(IDL_PROBLEM_CODES);

  // make enum and description array
  let enums: string | number[] = [];

  for (let i = 0; i < codes.length; i++) {
    // enums.push(codes[i]);W
    enums.push(IDL_PROBLEM_CODE_ALIAS_LOOKUP[codes[i]]);
  }

  // sort enums
  enums = enums.sort();

  // descriptions.push(`%parsing.errors.${codes[i]}%`);
  const descriptions: string[] = [];

  // populate descriptions
  for (let i = 0; i < codes.length; i++) {
    descriptions.push(
      `%parsing.errors.${IDL_REVERSE_PROBLEM_CODE_ALIAS_LOOKUP[enums[i]]}%`
    );
  }

  config.items.enum = enums;
  config.items.enumDescriptions = descriptions;
}
