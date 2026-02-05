---
agent: 'agent'
description: 'Create a boilerplate new MCP tool that sets up the right inputs and outputs'
---

Your goal is to create the boilerplate code for a new MCP tool in this code base.

## Getting Started

1. Get the name of the tool

2. Ask if the MCP tool will invoke ENVI or IDL and follow the relevant steps below

### Steps for ENVI and IDL

3. Create the type definitions:

For a tool named "My MCP Tool" we will create a new file in "libs\types\mcp\src\lib\vscode" that should be named "mcp-tool-my-mcp-tool.interface.ts" 

Initialize the file with this content (replace names with tool names):

```typescript
import { IMCPToolVSCode_BaseResponse } from '../mcp-base-response.interface';

/**
 * My MCP Tool
 */
export type MCPTool_MyMCPTool = 'my-mcp-tool';

/**
 * Parameters for My MCP Tool
 * 
 * @TODO
 */
export interface MCPToolParams_MyMCPTool {
}

/**
 * Response for My MCP Tool
 * 
 * @TODO
 */
export interface MCPToolResponse_MyMCPTool
  extends IMCPToolVSCode_BaseResponse {
  /** Output from IDL */
  idlOutput?: string;
}
```

Add the new type to the export in "libs\types\mcp\src\index.ts"

4. Update the union types and union parameter types in "libs\types\mcp\src\lib\mcp-tools-vscode.interface.ts" (make changes alphabetically)

Add type type from step 3 to the union type "MCPTools_VSCode"

Add a new conditional type to MCPToolParams_VSCode with the input parameters from step 3.

Add a new conditional type to MCPToolResponse_VSCode with the output parameters from step 3.

### Steps for No ENVI and IDL

For a tool named "My MCP Tool" we will create a new file, the file should be named "mcp-tool-my-mcp-tool.interface.ts" 

For a tool named "My MCP Tool" we will create a new file in "libs\types\mcp\src\lib\http" that should be named "mcp-tool-my-mcp-tool.interface.ts" 

Initialize the file with this content (replace names with tool names):

```typescript
/**
 * My MCP Tool
 */
export type MCPTool_MyMCPTool = 'my-mcp-tool';

/**
 * Parameters for My MCP Tool
 * 
 * @TODO
 */
export interface MCPToolParams_MyMCPTool {
}
```

Add the new type to the export in "libs\types\mcp\src\index.ts"

4. Update the union types and union parameter types in "libs\types\mcp\src\lib\mcp-tools-http.interface.ts" (make changes alphabetically)

Add type type from step 3 to the union type "MCPTools_HTTP"

Add a new conditional type to MCPToolParams_HTTP with the input parameters from step 3.

## Updating Lookup Constant

5. Following the pattern used for the key-value pair names, add a new entry to the interface IMCPToolLookup in "libs\types\mcp\src\lib\mcp-tools.interface.ts"

Also add the entry to the exported constant "MCP_TOOL_LOOKUP"

## Updating Translations

6. Add a new translation for the tool in "libs\translation\src\lib\languages\mcp-tool-names.interface.en.ts"

This should be the name asked for originally or you can follow the pattern of the other tool names

## Create Tool for the MCP Server

7. Create a boilerplate tool that follows the pattern "register-mcp-tool-my-mcp-tool.ts" (Ex: the MCP tool in this case is called "My MCP Tool")

The location of this tool depends on a few things:

- If the tool uses ENVI, create it in "libs\mcp\server-tools\src\lib\tools\envi"

- If the tool uses IDL, create it in "libs\mcp\server-tools\src\lib\tools\idl"

- If the tool requires the IDL for VSCode Language Server (ask the user if you don't know), create it in "libs\mcp\language-server\src\lib"

- If none of the above are true, create the file in "libs\mcp\server-tools\src\lib\tools"

8. Populate the file with a boilerplate MCP tool

### For an ENVI and IDL MCP Tool

```typescript
import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCP_TOOL_LOOKUP,
  MCPTool_MyMCPTool,
  MCPToolParams,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import { MCPToolRegistry } from '../../mcp-tool-registry.class';

/**
 * Registers My MCP Tool
 */
export function RegisterMCPTool_MyMCPTool(
  messenger: VSCodeLanguageServerMessenger
) {
  MCPToolRegistry.registerTool(
    MCP_TOOL_LOOKUP.MY_MCP_TOOL,
    {
      title: IDL_TRANSLATION.mcp.tools.displayNames[MCP_TOOL_LOOKUP.MY_MCP_TOOL],
      description:
        "Description of My MCP Tool",
      inputSchema: {
        myflag: z.boolean().describe('Boilerplate input parameter')
      },
    },
    async (id) => {
      // strictly typed parameters
      const params: MCPToolParams<MCPTool_MyMCPTool> = {
        myflag
      };

      const resp = await messenger.sendRequest(
        LANGUAGE_SERVER_MESSAGE_LOOKUP.MCP,
        {
          id,
          tool: MCP_TOOL_LOOKUP.MY_MCP_TOOL,
          params,
        }
      );

      return {
        isError: !resp.success,
        content: [
          {
            type: 'text',
            text: JSON.stringify(resp),
          },
        ],
      };
    }
  );
}
```

### For an MCP Tool that Doesn't use ENVI or IDL

```typescript
import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCP_TOOL_LOOKUP,
  MCPTool_MyMCPTool,
  MCPToolParams,
} from '@idl/types/mcp';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';
import { z } from 'zod';

import { MCPToolRegistry } from '../../mcp-tool-registry.class';

/**
 * Registers My MCP Tool
 */
export function RegisterMCPTool_MyMCPTool(
  messenger: VSCodeLanguageServerMessenger
) {
  MCPToolRegistry.registerTool(
    MCP_TOOL_LOOKUP.MY_MCP_TOOL,
    {
      title: IDL_TRANSLATION.mcp.tools.displayNames[MCP_TOOL_LOOKUP.MY_MCP_TOOL],
      description:
        "Description of My MCP Tool",
      inputSchema: {
        myflag: z.boolean().describe('Boilerplate input parameter')
      },
    },
    async (id) => {

      return {
        isError: !resp.success,
        content: [
          {
            type: 'text',
            text: 'Hellp world!',
          },
        ],
      };
    }
  );
}
```

## Adding a tool runner for tools that need ENVI or IDL

Only follow this section if the MCP tool uses ENVI or IDL.

9. Create the boilerplate tool runner following the pattern "run-mcp-tool-my-mcp-tool.ts" (for a tool named "My MCP Tool")

If an ENVI tool, add it to: "libs\vscode\mcp\src\lib\tools\envi"

If an IDL tool, add it to: "libs\vscode\mcp\src\lib\tools\idl"

10. Populate a boilerplate with this text:

```typescript
import { IDL_TRANSLATION } from '@idl/translation';
import {
  MCPTool_MyMCPTool,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { StartIDL } from '@idl/vscode/debug';

import { MCPEvaluateENVICommand } from '../../helpers/mcp-evaluate-envi-command';
import { MCPVerifyIDLVersion } from '../../helpers/mcp-verify-idl-version';
import { VSCodeSendMCPNotification } from '../../helpers/vscode-send-mcp-notification';
import { MCPSerializeJSON } from '../../helpers/mcp-serialize-json';

/**
 * Run IDL/ENVI for MyMCPTool
 */
export async function RunMCPTool_MyMCPTool(
  id: string,
  params: MCPToolParams<MCPTool_MyMCPTool>
): Promise<MCPToolResponse<MCPTool_MyMCPTool>> {
  /**
   * Start IDL
   */
  const started = await StartIDL(false);

  // return if unable to start IDL
  if (!started.started) {
    return { success: false, err: started.reason };
  }

  // verify version
  if (!MCPVerifyIDLVersion()) {
    return {
      success: false,
      err: IDL_TRANSLATION.mcp.errors.badIDLVersion,
    };
  }

  VSCodeSendMCPNotification(id, { message: 'Running command' });

  /**
   * @TODO add logic
   */

  // start ENVI/make sure it is started
  const start = await MCPEvaluateENVICommand(`print, '${MCPSerializeJSON(params)}'`);

  return {
    success: start.succeeded,
    err: start.error,
    idlOutput: start.idlOutput,
  };
}
```

11. Update the MCP tool callback lookup in "libs\vscode\mcp\src\lib\run-mcp-tool-message-handler.ts"

Add new extry to the variable "MCP_TOOL_LOOKUP"