import { IDL_LSP_LOG } from '@idl/logger';
import { ResolveHoverHelpLinks } from '@idl/parsing/index';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  LanguageServerPayload,
  LanguageServerResponse,
  RetrieveDocsMessage,
} from '@idl/vscode/events/messages';

import { IDL_CLIENT_CONFIG } from '../../helpers/track-workspace-config';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { IDL_INDEX } from '../initialize-document-manager';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Handle docs retrieval
 *
 * @param event The event sent from VSCode
 */
export const ON_RETRIEVE_DOCS = async (
  payload: LanguageServerPayload<RetrieveDocsMessage>
): Promise<LanguageServerResponse<RetrieveDocsMessage>> => {
  await SERVER_INITIALIZED;
  try {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'debug',
      content: ['Retrieve docs', payload],
    });

    // find matching global tokens
    const global = IDL_INDEX.globalIndex.findMatchingGlobalToken(
      payload.type,
      payload.name
    );

    // return docs
    return {
      docs:
        global.length > 0
          ? ResolveHoverHelpLinks(global[0].meta.docs, IDL_CLIENT_CONFIG, true)
          : '',
    };
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: [
        'Error while updating workspace config and sending problems',
        err,
      ],
      alert: IDL_TRANSLATION.lsp.events.onWorkspaceConfig,
    });
  }
};
