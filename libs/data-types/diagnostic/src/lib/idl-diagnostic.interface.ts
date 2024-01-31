import { IDLProblemCode } from '@idl/parsing/problem-codes';
import { Diagnostic } from 'vscode-languageserver';

/**
 * Customized data structure for Diagnostics to make sure we can take appropriate
 * actions against any issues that are discovered
 */
export interface IDLDiagnostic extends Diagnostic {
  /** Custom data for our diagnostics */
  data: {
    /** The problem code */
    code: IDLProblemCode;
  };
}
