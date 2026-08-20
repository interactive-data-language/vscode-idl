import { CancellationToken } from '@idl/cancellation-tokens';
import { MCPServer } from '@idl/mcp/server';
import { ValidateIDLCode } from '@idl/mcp/shared';
import { Parser } from '@idl/parser';
import { TreeRecurserBasic } from '@idl/parsing/syntax-tree';
import { TOKEN_NAMES, TokenName } from '@idl/tokenizer';
import { IDL_TRANSLATION } from '@idl/translation';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import { z } from 'zod';

import { QUERY_IDL_SESSION_DESCRIPTION } from './register-mcp-tool-query-idl-session.interface';

const DISALLOWED_TOKENS: Partial<Record<TokenName, string>> = {};
DISALLOWED_TOKENS[TOKEN_NAMES.LINE_SEPARATION] =
  'Only a single IDL command can be executed at a time. Ampersand detection which is a multi-line statement';
DISALLOWED_TOKENS[TOKEN_NAMES.LINE_SEPARATION_BASIC] =
  DISALLOWED_TOKENS[TOKEN_NAMES.LINE_SEPARATION];

/**
 * Verifies that we have a single command and does some sanity checks
 * for security about what routines execute
 */
async function ValidateCommand(server: MCPServer, command: string) {
  /** Make a cancellation token */
  const cancel = new CancellationToken();

  /** Parse */
  const parsed = Parser(command, cancel);

  TOKEN_NAMES.ARG_DEFINITION;

  let valid = true;

  /** Message if we have an error */
  let reason: string | undefined;

  /**
   * Recurse through the code and do some sanity checks
   */
  TreeRecurserBasic(parsed.tree, cancel, {
    onBasicToken: (token) => {
      if (token.name in DISALLOWED_TOKENS) {
        valid = false;
        reason = DISALLOWED_TOKENS[token.name];
        return true;
      }
    },
    onBranchToken: (token) => {
      if (token.name in DISALLOWED_TOKENS) {
        valid = false;
        reason = DISALLOWED_TOKENS[token.name];
        return true;
      }
    },
  });

  return { valid, reason };
}

/**
 * Registers a tool that queries the IDL session silently
 */
export function RegisterMCPTool_QueryIDLSession(server: MCPServer) {
  server.registerTool(
    MCP_TOOL_LOOKUP.QUERY_IDL_SESSION,
    {
      title:
        IDL_TRANSLATION.mcp.tools.displayNames[
          MCP_TOOL_LOOKUP.QUERY_IDL_SESSION
        ],
      description: QUERY_IDL_SESSION_DESCRIPTION,
      inputSchema: {
        command: z
          .string()
          .describe(
            'The IDL command to evaluate silently. Output is captured and returned but not shown in the user debug console.',
          ),
      },
    },
    async (id, { command }) => {
      /**
       * Validate the command
       */
      const valid = ValidateIDLCode(command);
      if (!valid.valid) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: valid.reason || 'Command does not pass security checks',
            },
          ],
        };
      }

      const resp = await server.sendIDLRequest(
        id,
        MCP_TOOL_LOOKUP.QUERY_IDL_SESSION,
        { command },
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
    },
  );
}
