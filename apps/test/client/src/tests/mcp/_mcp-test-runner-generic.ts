import { Logger } from '@idl/logger';

import { Runner } from '../runner.class';
import { RunMCPTestValidateMCPConnection } from './mcp-test-validate-mcp-connection';
import { RunMCPTestCreateFolder } from './tools/general/create-folder/mcp-test-create-folder';
import { RunMCPTestGetResources } from './tools/general/mcp-test-get-resources';
import { RunMCPTestGetRoutineDocs } from './tools/general/mcp-test-get-routine-docs';
import { RunMCPTestResourcesWorkflow } from './tools/general/mcp-test-resources-workflow';
import {
  RunMCPTestSearchForRoutineAll,
  RunMCPTestSearchForRoutineMultiple,
  RunMCPTestSearchForRoutineSingle,
} from './tools/general/mcp-test-search-for-routines';
import { RunMCPTestSearchResources } from './tools/general/mcp-test-search-resources';
import { RunMCPTestListGetPrompts } from './tools/general/prompts/mcp-test-list-get-prompt';
import {
  RunMCPTestListAllPrompts,
  RunMCPTestListPromptsWithFilters,
} from './tools/general/prompts/mcp-test-list-prompts';
import { RunMCPTestSearchForFiles_All } from './tools/general/search-for-files/mcp-test-search-for-files-all';
import { RunMCPTestSearchForFiles_FailRight } from './tools/general/search-for-files/mcp-test-search-for-files-fail-right';
import { RunMCPTestSearchForFiles_NoRecursion } from './tools/general/search-for-files/mcp-test-search-for-files-no-recursion';
import { RunMCPTestSearchForFiles_RecursionAll } from './tools/general/search-for-files/mcp-test-search-for-files-recursion-all';
import { RunMCPTestSearchForFiles_Single } from './tools/general/search-for-files/mcp-test-search-for-files-single';

/*
 * Logger to be used for tests related to debugging
 */
export const MCP_GENERIC_TEST_LOGGER = new Logger(
  'mcp-generic-tests',
  false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {},
);

/**
 * Test runner for generic (non-IDL, non-ENVI) MCP tools
 */
export const MCP_GENERIC_TEST_RUNNER = new Runner(MCP_GENERIC_TEST_LOGGER);

/**
 * =======================================================================
 * Generic tests
 * =======================================================================
 */
MCP_GENERIC_TEST_RUNNER.addTest({
  fn: RunMCPTestValidateMCPConnection,
  name: 'Validate MCP connection to server',
  critical: true,
});

/**
 * =======================================================================
 * Prompt tests
 * =======================================================================
 */
MCP_GENERIC_TEST_RUNNER.addTest({
  fn: RunMCPTestListAllPrompts,
  name: 'List all prompts',
});

MCP_GENERIC_TEST_RUNNER.addTest({
  fn: RunMCPTestListPromptsWithFilters,
  name: 'List filtered prompts for IDL and for ENVI',
});

MCP_GENERIC_TEST_RUNNER.addTest({
  fn: RunMCPTestListGetPrompts,
  name: 'Verify we can list and get prompts by name',
});

/**
 * =======================================================================
 * Search for routine
 * =======================================================================
 */
MCP_GENERIC_TEST_RUNNER.addTest({
  fn: RunMCPTestSearchForRoutineAll,
  name: 'Verify we can search for all matching routines',
});

MCP_GENERIC_TEST_RUNNER.addTest({
  fn: RunMCPTestSearchForRoutineSingle,
  name: 'Verify we can search for a single type of routine',
});

MCP_GENERIC_TEST_RUNNER.addTest({
  fn: RunMCPTestSearchForRoutineMultiple,
  name: 'Verify we can fulfill multiple searches at once',
});

MCP_GENERIC_TEST_RUNNER.addTest({
  fn: RunMCPTestGetRoutineDocs,
  name: 'Verify we can retrieve docs for routines',
});

/**
 * =======================================================================
 * Resource tests
 * =======================================================================
 */
MCP_GENERIC_TEST_RUNNER.addTest({
  fn: RunMCPTestResourcesWorkflow,
  name: 'Make sure we can list resources and retrieve a resource by name',
});

MCP_GENERIC_TEST_RUNNER.addTest({
  fn: RunMCPTestGetResources,
  name: 'Make sure getting resources fails correctly',
});

MCP_GENERIC_TEST_RUNNER.addTest({
  fn: RunMCPTestSearchResources,
  name: 'Make sure we can search for resources',
});

/**
 * =======================================================================
 * File search and creation tests
 * =======================================================================
 */
MCP_GENERIC_TEST_RUNNER.addTest({
  fn: RunMCPTestCreateFolder,
  name: 'File: Create folder recursively and verify existence',
});

MCP_GENERIC_TEST_RUNNER.addTest({
  fn: RunMCPTestSearchForFiles_All,
  name: 'File search: Make sure we can search for all files in a folder',
});

MCP_GENERIC_TEST_RUNNER.addTest({
  fn: RunMCPTestSearchForFiles_Single,
  name: 'File search: Make sure we can search for single file extension in a folder',
});

MCP_GENERIC_TEST_RUNNER.addTest({
  fn: RunMCPTestSearchForFiles_FailRight,
  name: 'File: search Make sure we fail with invalid folders',
});

MCP_GENERIC_TEST_RUNNER.addTest({
  fn: RunMCPTestSearchForFiles_RecursionAll,
  name: 'File search: Make sure we recursively search',
});

MCP_GENERIC_TEST_RUNNER.addTest({
  fn: RunMCPTestSearchForFiles_NoRecursion,
  name: 'File search: Honor no recursion',
});
