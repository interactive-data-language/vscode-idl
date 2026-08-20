This is your manual insert into the AI's brain.
Drop markdown (`.md`) or IDL Notebook (`.idlnb`) files in this folder to make them available to AI assistants through the MCP server. They get indexed automatically when the extension starts, and assistants can search and pull from them when helping with IDL questions.

## What Goes Here

Anything you want an AI assistant to have access to:

- Reference guides
- Common IDL patterns
- Domain-specific docs (astronomy workflows, medical imaging, etc.)
- Team knowledge base content
- Customer-specific notes
- FAQs
- Code examples

If it would be useful context for answering IDL questions, toss it in.

## Supported Files

- .md
- .idlnb

This can be upgraded in the mcp-track-resources function.

## Tips and tricks

Files are tracked by `MCPTrackResourcesInFolder()` with the prefix `resource-`. So a file called `my-guide.md` becomes `resource-my-guide` and is searchable via the `search-resources` and `get-resource` MCP tools.

- Use descriptive filenames — they become the resource ID
- Keep files focused so search results stay relevant
- In notebooks, use markdown cells for explanation and code cells for examples
