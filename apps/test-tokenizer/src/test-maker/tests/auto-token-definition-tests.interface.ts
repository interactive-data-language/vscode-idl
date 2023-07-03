import { ITokenDefTests } from '../tests.interface';

/**
 * Automated tests for finding the right definition of a token
 */
export const AUTO_TOKEN_DEFINITION_TESTS: ITokenDefTests[] = [
  {
    suiteName: `Correctly find function definitions`,
    fileName: `functions.spec.ts`,
    tests: [
      {
        name: `real`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 58,
            character: 11,
          },
        ],
      },
      {
        name: `fake`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 61,
            character: 11,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly find definitions for function methods`,
    fileName: `function-methods.spec.ts`,
    tests: [
      {
        name: `real`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 82,
            character: 17,
          },
          {
            line: 85,
            character: 14,
          },
        ],
      },
      {
        name: `fake`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 88,
            character: 19,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly find find include`,
    fileName: `include.spec.ts`,
    tests: [
      {
        name: `real`,
        files: [`idl/test/token-def/include_test.pro`],
        position: [
          {
            line: 4,
            character: 7,
          },
        ],
      },
      {
        name: `fake`,
        files: [`idl/test/token-def/include_test.pro`],
        position: [
          {
            line: 7,
            character: 8,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly find definitions for keywords`,
    fileName: `keywords.procedures.spec.ts`,
    tests: [
      {
        name: `real`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 52,
            character: 7,
          },
        ],
      },
      {
        name: `fake`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 52,
            character: 16,
          },
          {
            line: 55,
            character: 8,
          },
        ],
      },
      {
        name: `real binary`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 52,
            character: 30,
          },
        ],
      },
      {
        name: `fake binary`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 52,
            character: 37,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly find definitions for keywords`,
    fileName: `keywords.procedure-methods.spec.ts`,
    tests: [
      {
        name: `real`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 73,
            character: 16,
          },
          {
            line: 76,
            character: 16,
          },
        ],
      },
      {
        name: `fake`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 73,
            character: 25,
          },
          {
            line: 76,
            character: 25,
          },
          {
            line: 79,
            character: 17,
          },
        ],
      },
      {
        name: `real binary`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 73,
            character: 38,
          },
          {
            line: 76,
            character: 38,
          },
        ],
      },
      {
        name: `fake binary`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 73,
            character: 45,
          },
          {
            line: 76,
            character: 45,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly find definitions for keywords`,
    fileName: `keywords.functions.spec.ts`,
    tests: [
      {
        name: `real`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 58,
            character: 15,
          },
        ],
      },
      {
        name: `fake`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 58,
            character: 24,
          },
          {
            line: 61,
            character: 16,
          },
        ],
      },
      {
        name: `real binary`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 58,
            character: 37,
          },
        ],
      },
      {
        name: `fake binary`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 58,
            character: 44,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly find definitions for keywords`,
    fileName: `keywords.function-methods.spec.ts`,
    tests: [
      {
        name: `real`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 82,
            character: 24,
          },
          {
            line: 85,
            character: 24,
          },
        ],
      },
      {
        name: `fake`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 82,
            character: 33,
          },
          {
            line: 85,
            character: 33,
          },
          {
            line: 88,
            character: 25,
          },
        ],
      },
      {
        name: `real binary`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 82,
            character: 46,
          },
          {
            line: 85,
            character: 46,
          },
        ],
      },
      {
        name: `fake binary`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 82,
            character: 53,
          },
          {
            line: 85,
            character: 53,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly find find definition from obj new`,
    fileName: `obj-new.spec.ts`,
    tests: [
      {
        name: `real`,
        files: [`idl/test/token-def/obj_new.pro`],
        position: [
          {
            line: 53,
            character: 12,
          },
        ],
      },
      {
        name: `fake`,
        files: [`idl/test/token-def/obj_new.pro`],
        position: [
          {
            line: 56,
            character: 12,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly find procedure definitions`,
    fileName: `procedures.spec.ts`,
    tests: [
      {
        name: `real`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 52,
            character: 6,
          },
        ],
      },
      {
        name: `fake`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 55,
            character: 2,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly find definitions for procedure methods`,
    fileName: `procedure-methods.spec.ts`,
    tests: [
      {
        name: `real`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 73,
            character: 8,
          },
          {
            line: 76,
            character: 8,
          },
        ],
      },
      {
        name: `fake`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 79,
            character: 6,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly find definitions for properties`,
    fileName: `properties.spec.ts`,
    tests: [
      {
        name: `real`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 64,
            character: 14,
          },
          {
            line: 67,
            character: 14,
          },
        ],
      },
      {
        name: `fake`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 70,
            character: 14,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly find definitions in structures`,
    fileName: `structures.spec.ts`,
    tests: [
      {
        name: `using structure names`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 40,
            character: 9,
          },
        ],
      },
      {
        name: `using properties (inherited, ours, fake)`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 43,
            character: 19,
          },
          {
            line: 43,
            character: 31,
          },
          {
            line: 43,
            character: 42,
          },
        ],
      },
      {
        name: `anonymous properties`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 94,
            character: 22,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly find definitions for task files`,
    fileName: `tasks.spec.ts`,
    tests: [
      {
        name: `from ENVITask function`,
        files: [
          `idl/test/token-def/tasks.pro`,
          `idl/test/token-def/atanomalydetection.task`,
        ],
        position: [
          {
            line: 2,
            character: 12,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly find definitions in structures`,
    fileName: `variables.spec.ts`,
    tests: [
      {
        name: `real variables`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 46,
            character: 9,
          },
        ],
      },
      {
        name: `fake variables`,
        files: [`idl/test/token-def/all_cases.pro`],
        position: [
          {
            line: 49,
            character: 9,
          },
        ],
      },
    ],
  },
];
