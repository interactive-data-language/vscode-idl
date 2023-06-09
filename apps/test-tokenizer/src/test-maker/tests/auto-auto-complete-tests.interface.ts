import { IAutoCompleteTests } from '../tests.interface';

/**
 * Automated tests for auto-complete
 */
export const AUTO_AUTO_COMPLETE_TESTS: IAutoCompleteTests[] = [
  {
    suiteName: `Correctly provides auto complete for`,
    fileName: `bracket-paren.1.spec.ts`,
    tests: [
      {
        name: `things after brackets and parentheses`,
        file: `idl/test/auto-complete/bracket_paren.pro`,
        position: [
          {
            line: 14,
            character: 18,
          },
          {
            line: 17,
            character: 24,
          },
          {
            line: 20,
            character: 17,
          },
          {
            line: 23,
            character: 19,
          },
          {
            line: 24,
            character: 11,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Don't do auto-complete`,
    fileName: `dont-complete.spec.ts`,
    tests: [
      {
        name: `for any of these`,
        file: `idl/test/auto-complete/dont_complete.pro`,
        position: [
          {
            line: 1,
            character: 18,
          },
          {
            line: 1,
            character: 19,
          },
          {
            line: 1,
            character: 34,
          },
          {
            line: 6,
            character: 9,
          },
          {
            line: 6,
            character: 10,
          },
          {
            line: 6,
            character: 25,
          },
          {
            line: 13,
            character: 13,
          },
          {
            line: 16,
            character: 2,
          },
          {
            line: 17,
            character: 2,
          },
          {
            line: 20,
            character: 9,
          },
          {
            line: 21,
            character: 9,
          },
          {
            line: 22,
            character: 9,
          },
          {
            line: 25,
            character: 10,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly send only executive commands`,
    fileName: `executive-commands.1.spec.ts`,
    tests: [
      {
        name: `when we auto-complete`,
        file: `idl/test/auto-complete/examples.pro`,
        position: [
          {
            line: 36,
            character: 2,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Include properties`,
    fileName: `include-properties.spec.ts`,
    tests: [
      {
        name: `for procedure methods with only dots`,
        file: `idl/test/auto-complete/examples.pro`,
        position: [
          {
            line: 22,
            character: 4,
          },
        ],
      },
      {
        name: `for static properties`,
        file: `idl/test/auto-complete/examples.pro`,
        position: [
          {
            line: 26,
            character: 15,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Verify auto-complete in structures`,
    fileName: `in-structures.1.spec.ts`,
    tests: [
      {
        name: `for properties, property completion, and normal property completion`,
        file: `idl/test/auto-complete/in_structures.pro`,
        position: [
          {
            line: 17,
            character: 15,
          },
          {
            line: 19,
            character: 22,
          },
          {
            line: 21,
            character: 47,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Verify auto-complete for`,
    fileName: `include.spec.ts`,
    tests: [
      {
        name: `include statements`,
        file: `idl/test/auto-complete/include.pro`,
        position: [
          {
            line: 2,
            character: 1,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Verify auto-complete for`,
    fileName: `init-methods.spec.ts`,
    tests: [
      {
        name: `init methods`,
        file: `idl/test/auto-complete/init_method.pro`,
        position: [
          {
            line: 13,
            character: 10,
          },
          {
            line: 16,
            character: 18,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly provides auto complete for keywords`,
    fileName: `keywords.1.spec.ts`,
    tests: [
      {
        name: `things after brackets and parentheses`,
        file: `idl/test/auto-complete/keywords.pro`,
        position: [
          {
            line: 4,
            character: 10,
          },
          {
            line: 7,
            character: 11,
          },
          {
            line: 10,
            character: 15,
          },
          {
            line: 13,
            character: 13,
          },
          {
            line: 16,
            character: 14,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Verify types being used for`,
    fileName: `methods.1.spec.ts`,
    tests: [
      {
        name: `methods`,
        file: `idl/test/auto-complete/types.pro`,
        position: [
          {
            line: 10,
            character: 8,
          },
          {
            line: 13,
            character: 4,
          },
          {
            line: 26,
            character: 12,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Exclude init method`,
    fileName: `no-init.spec.ts`,
    tests: [
      {
        name: `for function methods`,
        file: `idl/test/auto-complete/examples.pro`,
        position: [
          {
            line: 7,
            character: 12,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Exclude parentheses`,
    fileName: `no-paren.spec.ts`,
    tests: [
      {
        name: `for functions and function methods`,
        file: `idl/test/auto-complete/examples.pro`,
        position: [
          {
            line: 10,
            character: 9,
          },
          {
            line: 11,
            character: 12,
          },
          {
            line: 12,
            character: 14,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Exclude properties`,
    fileName: `no-properties.spec.ts`,
    tests: [
      {
        name: `for function methods`,
        file: `idl/test/auto-complete/examples.pro`,
        position: [
          {
            line: 18,
            character: 12,
          },
          {
            line: 19,
            character: 14,
          },
        ],
      },
      {
        name: `for procedure method`,
        file: `idl/test/auto-complete/examples.pro`,
        position: [
          {
            line: 23,
            character: 7,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Exclude variables`,
    fileName: `no-variables.spec.ts`,
    tests: [
      {
        name: `for functions`,
        file: `idl/test/auto-complete/examples.pro`,
        position: [
          {
            line: 15,
            character: 9,
          },
        ],
      },
    ],
  },
  {
    suiteName: `When in procedure, send procedure tokens`,
    fileName: `procedures.1.spec.ts`,
    tests: [
      {
        name: `for functions`,
        file: `idl/test/auto-complete/procedures.pro`,
        position: [
          {
            line: 4,
            character: 2,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly return auto-complete from obj-new`,
    fileName: `obj-new.spec.ts`,
    tests: [
      {
        name: `real`,
        file: `idl/test/auto-complete/obj_new.pro`,
        position: [
          {
            line: 53,
            character: 26,
          },
        ],
      },
      {
        name: `fake`,
        file: `idl/test/auto-complete/obj_new.pro`,
        position: [
          {
            line: 56,
            character: 29,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Procedures`,
    fileName: `procedures.spec.ts`,
    tests: [
      {
        name: `including user and variables`,
        file: `idl/test/auto-complete/examples.pro`,
        position: [
          {
            line: 2,
            character: 0,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Verify types being used for`,
    fileName: `properties.1.spec.ts`,
    tests: [
      {
        name: `properties`,
        file: `idl/test/auto-complete/types.pro`,
        position: [
          {
            line: 16,
            character: 15,
          },
          {
            line: 19,
            character: 21,
          },
          {
            line: 19,
            character: 21,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Structures`,
    fileName: `structures-anonymous.spec.ts`,
    tests: [
      {
        name: `without a name`,
        file: `idl/test/auto-complete/structures.pro`,
        position: [
          {
            line: 8,
            character: 12,
          },
          {
            line: 9,
            character: 14,
          },
          {
            line: 10,
            character: 21,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Task auto complete`,
    fileName: `tasks.functions.spec.ts`,
    tests: [
      {
        name: `to make sure they look nice`,
        file: `idl/test/auto-complete/task_functions.pro`,
        position: [
          {
            line: 3,
            character: 8,
          },
        ],
        startsWith: `ENVITask`,
      },
    ],
  },
  {
    suiteName: `Task auto complete`,
    fileName: `tasks.properties.spec.ts`,
    tests: [
      {
        name: `as regression for task type parsing`,
        file: `idl/test/auto-complete/tasks.pro`,
        position: [
          {
            line: 13,
            character: 4,
          },
          {
            line: 14,
            character: 4,
          },
          {
            line: 15,
            character: 4,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Methods`,
    fileName: `method-regression.spec.ts`,
    tests: [
      {
        name: `inside the paren showing variables`,
        file: `idl/test/auto-complete/examples.pro`,
        position: [
          {
            line: 10,
            character: 10,
          },
          {
            line: 11,
            character: 13,
          },
          {
            line: 12,
            character: 15,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly send only system variables`,
    fileName: `system-variables.1.spec.ts`,
    tests: [
      {
        name: `when we auto-complete`,
        file: `idl/test/auto-complete/examples.pro`,
        position: [
          {
            line: 29,
            character: 3,
          },
          {
            line: 30,
            character: 9,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly finds the right variables`,
    fileName: `variables.1.spec.ts`,
    tests: [
      {
        name: `when we auto-complete`,
        file: `idl/test/auto-complete/variables.pro`,
        position: [
          {
            line: 6,
            character: 10,
          },
          {
            line: 9,
            character: 2,
          },
        ],
      },
    ],
  },
];
