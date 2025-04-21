import { GlobalTokenType } from '@idl/types/core';

/**
 * Message to retrieve docs
 */
export type RetrieveDocsMessage = 'retrieve-docs';

/**
 * Payload to retrieve docs
 */
export interface IRetrieveDocsPayload {
  /**
   * Name of token
   */
  name: string;
  /**
   * type of token
   */
  type: GlobalTokenType;
}

/**
 * response when getting docs
 */
export interface IRetrieveDocsResponse {
  // docs
  docs: string;
}
