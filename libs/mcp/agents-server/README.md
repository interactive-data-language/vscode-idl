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

On Windows, the standalone server defaults to
`%APPDATA%\envi-desktop-agent-dev\tool-calls.jsonl`. If `APPDATA` is unset,
it uses `~/.idl/agents/tool-calls.jsonl`. To override the location, set
`IDL_AGENT_TOOL_LOG` to an absolute filename before starting the server.
The desktop launcher supplies `<userData>/tool-calls.jsonl` when it starts a
worker. Attaching to an already running server does not change its log path.
The first tool call creates the file; later calls append without rotation.
