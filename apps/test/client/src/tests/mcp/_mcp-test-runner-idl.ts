import { Logger } from '@idl/logger';

import { Runner } from '../runner.class';
import { RunMCPTestValidateMCPConnection } from './mcp-test-validate-mcp-connection';
import { RunMCPTestCreateIDLNotebook } from './tools/idl/mcp-test-create-idl-notebook';
import { RunMCPTestRunIDLCode } from './tools/idl/mcp-test-run-idl-code';
import { RunMCPTestRunIDLCode_CrashEmulation } from './tools/idl/mcp-test-run-idl-code-crash-emulation';
import { RunMCPTestRunIDLFile } from './tools/idl/mcp-test-run-idl-file';
import { RunMCPTestStartIDL } from './tools/idl/mcp-test-start-idl';

/*
 * Logger to be used for tests related to debugging
 */
export const MCP_IDL_TEST_LOGGER = new Logger(
  'mcp-idl-tests',
  false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {},
);

/**
 * Test runner for IDL MCP tools
 */
export const MCP_IDL_TEST_RUNNER = new Runner(MCP_IDL_TEST_LOGGER);

/**
 * =======================================================================
 * Generic tests
 * =======================================================================
 */
MCP_IDL_TEST_RUNNER.addTest({
  fn: RunMCPTestValidateMCPConnection,
  name: 'Validate MCP connection to server',
  critical: true,
});

/**
 * =======================================================================
 * IDL tests
 * =======================================================================
 */
MCP_IDL_TEST_RUNNER.addTest({
  fn: RunMCPTestStartIDL,
  name: 'Start IDL via MCP',
  critical: true,
});

MCP_IDL_TEST_RUNNER.addTest({
  fn: RunMCPTestRunIDLCode,
  name: 'Execute snippet of IDL code',
  critical: true,
});

MCP_IDL_TEST_RUNNER.addTest({
  fn: RunMCPTestRunIDLCode_CrashEmulation,
  name: 'Execute snippet of IDL code that shuts down IDL',
  critical: true,
});

MCP_IDL_TEST_RUNNER.addTest({
  fn: RunMCPTestRunIDLFile,
  name: 'Execute file that contains IDL code',
});

MCP_IDL_TEST_RUNNER.addTest({
  fn: RunMCPTestCreateIDLNotebook,
  name: 'Create IDL notebook',
});
