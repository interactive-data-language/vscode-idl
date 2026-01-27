import { Logger } from '@idl/logger';

import { Runner } from '../runner.class';
import { RunGitHubCopilotValidateMCPConnection } from './github-copilot-validate-mcp-connection';
import { RunGitHubCopilotENVIInvalidTaskName } from './tools/envi/github-copilot-envi-invalid-task-name';
import { RunGitHubCopilotENVIListTools } from './tools/envi/github-copilot-envi-list-tools';
import { RunGitHubCopilotENVIParameterValidation } from './tools/envi/github-copilot-envi-parameter-validation';
import { RunGitHubCopilotENVIRunTool } from './tools/envi/github-copilot-envi-run-tool';
import { RunGitHubCopilotENVIToolNotesLoad } from './tools/envi/github-copilot-envi-tool-notes-load';
import { RunGitHubCopilotStartENVI } from './tools/envi/github-copilot-start-envi';
import { RunGitHubCopilotENVIQueryDataset_Raster } from './tools/envi/query-dataset/github-copilot-envi-query-dataset-raster';
import { RunGitHubCopilotENVIQueryDataset_ROI } from './tools/envi/query-dataset/github-copilot-envi-query-dataset-roi';
import { RunGitHubCopilotENVIQueryDataset_SpectralLibrary } from './tools/envi/query-dataset/github-copilot-envi-query-dataset-spectral-library';
import { RunGitHubCopilotENVIQueryDataset_Vector } from './tools/envi/query-dataset/github-copilot-envi-query-dataset-vector';
import { RunGitHubGetResources } from './tools/github-copilot-get-resources';
import { RunGitHubCopilotGetRoutineDocs } from './tools/github-copilot-get-routine-docs';
import { RunGitHubResourcesWorkflow } from './tools/github-copilot-resources-workflow';
import {
  RunGitHubSearchForFilesAll,
  RunGitHubSearchForFilesFailRight,
  RunGitHubSearchForFilesNoRecursion,
  RunGitHubSearchForFilesRecursionAll,
  RunGitHubSearchForFilesSingle,
} from './tools/github-copilot-search-for-files';
import {
  RunGitHubCopilotSearchForRoutineAll,
  RunGitHubCopilotSearchForRoutineMultiple,
  RunGitHubCopilotSearchForRoutineSingle,
} from './tools/github-copilot-search-for-routines';
import { RunGitHubSearchResources } from './tools/github-copilot-search-resources';
import { RunGitHubCopilotCreateIDLNotebook } from './tools/idl/github-copilot-create-idl-notebook';
import { RunGitHubCopilotExecuteIDLCode } from './tools/idl/github-copilot-execute-idl-code';
import { RunGitHubCopilotExecuteIDLFile } from './tools/idl/github-copilot-execute-idl-file';
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

/**
 * =======================================================================
 * Generic tests
 * =======================================================================
 */
GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubCopilotValidateMCPConnection,
  name: 'Validate MCP connection to server',
  critical: true,
});

/**
 * =======================================================================
 * Search for routine
 * =======================================================================
 */
GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubCopilotSearchForRoutineAll,
  name: 'Verify we can search for all matching routines',
});

GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubCopilotSearchForRoutineSingle,
  name: 'Verify we can search for a single type of routine',
});

GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubCopilotSearchForRoutineMultiple,
  name: 'Verify we can fullfill multiple searches at once',
});

GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubCopilotGetRoutineDocs,
  name: 'Verify we can retrieve docs for routines',
});

/**
 * =======================================================================
 * Resource tests
 * =======================================================================
 */
GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubResourcesWorkflow,
  name: 'Make sure we can list resources and retrieve a resource by name',
});

GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubGetResources,
  name: 'Make sure getting resources fails correctly',
});

GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubSearchResources,
  name: 'Make sure we can search for resources',
});

/**
 * =======================================================================
 * File search tests
 * =======================================================================
 */
GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubSearchForFilesAll,
  name: 'File search: Make sure we can search for all files in a folder',
});

GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubSearchForFilesSingle,
  name: 'File search: Make sure we can search for single file extension in a folder',
});

GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubSearchForFilesFailRight,
  name: 'File: search Make sure we fail with invalid folders',
});

GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubSearchForFilesRecursionAll,
  name: 'File search: Make sure we recursively search',
});

GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubSearchForFilesNoRecursion,
  name: 'File search: Honor no recursion',
});

/**
 * =======================================================================
 * IDL tests
 * =======================================================================
 */
GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubCopilotStartIDL,
  name: 'Start IDL via MCP',
  critical: true,
});

GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubCopilotExecuteIDLCode,
  name: 'Execute snippet of IDL code',
  critical: true,
});

GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubCopilotExecuteIDLFile,
  name: 'Execute file that contains IDL code',
});

GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubCopilotCreateIDLNotebook,
  name: 'Create IDL notebook',
});

/**
 * =======================================================================
 * ENVI tests
 * =======================================================================
 */
GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubCopilotStartENVI,
  name: 'Start ENVI with and without the UI',
  critical: true,
  excludeOS: [
    {
      os: ['darwin'],
      architecture: ['arm', 'arm64'],
    },
  ],
});

GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubCopilotENVIListTools,
  name: 'Verify we can list ENVI tools via MCP (at least 200 returned)',
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

GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubCopilotENVIRunTool,
  name: 'Run simple tool and get expected results',
});

GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubCopilotENVIQueryDataset_Raster,
  name: 'Query dataset works (Raster)',
});

GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubCopilotENVIQueryDataset_ROI,
  name: 'Query dataset works (ROI)',
});

GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubCopilotENVIQueryDataset_SpectralLibrary,
  name: 'Query dataset works (Spectral Library)',
});

GITHUB_COPILOT_RUNNER.addTest({
  fn: RunGitHubCopilotENVIQueryDataset_Vector,
  name: 'Query dataset works (Vector)',
});
