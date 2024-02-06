import { IDLProblemCode } from '@idl/parsing/problem-codes';

/**
 * Data structure to auto-fix a diagnostic
 */
export interface IAutoFixIDLDiagnostic {
  /** The problem code we are auto-fixing */
  code: IDLProblemCode;

  /** The line number that we want to turn it off for */
  line?: number;

  /** The scope for where the problem is disabled */
  scope?: 'user' | 'workspace';
}
