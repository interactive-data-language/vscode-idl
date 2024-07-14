import { IDL_COMMANDS } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { IAutoFixIDLDiagnostic, IDLDiagnostic } from '@idl/types/diagnostic';
import { CodeAction, CodeActionKind } from 'vscode-languageserver';

/**
 * Adds problem disabling actions to code actions
 */
export function AddDisableProblemWithSettingsAction(
  diag: IDLDiagnostic,
  actions: CodeAction[]
) {
  /**
   * Disable problem at user level
   */
  const user: IAutoFixIDLDiagnostic = {
    code: diag.data.code,
    scope: 'user',
  };
  actions.push({
    title: IDL_TRANSLATION.lsp.codeActions.disableUser.replace(
      'PROBLEM',
      diag.data.alias
    ),
    command: {
      command: IDL_COMMANDS.CODE.DISABLE_PROBLEM_SETTING,
      arguments: [user],
      title: IDL_COMMANDS.CODE.DISABLE_PROBLEM_SETTING,
    },
    kind: CodeActionKind.Empty,
  });

  /**
   * Disable problem reporting in workspace level
   */
  const workspace: IAutoFixIDLDiagnostic = {
    code: diag.data.code,
    scope: 'workspace',
  };
  actions.push({
    title: IDL_TRANSLATION.lsp.codeActions.disableWorkspace.replace(
      'PROBLEM',
      diag.data.alias
    ),
    command: {
      command: IDL_COMMANDS.CODE.DISABLE_PROBLEM_SETTING,
      arguments: [workspace],
      title: IDL_COMMANDS.CODE.DISABLE_PROBLEM_SETTING,
    },
    kind: CodeActionKind.Empty,
  });
}
