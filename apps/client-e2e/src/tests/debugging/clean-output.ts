import { CleanIDLOutput } from '@idl/idl';
import { IDL_COMMANDS, Sleep } from '@idl/shared';
import expect from 'expect';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';

/**
 * Example IDL statements that we should remove
 */
const STATEMENTS: string[] = [
  `% Restored file: HASH::INIT`,
  `% Compiled module: IMAGE::QUERYPROPERTY.`,
  `% Compiled module: SURFACE::QUERYPROPERTY.`,
  `% Compiled module: SCATTERPLOT::QUERYPROPERTY.`,
  `% Compiled module: SCATTERPLOT3D::QUERYPROPERTY.`,
  `% Compiled module: CONTOUR::QUERYPROPERTY.`,
  `% Compiled module: TEXT::QUERYPROPERTY.`,
  `% Compiled module: FILLPLOT::QUERYPROPERTY.`,
  `% Compiled module: POLYGON::QUERYPROPERTY.`,
  `% Compiled module: POLYLINE::QUERYPROPERTY.`,
  `% Compiled module: ARROW::QUERYPROPERTY.`,
  `% Compiled module: ELLIPSE::QUERYPROPERTY.`,
  `% Compiled module: MAPGRID::QUERYPROPERTY.`,
  `% Compiled module: VECTOR::QUERYPROPERTY.`,
  `% Compiled module: STREAMLINE::QUERYPROPERTY.`,
  `% Compiled module: MAPGRIDLINE::QUERYPROPERTY.`,
  `% Compiled module: CROSSHAIR::QUERYPROPERTY.`,
  `% Compiled module: VOLUME::QUERYPROPERTY.`,
  `% Compiled module: TEXT::GETTEXTDIMENSIONS.`,
  `% Compiled module: GRAPHIC__DEFINE.`,
];

/**
 * Function that verifies we can clean the output from IDL when we
 * have compiled and restore statements
 */
export const CleanOutput: RunnerFunction = async (init) => {
  /**
   * Start IDL
   */
  const started = await vscode.commands.executeCommand(
    IDL_COMMANDS.DEBUG.START
  );

  // verify we started
  expect(started).toBeTruthy();

  // short pause
  await Sleep(100);

  /**
   * Evaluate something and get result
   */
  const res = CleanIDLOutput(
    await init.debug.adapter.evaluate(
      `print, '${STATEMENTS.join(`' & print, '`)}'`,
      { echo: true }
    )
  );

  // verify we get the right output
  expect(res).toEqual('');
};
