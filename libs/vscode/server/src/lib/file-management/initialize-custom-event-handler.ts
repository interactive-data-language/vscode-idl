import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';

import { SERVER_EVENT_MANAGER } from '../initialize-server';
import { ON_ADD_DOCS } from './custom-events/on-add-docs';
import { ON_DID_RENAME } from './custom-events/on-did-rename';
import { ON_FOLDER_DELETE } from './custom-events/on-folder-delete';
import { ON_GENERATE_TASK } from './custom-events/on-generate-task';
import { ON_INIT_WORKSPACE_CONFIG } from './custom-events/on-init-workspace-config';
import { ON_WORKSPACE_CONFIG } from './custom-events/on-workspace-config';
import { ON_DOCUMENT_FORMATTING } from './events/on-document-formatting';

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
}
