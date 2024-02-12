import { IDLProblemCode } from '@idl/types/problem-codes';

/**
 * Data structure to auto-fix a diagnostic
 */
export interface IAutoFixIDLDiagnostic {
  /** The problem code we are auto-fixing */
  code: IDLProblemCode;

  /** The scope for where the problem is disabled */
  scope?: 'user' | 'workspace';
}
