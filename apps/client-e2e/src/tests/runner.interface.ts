import { IInitializeType } from '@idl/vscode/initialize-types';

/**
 * Function that runs tests, typed so that all test functions
 * follow the same pattern.
 */
export type RunnerFunction = (init: IInitializeType) => Promise<void>;

/**
 * Data structure to turn off tests for some hardware setups, such as arm macs
 * which need to skip ENVI code for notebooks.
 */
export interface IOSDefinition {
  /** The name of the architecture we exclude */
  architecture: NodeJS.Architecture[];
  /** The name of the OS we exclude for */
  os: NodeJS.Platform[];
}

/**
 * Data structure for test functions considering we don't have test
 * frameworks to use or access.
 */
export interface IRunnerTest {
  /** If critical, this failure prevents other tests from running */
  critical?: boolean;
  /** Do we keep or close all editors? */
  dontCloseAll?: boolean;
  /** Hardware we skip the test for */
  excludeOS?: IOSDefinition[];
  /** Async test function being run that returns the number of failed tests */
  fn: RunnerFunction;
  /** What hardware is our test specific for? */
  includeOS?: IOSDefinition[];
  /** Name fo the test being run */
  name: string;
}

/**
 * Pause between tests (ms) for stability
 */
export const TEST_PAUSE_MS = 200;
