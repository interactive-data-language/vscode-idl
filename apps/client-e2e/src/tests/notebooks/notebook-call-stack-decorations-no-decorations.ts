import { GetExtensionPath } from '@idl/shared';

import { RunnerFunction } from '../runner.interface';
import { RunNotebookAndCheckCallStackDecorations } from './helpers/run-notebook-and-check-call-stack-decorations';

/**
 * Function that verifies decorations do the right things for notebooks
 */
export const NotebookCallStackDecorationsNoDecorations: RunnerFunction = async (
  init
) => {
  // make sure the call stack is correct
  await RunNotebookAndCheckCallStackDecorations(
    GetExtensionPath(
      'idl/test/client-e2e/notebooks/decorations/no-decorations.1.idlnb'
    ),
    {},
    init.notebooks.controller,
    init.decorations
  );

  // make sure the call stack is correct
  await RunNotebookAndCheckCallStackDecorations(
    GetExtensionPath(
      'idl/test/client-e2e/notebooks/decorations/no-decorations.2.idlnb'
    ),
    {},
    init.notebooks.controller,
    init.decorations
  );

  // make sure the call stack is correct
  await RunNotebookAndCheckCallStackDecorations(
    GetExtensionPath(
      'idl/test/client-e2e/notebooks/decorations/no-decorations.3.idlnb'
    ),
    {},
    init.notebooks.controller,
    init.decorations
  );

  // make sure the call stack is correct
  await RunNotebookAndCheckCallStackDecorations(
    GetExtensionPath(
      'idl/test/client-e2e/notebooks/decorations/no-decorations.4.idlnb'
    ),
    {},
    init.notebooks.controller,
    init.decorations
  );
};
