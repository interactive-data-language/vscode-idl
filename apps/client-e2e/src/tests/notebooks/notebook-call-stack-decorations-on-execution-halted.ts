import { GetExtensionPath } from '@idl/shared';
import { IStackTraceLookup } from '@idl/vscode/decorations';
import { OpenNotebookInVSCode } from '@idl/vscode/shared';

import { RunnerFunction } from '../runner.interface';
import { RunNotebookAndCheckCallStackDecorations } from './helpers/run-notebook-and-check-call-stack-decorations';

/**
 * Function that verifies decorations do the right things for notebooks
 */
export const NotebookCallStackDecorationsOnExecutionHalted1: RunnerFunction =
  async (init) => {
    const nbFile = GetExtensionPath(
      'idl/test/client-e2e/notebooks/decorations/on-execution-halted.1.idlnb'
    );

    // open our notebook
    const nb = await OpenNotebookInVSCode(nbFile, true);

    const stack: IStackTraceLookup = {};
    stack[nb.getCells()[0].document.uri.toString()] = [0];

    // make sure the call stack is correct
    await RunNotebookAndCheckCallStackDecorations(
      nbFile,
      stack,
      init.notebooks.controller,
      init.decorations
    );
  };
