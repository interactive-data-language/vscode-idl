import { MCP_SERVER } from '@idl/mcp/server';
import { VSCodeLanguageServerMessenger } from '@idl/vscode/events/server';

const OPERATOR_TEXT = `
IDL has a few operators that differ from other programming languages. Here's the difference highlights:

- Logical operators (like "===" in typescript), use the words from the operators below. 
  For example: The "equal to" operation in IDL uses "eq" and not "=="
  For example: The less than operator uses "lt" and not "<"
  For example: The less than or equal to operator uses "le" and not "<="
  For example: The greater than operator uses "gt" and not ">"
  For example: The greater than or equal to operator uses "ge" and not ">="
- Logical negation (i.e. "not true") uses the tilde (~) and not exclamation point like many other languages


And here's a table with the operators, what they are used for, which is sorted by operation priority in IDL.


|   Priority   | Operator | Description |
| ------------ | -------- | ----------- |
| Highest      | ()       | Parentheses for grouping |
|              | []       | Brackets for concatenating arrays |
| ---          | ()       | Parentheses in a function call |
|              | []       | Brackets for subscripting arrays |
|              | {}       | Braces for structure creation |
| ---          | . | Structure field |
|              | *       | Pointer dereference |
|              | -> or . | Method invocation |
|              | ++       | Increment |
|              | --       | Decrement |
|              | ^        | Exponentation |
| ---          | #, ##    | Matrix multiplication |
|              | *        | Multiplication |
|              | /        | Division |
|              | mod      | Modulo |
| ---          | +        | Addition/string joining |
|              | -        | Subtraction/unary negation |
|              | <        | Minimum of |
|              | >        | Maximum of |
|              | ~        | Logical negation |
|              | not      | Bitwise complement |
| ---          | eq       | Equal to |
|              | ne       | Not equal to |
|              | le       | Less than or equal to |
|              | lt       | Less than |
|              | ge       | Greater than or equal to |
|              | gt       | Greater than |
| ---          | and      | Bitwise and |
|              | or       | Bitwise or |
|              | xor      | Bitwise exclusive or |
| ---          | &&       | Logical and |
|              | ||       | Logical or |
| ---          | ?:       | Conditional expression |
| Lowest       | =        | Assignment |
`;

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
        'Information about how to use IDL operators when writing IDL code',
    },
    async (uri) => {
      return {
        contents: [
          {
            uri: uri.href,
            text: OPERATOR_TEXT,
          },
        ],
      };
    }
  );
}
