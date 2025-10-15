import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { IDLDiagnostic } from '@idl/types/diagnostic';
import { CodeAction } from 'vscode-languageserver';

import { AddDisableProblemWithCommentsAction } from './add-disable-problem-with-comments-actions';
import { AddDisableProblemWithSettingsAction } from './add-disable-problem-with-settings-actions';
import { AddDocsActions } from './add-docs-actions';
import { AddQuickFixActions } from './add-quick-fix-action';

/**
 * Creates code actions based on diagnostics for a file at a given location
 */
export async function CreateCodeActions(
  code: string[],
  diags: IDLDiagnostic[],
  formatting: IAssemblerOptions<FormatterType>,
  uri: string,
  notebookCell?: number
): Promise<CodeAction[]> {
  /**
   * Make our code actions
   */
  const actions: CodeAction[] = [];

  // process all diagnostics
  for (let i = 0; i < diags.length; i++) {
    // add quick fix actions and, if we have one, skip everything else
    AddQuickFixActions(diags[i], actions, uri);

    // add code actions to disable with commends
    AddDisableProblemWithCommentsAction(
      diags[i],
      code,
      formatting,
      actions,
      notebookCell
    );

    // add actions to disable problems with settings
    AddDisableProblemWithSettingsAction(diags[i], actions);

    // add code actions to open the docs for the problem
    AddDocsActions(diags[i], actions);
  }

  return actions;
}
