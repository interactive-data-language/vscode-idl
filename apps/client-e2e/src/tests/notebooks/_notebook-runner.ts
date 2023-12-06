import { Logger } from '@idl/logger';

import { Runner } from '../runner.class';
import { NewNotebook } from './new-notebook';
import { NotebookFormats_1_0_0 } from './notebook-formats-1.0.0';
import { NotebookFormats_2_0_0 } from './notebook-formats-2.0.0';
import { NotebookProblemsTrackRight } from './notebook-problems-track-right';
import { RunNotebookReset } from './notebook-reset';
import { RunNotebookStop } from './notebook-stop';
import { NotebookToProCodeAllCells } from './notebook-to-pro-code-all-cells';
import { NotebookToProCodeOnlyCode } from './notebook-to-pro-code-only-code';
import { OpenENVINotebookExample } from './open-envi-notebook-example';
import { OpenIDLNotebookExample } from './open-idl-notebook-example';
import { ResetNotebookExamples } from './reset-notebook-examples';
import { RunENVIMessageListenerTestNotebook } from './run-envi-message-listener-test-notebook';
import { RunProblemNotebooks } from './run-problem-notebooks';
import { RunTestENVIMapNotebook } from './run-test-envi-map-notebook';
import { RunTestENVINotebook } from './run-test-envi-notebook';
import { RunTestNotebook } from './run-test-notebook';
import { RunUnsavedNotebook } from './run-unsaved-notebook';
import { SaveAndClearNotebook } from './save-and-clear-output';
import { VerifyQuietNotebookSetting } from './verify-quiet-notebook-setting';

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
  name: 'Make sure we properly open format 1.0.0',
  fn: NotebookFormats_1_0_0,
  critical: true,
});

NOTEBOOK_RUNNER.addTest({
  name: 'Make sure we properly open format 2.0.0',
  fn: NotebookFormats_2_0_0,
  critical: true,
});

NOTEBOOK_RUNNER.addTest({
  name: 'Verify we can create new notebooks',
  fn: NewNotebook,
  critical: false,
});

NOTEBOOK_RUNNER.addTest({
  name: 'Open IDL example notebook',
  fn: OpenIDLNotebookExample,
  critical: false,
});

NOTEBOOK_RUNNER.addTest({
  name: 'Open ENVI example notebook',
  fn: OpenENVINotebookExample,
  critical: false,
});

NOTEBOOK_RUNNER.addTest({
  name: 'Reset notebook examples',
  fn: ResetNotebookExamples,
  critical: false,
});

NOTEBOOK_RUNNER.addTest({
  name: 'Convert notebook to PRO code (only code)',
  fn: NotebookToProCodeOnlyCode,
  critical: false,
});

NOTEBOOK_RUNNER.addTest({
  name: 'Convert notebook to PRO code (all cells)',
  fn: NotebookToProCodeAllCells,
  critical: false,
});

NOTEBOOK_RUNNER.addTest({
  name: 'Run notebook that tests successes',
  fn: RunTestNotebook,
  critical: true,
});

NOTEBOOK_RUNNER.addTest({
  name: 'Run cells in notebook not saved to disk',
  fn: RunUnsavedNotebook,
  critical: false,
});

NOTEBOOK_RUNNER.addTest({
  name: 'Run notebooks that test problems are handled right',
  fn: RunProblemNotebooks,
  critical: true,
});

NOTEBOOK_RUNNER.addTest({
  name: 'Save output and reload',
  fn: SaveAndClearNotebook,
  critical: true,
});

NOTEBOOK_RUNNER.addTest({
  name: 'Run notebook that embeds rasters and do basic check they are right',
  fn: RunTestENVINotebook,
});

// can run ENVI map notebook
NOTEBOOK_RUNNER.addTest({
  name: 'Notebook maps through ENVI run and basic checks outputs are right',
  fn: RunTestENVIMapNotebook,
});

// can get ENVI progress messages
NOTEBOOK_RUNNER.addTest({
  name: 'Notebooks can display progress messages from ENVI',
  fn: RunENVIMessageListenerTestNotebook,
});

// reset goes first
NOTEBOOK_RUNNER.addTest({
  name: 'Reset does the right thing',
  fn: RunNotebookReset,
  critical: true,
});

// stop at the end to make sure the process exits
NOTEBOOK_RUNNER.addTest({
  name: 'Stop does the right thing',
  fn: RunNotebookStop,
  critical: true,
});

// make sure quiet mode works right
// this should always be after the RunNotebookStop test which makes
// sure we have a fresh session to tweak preferences for
NOTEBOOK_RUNNER.addTest({
  name: 'Verify quiet mode for notebooks',
  fn: VerifyQuietNotebookSetting,
});

// notebook problems track right
NOTEBOOK_RUNNER.addTest({
  name: 'Notebook problems track right',
  fn: NotebookProblemsTrackRight,
});
