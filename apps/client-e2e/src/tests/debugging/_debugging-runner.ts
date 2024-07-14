import { Logger } from '@idl/logger';

import { Runner } from '../runner.class';
import { BreakpointCompileBehavior } from './breakpoint-compile-behavior';
import { BreakpointSetBeforeStart } from './breakpoint-set-before-start';
import { BreakpointStepInStepOut } from './breakpoint-step-in-step-out';
import { CleanOutput } from './clean-output';
import { Compile } from './compile';
import { Continue } from './continue';
import { Edit } from './edit';
import { Exit } from './exit';
import { ImpliedPrint } from './implied-print';
import { QueueRight } from './queue-right';
import { RigorousAlwaysReturn } from './rigorous-always-return';
import { RunFile } from './run-file';
import { StartDebugging } from './start';
import { SyntaxErrorTracking } from './syntax_error_tracking';
import { TimerStop } from './timer-stop';
import { VariableReplacement } from './variable-replacement';

/**
 * Logger to be used for tests related to debugging
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const DEBUG_TEST_LOGGER = new Logger('debugging-tests', false, () => {});

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
  name: 'Remove excess IDL content from IDL output (compile/restore statements)',
  fn: CleanOutput,
  critical: true,
});

DEBUGGING_RUNNER.addTest({
  name: 'Queue works right',
  fn: QueueRight,
  critical: true,
});

DEBUGGING_RUNNER.addTest({
  name: 'Track syntax errors on compile',
  fn: SyntaxErrorTracking,
});

DEBUGGING_RUNNER.addTest({
  name: 'Running a file handles all the right cases',
  fn: RunFile,
});

DEBUGGING_RUNNER.addTest({
  name: 'Run file, stop on stops, and move through code with continue',
  fn: Continue,
});

DEBUGGING_RUNNER.addTest({
  name: 'Set breakpoints, step in, over, out, reset',
  fn: BreakpointStepInStepOut,
});

DEBUGGING_RUNNER.addTest({
  name: 'Breakpoints behave correctly when we set before compiling a file',
  fn: BreakpointCompileBehavior,
});

DEBUGGING_RUNNER.addTest({
  name: 'Breakpoints get applied when set before IDL starts up',
  fn: BreakpointSetBeforeStart,
});

DEBUGGING_RUNNER.addTest({
  name: 'Detect stops not from manually running code',
  fn: TimerStop,
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
