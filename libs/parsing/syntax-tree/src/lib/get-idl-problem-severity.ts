import {
  IDL_PROBLEM_SEVERITY_LEVEL_MAP,
  IDL_PROBLEM_SEVERITY_LOOKUP,
  IDLProblemCode,
  IDLProblemSeverity,
} from '@idl/types/problem-codes';

/**
 * Maps a problem code to a severity level
 */
export function GetIDLProblemSeverity(
  code: IDLProblemCode
): IDLProblemSeverity {
  if (code in IDL_PROBLEM_SEVERITY_LEVEL_MAP) {
    return IDL_PROBLEM_SEVERITY_LEVEL_MAP[code];
  } else {
    return IDL_PROBLEM_SEVERITY_LOOKUP.ERROR;
  }
}
