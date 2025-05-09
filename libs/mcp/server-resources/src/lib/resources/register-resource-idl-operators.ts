import { MCP_SERVER } from '@idl/mcp/server';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';

// operators
// no double backslashes in IDL unless you use backticks

/**
 * Registers infomration about server resources for how to write IDL code
 */
export function RegisterResourceIDLOperators(
  messenger: VSCodeLanguageServerMessenger
) {
  MCP_SERVER.resource(
    'docs-writing-idl-code',
    'docs://writing-idl-code',
    async (uri) => {
      console.log('Requested docs writing code');
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
