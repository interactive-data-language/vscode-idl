import { Logger } from '@idl/logger';

import { Runner } from '../runner.class';
import { NotebookProblemsTrackRight } from './notebook-problems-track-right';
import { RunNotebookRestart } from './notebook-restart';
import { RunNotebookStop } from './notebook-stop';
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

// reset goes first
NOTEBOOK_RUNNER.addTest({
  name: 'Reset does the right thing',
  fn: RunNotebookRestart,
  critical: true,
});

// stop at the end to make sure the process exits
NOTEBOOK_RUNNER.addTest({
  name: 'Stop does the right thing',
  fn: RunNotebookStop,
  critical: true,
});

// stop at the end to make sure the process exits
NOTEBOOK_RUNNER.addTest({
  name: 'Notebook problems track right',
  fn: NotebookProblemsTrackRight,
});
