import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';

import { SERVER_EVENT_MANAGER } from '../initialize-server';
import { ON_ADD_DOCS } from './custom-events/on-add-docs';
import { ON_DID_RENAME } from './custom-events/on-did-rename';
import { ON_FOLDER_DELETE } from './custom-events/on-folder-delete';
import { ON_FORMAT_WORKSPACE } from './custom-events/on-format-workspace';
import { ON_GENERATE_TASK } from './custom-events/on-generate-task';
import { ON_INIT_WORKSPACE_CONFIG } from './custom-events/on-init-workspace-config';
import { ON_MIGRATE_CODE } from './custom-events/on-migrate-code';
import { ON_NOTEBOOK_TO_PRO_CODE } from './custom-events/on-notebook-to-pro-code';
import { ON_PREPARE_NOTEBOOK_CELL } from './custom-events/on-prepare-notebook-cell';
import { ON_RETRIEVE_DOCS } from './custom-events/on-retrieve-docs';
import { ON_WORKSPACE_CONFIG } from './custom-events/on-workspace-config';
import { ON_DOCUMENT_FORMATTING } from './documents/on-document-formatting';

/**
 * Sets up and creates handlers for listening to custom messages from the
 * client
 */
export function InitializeCustomEventHandler() {
  // listen for our server configuration
  SERVER_EVENT_MANAGER.onNotification(
    LANGUAGE_SERVER_MESSAGE_LOOKUP.WORKSPACE_CONFIG,
    ON_WORKSPACE_CONFIG
  );

  // listen for our initializing server configuration
  SERVER_EVENT_MANAGER.onNotification(
    LANGUAGE_SERVER_MESSAGE_LOOKUP.INIT_WORKSPACE_CONFIG,
    ON_INIT_WORKSPACE_CONFIG
  );

  // listen for adding docs to files
  SERVER_EVENT_MANAGER.onNotification(
    LANGUAGE_SERVER_MESSAGE_LOOKUP.ADD_DOCS,
    ON_ADD_DOCS
  );

  // listen for file formatting
  SERVER_EVENT_MANAGER.onNotification(
    LANGUAGE_SERVER_MESSAGE_LOOKUP.FORMAT_FILE,
    ON_DOCUMENT_FORMATTING
  );

  // listen for workspace formatting
  SERVER_EVENT_MANAGER.onRequest(
    LANGUAGE_SERVER_MESSAGE_LOOKUP.FORMAT_WORKSPACE,
    ON_FORMAT_WORKSPACE
  );

  // listen for file rename
  SERVER_EVENT_MANAGER.onNotification(
    LANGUAGE_SERVER_MESSAGE_LOOKUP.FILE_RENAME,
    ON_DID_RENAME
  );

  // listen for deleting folders
  SERVER_EVENT_MANAGER.onNotification(
    LANGUAGE_SERVER_MESSAGE_LOOKUP.FOLDER_DELETE,
    ON_FOLDER_DELETE
  );

  // listen for deleting folders
  SERVER_EVENT_MANAGER.onNotification(
    LANGUAGE_SERVER_MESSAGE_LOOKUP.GENERATE_TASK,
    ON_GENERATE_TASK
  );

  // listen for migrating code
  SERVER_EVENT_MANAGER.onRequest(
    LANGUAGE_SERVER_MESSAGE_LOOKUP.MIGRATE_CODE,
    ON_MIGRATE_CODE
  );

  // listen for deleting folders
  SERVER_EVENT_MANAGER.onRequest(
    LANGUAGE_SERVER_MESSAGE_LOOKUP.RETRIEVE_DOCS,
    ON_RETRIEVE_DOCS
  );

  // listen for converting notebooks to PRO code
  SERVER_EVENT_MANAGER.onRequest(
    LANGUAGE_SERVER_MESSAGE_LOOKUP.NOTEBOOK_TO_PRO_CODE,
    ON_NOTEBOOK_TO_PRO_CODE
  );

  // listen for converting notebooks to PRO code
  SERVER_EVENT_MANAGER.onRequest(
    LANGUAGE_SERVER_MESSAGE_LOOKUP.PREPARE_NOTEBOOK_CELL,
    ON_PREPARE_NOTEBOOK_CELL
  );
}
