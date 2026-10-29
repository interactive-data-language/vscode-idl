import type { AxiosInstance } from 'axios';

/**
 * Options for creating a client for the agents server
 */
export interface IAgentsServerClientOptions {
  /**
   * Axios instance used for all requests (including the streaming chat request),
   * so callers bring their own interceptors, auth, and defaults.
   *
   * Must have `baseURL` set unless `baseUrl` is provided
   */
  axios: AxiosInstance;
  /**
   * Overrides the base URL on the axios instance
   */
  baseUrl?: string;
}

/**
 * Per-request options
 */
export interface IAgentsServerRequestOptions {
  /**
   * Signal to abort the request
   */
  signal?: AbortSignal;
}
