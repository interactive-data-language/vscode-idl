import { IDLProblemCode } from '@idl/types/problem-codes';
import { Diagnostic, TextEdit } from 'vscode-languageserver';

/**
 * Type of IDL diagnostic
 */
export type IDLDiagnosticType = 'idl';

/**
 * Customized data structure for Diagnostics to make sure we can take appropriate
 * actions against any issues that are discovered
 */
export interface IDLDiagnostic extends Diagnostic {
  /** Custom data for our diagnostics */
  data: {
    /** Type of diagnostic */
    type: IDLDiagnosticType;
    /** The problem code */
    code: IDLProblemCode;
    /** Alias for the problem code */
    alias: string;
    /** Text edits for the library */
    edits?: TextEdit[];
  };
}
