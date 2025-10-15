import { IDL_TRANSLATION } from '@idl/translation';
import { IDLDiagnostic } from '@idl/types/diagnostic';
import {
  CodeAction,
  CodeActionKind,
  WorkspaceEdit,
} from 'vscode-languageserver';

/**
 * Adds actions for quick fix when we have problems
 * that can be solved with a simple edit to existing text
 */
export function AddQuickFixActions(
  diag: IDLDiagnostic,
  actions: CodeAction[],
  uri: string
) {
  // skip if we dont ahve any edits
  if (!diag.data.edits) {
    return;
  }

  /** Create workspace edit to fx the problem */
  const edit: WorkspaceEdit = {
    changes: {},
  };
  edit.changes[uri] = diag.data.edits;

  /**
   * View problem code docs
   */
  actions.push({
    title: IDL_TRANSLATION.lsp.codeActions.quickFixProblem.replace(
      'PROBLEM',
      diag.data.alias
    ),
    kind: CodeActionKind.QuickFix,
    edit,
  });
}
