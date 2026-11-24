# MCP: Agents Server

Standalone agents server

## Deferred MCP toolsets

Agent-server conversations initially expose only the `core` MCP tools and a
custom `load-toolset` tool. The configured Copilot built-ins and custom todo tools
remain available. This does not change the shared MCP endpoint or tool discovery
for external MCP clients.

| Toolset                                               | Tools                                                                                                                                                                                                                                                |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `core` (always available, subject to MCP tool policy) | `list-skills`, `get-skill`, `load-toolset`, `run-idl-code`, `get-idl-state`, `search-for-routine`, `get-routine-docs`, `control-idl-and-envi-session`, `search-for-files`, `create-folder`, `list-all-resources`, `search-resources`, `get-resource` |
| `dataset-inspection`                                  | `query-dataset-with-envi`                                                                                                                                                                                                                            |
| `envi-display`                                        | `open-datasets-in-envi`, `take-envi-screenshot`                                                                                                                                                                                                      |
| `envi-processing`                                     | `list-envi-tools`, `get-envi-tool-parameters`, `run-envi-tool`                                                                                                                                                                                       |
| `modeler`                                             | `create-envi-modeler-workflow`; also loads `envi-processing`                                                                                                                                                                                         |
| `workflow-recipes`                                    | `list-envi-tool-workflows`, `get-envi-tool-workflow`, `save-envi-tool-workflow`                                                                                                                                                                      |
| `idl-dev`                                             | `control-idl-debugger`, `query-idl-session`, `run-idl-file`, `create-idl-notebook`                                                                                                                                                                   |

Call `load-toolset` with, for example, `{"toolset":"dataset-inspection"}`.
The loader updates the conversation's Copilot SDK tool allow-list before
returning, making the new schemas available on the next model request, including
within the current turn. Tools stay loaded for that conversation; repeated loads
are harmless. Successful loads are restored from the SDK event history when a
conversation resumes after eviction or a server restart.

The MCP server may still be queried for its full tool catalogue by the SDK.
Deferral controls which schemas are sent to the model, not server-side
registration or connection setup. Existing MCP whitelists and blacklists still
apply: the loader reports excluded tools and fails if a requested group or a
dependency has no permitted tools. Loading a group neither executes its tools nor
changes their permissions.

## Tool-call log

Every agent chat tool invocation appends one JSON line containing `timestamp` and
the raw `tool` name. Repeated calls are recorded separately, including built-in,
custom, and MCP tools. Calls are recorded when they start, even if they later
fail. No arguments, results, prompts, or credentials are recorded.

The parent app supplies the absolute filename through `IDL_AGENT_TOOL_LOG`, for
example `<userData>/logs/tool-calls.jsonl`. Without it, standalone servers write to
`~/.idl/agents/tool-calls.jsonl`. The directory and file are created on the first
call; the file is appended across restarts without rotation. Write failures are
reported on the server console without interrupting chat.

For a separately hosted server, set the path in that server's environment before
starting it; a connecting desktop app cannot change its destination:

```powershell
$env:IDL_AGENT_TOOL_LOG = Join-Path $env:APPDATA 'envi-desktop-agent-dev\logs\tool-calls.jsonl'
npx nx serve agents-server
```
