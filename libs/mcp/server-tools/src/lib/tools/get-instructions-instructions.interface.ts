import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';

export const GET_INSTRUCTIONS_INSTRUCTIONS = `
To request instruction sets, follow these steps:

1. ${MCP_TOOL_LOOKUP.LIST_INSTRUCTIONS} - To evaluate if a user requests meets the qualifications to use an isntruction set or not.

2. ${MCP_TOOL_LOOKUP.GET_INSTRUCTIONS} - Use the descriptive name returned from step one to retrieve the instructions.
`;
