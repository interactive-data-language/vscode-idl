import { IDL_LSP_LOG } from '@idl/logger';
import { IDL_COMMANDS } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { IAutoFixIDLDiagnostic, IDLDiagnostic } from '@idl/types/diagnostic';
import {
  CodeAction,
  CodeActionKind,
  CodeActionParams,
} from 'vscode-languageserver/node';

import { IsIDLDiagnostic } from '../../helpers/is-idl-diagnostinc';
import { ResolveFSPathAndCodeForURI } from '../../helpers/resolve-fspath-and-code-for-uri';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { IDL_INDEX } from '../initialize-document-manager';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Event handler for retrieving code actions
 */
export const ON_CODE_ACTIONS = async (
  params: CodeActionParams
): Promise<CodeAction[]> => {
  await SERVER_INITIALIZED;
  try {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['CodeAction request', params],
    });

    /**
     * Get IDL diagnostics
     */
    const diags = params.context.diagnostics.filter((diag) =>
      IsIDLDiagnostic(diag)
    ) as IDLDiagnostic[];

    // make sure we only keep diagnostics for each individual problem
    if (diags.length === 0) {
      return undefined;
    }

    /**
     * Resolve the fspath to our cell and retrieve code
     */
    const info = await ResolveFSPathAndCodeForURI(params.textDocument.uri);

    // return if nothing found
    if (info === undefined) {
      return undefined;
    }

    // return if not a file we can process
    if (
      !(
        IDL_INDEX.isPROCode(info.fsPath) ||
        IDL_INDEX.isIDLNotebookFile(info.fsPath)
      )
    ) {
      return undefined;
    }

    /**
     * Make our code actions
     */
    const commands: CodeAction[] = [];

    // process all diagnostics
    for (let i = 0; i < diags.length; i++) {
      /** Command to disable at the user level */
      const user: IAutoFixIDLDiagnostic = {
        code: diags[i].data.code,
        scope: 'user',
      };
      commands.push({
        title: IDL_TRANSLATION.lsp.codeActions.disableUser.replace(
          'PROBLEM',
          diags[i].data.alias
        ),
        command: {
          command: IDL_COMMANDS.CODE.DISABLE_PROBLEM_SETTING,
          arguments: [user],
          title: IDL_COMMANDS.CODE.DISABLE_PROBLEM_SETTING,
        },
        kind: CodeActionKind.QuickFix,
      });

      /** Command to disable at the workspace level */
      const workspace: IAutoFixIDLDiagnostic = {
        code: diags[i].data.code,
        scope: 'workspace',
      };
      commands.push({
        title: IDL_TRANSLATION.lsp.codeActions.disableWorkspace.replace(
          'PROBLEM',
          diags[i].data.alias
        ),
        command: {
          command: IDL_COMMANDS.CODE.DISABLE_PROBLEM_SETTING,
          arguments: [workspace],
          title: IDL_COMMANDS.CODE.DISABLE_PROBLEM_SETTING,
        },
        kind: CodeActionKind.QuickFix,
      });
    }

    // create commands
    return commands;
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error responding to code action request', err],
      alert: IDL_TRANSLATION.lsp.events.onSemanticHighlighting,
    });
    return undefined;
  }
};
