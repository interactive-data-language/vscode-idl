/**
 * Configuration options for starting the language server
 */
export const START_LANGUAGE_SERVER_CONFIG = {
  /**
   * How long do we try to wait for node.js to start? This is blocking, so
   * it needs to be fast
   */
  NODE_TIMEOUT: 1000,
  /**
   * minimum node.js version that we will use to launch
   */
  NODE_MIN_VERSION: '16.0.0',
};
