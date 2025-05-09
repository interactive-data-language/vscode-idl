import { MCP_SERVER } from '@idl/mcp/server';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';

/**
 * Registers infomration about server resources for how to write IDL code
 */
export function RegisterResourceIDLOperators(
  messenger: VSCodeLanguageServerMessenger
) {
  MCP_SERVER.resource(
    'docs-idl-operators',
    'docs://idl-operators',
    {
      description:
        'Information about writing IDL code and what operators should be used in your code',
    },
    async (uri) => {
      return {
        contents: [
          {
            uri: uri.href,
            text: 'IDL has special operators that differ from traditional languages. For greater than, you\'ll use the "ge" symbol instead of >.',
          },
        ],
      };
    }
  );
}
