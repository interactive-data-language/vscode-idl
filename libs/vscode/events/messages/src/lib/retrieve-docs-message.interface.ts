import { GlobalTokenType } from '@idl/data-types/core';

/**
 * Message to retrieve docs
 */
export type RetrieveDocsMessage = 'retrieve-docs';

/**
 * Payload to retrieve docs
 */
export interface IRetrieveDocsPayload {
  /**
   * type of token
   */
  type: GlobalTokenType;
  /**
   * Name of token
   */
  name: string;
}

/**
 * response when getting docs
 */
export interface IRetrieveDocsResponse {
  // docs
  docs: string;
}
