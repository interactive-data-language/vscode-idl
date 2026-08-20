import { MCPTools } from '@idl/types/mcp';

import { ValsOfToStrings } from '../../translation.interface';

/**
 * Constant with MCP tool names
 *
 * Separate so easier for LLM to edit
 */
export const MCPToolNames_EN: ValsOfToStrings<MCPTools> = {
  'create-envi-modeler-workflow': 'Create ENVI Modeler Workflow',
  'create-idl-notebook': 'Create IDL Notebook',
  'control-idl-and-envi-session': 'Control IDL and ENVI Session',
  'control-idl-debugger': 'Control IDL Debugger',
  'get-envi-tool-parameters': 'Get ENVI Tool Parameters',
  'get-envi-tool-workflow': 'Get ENVI Tool Workflow',
  'get-idl-state': 'Get IDL State',
  'get-prompt': 'Get Prompt',
  'get-resource': 'Get Resource',
  'get-routine-docs': 'Get Routine Docs',
  'list-all-resources': 'List All Resources',
  'list-envi-tool-workflows': 'List ENVI Tool Workflows',
  'list-envi-tools': 'List ENVI Tools',
  'open-datasets-in-envi': 'Open Datasets in ENVI',
  'query-dataset-with-envi': 'Query Dataset with ENVI',
  'query-idl-session': 'Query IDL Session',
  'return-notes': 'Return Notes',
  'run-envi-tool': 'Run ENVI Tool',
  'run-idl-code': 'Run IDL Code',
  'run-idl-file': 'Run IDL File',
  'save-envi-tool-workflow': 'Save ENVI Tool Workflow',
  'search-for-files': 'Search for Files',
  'search-for-routine': 'Search for Routine',
  'list-prompts': 'List Prompts',
  'search-resources': 'Search Resources',
  'take-envi-screenshot': 'Take ENVI Screenshot',
};
