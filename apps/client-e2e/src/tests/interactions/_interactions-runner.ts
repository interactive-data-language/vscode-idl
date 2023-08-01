import { Logger } from '@idl/logger';

import { Runner } from '../runner.class';
import { AddDocs } from './add-docs';
import { IndexIDLFolderRightAndOpenEditClose } from './index-idl-folder-right-and-open-edit-close';

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
