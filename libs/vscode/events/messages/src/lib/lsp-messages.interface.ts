import { ILogOptions } from '@idl/logger';
import { IUsageMetricAndPayload, UsageMetric } from '@idl/usage-metrics';
import { DocumentFormattingParams } from 'vscode-languageserver/node';

import {
  FolderDeleteMessage,
  IFolderDeletePayload,
} from './messages/folder-delete.message.interface';
import {
  AddDocsMessage,
  FormatFileMessage,
  FormatWorkspaceMessage,
  FormatWorkspacePayload,
  FormatWorkspaceResponse,
} from './messages/formatting-messages.interface';
import {
  GenerateTaskMessage,
  IGenerateTaskPayload,
} from './messages/generate-task.message.interface';
import {
  IIndexingMessagePayload,
  IndexingMessage,
} from './messages/indexing.message.interface';
import { LoggingMessage } from './messages/logging.message.interface';
import {
  MigrateCodeLSPMessage,
  MigrateCodeLSPPayload,
  MigrateCodeLSPResponse,
} from './messages/migrate-code.message.interface';
import {
  INotebookToProCodePayload,
  INotebookToProCodeResponse,
  NotebookToProCodeMessage,
} from './messages/notebook-to-pro-code.message.interface';
import {
  PrepareNotebookCellMessage,
  PrepareNotebookCellPayload,
  PrepareNotebookCellResponse,
} from './messages/prepare-notebook-cell.message.interface';
import {
  ProgressMessage,
  ProgressMessagePayload,
} from './messages/progress.message.interface';
import {
  FileRenameMessage,
  IFileRenamePayload,
} from './messages/rename.message.interface';
import {
  IRetrieveDocsPayload,
  IRetrieveDocsResponse,
  RetrieveDocsMessage,
} from './messages/retrieve-docs.message.interface';
import { UsageMetricLSPMessage } from './messages/usage-metric.message.interface';
import {
  IInitWorkspaceConfigPayload,
  InitWorkspaceConfigMessage,
  IWorkspaceConfigPayload,
  WorkspaceConfigMessage,
} from './messages/workspace-config.message.interface';

/** Allowed types for messages sent to language servers */
export type LanguageServerMessage =
  | AddDocsMessage
  | FileRenameMessage
  | FormatFileMessage
  | FormatWorkspaceMessage
  | FolderDeleteMessage
  | GenerateTaskMessage
  | IndexingMessage
  | InitWorkspaceConfigMessage
  | LoggingMessage
  | MigrateCodeLSPMessage
  | NotebookToProCodeMessage
  | ProgressMessage
  | RetrieveDocsMessage
  | PrepareNotebookCellMessage
  | UsageMetricLSPMessage
  | WorkspaceConfigMessage;

/** Strictly typed payloads to/from the language server */
export type LanguageServerPayload<T extends LanguageServerMessage> =
  T extends AddDocsMessage
    ? DocumentFormattingParams
    : T extends FileRenameMessage
    ? IFileRenamePayload
    : T extends FolderDeleteMessage
    ? IFolderDeletePayload
    : T extends FormatFileMessage
    ? DocumentFormattingParams
    : T extends FormatWorkspaceMessage
    ? FormatWorkspacePayload
    : T extends GenerateTaskMessage
    ? IGenerateTaskPayload
    : T extends IndexingMessage
    ? IIndexingMessagePayload
    : T extends InitWorkspaceConfigMessage
    ? IInitWorkspaceConfigPayload
    : T extends LoggingMessage
    ? ILogOptions
    : T extends MigrateCodeLSPMessage
    ? MigrateCodeLSPPayload
    : T extends NotebookToProCodeMessage
    ? INotebookToProCodePayload
    : T extends RetrieveDocsMessage
    ? IRetrieveDocsPayload
    : T extends ProgressMessage
    ? ProgressMessagePayload
    : T extends PrepareNotebookCellMessage
    ? PrepareNotebookCellPayload
    : T extends UsageMetricLSPMessage
    ? IUsageMetricAndPayload<UsageMetric>
    : T extends WorkspaceConfigMessage
    ? IWorkspaceConfigPayload
    : any;

/** Strictly typed payloads to/from the language server */
export type LanguageServerResponse<T extends LanguageServerMessage> =
  T extends FormatWorkspaceMessage
    ? FormatWorkspaceResponse
    : T extends MigrateCodeLSPMessage
    ? MigrateCodeLSPResponse
    : T extends NotebookToProCodeMessage
    ? INotebookToProCodeResponse
    : T extends RetrieveDocsMessage
    ? IRetrieveDocsResponse
    : T extends PrepareNotebookCellMessage
    ? PrepareNotebookCellResponse
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
  /** Message to specify that we are formatting files in a workspace */
  FORMAT_WORKSPACE: FormatWorkspaceMessage;
  /** Message for generating tasks */
  GENERATE_TASK: GenerateTaskMessage;
  /** When we index or finish indexing folders */
  INDEXING: IndexingMessage;
  /** Message to initialize workspace config */
  INIT_WORKSPACE_CONFIG: InitWorkspaceConfigMessage;
  /** Log content from the LSP */
  LOG: LoggingMessage;
  /** Message to migrate ENVI DL API to 3.0 */
  MIGRATE_CODE: MigrateCodeLSPMessage;
  /** Convert notebooks to PRO code */
  NOTEBOOK_TO_PRO_CODE: NotebookToProCodeMessage;
  /** Progress message */
  PROGRESS: ProgressMessage;
  /** Message to retrieve docs */
  RETRIEVE_DOCS: RetrieveDocsMessage;
  /** Prepare notebook cell for execution */
  PREPARE_NOTEBOOK_CELL: PrepareNotebookCellMessage;
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
  FORMAT_WORKSPACE: 'format-workspace',
  GENERATE_TASK: 'generate/task',
  INDEXING: 'indexing',
  INIT_WORKSPACE_CONFIG: 'init-workspace-config',
  LOG: 'log',
  MIGRATE_CODE: 'migrate-code',
  NOTEBOOK_TO_PRO_CODE: 'notebook/to-pro-code',
  PROGRESS: 'progress',
  RETRIEVE_DOCS: 'retrieve-docs',
  PREPARE_NOTEBOOK_CELL: 'prepare-notebook-cell',
  USAGE_METRIC: 'usage-metric-lsp',
  WORKSPACE_CONFIG: 'workspace-config',
};
