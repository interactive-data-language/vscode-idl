import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { IDL_COMMANDS } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDLDiagnostic } from '@idl/types/diagnostic';
import { CodeAction, CodeActionKind } from 'vscode-languageserver';

import { DisableProblemForFile } from './helpers/disable-problem-file';
import { DisableProblemForLine } from './helpers/disable-problem-for-line';

/**
 * Adds problem disabling actions to code actions
 */
export function AddDisableProblemWithCommentsAction(
  diag: IDLDiagnostic,
  code: string[],
  formatting: IAssemblerOptions<FormatterType>,
  actions: CodeAction[],
  notebookCell?: number
) {
  /**
   * Disable problem for line
   */
  actions.push({
    title: IDL_TRANSLATION.lsp.codeActions.disableLine.replace(
      'PROBLEM',
      diag.data.alias
    ),
    command: {
      command: IDL_COMMANDS.CODE.FIX_PROBLEM,
      arguments: [
        DisableProblemForLine(
          diag.range.start.line,
          diag.data.alias,
          code,
          formatting.eol === 'lf' ? '\n' : '\r\n',
          notebookCell
        ),
      ],
      title: IDL_COMMANDS.CODE.FIX_PROBLEM,
    },
    kind: CodeActionKind.RefactorInline,
  });

  /**
   * Disable problem for file
   */
  actions.push({
    title: IDL_TRANSLATION.lsp.codeActions.disableFile.replace(
      'PROBLEM',
      diag.data.alias
    ),
    command: {
      command: IDL_COMMANDS.CODE.FIX_PROBLEM,
      arguments: [
        DisableProblemForFile(
          diag.range.start.line,
          diag.data.alias,
          code,
          formatting.eol === 'lf' ? '\n' : '\r\n',
          notebookCell
        ),
      ],
      title: IDL_COMMANDS.CODE.FIX_PROBLEM,
    },
    kind: CodeActionKind.RefactorInline,
  });
}
