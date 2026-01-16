import { Logger } from '@idl/logger';

import { Runner } from '../runner.class';

/*
 * Logger to be used for tests related to debugging
 */
export const GITHUB_COPILOT_TEST_LOGGER = new Logger(
  'github-copilot-tests',
  false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {}
);

/**
 * Test runner for debugging
 */
export const GITHUB_COPILOT_RUNNER = new Runner(GITHUB_COPILOT_TEST_LOGGER);
