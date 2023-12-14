import { CancellationToken } from '@idl/cancellation-tokens';
import {
  PayloadFromWorkerBaseMessage,
  WorkerIOBaseMessage,
} from '@idl/workers/workerio';

import {
  AllFilesMessage,
  AllFilesPayload,
  AllFilesResponse,
  AssembleProCodeMessage,
  AssembleProCodePayload,
  AssembleProCodeResponse,
  ChangeDetectionMessage,
  ChangeDetectionPayload,
  ChangeDetectionResponse,
  CleanUpMessage,
  CleanUpPayload,
  CleanUpResponse,
  GetAutoCompleteMessage,
  GetAutoCompletePayload,
  GetAutoCompleteResponse,
  GetHoverHelpLookupMessage,
  GetHoverHelpLookupResponse,
  GetHoverHelpPayload,
  GetNotebookCellMessage,
  GetNotebookCellPayload,
  GetNotebookCellResponse,
  GetOutlineMessage,
  GetOutlinePayload,
  GetOutlineResponse,
  GetSemanticTokensMessage,
  GetSemanticTokensPayload,
  GetSemanticTokensResponse,
  GetTokenDefMessage,
  GetTokenDefPayload,
  GetTokenDefResponse,
  LoadGlobalMessage,
  LoadGlobalPayload,
  LogManagerMessage,
  LogManagerPayload,
  LogManagerResponse,
  LSPWorkerThreadMessage,
  ParseAndPostProcessCodeMessage,
  ParseAndPostProcessCodePayload,
  ParseAndPostProcessCodeResponse,
  ParseAndPostProcessFileMessage,
  ParseAndPostProcessFilePayload,
  ParseAndPostProcessFileResponse,
  ParseFilesFastMessage,
  ParseFilesFastResponse,
  ParseFilesMessage,
  ParseFilesPayload,
  ParseFilesResponse,
  ParseNotebookMessage,
  ParseNotebookPayload,
  ParseNotebookResponse,
  PostProcessFilesMessage,
  PostProcessFilesPayload,
  PostProcessFilesResponse,
  RemoveFilesMessage,
  RemoveFilesPayload,
  RemoveFilesResponse,
  TrackGlobalTokensMessage,
  TrackGlobalTokensPayload,
} from './lsp-worker-thread.messages.interface';

/**
 * What is the response from our worker thread
 */
export type PayloadToLSPWorker<T extends LSPWorkerThreadMessage> =
  T extends AllFilesMessage
    ? AllFilesPayload
    : T extends AssembleProCodeMessage
    ? AssembleProCodePayload
    : T extends ChangeDetectionMessage
    ? ChangeDetectionPayload
    : T extends CleanUpMessage
    ? CleanUpPayload
    : T extends GetAutoCompleteMessage
    ? GetAutoCompletePayload
    : T extends GetHoverHelpLookupMessage
    ? GetHoverHelpPayload
    : T extends GetNotebookCellMessage
    ? GetNotebookCellPayload
    : T extends GetOutlineMessage
    ? GetOutlinePayload
    : T extends GetSemanticTokensMessage
    ? GetSemanticTokensPayload
    : T extends GetTokenDefMessage
    ? GetTokenDefPayload
    : T extends LoadGlobalMessage
    ? LoadGlobalPayload
    : T extends LogManagerMessage
    ? LogManagerPayload
    : T extends ParseAndPostProcessCodeMessage
    ? ParseAndPostProcessCodePayload
    : T extends ParseAndPostProcessFileMessage
    ? ParseAndPostProcessFilePayload
    : T extends ParseFilesMessage
    ? ParseFilesPayload
    : T extends ParseFilesFastMessage
    ? ParseFilesPayload
    : T extends ParseNotebookMessage
    ? ParseNotebookPayload
    : T extends PostProcessFilesMessage
    ? PostProcessFilesPayload
    : T extends RemoveFilesMessage
    ? RemoveFilesPayload
    : T extends TrackGlobalTokensMessage
    ? TrackGlobalTokensPayload
    : T extends WorkerIOBaseMessage
    ? PayloadFromWorkerBaseMessage<T>
    : any;

/**
 * What is the response from our worker thread
 */
export type PayloadFromLSPWorker<T extends LSPWorkerThreadMessage> =
  T extends AllFilesMessage
    ? AllFilesResponse
    : T extends AssembleProCodeMessage
    ? AssembleProCodeResponse
    : T extends ChangeDetectionMessage
    ? ChangeDetectionResponse
    : T extends CleanUpMessage
    ? CleanUpResponse
    : T extends GetAutoCompleteMessage
    ? GetAutoCompleteResponse
    : T extends GetHoverHelpLookupMessage
    ? GetHoverHelpLookupResponse
    : T extends GetNotebookCellMessage
    ? GetNotebookCellResponse
    : T extends GetOutlineMessage
    ? GetOutlineResponse
    : T extends GetSemanticTokensMessage
    ? GetSemanticTokensResponse
    : T extends GetTokenDefMessage
    ? GetTokenDefResponse
    : T extends LogManagerMessage
    ? LogManagerResponse
    : T extends ParseAndPostProcessCodeMessage
    ? ParseAndPostProcessCodeResponse
    : T extends ParseAndPostProcessFileMessage
    ? ParseAndPostProcessFileResponse
    : T extends ParseFilesMessage
    ? ParseFilesResponse
    : T extends ParseFilesFastMessage
    ? ParseFilesFastResponse
    : T extends ParseNotebookMessage
    ? ParseNotebookResponse
    : T extends PostProcessFilesMessage
    ? PostProcessFilesResponse
    : T extends RemoveFilesMessage
    ? RemoveFilesResponse
    : T extends WorkerIOBaseMessage
    ? PayloadFromWorkerBaseMessage<T>
    : any;

/**
 * Callback handler for LSP worker thread
 */
export type LSPMessageHandler<T extends LSPWorkerThreadMessage> = (
  payload: PayloadToLSPWorker<T>,
  token: CancellationToken
) => Promise<PayloadFromLSPWorker<T>>;
