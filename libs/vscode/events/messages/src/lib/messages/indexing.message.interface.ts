/**
 * Message indicating we are starting or stopping indexing
 */
export type IndexingMessage = 'indexing';

/**
 * Information we expect to send back and forth for our workspace config
 */
export interface IIndexingMessagePayload {
  /** Flag if we start or stop indexing */
  type: 'start' | 'finish';
}
