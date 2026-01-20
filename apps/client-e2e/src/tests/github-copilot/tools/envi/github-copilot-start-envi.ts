import { CleanIDLOutput } from '@idl/idl/idl-interaction-manager';
import { Sleep } from '@idl/shared/extension';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { DEBUG_PAUSE } from '../../../debugging/_shared.interface';
import { RunnerFunction } from '../../../runner.interface';
import { CallMCPTool } from '../../helpers/call-mcp-tool';

/**
 * Makes sure we can start ENVI through MCP
 *
 * Headless execution of
 */
export const RunGitHubCopilotStartENVI: RunnerFunction = async (init) => {
  // Call a tool
  const resultHeadless = await CallMCPTool(MCP_TOOL_LOOKUP.ENVI_START, {
    headless: true,
  });

  // make sure the tool runs
  expect(resultHeadless.isError).toBeFalsy();

  // verify we started
  expect(init.debug.adapter.isStarted()).toBeTruthy();

  const res = CleanIDLOutput(
    await init.debug.adapter.evaluate(`print, envi.widget_id`)
  );

  console.log(res);

  // make sure that the ENVI UI is not started
  expect(
    CleanIDLOutput(await init.debug.adapter.evaluate(`print, envi.widget_id`))
  ).toEqual('0');

  // pause while stopping
  await Sleep(DEBUG_PAUSE);

  // stop
  init.debug.adapter.terminate();

  // pause while stopping
  await Sleep(DEBUG_PAUSE);

  // make sure we have stopped
  expect(init.debug.adapter.isStarted()).toBeFalsy();

  // start ENVI with the UI
  const resultUI = await CallMCPTool(MCP_TOOL_LOOKUP.ENVI_START, {
    headless: false,
  });

  // make sure the tool runs
  expect(resultUI.isError).toBeFalsy();

  // verify we started
  expect(init.debug.adapter.isStarted()).toBeTruthy();

  // make sure that the ENVI UI is not started
  expect(
    CleanIDLOutput(await init.debug.adapter.evaluate(`print, envi.widget_id`))
  ).not.toEqual('0');
};
