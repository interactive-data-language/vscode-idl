import { Logger } from '@idl/logger';

import { Runner } from '../runner.class';
import { DefFilesInteractRight } from './basic-interactions/def-files-interact-right';
import { IDLJSONInteractRight } from './basic-interactions/idl-json-interact-right';
import { IndexIDLFolderRightAndOpenEditClose } from './basic-interactions/index-idl-folder-right-and-open-edit-close';
import { ProCodeInteractRight } from './basic-interactions/pro-code-interacts-right';
import { TasksInteractRight } from './basic-interactions/tasks-interact-right';
import { DuplicateGlobals } from './change-detection/duplicate-globals';
import { DuplicateGlobalsFromDefs } from './change-detection/duplicate-globals-from-defs';
import { DuplicateGlobalsFromOnlyDefs } from './change-detection/duplicate-globals-from-only-defs';
import {
  ExecuteCodeActionsWithEditForNotebook,
  ExecuteCodeActionsWithEditForPROFile,
} from './code-actions/execute-code-actions-with-edits';
import {
  ProCodeCodeActionsExisting,
  ProCodeCodeActionsNoExisting,
} from './code-actions/pro-code-code-actions';
import { AddDocs } from './commands/add-docs';
import {
  MigrateCodeDL30,
  MigrateCodeDL30_2,
} from './commands/migrate-code-dl-3.0';
import { IDLDisableAllFromSettings } from './disable-problems/idl-disable-all-from-setting';
import { IDLDisableAllFromSettingsForNotebook } from './disable-problems/idl-disable-all-from-setting-for-notebook';
import {
  IDLDisableAllFromComments,
  IDLDisableLinesFromComments,
} from './disable-problems/idl-disable-from-comments';
import { IDLDisableIndividualsFromSettings } from './disable-problems/idl-disable-individuals-from-setting';
import { IDLDisableIndividualsFromSettingsForNotebook } from './disable-problems/idl-disable-individuals-from-setting-for-notebook';
import { NotebookImpliedPrintProblemReporting } from './notebooks/notebook-implied-print-problem-reporting';
import { NotebookProblemsTrackRight } from './notebooks/notebook-problems-track-right';
import { NotebookCompletionBasic } from './notebooks/notebooks-completion-basic';
import { NotebooksInteractRight } from './notebooks/notebooks-interact-right';
import { NotebooksNoDuplicateRoutines } from './notebooks/notebooks-no-duplicate-routines';

/*
 * Logger to be used for tests related to debugging
 */
export const INTERACTIONS_TEST_LOGGER = new Logger(
  'interaction-tests',
  false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {}
);

/**
 * Test runner for debugging
 */
export const INTERACTIONS_RUNNER = new Runner(INTERACTIONS_TEST_LOGGER);

INTERACTIONS_RUNNER.addTest({
  name: 'Add docs, update test, add docs again',
  fn: AddDocs,
});

INTERACTIONS_RUNNER.addTest({
  name: 'Index IDL folder right on startup and properly sync problems on open, edit, close',
  fn: IndexIDLFolderRightAndOpenEditClose,
});

INTERACTIONS_RUNNER.addTest({
  name: 'Migrate code: DL 3.0 API #1',
  fn: MigrateCodeDL30,
});

INTERACTIONS_RUNNER.addTest({
  name: 'Migrate code: DL 3.0 API #2',
  fn: MigrateCodeDL30_2,
});

INTERACTIONS_RUNNER.addTest({
  name: 'Task interaction does the right thing',
  fn: TasksInteractRight,
});

INTERACTIONS_RUNNER.addTest({
  name: 'idl.json interaction does the right thing',
  fn: IDLJSONInteractRight,
});

INTERACTIONS_RUNNER.addTest({
  name: 'PRO code interacts right',
  fn: ProCodeInteractRight,
});

INTERACTIONS_RUNNER.addTest({
  name: 'PRO def files interact right',
  fn: DefFilesInteractRight,
});

INTERACTIONS_RUNNER.addTest({
  name: 'Disable problem reporting using comments (all)',
  fn: IDLDisableAllFromComments,
});

INTERACTIONS_RUNNER.addTest({
  name: 'Disable problem reporting using comments (by line)',
  fn: IDLDisableLinesFromComments,
});

INTERACTIONS_RUNNER.addTest({
  name: 'Disable problem reporting from root setting',
  fn: IDLDisableAllFromSettings,
  critical: true,
});

INTERACTIONS_RUNNER.addTest({
  name: 'Disable problem reporting from root setting (notebooks)',
  fn: IDLDisableAllFromSettingsForNotebook,
  critical: true,
});

INTERACTIONS_RUNNER.addTest({
  name: 'Disable problem reporting from individual setting',
  fn: IDLDisableIndividualsFromSettings,
  critical: true,
});

INTERACTIONS_RUNNER.addTest({
  name: 'Disable problem reporting from individual setting (notebooks)',
  fn: IDLDisableIndividualsFromSettingsForNotebook,
  critical: true,
});

INTERACTIONS_RUNNER.addTest({
  name: 'Code actions for none existing',
  fn: ProCodeCodeActionsNoExisting,
});

INTERACTIONS_RUNNER.addTest({
  name: 'Code actions for existing',
  fn: ProCodeCodeActionsExisting,
});

INTERACTIONS_RUNNER.addTest({
  name: 'Code actions for notebook cell',
  fn: ProCodeCodeActionsExisting,
});

INTERACTIONS_RUNNER.addTest({
  name: 'Execute code actions for PRO code',
  fn: ExecuteCodeActionsWithEditForPROFile,
});

INTERACTIONS_RUNNER.addTest({
  name: 'Execute code actions for notebook',
  fn: ExecuteCodeActionsWithEditForNotebook,
});

INTERACTIONS_RUNNER.addTest({
  name: 'Notebooks interact right',
  fn: NotebooksInteractRight,
});

INTERACTIONS_RUNNER.addTest({
  name: 'No duplicate routine definition problems',
  fn: NotebooksNoDuplicateRoutines,
});

INTERACTIONS_RUNNER.addTest({
  name: 'Verify notebook auto-complete passes basic tests',
  fn: NotebookCompletionBasic,
  critical: true,
});

// notebook problems track right
INTERACTIONS_RUNNER.addTest({
  name: 'Notebook problems track right',
  fn: NotebookProblemsTrackRight,
});

INTERACTIONS_RUNNER.addTest({
  name: 'Notebooks report problems right for implied print and standalone expressions',
  fn: NotebookImpliedPrintProblemReporting,
});

INTERACTIONS_RUNNER.addTest({
  name: 'Detect duplicate globals from two PRO files',
  fn: DuplicateGlobals,
});

INTERACTIONS_RUNNER.addTest({
  name: 'Detect duplicate globals from PRO and def files',
  fn: DuplicateGlobalsFromDefs,
});

INTERACTIONS_RUNNER.addTest({
  name: 'Detect duplicate globals from only def files',
  fn: DuplicateGlobalsFromOnlyDefs,
});
