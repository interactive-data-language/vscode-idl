import { IDL_MCP_VSCODE_LOG } from '@idl/logger';
import { Sleep } from '@idl/shared/extension';
import { IDL_LOGGER } from '@idl/vscode/logger';

/**
 * Options for fetch with retry
 */
export interface IFetchWithRetryOptions {
  /**
   * Initial delay between retries in milliseconds (will be doubled each retry)
   */
  initialRetryDelay: number;

  /**
   * Maximum number of retry attempts
   */
  maxRetries: number;

  /**
   * Timeout for each individual fetch attempt in milliseconds
   */
  timeout: number;
}

const DEFAULTS: IFetchWithRetryOptions = {
  initialRetryDelay: 500,
  maxRetries: 5,
  timeout: 2000,
};

/**
 * Fetches a URL with retry logic and timeout handling
 *
 * Uses exponential backoff to handle cases where the server is slow to start
 */
export async function FetchWithRetry(
  url: string,
  options: Partial<IFetchWithRetryOptions> = {},
): Promise<Response> {
  // set defaults
  const timeout = options.timeout || DEFAULTS.timeout;
  const maxRetries = options.maxRetries || DEFAULTS.maxRetries;
  const initialRetryDelay =
    options.initialRetryDelay || DEFAULTS.initialRetryDelay;

  /** Track attempts */
  let attempt = 0;

  /** Track the last error */
  let lastError: Error | undefined;

  /** Current retry delay (exponential backoff) */
  let retryDelay = initialRetryDelay;

  // try to fetch with retries
  while (attempt <= maxRetries) {
    try {
      // set timeout for this attempt
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // log retry attempts
      if (attempt > 0) {
        IDL_LOGGER.log({
          log: IDL_MCP_VSCODE_LOG,
          type: 'debug',
          content: `Retrying connection to MCP server (attempt ${attempt}/${maxRetries})`,
        });
      }

      // attempt to fetch
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
      });

      // remove timeout
      clearTimeout(timeoutId);

      // return successful response
      return response;
    } catch (err) {
      // save error for final throw
      lastError = err as Error;

      // check if we have more retries
      if (attempt < maxRetries) {
        // log the failure
        IDL_LOGGER.log({
          log: IDL_MCP_VSCODE_LOG,
          type: 'debug',
          content: [
            `Failed to connect to MCP server (attempt ${attempt + 1}/${
              maxRetries + 1
            }), retrying in ${retryDelay}ms`,
            err,
          ],
        });

        // wait before retrying (exponential backoff)
        await Sleep(retryDelay);

        // double the retry delay for next attempt
        retryDelay *= 2;

        // increment attempt counter
        attempt++;
      } else {
        // no more retries, break out
        break;
      }
    }
  }

  // if we get here, all retries failed
  throw new Error(
    `Failed to connect to MCP server after ${maxRetries + 1} attempts: ${
      lastError?.message || 'Unknown error'
    }`,
  );
}
