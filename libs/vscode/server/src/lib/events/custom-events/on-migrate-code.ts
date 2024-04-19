import { IDL_LSP_LOG } from '@idl/logger';
import { IDLFileHelper } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  MigrateCodeLSPPayload,
  MigrateCodeLSPResponse,
} from '@idl/vscode/events/messages';
import { LSP_WORKER_THREAD_MESSAGE_LOOKUP } from '@idl/workers/parsing';

import { GetFormattingConfigForFile } from '../../helpers/get-formatting-config-for-file';
import { ResolveFSPathAndCodeForURI } from '../../helpers/resolve-fspath-and-code-for-uri';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { IDL_INDEX } from '../initialize-document-manager';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Callback to migrate code to newer versions
 *
 * @param event The event from VSCode
 */
export const ON_MIGRATE_CODE = async (
  event: MigrateCodeLSPPayload
): Promise<MigrateCodeLSPResponse> => {
  await SERVER_INITIALIZED;
  try {
    // log information
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'info',
      content: ['Migrate code', event],
    });

    /**
     * Resolve the fspath to our cell and retrieve code
     */
    const info = await ResolveFSPathAndCodeForURI(event.uri);

    // return if nothing found
    if (info === undefined) {
      return undefined;
    }

    /** Formatting config for info.fsPath */
    const config = GetFormattingConfigForFile(info.fsPath);

    // do nothing
    if (!IDLFileHelper.isPROCode(info.fsPath)) {
      return undefined;
    }

    /**
     * Formatted code
     */
    const migrated = await IDL_INDEX.indexerPool.workerio.postAndReceiveMessage(
      IDL_INDEX.getWorkerID(info.fsPath),
      LSP_WORKER_THREAD_MESSAGE_LOOKUP.MIGRATE_CODE,
      {
        file: info.fsPath,
        code: info.code,
        formatting: config,
        migrationType: event.migrationType,
      }
    ).response;

    // check if we couldnt format
    if (migrated === undefined) {
      IDL_LANGUAGE_SERVER_LOGGER.log({
        log: IDL_LSP_LOG,
        type: 'warn',
        content: [
          IDL_TRANSLATION.lsp.events.onMigrateCodeProblemCode,
          info.fsPath,
        ],
        alert: IDL_TRANSLATION.lsp.events.onMigrateCodeProblemCode,
        alertMeta: {
          file: info.fsPath,
        },
      });
      return { text: undefined };
    }

    return { text: migrated };
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error responding to code migration', err],
      alert: IDL_TRANSLATION.lsp.events.onMigrateCode,
    });
  }

  return { text: undefined };
};
