import { IInitializeType } from '@idl/vscode/initialize-types';

/**
 * Function that runs tests, typed so that all test functions
 * follow the same pattern.
 */
export type RunnerFunction = (init: IInitializeType) => Promise<void>;

/**
 * Data structure for test functions considering we don't have test
 * frameworks to use or access.
 */
export interface IRunnerTest {
  /** Name fo the test being run */
  name: string;
  /** Async test function being run that returns the number of failed tests */
  fn: RunnerFunction;
  /** If critical, this failure prevents other tests from running */
  critical?: boolean;
}

/**
 * Pause between tests (ms) for stability
 */
export const TEST_PAUSE_MS = 200;
