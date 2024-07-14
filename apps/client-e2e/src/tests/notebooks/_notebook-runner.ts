import { Logger } from '@idl/logger';

import { Runner } from '../runner.class';
import { NewNotebook } from './new-notebook';
import { NotebookCallStackDecorationsNoDecorations } from './notebook-call-stack-decorations-no-decorations';
import { NotebookCallStackDecorationsOnExecutionHalted1 } from './notebook-call-stack-decorations-on-execution-halted';
import { NotebookCallStackDecorationsOnStop } from './notebook-call-stack-decorations-on-stop';
import { NotebookDecorationsBehaveRight } from './notebook-decorations-behave-right';
import { NotebookFormats_1_0_0 } from './notebook-formats-1.0.0';
import { NotebookFormats_2_0_0 } from './notebook-formats-2.0.0';
import { RunNotebookReset } from './notebook-reset';
import { RunNotebookStop } from './notebook-stop';
import { RunNotebookStopAll } from './notebook-stop-all';
import { NotebookToProCodeAllCells } from './notebook-to-pro-code-all-cells';
import { NotebookToProCodeAllCells2 } from './notebook-to-pro-code-all-cells-2';
import { NotebookToProCodeOnlyCode } from './notebook-to-pro-code-only-code';
import { NotebooksReplaceCellPathsForError } from './notebooks-replace-cell-paths-for-error';
import { NotebooksReplaceCellPathsOnStop } from './notebooks-replace-cell-paths-on-stop';
import { NotebooksVerifyImpliedPrint } from './notebooks-verify-implied-print';
import { OpenENVINotebookExample } from './open-envi-notebook-example';
import { OpenIDLNotebookExample } from './open-idl-notebook-example';
import { ResetNotebookExamples } from './reset-notebook-examples';
import { RunENVIMessageListenerTestNotebook } from './run-envi-message-listener-test-notebook';
import { RunENVIMultiPlotNotebook } from './run-envi-multi-plot-notebook';
import { RunPlotRegressionNotebook } from './run-plot-regression-notebook';
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
  'notebook-tests',
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
  excludeOS: [
    {
      os: ['darwin'],
      architecture: ['arm', 'arm64'],
    },
  ],
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
  name: 'Convert notebook to PRO code (all cells) #2',
  fn: NotebookToProCodeAllCells2,
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
  excludeOS: [
    {
      os: ['darwin'],
      architecture: ['arm', 'arm64'],
    },
  ],
});

// can run ENVI map notebook
NOTEBOOK_RUNNER.addTest({
  name: 'Notebook maps through ENVI run and basic checks outputs are right',
  fn: RunTestENVIMapNotebook,
  excludeOS: [
    {
      os: ['darwin'],
      architecture: ['arm', 'arm64'],
    },
  ],
});

// can get ENVI progress messages
NOTEBOOK_RUNNER.addTest({
  name: 'Notebooks can display progress messages from ENVI',
  fn: RunENVIMessageListenerTestNotebook,
  excludeOS: [
    {
      os: ['darwin'],
      architecture: ['arm', 'arm64'],
    },
  ],
});

// can get multiple graphics when ENVI has started
NOTEBOOK_RUNNER.addTest({
  name: 'Notebooks can display more than one plot when ENVI has started',
  fn: RunENVIMultiPlotNotebook,
  excludeOS: [
    {
      os: ['darwin'],
      architecture: ['arm', 'arm64'],
    },
  ],
});

NOTEBOOK_RUNNER.addTest({
  name: 'Regression test to re-embed graphics on property changes',
  fn: RunPlotRegressionNotebook,
});

NOTEBOOK_RUNNER.addTest({
  name: 'Stack trace decorations on execution halted #1',
  fn: NotebookCallStackDecorationsOnExecutionHalted1,
});

NOTEBOOK_RUNNER.addTest({
  name: 'Stack trace decorations on stop',
  fn: NotebookCallStackDecorationsOnStop,
});

NOTEBOOK_RUNNER.addTest({
  name: 'Stack trace decorations dont show for normal execution',
  fn: NotebookCallStackDecorationsNoDecorations,
});

NOTEBOOK_RUNNER.addTest({
  name: 'Stack trace decorations dont show for normal execution',
  fn: NotebookCallStackDecorationsNoDecorations,
});

NOTEBOOK_RUNNER.addTest({
  name: 'Replace cell paths for stops',
  fn: NotebooksReplaceCellPathsOnStop,
});

NOTEBOOK_RUNNER.addTest({
  name: 'Replace cell paths for errors',
  fn: NotebooksReplaceCellPathsForError,
});

NOTEBOOK_RUNNER.addTest({
  name: 'Implied print does the right thing',
  fn: NotebooksVerifyImpliedPrint,
});

// reset goes first
NOTEBOOK_RUNNER.addTest({
  name: 'Reset does the right thing',
  fn: RunNotebookReset,
  critical: true,
});

// stop all notebooks
NOTEBOOK_RUNNER.addTest({
  name: 'Stop all does the right thing',
  fn: RunNotebookStopAll,
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

NOTEBOOK_RUNNER.addTest({
  name: 'Verify decorations work right in notebooks',
  fn: NotebookDecorationsBehaveRight,
});
