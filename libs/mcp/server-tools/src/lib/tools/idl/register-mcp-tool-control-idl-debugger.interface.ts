export const CONTROL_IDL_DEBUGGER_DESCRIPTION = `
Controls the IDL debugger session — set/clear breakpoints and step through code.

Actions:
- "set-breakpoint": Set a breakpoint at a specific file and line. Requires "file" and "line" params.
- "clear-breakpoint": Remove a breakpoint at a specific file and line. Requires "file" and "line" params.
- "clear-all-breakpoints": Remove all breakpoints.
- "list-breakpoints": List all currently set breakpoints.
- "continue": Resume execution after stopping at a breakpoint.
- "step-in": Step into the next routine call.
- "step-over": Step over the current line (execute without entering subroutines).
- "step-out": Step out of the current routine back to the caller.

Note: Breakpoints in named routines (pro/function) persist across recompilation. Breakpoints in main-level programs ($MAIN$) are cleared when the program is recompiled.`;
