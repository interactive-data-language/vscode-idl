import { IDL_LSP_CONSOLE, LogManager } from '@idl/logger';
import { SEMANTIC_TOKEN_LEGEND } from '@idl/parsing/semantic-tokens';
import {
  COMPLETION_TRIGGER_CHARACTERS,
  IDL_NOTEBOOK_LANGUAGE_NAME,
} from '@idl/shared';
import { IDL_TRANSLATION, InitializeTranslation } from '@idl/translation';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeServerEventManager } from '@idl/vscode/events/server';
import { ILanguageServerConfig } from '@idl/vscode/extension-config';
import copy from 'fast-copy';
import {
  CodeActionKind,
  createConnection,
  DidChangeConfigurationNotification,
  InitializeParams,
  InitializeResult,
  ProposedFeatures,
  SymbolInformation,
  TextDocumentSyncKind,
  WorkspaceSymbolParams,
} from 'vscode-languageserver/node';

import { CAPABILITIES } from './capabilities.interface';
import { InitializeCustomEventHandler } from './events/initialize-custom-event-handler';
import { InitializeDocumentManager } from './events/initialize-document-manager';
import { InitializeNotebookManager } from './events/initialize-notebook-manager';
import { InitializeUserInteractions } from './events/initialize-user-interactions';
import { DEFAULT_SERVER_SETTINGS } from './settings.interface';

/**
 * Current settings for the language server
 *
 * Original comments:
 *   The global settings, used when the `workspace/configuration` request is not supported by the client.
 *   Please note that this is not the case when using this server with the client provided in this example
 *   but could happen with other clients.
 */
export let GLOBAL_SERVER_SETTINGS = copy(DEFAULT_SERVER_SETTINGS);

/**
 * Track settings by document when they might come from other workspaces.
 *
 * Use the function GetDocumentSettings to access/populate this. Only need to take
 * advantage of this once we have linting/formatting which will need to ahndle settings by document
 */
export const DOCUMENT_SETTINGS: Map<
  string,
  Thenable<ILanguageServerConfig>
> = new Map();

/**
 * A reference to the connection that we have established with the client
 * from the server
 */
export const SERVER_CONNECTION = createConnection(ProposedFeatures.all);

/**
 * Event manager for the language server to send/receive custom notifications
 * from the language client.
 */
export let SERVER_EVENT_MANAGER: VSCodeServerEventManager;

/**
 * Logger for our language server
 *
 * IMPORTANT: ALL LOGS ARE INTERCEPTED IN FILE WHERE DEFINED
 */
export const IDL_LANGUAGE_SERVER_LOGGER = new LogManager({
  alert: () => {
    // ignore special errors, we pass to the client
  },
});

/**
 * Old console.log routine
 */
const OLD_LOG = console.log;
const OLD_WARN = console.warn;
const OLD_ERROR = console.error;

// replace logs
console.log = (...args: any[]) => {
  IDL_LANGUAGE_SERVER_LOGGER.log({
    log: IDL_LSP_CONSOLE,
    content: args,
  });
};
console.warn = (...args: any[]) => {
  IDL_LANGUAGE_SERVER_LOGGER.log({
    log: IDL_LSP_CONSOLE,
    content: args,
    type: 'warn',
  });
};
console.error = (...args: any[]) => {
  IDL_LANGUAGE_SERVER_LOGGER.log({
    log: IDL_LSP_CONSOLE,
    content: args,
    type: 'error',
    alert: IDL_TRANSLATION.lsp.errors.unhandled,
  });
};

/**
 * Initialized functionality for our language server
 */
export function InitializeServer() {
  // load our translations in our server
  InitializeTranslation();

  // create our server event manager
  SERVER_EVENT_MANAGER = new VSCodeServerEventManager(SERVER_CONNECTION);

  // intercept log messages and send to client
  IDL_LANGUAGE_SERVER_LOGGER.interceptor = (options) => {
    SERVER_EVENT_MANAGER.sendNotification(
      LANGUAGE_SERVER_MESSAGE_LOOKUP.LOG,
      options
    );
  };

  // // create our IDL provider object, which is the object-entry for everything so
  // // we can test functionality with object methods rather than APIs
  // const idl = new IDL(connection);

  // handle when a user searches for a symbol
  SERVER_CONNECTION.onWorkspaceSymbol(
    (params: WorkspaceSymbolParams): SymbolInformation[] => []
    // idl.findSymbolsByName(params.query)
  );

  /**
   * Listen for the request to initialize
   */
  SERVER_CONNECTION.onInitialize((params: InitializeParams) => {
    // get capabilities from our session
    const capabilities = params.capabilities;

    // Does the client support the `workspace/configuration` request?
    // If not, we will fall back using global settings
    CAPABILITIES.configuration = !!(
      capabilities.workspace && !!capabilities.workspace.configuration
    );
    CAPABILITIES.workspaceFolder = !!(
      capabilities.workspace && !!capabilities.workspace.workspaceFolders
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    CAPABILITIES.diagnosticInfo = !!(
      capabilities.textDocument &&
      capabilities.textDocument.publishDiagnostics &&
      capabilities.textDocument.publishDiagnostics.relatedInformation
    );

    /**
     * Respond with the capabilities of our server
     */
    const result: InitializeResult = {
      capabilities: {
        textDocumentSync: TextDocumentSyncKind.Incremental,
        completionProvider: {
          resolveProvider: true,
          /**
           * TODO: Figure out how to improve this
           *
           * It doesnt look like it always works, but we need it?
           */
          triggerCharacters: COMPLETION_TRIGGER_CHARACTERS,
        },
        definitionProvider: true,
        workspaceSymbolProvider: true,
        documentSymbolProvider: true,
        /**
         * This is a ruse :)
         *
         * The actual implementation of hover help comes from: libs/vscode/client/src/lib/register-hover-provider.ts
         * which makes "trusted" markdown so we can embed commands and anything else in what gets returned
         * for a better user experience
         */
        hoverProvider: false,
        documentFormattingProvider: true,
        semanticTokensProvider: {
          legend: SEMANTIC_TOKEN_LEGEND,
          full: true,
          documentSelector: null,
        },
        codeActionProvider: {
          codeActionKinds: [CodeActionKind.QuickFix],
          resolveProvider: false,
        },
        notebookDocumentSync: {
          notebookSelector: [
            {
              notebook: {
                scheme: 'file',
                notebookType: IDL_NOTEBOOK_LANGUAGE_NAME,
              },
            },
          ],
        },
      },
    };

    // check if we support workspace folders
    if (CAPABILITIES.workspaceFolder) {
      result.capabilities.workspace = {
        workspaceFolders: {
          supported: true,
        },
      };
    }

    return result;
  });

  /**
   * Listen for our connection to be initialized
   */
  SERVER_CONNECTION.onInitialized(() => {
    if (CAPABILITIES.configuration) {
      // Register for all configuration changes.
      SERVER_CONNECTION.client.register(
        DidChangeConfigurationNotification.type,
        undefined
      );
    }
  });

  /**
   * Listen for changes to our configuration
   */
  SERVER_CONNECTION.onDidChangeConfiguration((change) => {
    if (CAPABILITIES.configuration) {
      // Reset all cached document settings
      DOCUMENT_SETTINGS.clear();
    } else {
      GLOBAL_SERVER_SETTINGS = (change.settings.languageServerExample || {
        ...DEFAULT_SERVER_SETTINGS,
      }) as ILanguageServerConfig;
    }
  });

  // add document manager
  InitializeDocumentManager();

  // listen for user-driven events
  InitializeUserInteractions();

  // turn on our event listeners for custom messages
  InitializeCustomEventHandler();

  // listen for notebook events
  InitializeNotebookManager();

  // Listen on the connection
  SERVER_CONNECTION.listen();
}
