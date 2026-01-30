import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';

export const ENVI_TOOL_WORKFLOW_INSTRUCTIONS = `
To request details on ENVI Tool Workflows, follow these instructions:

1. ${MCP_TOOL_LOOKUP.LIST_ENVI_TOOL_WORKFLOWS} - Use this to get descritive names of ENVI Tool Workflows.

2. ${MCP_TOOL_LOOKUP.GET_ENVI_TOOL_WORKFLOW} - Use the descriptive name returned from step one to retrieve the text for the ENVI Tool Workflow.
`;
