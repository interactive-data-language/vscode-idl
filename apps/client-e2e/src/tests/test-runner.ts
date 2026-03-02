import { Logger } from '@idl/logger';

import { COPILOT_TEST_RUNNER } from './copilot/_copilot-test-runner';
import { Runner } from './runner.class';

/**
 * Test runner. All tests should be added/executed here.
 *
 * Returns the number of failed tests
 */
export async function TestRunner(): Promise<number> {
  /**
   * Logger to be used for tests related to debugging
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const clientLogger = new Logger('test-runner', false, () => {});

  // primary test runner
  const clientRunner = new Runner(clientLogger);

  // register all of our test runners
  // clientRunner.addRunner(INTERACTIONS_RUNNER);
  // clientRunner.addRunner(DEBUGGING_RUNNER);
  // clientRunner.addRunner(NOTEBOOK_RUNNER);
  // clientRunner.addRunner(MCP_TEST_RUNNER);
  clientRunner.addRunner(COPILOT_TEST_RUNNER);

  // test and return number of failures
  return await clientRunner.runAllTests();
}
