export const QUERY_IDL_SESSION_DESCRIPTION = `
This tool runs one or more single-line IDL statements and returns the output for all commands.

Use this when you need to inspect IDL (variables, system info, help output, etc.) without cluttering the user's terminal.

Unlike "run-idl-code", this tool runs at the current scope for the IDL process and can be used to get information about what is local.

Examples of good uses:
- Querying variable values: "print, myVar"
- Checking system state: "help, /brief"
- Getting information: "print, !version"
- Inspecting data: "help, myArray"

Multiple commands (separated with new line character):
- "help, /brief\nprint, !version
- "help, myVar\nprint, myVar

What is not allowed:
- Commands separated with "&" (use new-line instead)
- Use of IDL's spawn command 
- Routines that manipulate the file system
- Loading/linking 3rd party libraries
- Use of IDL's "execute()" function`;
