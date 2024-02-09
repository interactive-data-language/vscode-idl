import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { IDLDiagnostic } from '@idl/types/diagnostic';
import { CodeAction } from 'vscode-languageserver';

import { AddDisableProblemWithCommentsAction } from './add-disable-problem-with-comments-actions';
import { AddDisableProblemWithSettingsAction } from './add-disable-problem-with-settings-actions';
import { AddDocsActions } from './add-docs-actions';

/**
 * Creates code actions based on diagnostics for a file at a given location
 */
export async function CreateCodeActions(
  code: string[],
  diags: IDLDiagnostic[],
  formatting: IAssemblerOptions<FormatterType>,
  notebookCell?: number
): Promise<CodeAction[]> {
  /**
   * Make our code actions
   */
  const actions: CodeAction[] = [];

  // process all diagnostics
  for (let i = 0; i < diags.length; i++) {
    AddDisableProblemWithCommentsAction(
      diags[i],
      code,
      formatting,
      actions,
      notebookCell
    );

    // add actions to disable problems
    AddDisableProblemWithSettingsAction(diags[i], actions);

    // add code actions
    AddDocsActions(diags[i], actions);
  }

  return actions;
}
