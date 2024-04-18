import { CreateCodeActions } from '@idl/assembling/code-actions';
import { IDL_LSP_LOG } from '@idl/logger';
import { IDLFileHelper } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDLDiagnostic } from '@idl/types/diagnostic';
import { CodeAction, CodeActionParams } from 'vscode-languageserver/node';

import { GetFormattingConfigForFile } from '../../helpers/get-formatting-config-for-file';
import { IsIDLDiagnostic } from '../../helpers/is-idl-diagnostinc';
import { ResolveFSPathAndCodeForURI } from '../../helpers/resolve-fspath-and-code-for-uri';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Event handler for retrieving code actions
 */
export const ON_CODE_ACTIONS = async (
  params: CodeActionParams
): Promise<CodeAction[]> => {
  await SERVER_INITIALIZED;
  try {
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

    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['CodeAction request', params],
    });

    /**
     * Resolve the fspath to our cell and retrieve code
     */
    const info = await ResolveFSPathAndCodeForURI(params.textDocument.uri);

    // return if nothing found
    if (info === undefined) {
      return undefined;
    }

    // return if not a file we can process
    if (!(IDLFileHelper.isPROCode(info.fsPath) || info.isNotebook)) {
      return undefined;
    }

    /**
     * Get formatting config
     */
    const config = GetFormattingConfigForFile(info.fsPath);

    /** Get code as string array */
    const code = info.code.split(/\r?\n/gim);

    /** get code actions */
    const actions = await CreateCodeActions(
      code,
      diags,
      config,
      info.isNotebook ? +info.fsPath.split('#')[1] : undefined
    );

    /**
     * For test creation, use the output here as expected values
     */
    // console.log(JSON.stringify(actions, undefined, 2));

    // create code actions and return
    return actions;
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
