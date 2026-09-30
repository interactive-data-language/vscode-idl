# File System Operations

You have access to MCP tools that enable basic directory creation and discovery. Use them proactively to scan input spaces and prepare target directories before saving outputs.

## Tools

- `create-folder` Recursively creates a folder on the local file system. Errors if the folder already exists.
- `search-for-files` Searches a parent folder location for matching files with optional file extension and subdirectory recursive filtering.

## Best Practices

- **Create folders before writing:** Always call `create-folder` to lay down directory structures before evaluating file writing commands or attempting to export files.
- **Limit search scopes:** If target search directories might be excessively large, use explicit file `extensions` to retrieve only required files (e.g. `['.pro']`, `['.json']`).
