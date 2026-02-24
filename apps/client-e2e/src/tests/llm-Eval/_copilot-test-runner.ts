import { Logger } from '@idl/logger';

import { Runner } from '../runner.class';
import { RunCopilotTestFollowsInstructions } from './copilot-test-follows-instructions';

/**
 * Logger for Copilot tests
 */
export const COPILOT_TEST_LOGGER = new Logger(
  'copilot-tests',
  false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {}
);

/**
 * Test runner for Copilot evaluation
 */
export const COPILOT_TEST_RUNNER = new Runner(COPILOT_TEST_LOGGER);

/**
 * Add test for following instructions
 */
COPILOT_TEST_RUNNER.addTest({
  fn: RunCopilotTestFollowsInstructions,
  name: 'Test Copilot follows instructions',
});
