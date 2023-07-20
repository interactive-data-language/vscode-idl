import { Logger } from '@idl/logger';

import { Runner } from '../runner.class';
import { RunTestNotebook } from './run-test-notebook';
import { SaveAndClearNotebook } from './save-and-clear-output';

/*
 * Logger to be used for tests related to debugging
 */
export const NOTEBOOK_TEST_LOGGER = new Logger(
  'tests-notebook',
  false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {}
);

/**
 * Test runner for debugging
 */
export const NOTEBOOK_RUNNER = new Runner(NOTEBOOK_TEST_LOGGER);

NOTEBOOK_RUNNER.addTest({
  name: 'Run notebook that tests everything',
  fn: RunTestNotebook,
  critical: true,
});

NOTEBOOK_RUNNER.addTest({
  name: 'Save output and reload',
  fn: SaveAndClearNotebook,
  critical: true,
});
