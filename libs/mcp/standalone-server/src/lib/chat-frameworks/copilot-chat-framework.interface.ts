/**
 * Tools that we allow GitHUb Copilot SDK to run on it's own
 *
 * To get this list, you have to ask an agent to print and describe each tool
 */
export const COPILOT_ALLOWED_TOOLS: string[] = [
  // 'powershell', // Run PowerShell commands (sync/async).
  // 'read_powershell', // Retrieve output from an active PowerShell session.
  // 'stop_powershell', // Terminate a running PowerShell process.
  // 'list_powershell', // List all active PowerShell sessions.
  'view', // Read file contents or list directory contents.
  'create', // Create new files at a specific path.
  // 'edit', // Perform string replacements in existing files.
  'web_fetch', // Fetch content from a URL (Markdown or HTML).
  'skill', // Invoke specialized capabilities (e.g., pdf, xlsx).
  'sql', // Execute queries against the session's SQLite database.
  'read_agent', // Retrieve results/status from background agents.
  'list_agents', // List all active and completed background agents.
  'grep', // Search for patterns within file contents (ripgrep).
  'glob', // Fast file pattern matching.
  'task', // Launch specialized sub-agents (explore, task, general-purpose, code-review, research, security-review).
];
