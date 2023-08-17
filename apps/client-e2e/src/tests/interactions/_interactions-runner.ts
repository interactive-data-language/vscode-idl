import { Logger } from '@idl/logger';

import { Runner } from '../runner.class';
import { AddDocs } from './add-docs';
import { IDLJSONInteractRight } from './idl-json-interact-right';
import { IndexIDLFolderRightAndOpenEditClose } from './index-idl-folder-right-and-open-edit-close';
import { NotebookCompletionBasic } from './notebooks-completion-basic';
import { NotebooksInteractRight } from './notebooks-interact-right';
import { NotebooksNoDuplicates } from './notebooks-no-duplicates';
import { ProCodeInteractRight } from './pro-code-interacts-right';
import { TasksInteractRight } from './tasks-interact-right';

/*
 * Logger to be used for tests related to debugging
 */
export const INTERACTIONS_TEST_LOGGER = new Logger(
  'tests-interaction',
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
  name: 'Notebooks interact right',
  fn: NotebooksInteractRight,
});

INTERACTIONS_RUNNER.addTest({
  name: 'Notebook problems track right',
  fn: NotebooksNoDuplicates,
});

INTERACTIONS_RUNNER.addTest({
  name: 'Verify notebook auto-complete passes basic tests',
  fn: NotebookCompletionBasic,
  critical: true,
});
