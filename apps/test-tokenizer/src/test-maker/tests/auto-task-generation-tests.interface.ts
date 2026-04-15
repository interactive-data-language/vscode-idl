import { ITaskGenerationTests } from '../tests.interface';

/**
 * Automated tests for hover-help extraction
 */
export const AUTO_TASK_GENERATION_TESTS: ITaskGenerationTests[] = [
  {
    suiteName: `Make basic ENVI task`,
    fileName: `envi.basic.spec.ts`,
    tests: [
      {
        name: `from PRO`,
        file: `idl/test/task-generation/envitasktest.pro`,
        type: 'envi',
      },
    ],
  },
  {
    suiteName: `Don't make ENVI Task`,
    fileName: `envi.failure1.spec.ts`,
    tests: [
      {
        name: `because of missing PRO definition`,
        file: `idl/test/task-generation/empty_envi.pro`,
        type: 'envi',
      },
    ],
  },
  {
    suiteName: `Make basic IDL task`,
    fileName: `idl.basic.spec.ts`,
    tests: [
      {
        name: `from PRO`,
        file: `idl/test/task-generation/idltasktest.pro`,
        type: 'idl',
      },
    ],
  },
  {
    suiteName: `Don't make IDL Task`,
    fileName: `idl.failure1.spec.ts`,
    tests: [
      {
        name: `because of missing PRO definition`,
        file: `idl/test/task-generation/empty_idl.pro`,
        type: 'idl',
      },
    ],
  },
];
