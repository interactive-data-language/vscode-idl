import { IDLDiagnostic } from '@idl/data-types/diagnostic';
import {
  IDL_PROBLEM_CODE_ALIAS_LOOKUP,
  IDL_PROBLEM_DIAGNOSTIC_TAGS,
  IDL_PROBLEM_SEVERITY_LOOKUP,
  ISyntaxProblem,
  SyntaxProblems,
} from '@idl/parsing/problem-codes';
import { GetIDLProblemSeverity } from '@idl/parsing/syntax-tree';
import { IDL_LANGUAGE_NAME } from '@idl/shared';
import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver/node';

import { ResolveExtensionDocsURL } from './resolve-extension-docs-url';

/**
 * Map IDL problem codes to the right level in VSCode
 */
const PROBLEM_MAP: { [key: string]: DiagnosticSeverity } = {};
PROBLEM_MAP[IDL_PROBLEM_SEVERITY_LOOKUP.HINT] = DiagnosticSeverity.Hint;
PROBLEM_MAP[IDL_PROBLEM_SEVERITY_LOOKUP.INFORMATION] =
  DiagnosticSeverity.Information;
PROBLEM_MAP[IDL_PROBLEM_SEVERITY_LOOKUP.WARNING] = DiagnosticSeverity.Warning;
PROBLEM_MAP[IDL_PROBLEM_SEVERITY_LOOKUP.ERROR] = DiagnosticSeverity.Error;

/**
 * Converts a syntax problem to a VSCode diagnostic that gets presented to the user
 */
export function SyntaxProblemToDiagnostic(
  problem: ISyntaxProblem
): IDLDiagnostic {
  // get the severity level of our problem
  const severity = GetIDLProblemSeverity(problem.code);

  return {
    message: problem.info.endsWith('.') ? problem.info : `${problem.info}.`,
    range: {
      start: {
        line: problem.start[0],
        character: problem.start[1],
      },
      end: {
        line: problem.end[0],
        character: problem.end[1] + problem.end[2],
      },
    },
    severity:
      severity in PROBLEM_MAP
        ? PROBLEM_MAP[severity]
        : DiagnosticSeverity.Error,
    tags:
      problem.code in IDL_PROBLEM_DIAGNOSTIC_TAGS
        ? IDL_PROBLEM_DIAGNOSTIC_TAGS[problem.code]
        : [],
    code: `"${IDL_PROBLEM_CODE_ALIAS_LOOKUP[problem.code]}", ${problem.code}`,
    source: IDL_LANGUAGE_NAME,
    codeDescription: {
      href: ResolveExtensionDocsURL(
        `/problem-codes/codes/${problem.code}.html`
      ),
    },
    data: {
      code: problem.code,
    },
  };
}

/**
 * Converts our syntax problems to diagnostic information
 */
export function SyntaxProblemsToDiagnostic(
  problems: SyntaxProblems
): Diagnostic[] {
  // init output
  const diags: Diagnostic[] = [];

  // convert all of our problems
  for (let i = 0; i < problems.length; i++) {
    diags.push(SyntaxProblemToDiagnostic(problems[i]));
  }

  // return
  return diags;
}
