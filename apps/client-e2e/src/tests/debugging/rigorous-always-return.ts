import { CleanIDLOutput } from '@idl/idl';
import { IDL_COMMANDS } from '@idl/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';

/** Allowed max time to wait for command to return, milliseconds */
const TIMEOUT = 50;

/** Number of times we run our test */
const ITERATIONS = 100;

/**
 * Verify we always return from running commands.
 *
 * Stress tests the debugger and hopefully catches any edge cases where we
 * take too long or dont respond
 */
export const RigorousAlwaysReturn: RunnerFunction = async (init) => {
  /**
   * Start IDL
   */
  const started = await vscode.commands.executeCommand(
    IDL_COMMANDS.DEBUG.START
  );

  // verify we started
  expect(started).toBeTruthy();

  // run many tests
  for (let i = 0; i < ITERATIONS; i++) {
    // verify we are still launched
    expect(init.debug.adapter.isStarted()).toBeTruthy();

    // execute command
    const prom = init.debug.adapter.evaluate(`print, 'Hello world ${i}'`, {
      echo: true,
    });

    // error callback from this scope
    const errCb = () => {
      throw new Error(`Did not return fast enough. Filed on iteration: ${i}`);
    };

    // create timeout
    const timeout = setTimeout(errCb, TIMEOUT);

    // wait to return
    const res = await prom;

    // clear timeout
    clearTimeout(timeout);

    // verify we get the right output
    expect(CleanIDLOutput(res)).toEqual(`Hello world ${i}`);
  }

  // fake test to indicate we finished
  expect(true).toBeTruthy();
};
