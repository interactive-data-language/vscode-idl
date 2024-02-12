import { Diagnostic } from 'vscode-languageserver';

/**
 * Makes sure that a diagnostic comes from IDL and the language server
 */
export function IsIDLDiagnostic(diag: Diagnostic) {
  return diag?.data?.type === 'idl';
}
