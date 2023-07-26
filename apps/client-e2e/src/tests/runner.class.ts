import { Logger } from '@idl/logger';
import { Sleep } from '@idl/shared';

import { ACTIVATION_RESULT } from '../main';
import { IRunnerTest, TEST_PAUSE_MS } from './runner.interface';

/**
 * Basic class that runs and manages tests for the VSCode client
 */
export class Runner {
  /** Logger to print information to the console */
  logger: Logger;

  /** All tests runners that we work with */
  runners: Runner[] = [];

  /** All the tests that we run */
  tests: IRunnerTest[] = [];

  constructor(log: Logger) {
    this.logger = log;
  }

  /** Registers other test runners to execute */
  addRunner(runner: Runner) {
    this.runners.push(runner);
  }

  /** Register test that we need to run */
  addTest(test: IRunnerTest) {
    this.tests.push(test);
  }

  /**
   * Runs the tests that we have registered to our runner and returns the number of failures
   */
  async runOurTests(): Promise<number> {
    /** Initialize failures */
    let failures = 0;

    // run all of our tests
    for (let i = 0; i < this.tests.length; i++) {
      try {
        // log test we are starting
        this.logger.info(this.tests[i].name);

        // attempt to run test
        await this.tests[i].fn(ACTIVATION_RESULT);

        // pause afterwards so things catch up
        await Sleep(TEST_PAUSE_MS);
      } catch (err) {
        // pause so output logs can be captured
        await Sleep(1000);

        // log
        this.logger.error([`Failed test: "${this.tests[i].name}"`, err]);

        // account for failure
        failures += 1;

        // check if we have a critical test that might set things up
        if (this.tests[i].critical) {
          break;
        }
      }
    }

    return failures;
  }

  /**
   * Runs the tests that we have registered to our runner and returns the number of failures
   */
  async runAllTests(): Promise<number> {
    /** Initialize failures */
    let failures = 0;

    // run all of our tests - no need for try/catch, handled internally below
    for (let i = 0; i < this.runners.length; i++) {
      failures += await this.runners[i].runOurTests();
    }

    return failures;
  }
}
