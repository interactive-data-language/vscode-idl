export const QUERY_IDL_SESSION_DESCRIPTION = `
Runs an IDL command in the running IDL session and returns its output.

Unlike run-idl-code, this tool does NOT echo output to the user's debug console. Use this when you need to inspect IDL state (variables, system info, help output, etc.) without cluttering the user's terminal.

The command runs in the same IDL process and session — all variables, compiled routines, and state are accessible.

Examples of good uses:
- Querying variable values: "print, myVar"
- Checking system state: "help, /brief"
- Getting information: "print, !version"
- Inspecting data: "help, myArray"`;
