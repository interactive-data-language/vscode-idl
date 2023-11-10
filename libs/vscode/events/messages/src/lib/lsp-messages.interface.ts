import { ILogOptions } from '@idl/logger';
import { IUsageMetricAndPayload, UsageMetric } from '@idl/usage-metrics';
import { DocumentFormattingParams } from 'vscode-languageserver/node';

import {
  FolderDeleteMessage,
  IFolderDeletePayload,
} from './folder-delete.interface';
import {
  GenerateTaskMessage,
  IGenerateTaskPayload,
} from './generate-task.interface';
import {
  IIndexingMessagePayload,
  IndexingMessage,
} from './indexing-message.interface';
import { LoggingMessage } from './logging.message.interface';
import {
  INotebookToProCodePayload,
  INotebookToProCodeResponse,
  NotebookToProCodeMessage,
} from './notebook-to-pro-code.interface';
import { FileRenameMessage, IFileRenamePayload } from './rename.interface';
import {
  IRetrieveDocsPayload,
  IRetrieveDocsResponse,
  RetrieveDocsMessage,
} from './retrieve-docs-message.interface';
import { UsageMetricLSPMessage } from './usage-metric-message.interface';
import {
  AddDocsMessage,
  FormatFileMessage,
  IAddDocsMessagePayload,
  IInitWorkspaceConfigPayload,
  InitWorkspaceConfigMessage,
  IWorkspaceConfigPayload,
  WorkspaceConfigMessage,
} from './workspace-config.message.interface';

/** Allowed types for messages sent to language servers */
export type LanguageServerMessage =
  | AddDocsMessage
  | FileRenameMessage
  | FormatFileMessage
  | FolderDeleteMessage
  | GenerateTaskMessage
  | IndexingMessage
  | InitWorkspaceConfigMessage
  | LoggingMessage
  | NotebookToProCodeMessage
  | RetrieveDocsMessage
  | UsageMetricLSPMessage
  | WorkspaceConfigMessage;

/** Strictly typed payloads to/from the language server */
export type LanguageServerPayload<T extends LanguageServerMessage> =
  T extends AddDocsMessage
    ? IAddDocsMessagePayload
    : T extends FileRenameMessage
    ? IFileRenamePayload
    : T extends FolderDeleteMessage
    ? IFolderDeletePayload
    : T extends FormatFileMessage
    ? DocumentFormattingParams
    : T extends GenerateTaskMessage
    ? IGenerateTaskPayload
    : T extends IndexingMessage
    ? IIndexingMessagePayload
    : T extends InitWorkspaceConfigMessage
    ? IInitWorkspaceConfigPayload
    : T extends LoggingMessage
    ? ILogOptions
    : T extends NotebookToProCodeMessage
    ? INotebookToProCodePayload
    : T extends RetrieveDocsMessage
    ? IRetrieveDocsPayload
    : T extends UsageMetricLSPMessage
    ? IUsageMetricAndPayload<UsageMetric>
    : T extends WorkspaceConfigMessage
    ? IWorkspaceConfigPayload
    : any;

/** Strictly typed payloads to/from the language server */
export type LanguageServerResponse<T extends LanguageServerMessage> =
  T extends RetrieveDocsMessage
    ? IRetrieveDocsResponse
    : T extends NotebookToProCodeMessage
    ? INotebookToProCodeResponse
    : any;

/** Strictly typed lookup of language server messages */
export interface ILanguageServerMessages {
  /** Add/update docs for file */
  ADD_DOCS: AddDocsMessage;
  /** Rename event for files */
  FILE_RENAME: FileRenameMessage;
  /** When we will delete folders */
  FOLDER_DELETE: FolderDeleteMessage;
  /** Message to specify that we are formatting a file */
  FORMAT_FILE: FormatFileMessage;
  /** Message for generating tasks */
  GENERATE_TASK: GenerateTaskMessage;
  /** When we index or finish indexing folders */
  INDEXING: IndexingMessage;
  /** Message to initialize workspace config */
  INIT_WORKSPACE_CONFIG: InitWorkspaceConfigMessage;
  /** Log content from the LSP */
  LOG: LoggingMessage;
  /** Convert notebooks to PRO code */
  NOTEBOOK_TO_PRO_CODE: NotebookToProCodeMessage;
  /** Message to retrieve docs */
  RETRIEVE_DOCS: RetrieveDocsMessage;
  /** Message to update workspace config */
  WORKSPACE_CONFIG: WorkspaceConfigMessage;
  /** Message from language server with usage metric to report */
  USAGE_METRIC: UsageMetricLSPMessage;
}

/**
 * Constant for easy-access to the message types sent back and forth between the
 * language client and the language server.
 *
 * Handles any custom information that we want/need to send back and forth.
 */
export const LANGUAGE_SERVER_MESSAGE_LOOKUP: ILanguageServerMessages = {
  ADD_DOCS: 'add-docs',
  FILE_RENAME: 'textDocument/didRename',
  FOLDER_DELETE: 'will-delete-folders',
  FORMAT_FILE: 'format-file',
  GENERATE_TASK: 'generate/task',
  INDEXING: 'indexing',
  INIT_WORKSPACE_CONFIG: 'init-workspace-config',
  LOG: 'log',
  NOTEBOOK_TO_PRO_CODE: 'notebook/to-pro-code',
  RETRIEVE_DOCS: 'retrieve-docs',
  USAGE_METRIC: 'usage-metric-lsp',
  WORKSPACE_CONFIG: 'workspace-config',
};
