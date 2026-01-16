import { Logger } from '@idl/logger';

import { Runner } from '../runner.class';
import { RunGitHubCopilotStartIDL } from './github-copilot-start-idl';
import { RunGitHubCopilotValidateMCPConnection } from './github-copilot-validate-mcp-connection';

/*
 * Logger to be used for tests related to debugging
 */
export const GITHUB_COPILOT_TEST_LOGGER = new Logger(
  'github-copilot-tests',
  false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {}
);

/**
 * Test runner for debugging
 */
export const GITHUB_COPILOT_RUNNER = new Runner(GITHUB_COPILOT_TEST_LOGGER);

// make sure that we can connect to our MCP server and return tools
GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubCopilotValidateMCPConnection,
  name: 'Validate MCP connection',
  critical: true,
});

// make sure that we can start IDL
GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubCopilotStartIDL,
  name: 'Start IDL',
  critical: true,
});
