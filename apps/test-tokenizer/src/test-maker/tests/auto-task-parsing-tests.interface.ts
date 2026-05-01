import { ITaskParsingTests } from '../tests.interface';

/**
 * Automated tests for finding the right definition of a token
 */
export const AUTO_TASK_PARSING_TESTS: ITaskParsingTests[] = [
  {
    suiteName: `Correctly parse task file`,
    fileName: `envi1.spec.ts`,
    tests: [
      {
        name: `envi`,
        file: `idl/test/task-parsing/BuildMosaicRaster.task`,
      },
    ],
  },
  {
    suiteName: `Correctly parse task file`,
    fileName: `envi2.spec.ts`,
    tests: [
      {
        name: `envi`,
        file: `idl/test/task-parsing/ExportRasterToCADRG.task`,
      },
    ],
  },
  {
    suiteName: `Correctly parse task file`,
    fileName: `envi3.spec.ts`,
    tests: [
      {
        name: `envi`,
        file: `idl/test/task-parsing/PointCloudFeatureExtraction.task`,
      },
    ],
  },
  {
    suiteName: `Correctly parse task file`,
    fileName: `envi4.spec.ts`,
    tests: [
      {
        name: `envi`,
        file: `idl/test/task-parsing/SetRasterMetadata.task`,
      },
    ],
  },
  {
    suiteName: `Correctly parse task file`,
    fileName: `envi5.spec.ts`,
    tests: [
      {
        name: `envi`,
        file: `idl/test/task-parsing/maskfxrasterstats.task`,
      },
    ],
  },
  {
    suiteName: `Correctly parse task file`,
    fileName: `idl1.spec.ts`,
    tests: [
      {
        name: `idl`,
        file: `idl/test/task-parsing/Download_S3_URL.task`,
      },
    ],
  },
  {
    suiteName: `Correctly parse task file`,
    fileName: `idl2.spec.ts`,
    tests: [
      {
        name: `idl`,
        file: `idl/test/task-parsing/QueryAllTasks.task`,
      },
    ],
  },
  {
    suiteName: `Correctly parse task file`,
    fileName: `idl3.spec.ts`,
    tests: [
      {
        name: `idl`,
        file: `idl/test/task-parsing/QueryTask.task`,
      },
    ],
  },
  {
    suiteName: `Correctly parse task without display_name`,
    fileName: `idl-no-display-name.spec.ts`,
    tests: [
      {
        name: `idl`,
        file: `idl/test/task-parsing/test_task_no_display_name_idl.task`,
      },
    ],
  },
  {
    suiteName: `Correctly parse task without display_name`,
    fileName: `envi-no-display-name.spec.ts`,
    tests: [
      {
        name: `envi`,
        file: `idl/test/task-parsing/test_task_no_display_name_envi.task`,
      },
    ],
  },
  {
    suiteName: `Correctly parse task without displayName`,
    fileName: `legacy-envi-no-display-name.spec.ts`,
    tests: [
      {
        name: `envi`,
        file: `idl/test/task-parsing/test_task_no_display_name_legacy.task`,
      },
    ],
  },
];
