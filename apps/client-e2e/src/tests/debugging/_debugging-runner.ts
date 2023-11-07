import { Logger } from '@idl/logger';

import { Runner } from '../runner.class';
import { BreakPointStepInStepOut } from './breakpoint-step-in-step-out';
import { Compile } from './compile';
import { Continue } from './continue';
import { Edit } from './edit';
import { Exit } from './exit';
import { ImpliedPrint } from './implied-print';
import { RigorousAlwaysReturn } from './rigorous-always-return';
import { StartDebugging } from './start';
import { VariableReplacement } from './variable-replacement';

/**
 * Logger to be used for tests related to debugging
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const DEBUG_TEST_LOGGER = new Logger('tests-debug', false, () => {});

/**
 * Test runner for debugging
 */
export const DEBUGGING_RUNNER = new Runner(DEBUG_TEST_LOGGER);

DEBUGGING_RUNNER.addTest({
  name: 'Start debugging and run basic command',
  fn: StartDebugging,
  critical: true,
});

DEBUGGING_RUNNER.addTest({
  name: 'Run file, stop on stops, and move through code with continue',
  fn: Continue,
});

DEBUGGING_RUNNER.addTest({
  name: 'Set breakpoints, step in, over, out, reset',
  fn: BreakPointStepInStepOut,
});

DEBUGGING_RUNNER.addTest({
  name: 'Compile file and open the file we compiled',
  fn: Compile,
});

DEBUGGING_RUNNER.addTest({
  name: 'Edit file and open the file we desire to edit',
  fn: Edit,
});

DEBUGGING_RUNNER.addTest({
  name: 'Can run many commands and return',
  fn: RigorousAlwaysReturn,
  critical: true,
});

DEBUGGING_RUNNER.addTest({
  name: 'Verify implied print works right',
  fn: ImpliedPrint,
  critical: true,
});

DEBUGGING_RUNNER.addTest({
  name: 'Manual exit closes cleanly',
  fn: Exit,
});

DEBUGGING_RUNNER.addTest({
  name: 'Verify we replace variables from environment',
  fn: VariableReplacement,
});
