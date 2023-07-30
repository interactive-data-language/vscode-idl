import { Logger } from '@idl/logger';

import { Runner } from '../runner.class';
import { AddDocs } from './add-docs';

/*
 * Logger to be used for tests related to debugging
 */
export const INTERACTIONS_TEST_LOGGER = new Logger(
  'tests-interaction',
  false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {}
);

/**
 * Test runner for debugging
 */
export const INTERACTIONS_RUNNER = new Runner(INTERACTIONS_TEST_LOGGER);

// verify add-docs works
INTERACTIONS_RUNNER.addTest({
  name: 'Add docs, update test, add docs again',
  fn: AddDocs,
  critical: false,
});
