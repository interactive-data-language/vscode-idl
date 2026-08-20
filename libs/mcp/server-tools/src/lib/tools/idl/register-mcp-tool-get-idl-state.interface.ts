export const GET_IDL_STATE_DESCRIPTION = `
Read-only inspection of the running IDL session. Returns structured state; never mutates the debugger or echoes to the user's console.

Actions:
- "get-info": Orientation snapshot — current scope, call stack, variables at current scope, general session info. Use to get situated before drilling in.
- "get-variables": Variables at a scope. Optional "frameId" param; defaults to current frame.
- "get-stack": Current call stack (traceback).
- "get-output": Raw captured output from the IDL process.
- "get-errors": Syntax errors tracked by file.
- "get-coverage": Code coverage for a file. Requires "file" param.`;
