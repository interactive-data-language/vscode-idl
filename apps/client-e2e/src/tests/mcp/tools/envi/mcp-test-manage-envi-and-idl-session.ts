import { CleanIDLOutput } from '@idl/idl/idl-interaction-manager';
import { Sleep } from '@idl/shared/extension';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { DEBUG_PAUSE } from '../../../debugging/_shared.interface';
import { RunnerFunction } from '../../../runner.interface';
import { CallMCPTool } from '../../helpers/call-mcp-tool';

/**
 * Makes sure we can manage our session
 */
export const RunMCPManageENVIAndIDLSession: RunnerFunction = async (init) => {
  // make sure IDL is started
  expect(
    (await CallMCPTool(MCP_TOOL_LOOKUP.START_IDL, {})).isError
  ).toBeFalsy();

  // make sure launched
  expect(init.debug.adapter.isStarted()).toBeTruthy();

  /**
   * =========================================================
   * Restart IDL
   * =========================================================
   */
  expect(
    (
      await CallMCPTool(MCP_TOOL_LOOKUP.MANAGE_ENVI_AND_IDL_SESSION, {
        action: 'restart-idl',
      })
    ).isError
  ).toBeFalsy();

  // make sure launched
  expect(init.debug.adapter.isStarted()).toBeTruthy();

  /**
   * =========================================================
   * Restart ENVI with headless
   * =========================================================
   */

  expect(
    (
      await CallMCPTool(MCP_TOOL_LOOKUP.MANAGE_ENVI_AND_IDL_SESSION, {
        action: 'restart-envi-headless',
      })
    ).isError
  ).toBeFalsy();

  // make sure launched
  expect(init.debug.adapter.isStarted()).toBeTruthy();

  // make sure that the ENVI UI is not started
  expect(
    CleanIDLOutput(await init.debug.adapter.evaluate(`print, envi.widget_id`))
  ).toEqual('0');

  // pause while stopping
  await Sleep(DEBUG_PAUSE);

  /**
   * =========================================================
   * Restart ENVI with UI
   * =========================================================
   */

  expect(
    (
      await CallMCPTool(MCP_TOOL_LOOKUP.MANAGE_ENVI_AND_IDL_SESSION, {
        action: 'restart-envi-ui',
      })
    ).isError
  ).toBeFalsy();

  // verify we started
  expect(init.debug.adapter.isStarted()).toBeTruthy();

  // make sure that the ENVI UI is not started
  expect(
    CleanIDLOutput(await init.debug.adapter.evaluate(`print, envi.widget_id`))
  ).not.toEqual('0');

  /**
   * =========================================================
   * Stop works OK
   * =========================================================
   */

  expect(
    (
      await CallMCPTool(MCP_TOOL_LOOKUP.MANAGE_ENVI_AND_IDL_SESSION, {
        action: 'stop',
      })
    ).isError
  ).toBeFalsy();

  // pause while stopping
  await Sleep(DEBUG_PAUSE);

  // verify we started
  expect(init.debug.adapter.isStarted()).toBeFalsy();
};
