import { Logger } from '@idl/logger';

import { Runner } from '../runner.class';
import { RunMCPTestValidateMCPConnection } from './mcp-test-validate-mcp-connection';
import { RunMCPTestInvalidENVIToolName } from './tools/envi/mcp-test-envi-invalid-tool-name';
import { RunMCPTestENVIToolNotesLoad } from './tools/envi/mcp-test-envi-tool-notes-load';
import { RunMCPTestENVIToolParameterValidation } from './tools/envi/mcp-test-envi-tool-parameter-validation';
import { RunMCPTestListENVITools } from './tools/envi/mcp-test-list-envi-tools';
import { RunMCPTestRunENVITool } from './tools/envi/mcp-test-run-envi-tool';
import { RunMCPTestStartENVI } from './tools/envi/mcp-test-start-envi';
import { RunMCPTestOpenDatasetsInENVI_Raster } from './tools/envi/open-datasets/mcp-test-open-datasets-in-envi-raster';
import { RunMCPTestOpenDatasetsInENVI_RasterSeries } from './tools/envi/open-datasets/mcp-test-open-datasets-in-envi-raster-series';
import { RunMCPTestOpenDatasetsInENVI_Vector } from './tools/envi/open-datasets/mcp-test-open-datasets-in-envi-vector';
import { RunMCPTestQueryDatasetWithENVI_Raster } from './tools/envi/query-dataset/mcp-test-query-dataset-with-envi-raster';
import { RunMCPTestQueryDatasetWithENVI_ROI } from './tools/envi/query-dataset/mcp-test-query-dataset-with-envi-roi';
import { RunMCPTestQueryDatasetWithENVI_SpectralLibrary } from './tools/envi/query-dataset/mcp-test-query-dataset-with-envi-spectral-library';
import { RunMCPTestQueryDatasetWithENVI_Vector } from './tools/envi/query-dataset/mcp-test-query-dataset-with-envi-vector';
import { RunMCPTestGetResources } from './tools/general/mcp-test-get-resources';
import { RunMCPTestGetRoutineDocs } from './tools/general/mcp-test-get-routine-docs';
import { RunMCPTestResourcesWorkflow } from './tools/general/mcp-test-resources-workflow';
import {
  RunMCPTestSearchForRoutineAll,
  RunMCPTestSearchForRoutineMultiple,
  RunMCPTestSearchForRoutineSingle,
} from './tools/general/mcp-test-search-for-routines';
import { RunMCPTestSearchResources } from './tools/general/mcp-test-search-resources';
import { RunMCPTestSearchForFiles_All } from './tools/general/search-for-files/mcp-test-search-for-files-all';
import { RunMCPTestSearchForFiles_FailRight } from './tools/general/search-for-files/mcp-test-search-for-files-fail-right';
import { RunMCPTestSearchForFiles_NoRecursion } from './tools/general/search-for-files/mcp-test-search-for-files-no-recursion';
import { RunMCPTestSearchForFiles_RecursionAll } from './tools/general/search-for-files/mcp-test-search-for-files-recursion-all';
import { RunMCPTestSearchForFiles_Single } from './tools/general/search-for-files/mcp-test-search-for-files-single';
import { RunMCPTestCreateIDLNotebook } from './tools/idl/mcp-test-create-idl-notebook';
import { RunMCPTestExecuteIDLCode } from './tools/idl/mcp-test-execute-idl-code';
import { RunMCPTestExecuteIDLFile } from './tools/idl/mcp-test-execute-idl-file';
import { RunMCPTestStartIDL } from './tools/idl/mcp-test-start-idl';

/*
 * Logger to be used for tests related to debugging
 */
export const MCP_TEST_LOGGER = new Logger(
  'mcp-tests',
  false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {}
);

/**
 * Test runner for debugging
 */
export const MCP_TEST_RUNNER = new Runner(MCP_TEST_LOGGER);

/**
 * =======================================================================
 * Generic tests
 * =======================================================================
 */
MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestValidateMCPConnection,
  name: 'Validate MCP connection to server',
  critical: true,
});

/**
 * =======================================================================
 * Search for routine
 * =======================================================================
 */
MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestSearchForRoutineAll,
  name: 'Verify we can search for all matching routines',
});

MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestSearchForRoutineSingle,
  name: 'Verify we can search for a single type of routine',
});

MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestSearchForRoutineMultiple,
  name: 'Verify we can fullfill multiple searches at once',
});

MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestGetRoutineDocs,
  name: 'Verify we can retrieve docs for routines',
});

/**
 * =======================================================================
 * Resource tests
 * =======================================================================
 */
MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestResourcesWorkflow,
  name: 'Make sure we can list resources and retrieve a resource by name',
});

MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestGetResources,
  name: 'Make sure getting resources fails correctly',
});

MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestSearchResources,
  name: 'Make sure we can search for resources',
});

/**
 * =======================================================================
 * File search tests
 * =======================================================================
 */
MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestSearchForFiles_All,
  name: 'File search: Make sure we can search for all files in a folder',
});

MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestSearchForFiles_Single,
  name: 'File search: Make sure we can search for single file extension in a folder',
});

MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestSearchForFiles_FailRight,
  name: 'File: search Make sure we fail with invalid folders',
});

MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestSearchForFiles_RecursionAll,
  name: 'File search: Make sure we recursively search',
});

MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestSearchForFiles_NoRecursion,
  name: 'File search: Honor no recursion',
});

/**
 * =======================================================================
 * IDL tests
 * =======================================================================
 */
MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestStartIDL,
  name: 'Start IDL via MCP',
  critical: true,
});

MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestExecuteIDLCode,
  name: 'Execute snippet of IDL code',
  critical: true,
});

MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestExecuteIDLFile,
  name: 'Execute file that contains IDL code',
});

MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestCreateIDLNotebook,
  name: 'Create IDL notebook',
});

/**
 * =======================================================================
 * ENVI tests
 * =======================================================================
 */
MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestStartENVI,
  name: 'Start ENVI with and without the UI',
  critical: true,
  excludeOS: [
    {
      os: ['darwin'],
      architecture: ['arm', 'arm64'],
    },
  ],
});

MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestListENVITools,
  name: 'Verify we can list ENVI tools via MCP (at least 200 returned)',
});

MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestENVIToolNotesLoad,
  name: 'Verify ENVI tool notes are loaded (will always fail until SAVE files bundled)',
});

MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestInvalidENVIToolName,
  name: 'Verify ENVI tools fail with unknown task name',
});

MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestENVIToolParameterValidation,
  name: 'Verify ENVI parameters are validated and tool execution fails',
});

MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestRunENVITool,
  name: 'Run simple tool and get expected results',
  excludeOS: [
    {
      os: ['darwin'],
      architecture: ['arm', 'arm64'],
    },
  ],
});

MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestQueryDatasetWithENVI_Raster,
  name: 'Query dataset works (Raster)',
  excludeOS: [
    {
      os: ['darwin'],
      architecture: ['arm', 'arm64'],
    },
  ],
});

MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestQueryDatasetWithENVI_ROI,
  name: 'Query dataset works (ROI)',
  excludeOS: [
    {
      os: ['darwin'],
      architecture: ['arm', 'arm64'],
    },
  ],
});

MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestQueryDatasetWithENVI_SpectralLibrary,
  name: 'Query dataset works (Spectral Library)',
  excludeOS: [
    {
      os: ['darwin'],
      architecture: ['arm', 'arm64'],
    },
  ],
});

MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestQueryDatasetWithENVI_Vector,
  name: 'Query dataset works (Vector)',
  excludeOS: [
    {
      os: ['darwin'],
      architecture: ['arm', 'arm64'],
    },
  ],
});

MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestOpenDatasetsInENVI_Raster,
  name: 'Open dataset (Raster)',
  excludeOS: [
    {
      os: ['darwin'],
      architecture: ['arm', 'arm64'],
    },
  ],
});

MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestOpenDatasetsInENVI_RasterSeries,
  name: 'Open dataset (Raster Series)',
  excludeOS: [
    {
      os: ['darwin'],
      architecture: ['arm', 'arm64'],
    },
  ],
});

MCP_TEST_RUNNER.addTest({
  fn: RunMCPTestOpenDatasetsInENVI_Vector,
  name: 'Open dataset (Vector)',
  excludeOS: [
    {
      os: ['darwin'],
      architecture: ['arm', 'arm64'],
    },
  ],
});
