import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../../runner.interface';
import { CallMCPTool } from '../../helpers/call-mcp-tool';
import { GetTextContent } from '../../helpers/get-text-content';

/**
 * Makes sure we can list and request resources as expected
 */
export const RunMCPTestResourcesWorkflow: RunnerFunction = async (init) => {
  // Call a tool
  const listResources = await CallMCPTool(
    MCP_TOOL_LOOKUP.LIST_ALL_RESOURCES,
    {},
  );

  // make sure the tool runs
  expect(listResources.isError).toBeFalsy();

  // verify we get one block of content back
  expect(listResources.content.length).toEqual(1);

  // init variable
  let parsedResourceNames: string[];

  // attempt to parse
  try {
    parsedResourceNames = JSON.parse(GetTextContent(listResources.content));
  } catch (err) {
    // do nothing
  }

  // make sure we parsed
  expect(parsedResourceNames).toBeTruthy();

  // return if we fail
  if (!parsedResourceNames) {
    return;
  }

  // make sure we parsed
  expect(parsedResourceNames.length > 0).toBeTruthy();

  // retrieve resources
  const getResource = await CallMCPTool(MCP_TOOL_LOOKUP.GET_RESOURCE, {
    names: [parsedResourceNames[0]],
  });

  // make sure the tool runs
  expect(getResource.isError).toBeFalsy();

  // verify we get one block of content back
  expect(getResource.content.length).toEqual(1);

  // init variable
  let parsedResources: { [key: string]: any };

  // attempt to parse
  try {
    parsedResources = JSON.parse(GetTextContent(getResource.content));
  } catch (err) {
    // do nothing
  }

  // make sure we parsed
  expect(parsedResources).toBeTruthy();

  // return if we fail
  if (!parsedResources) {
    return;
  }
};
