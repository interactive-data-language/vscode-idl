import { Logger } from '@idl/logger';

import { Runner } from '../runner.class';
import { RunGitHubCopilotValidateMCPConnection } from './github-copilot-validate-mcp-connection';
import { RunGitHubCopilotENVIInvalidTaskName } from './tools/envi/github-copilot-envi-invalid-task-name';
import { RunGitHubCopilotENVIParameterValidation } from './tools/envi/github-copilot-envi-parameter-validation';
import { RunGitHubCopilotENVIToolNotesLoad } from './tools/envi/github-copilot-envi-tool-notes-load';
import { RunGitHubCopilotExecuteIDLCode } from './tools/idl/github-copilot-execute-idl-code';
import { RunGitHubCopilotStartIDL } from './tools/idl/github-copilot-start-idl';

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

GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubCopilotValidateMCPConnection,
  name: 'Validate MCP connection to server',
  critical: true,
});

GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubCopilotStartIDL,
  name: 'Start IDL via MCP',
  critical: true,
});

GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubCopilotENVIToolNotesLoad,
  name: 'Verify ENVI tool notes are loaded (will always fail until SAVE files bundled)',
});

GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubCopilotENVIInvalidTaskName,
  name: 'Verify ENVI tools fail with unknown task name',
});

GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubCopilotENVIParameterValidation,
  name: 'Verify ENVI parameters are validated and tool execution fails',
});
