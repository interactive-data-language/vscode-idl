/**
 * Test configuration with constants to easily change timeouts and delays when running tests
 *
 * These occasionally need to change so tests pass 100% of the time
 */
export const CLIENT_E2E_CONFIG = {
  /** Test delays */
  DELAYS: {
    /** Problem delay for PRO files and anything else */
    DEFAULT: 1000,
    /** Pause in debug code */
    DEBUG: 500,
    /** Pause when we parse code so that it gets parsed and reports problems  */
    PARSE_PAUSE: 250,
    /** Delay with notebook parsing */
    NOTEBOOK_PARSE: 500,
    /** Delay for tests using problem reporting and notebooks */
    PROBLEMS_NOTEBOOK: 2000,
    /** When we need to wait for settings to sync up */
    SETTINGS: 2500,
  },
};
