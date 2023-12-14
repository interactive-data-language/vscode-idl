import {
  ALL_DOCUMENT_SELECTORS,
  CleanPath,
  GetExtensionPath,
  IDL_LANGUAGE_NAME,
  NODE_MEMORY_CONFIG,
  NOTIFY_FILES_GLOB_PATTERN,
} from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { IDL_EXTENSION_CONFIG } from '@idl/vscode/config';
import { VSCodeClientEventManager } from '@idl/vscode/events/client';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeTelemetryLogger } from '@idl/vscode/shared';
import { execSync } from 'child_process';
import { compare } from 'compare-versions';
import { lstatSync } from 'fs';
import * as path from 'path';
import { ExtensionContext, workspace } from 'vscode';
import {
  CloseAction,
  CloseHandlerResult,
  ErrorAction,
  ErrorHandlerResult,
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';

import { ON_INDEX } from './events/indexing/on-index';
import { IDL_CLIENT_OUTPUT_CHANNEL, IDL_LOGGER } from './initialize-client';
import { START_LANGUAGE_SERVER_CONFIG } from './start-language-server.interface';

/**
 * Reference to the language client that interfaces with our language server
 */
export let LANGUAGE_SERVER_CLIENT: LanguageClient;

/** Flag that indicates if we failed to start the language server */
export let LANGUAGE_SERVER_FAILED_START = false;

/** Message handler between the VSCode client and the language server */
export let LANGUAGE_SERVER_MESSENGER: VSCodeClientEventManager;

/**
 * Creates our language client and starts our language server
 */
export async function StartLanguageServer(ctx: ExtensionContext) {
  // Start the client. This will also launch the server
  IDL_LOGGER.log({ content: 'Trying to detect node.js' });

  /**
   * Check for nodejs to determine how we launch the language server
   */
  let HAS_NODE = false;

  // placeholder for output from node
  let nodeOutput = '';

  /**
   * Attempt to spawn node
   */
  try {
    nodeOutput = execSync(`node --version`, {
      timeout: START_LANGUAGE_SERVER_CONFIG.NODE_TIMEOUT,
    })
      .toString('utf8')
      .trim()
      .replace('v', ''); // strip the "v" that our version starts with

    if (nodeOutput) {
      HAS_NODE = compare(
        nodeOutput,
        START_LANGUAGE_SERVER_CONFIG.NODE_MIN_VERSION,
        '>='
      );
    }
  } catch (err) {
    nodeOutput = (err as Error)?.message;
  }

  /**
   * Full path to the JS file for launching in VSCode
   */
  const serverModule = ctx.asAbsolutePath(
    path.join('dist', 'apps', 'server', 'main.js')
  );

  /**
   * Server launch options as thread from VSCode
   *
   * This has RAM limitations even though we have the execArgv (they do nothing)
   */
  const serverOptionsInVSCode: ServerOptions = {
    run: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: {
        execArgv: [
          '--expose-gc',
          `--max-old-space-size=${NODE_MEMORY_CONFIG.OLD}`, // keep it, even though it doesnt do anything
          `--max-semi-space-size=${NODE_MEMORY_CONFIG.YOUNG}`,
        ],
      },
    },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      // The debug options for the server
      // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
      options: {
        execArgv: [
          '--nolazy',
          '--inspect=6009',
          '--expose-gc',
          `--max-old-space-size=${NODE_MEMORY_CONFIG.OLD}`, // keep it, even though it doesnt do anything
          `--max-semi-space-size=${NODE_MEMORY_CONFIG.YOUNG}`,
        ],
      },
    },
  };

  /**
   * Options for launching the server manually using node.js without RAM limitation
   *
   * If the extension is launched in debug mode then the debug server options are used.
   * Otherwise the run options are used.
   */
  const serverOptionsNode: ServerOptions = {
    command: `node`,
    transport: TransportKind.stdio,
    args: [
      '--expose-gc',
      `--max-old-space-size=${NODE_MEMORY_CONFIG.OLD}`,
      `--max-semi-space-size=${NODE_MEMORY_CONFIG.YOUNG}`,
      /**
       * Needs to be last, cant remember why but this was something (a long time ago) i saw on
       * blog/stack exchange
       */
      path.join('dist', 'apps', 'server', 'main.js'),
    ],
    options: {
      cwd: ctx.extensionPath,
    },
  };

  /**
   * Options for our language client
   */
  const clientOptions: LanguageClientOptions = {
    // Register the server for plain text documents
    documentSelector: ALL_DOCUMENT_SELECTORS,
    synchronize: {
      // Notify the server about file changes to IDL-related files contained in the workspace
      fileEvents: [
        workspace.createFileSystemWatcher(NOTIFY_FILES_GLOB_PATTERN),
      ],
    },
    outputChannel: IDL_CLIENT_OUTPUT_CHANNEL,
    initializationFailedHandler: (err) => {
      IDL_LOGGER.log({
        type: 'error',
        content: [`Error initializing IDL Language Server`, err],
        alert: IDL_TRANSLATION.lsp.errors.start,
      });
      LANGUAGE_SERVER_FAILED_START = true;
      return false;
    },
    errorHandler: {
      error: async (error, message, count) => {
        IDL_LOGGER.log({
          type: 'error',
          content: [
            `Error communicating with the IDL Language Server`,
            error,
            message,
            count,
          ],
          alert: IDL_TRANSLATION.lsp.errors.connection,
        });
        const res: ErrorHandlerResult = {
          action: ErrorAction.Continue,
        };
        return res;
      },
      closed: () => {
        IDL_LOGGER.log({
          type: 'error',
          content: [
            `The connection to the IDL Language Server unexpectedly closed`,
          ],
          alert: IDL_TRANSLATION.lsp.errors.closed,
          alertMeta: {
            openMarkdownDocs: GetExtensionPath(
              'extension/docs/general/LANGUAGE_SERVER_CRASHES.md'
            ),
          },
        });
        const res: CloseHandlerResult = {
          action: CloseAction.DoNotRestart,
        };
        return res;
      },
    },
  };

  IDL_LOGGER.log({
    type: 'info',
    content: [
      `Starting the language server using "${
        HAS_NODE ? 'node' : 'VSCode'
      }". Output from "node --version" (minimum is "${
        START_LANGUAGE_SERVER_CONFIG.NODE_MIN_VERSION
      }"):`,
      nodeOutput,
    ],
  });

  // Create the language client and start the client.
  LANGUAGE_SERVER_CLIENT = new LanguageClient(
    'IDLLanguageServer',
    IDL_LANGUAGE_NAME,
    HAS_NODE ? serverOptionsNode : serverOptionsInVSCode,
    clientOptions
  );

  // create our message handler
  LANGUAGE_SERVER_MESSENGER = new VSCodeClientEventManager(
    LANGUAGE_SERVER_CLIENT
  );

  // listen for log messages from the server
  LANGUAGE_SERVER_MESSENGER.onNotification(
    LANGUAGE_SERVER_MESSAGE_LOOKUP.LOG,
    (payload) => {
      IDL_LOGGER.log(payload);
    }
  );

  // listen for usage metrics
  LANGUAGE_SERVER_MESSENGER.onNotification(
    LANGUAGE_SERVER_MESSAGE_LOOKUP.USAGE_METRIC,
    (payload) => {
      VSCodeTelemetryLogger(payload.event, payload.payload);
    }
  );

  // Start the client. This will also launch the server
  IDL_LOGGER.log({ content: 'Starting language server' });

  // try to launch
  await LANGUAGE_SERVER_CLIENT.start();

  workspace.onWillDeleteFiles((event) => {
    // check files for folders
    const folders: string[] = [];
    for (let i = 0; i < event.files.length; i++) {
      const fsPath = CleanPath(event.files[i].fsPath);
      if (lstatSync(fsPath).isDirectory()) {
        folders.push(fsPath);
      }
    }

    // only send event if we have folders
    if (folders.length > 0) {
      LANGUAGE_SERVER_MESSENGER.sendNotification(
        LANGUAGE_SERVER_MESSAGE_LOOKUP.FOLDER_DELETE,
        {
          folders,
        }
      );
    }
  });

  // Listen for file renaming events and pass them on
  workspace.onDidRenameFiles((event) => {
    LANGUAGE_SERVER_MESSENGER.sendNotification(
      LANGUAGE_SERVER_MESSAGE_LOOKUP.FILE_RENAME,
      {
        files: event.files.map((item) => {
          return {
            oldUri: CleanPath(item.oldUri.fsPath),
            newUri: CleanPath(item.newUri.fsPath),
          };
        }),
      }
    );
  });

  // send our config now that we have started
  LANGUAGE_SERVER_MESSENGER.sendNotification(
    LANGUAGE_SERVER_MESSAGE_LOOKUP.WORKSPACE_CONFIG,
    {
      config: IDL_EXTENSION_CONFIG,
    }
  );

  // listen to indexing message
  LANGUAGE_SERVER_MESSENGER.onNotification(
    LANGUAGE_SERVER_MESSAGE_LOOKUP.INDEXING,
    ON_INDEX
  );
}
