import { NO_MATCHES } from '@idl/mcp/language-server';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import expect from 'expect';

import { RunnerFunction } from '../../runner.interface';
import { CallMCPTool } from '../helpers/call-mcp-tool';

/**
 * Get docs for a specific routine
 */
export const RunGitHubCopilotGetRoutineDocs: RunnerFunction = async (init) => {
  // Call a tool
  const routineDocs = await CallMCPTool(
    MCP_TOOL_LOOKUP.RESOURCES_GET_ROUTINE_DOCS,
    {
      routines: [
        {
          name: 'httprequest',
          type: 'StructureOrClassDefinition',
        },
        {
          name: 'mcfoobers',
          type: 'StructureOrClassDefinition',
        },
      ],
    }
  );

  // make sure the tool runs
  expect(routineDocs.isError).toBeFalsy();

  // verify we get one block of content back
  expect(routineDocs.content.length).toBe(1);

  // init variable
  let docs: ({ [key: string]: any } | string)[];

  // attempt to parse
  try {
    docs = JSON.parse(routineDocs.content[0].text as string);
  } catch (err) {
    // do nothing
  }

  // make sure we parsed
  expect(docs).toBeTruthy();

  // verify one set of matches returned
  expect(docs.length).toBe(2);

  // make sure we have an object first
  expect(typeof docs[0]).toBe('object');

  // verify there are docs our structure definition (checks docs parsing and reporting properties)
  expect(typeof (docs[0] as any)?.docs).toBe('string');

  // verify second result
  expect(typeof docs[1]).toBe('string');
  expect(docs[1]).toBe(NO_MATCHES);
};
