import { GlobalTokens, IBaseIndexedToken } from '@idl/data-types/core';
import { ILogOptions } from '@idl/logger';
import { SyntaxProblems } from '@idl/parsing/problem-codes';
import { IParsed } from '@idl/parsing/syntax-tree';
import { IDLExtensionConfig } from '@idl/vscode/extension-config';
import { WorkerIOBaseMessage } from '@idl/workers/workerio';
import {
  CompletionItem,
  DocumentSymbol,
  Position,
  SemanticTokens,
} from 'vscode-languageserver';

/**
 * Message to synchronize with worker threads all of the files that we have on our path
 */
export type AllFilesMessage = 'all-files';

/**
 * Payload to indicate which files we have on our path
 */
export interface AllFilesPayload {
  files: string[];
}

/**
 * Response when tracking all files
 */
export type AllFilesResponse = void;

/**
 * Message when we need to perform change detection
 */
export type ChangeDetectionMessage = 'change-detection';

/**
 * Payload to have workers perform change detection
 */
export interface ChangeDetectionPayload {
  /** Changed global tokens */
  changed: GlobalTokens;
}

/**
 * Response from change detection
 */
export type ChangeDetectionResponse = {
  /** Problems we detected, by file */
  problems: {
    [file: string]: SyntaxProblems;
  };
  /** Files we tried to perform change detection on, but were missing */
  missing: string[];
};

/**
 * Message when we want to get auto complete for a file
 */
export type GetAutoCompleteMessage = 'get-auto-complete';

/**
 * Payload to get auto complete
 */
export interface GetAutoCompletePayload {
  file: string;
  code: string | string[];
  position: Position;
  config: IDLExtensionConfig;
}

/**
 * Response from get auto complete
 */
export type GetAutoCompleteResponse = CompletionItem[];

/**
 * Message when we want to get the outline for a file
 */
export type GetOutlineMessage = 'get-outline';

/**
 * Payload to get outline for a file
 */
export interface GetOutlinePayload {
  file: string;
  code: string | string[];
}

/**
 * Response for outline
 */
export type GetOutlineResponse = DocumentSymbol[];

/**
 * Message when we want to get semantic tokens for a file
 */
export type GetSemanticTokensMessage = 'get-semantic-tokens';

/**
 * Payload to get semantic tokens for a file
 */
export interface GetSemanticTokensPayload {
  file: string;
  code: string | string[];
}

/**
 * Response for getting semantic tokens from a file
 */
export type GetSemanticTokensResponse = SemanticTokens;

/**
 * Message when we want to get token definition
 */
export type GetTokenDefMessage = 'get-token-def';

/**
 * Payload to get token def
 */
export interface GetTokenDefPayload {
  file: string;
  code: string | string[];
  position: Position;
}

/**
 * Response from get token def
 */
export type GetTokenDefResponse = IBaseIndexedToken | undefined;

/**
 * Load global tokens using our extension configuration
 */
export type LoadGlobalMessage = 'load-global';

/**
 * Payload to load global tokens in our worker thread
 */
export interface LoadGlobalPayload {
  config: IDLExtensionConfig;
}

/**
 * Response when asking to load global tokens
 */
export type LoadGlobalResponse = void;

/**
 * Message for log manager
 */
export type LogManagerMessage = 'log-manager';

/**
 * Payload to from parent when logging (should never have, so its void)
 */
export type LogManagerPayload = void;

/**
 * Response when sending message to log manager
 */
export type LogManagerResponse = ILogOptions;

/**
 * When we parse and post-process code (i.e. open editor, file not saved on disk)
 */
export type ParseAndPostProcessCodeMessage = 'parse-code';

/**
 * Payload when we have a single file from code to parse and post-process
 */
export interface ParseAndPostProcessCodePayload {
  file: string;
  code: string | string[];
  postProcess: boolean;
}

/**
 * Response when we have a single file from code to parse and post-process
 */
export type ParseAndPostProcessCodeResponse = IParsed;

/**
 * When we parse and post-process one file
 */
export type ParseAndPostProcessFileMessage = 'parse-file';

/**
 * Payload when we have a single file to parse and post-process
 */
export interface ParseAndPostProcessFilePayload {
  file: string;
  postProcess: boolean;
}

/**
 * Response when we have a single file to parse and post-process
 */
export type ParseAndPostProcessFileResponse = IParsed;

/**
 * Parse more than one file and return global tokens
 */
export type ParseFilesMessage = 'parse-files';

/**
 * Payload when we have files to parse
 */
export interface ParseFilesPayload {
  files: string[];
}

/**
 * Response when we parse files
 */
export interface ParseFilesResponse {
  /** Globals we found, by file */
  globals: {
    [file: string]: GlobalTokens;
  };
  /** Files we tried to parse, but were missing */
  missing: string[];
  /** Number of lines of code */
  lines: number;
}

/**
 * Quickly parse more than one file at a time and track global tokens
 */
export type ParseFilesFastMessage = 'parse-files-fast';

/**
 * Response when we parse files quickly
 */
export interface ParseFilesFastResponse extends ParseFilesResponse {
  /** Globals we found, by file */
  globals: {
    [file: string]: GlobalTokens;
  };
  /** Problems we detected, by file */
  problems: {
    [file: string]: SyntaxProblems;
  };
  /** Files we tried to parse, but were missing */
  missing: string[];
  /** Number of lines of code */
  lines: number;
}

/**
 * Post-process more than one file and return problems-per-file
 */
export type PostProcessFilesMessage = 'post-process-files';

/**
 * Payload when we post process files
 */
export interface PostProcessFilesPayload {
  /**
   * Specific files that we process. If none are specified, then we
   * post process every file in the index
   */
  files?: string[];
}

/**
 * Response when we post process files
 */
export interface PostProcessFilesResponse {
  /** Problems we detected, by file */
  problems: {
    [file: string]: SyntaxProblems;
  };
  /** Files we tried to post-process, but were missing */
  missing: string[];
  /** Number of lines of code */
  lines: number;
}

/**
 * Removes files from our thread, cleans up globals, and does post-processing
 */
export type RemoveFilesMessage = 'remove-files';

/**
 * Payload when we remove files
 */
export interface RemoveFilesPayload {
  /**
   * All files being removed, not just those owned by the worker
   *
   * We need to send all files to clean up global tokens and have proper
   * post-processing/change detection
   */
  files: string[];
}

/**
 * Response when we remove files
 */
export interface RemoveFilesResponse {
  /** Problems we detected, by file */
  problems: {
    [file: string]: SyntaxProblems;
  };
  /** Files we tried to post-process after removing tracked files, but were missing */
  missing: string[];
}

/**
 * Global tokens that we are syncing between worker threads
 */
export type TrackGlobalTokensMessage = 'track-global';

/**
 * Payload to track global tokens for other files
 */
export interface TrackGlobalTokensPayload {
  [key: string]: GlobalTokens;
}

/**
 * Response when asking to track global tokens
 */
export type TrackGlobalTokensResponse = void;

/**
 * All messages that we send with the language server
 */
export type LSPWorkerThreadMessage =
  | WorkerIOBaseMessage
  | AllFilesMessage
  | ChangeDetectionMessage
  | GetAutoCompleteMessage
  | GetOutlineMessage
  | GetSemanticTokensMessage
  | GetTokenDefMessage
  | LoadGlobalMessage
  | LogManagerMessage
  | ParseAndPostProcessCodeMessage
  | ParseAndPostProcessFileMessage
  | ParseFilesMessage
  | ParseFilesFastMessage
  | PostProcessFilesMessage
  | RemoveFilesMessage
  | TrackGlobalTokensMessage;

/**
 * Strictly typed worker thread message lookup
 */
interface ILSPWorkerThreadMessageLookup {
  /**
   * Load global tokens using our extension configuration
   */
  ALL_FILES: AllFilesMessage;
  /**
   * Message when we need to perform change detection
   */
  CHANGE_DETECTION: ChangeDetectionMessage;
  /**
   * Message when we want to get auto complete for a file
   */
  GET_AUTO_COMPLETE: GetAutoCompleteMessage;
  /**
   * Message when we want to get the outline for a file
   */
  GET_OUTLINE: GetOutlineMessage;
  /**
   * Message when we want to get semantic tokens for a file
   */
  GET_SEMANTIC_TOKENS: GetSemanticTokensMessage;
  /**
   * Message when we want to get token definition
   */
  GET_TOKEN_DEF: GetTokenDefMessage;
  /**
   * Load global tokens using our extension configuration
   */
  LOAD_GLOBAL: LoadGlobalMessage;
  /**
   * Message for log manager
   */
  LOG_MANAGER: LogManagerMessage;
  /**
   * When we parse and post-process code (i.e. open editor, file not saved on disk)
   */
  PARSE_CODE: ParseAndPostProcessCodeMessage;
  /**
   * When we parse and post-process one file
   */
  PARSE_FILE: ParseAndPostProcessFileMessage;
  /**
   * Parse more than one file and return global tokens
   */
  PARSE_FILES: ParseFilesMessage;
  /**
   * Quickly parse more than one file at a time and track global tokens
   */
  PARSE_FILES_FAST: ParseFilesFastMessage;
  /**
   * Post-process more than one file and return problems-per-file
   */
  POST_PROCESS_FILES: PostProcessFilesMessage;
  /**
   * Removes files from our thread, cleans up globals, and does post-processing
   */
  REMOVE_FILES: RemoveFilesMessage;
  /**
   * Global tokens that we are syncing between worker threads
   */
  TRACK_GLOBAL: TrackGlobalTokensMessage;
}

/**
 * Messages we are allowed to send to our language server worker thread pool
 */
export const LSP_WORKER_THREAD_MESSAGE_LOOKUP: ILSPWorkerThreadMessageLookup = {
  ALL_FILES: 'all-files',
  CHANGE_DETECTION: 'change-detection',
  GET_AUTO_COMPLETE: 'get-auto-complete',
  GET_OUTLINE: 'get-outline',
  GET_SEMANTIC_TOKENS: 'get-semantic-tokens',
  GET_TOKEN_DEF: 'get-token-def',
  LOAD_GLOBAL: 'load-global',
  LOG_MANAGER: 'log-manager',
  PARSE_CODE: 'parse-code',
  PARSE_FILE: 'parse-file',
  PARSE_FILES: 'parse-files',
  PARSE_FILES_FAST: 'parse-files-fast',
  POST_PROCESS_FILES: 'post-process-files',
  REMOVE_FILES: 'remove-files',
  TRACK_GLOBAL: 'track-global',
};
