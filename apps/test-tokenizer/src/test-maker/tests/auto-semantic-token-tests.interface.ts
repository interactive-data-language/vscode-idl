import { IAutoTest } from '../tests.interface';

/**
 * Automated tests for generating semantic tokens for code
 */
export const AUTO_SEMANTIC_TOKEN_TESTS: IAutoTest[] = [
  {
    suiteName: `Extracts semantic tokens`,
    fileName: `basic.spec.ts`,
    tests: [
      {
        name: `for basic case`,
        code: [
          `compile_opt idl2`,
          `a = envi.api_version`,
          `!null = envi.openRaster('somefile.dat')`,
          `end`,
        ],
      },
    ],
  },
  {
    suiteName: `Extracts semantic tokens`,
    fileName: `complex.spec.ts`,
    tests: [
      {
        name: `for complex case with out-of order and same ref`,
        code: [
          `compile_opt idl2`,
          `IDLgrVolume.AddToNotebookMap`,
          `!null = ENVI.displayinnotebookmap + ENVI.api_version`,
          ``,
          `IDLgrVolume.AddToNotebookMap`,
          `ENVI.displayInNotebookMap`,
          `end`,
        ],
      },
    ],
  },
];
