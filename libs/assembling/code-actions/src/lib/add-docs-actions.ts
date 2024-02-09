import { IDL_COMMANDS } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDLDiagnostic } from '@idl/types/diagnostic';
import { CodeAction, CodeActionKind } from 'vscode-languageserver';

/**
 * Adds documentations actions to code actions
 */
export function AddDocsActions(diag: IDLDiagnostic, actions: CodeAction[]) {
  /**
   * View problem code docs
   */
  actions.push({
    title: IDL_TRANSLATION.lsp.codeActions.viewProblemCodeDocs.replace(
      'PROBLEM',
      diag.data.alias
    ),
    command: {
      command: IDL_COMMANDS.DOCS.OPEN,
      arguments: [`/problem-codes/codes/${diag.data.code}.html`],
      title: IDL_COMMANDS.DOCS.OPEN,
    },
    kind: CodeActionKind.Empty,
  });

  /**
   * View problem configuration docs
   */
  actions.push({
    title: IDL_TRANSLATION.lsp.codeActions.viewProblemConfigDocs,
    command: {
      command: IDL_COMMANDS.DOCS.OPEN,
      arguments: ['/problem-codes/configuration.html'],
      title: IDL_COMMANDS.DOCS.OPEN,
    },
    kind: CodeActionKind.Empty,
  });
}
