import { IHoverHelpTests } from '../tests.interface';

/**
 * Automated tests for hover-help extraction
 */
export const AUTO_HOVER_HELP_TESTS: IHoverHelpTests[] = [
  {
    suiteName: `Correctly provides hover help for`,
    fileName: `bracket-paren.1.spec.ts`,
    tests: [
      {
        name: `things after brackets and parentheses`,
        file: `idl/test/hover-help/bracket_paren.pro`,
        position: [
          {
            line: 14,
            character: 20,
          },
          {
            line: 17,
            character: 21,
          },
          {
            line: 17,
            character: 27,
          },
          {
            line: 20,
            character: 20,
          },
          {
            line: 23,
            character: 25,
          },
          {
            line: 24,
            character: 13,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly get hover help`,
    fileName: `comment-regression.spec.ts`,
    tests: [
      {
        name: `for comment edge case`,
        file: `idl/test/hover-help/comment_regression.pro`,
        position: [
          {
            line: 3,
            character: 12,
          },
          {
            line: 5,
            character: 13,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly overrides doc hover help`,
    fileName: `docs-overrides.spec.ts`,
    tests: [
      {
        name: `extract correct tokens and handle undefined`,
        file: `idl/test/hover-help/docs_overrides.pro`,
        position: [
          {
            line: 3,
            character: 8,
          },
          {
            line: 3,
            character: 13,
          },
          {
            line: 3,
            character: 22,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly overrides doc hover help`,
    fileName: `docs-overrides.2.spec.ts`,
    tests: [
      {
        name: `for structure properties`,
        file: `idl/test/hover-help/docs_overrides2.pro`,
        position: [
          {
            line: 6,
            character: 11,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly identifies search terms from syntax tree`,
    fileName: `ex-1.spec.ts`,
    tests: [
      {
        name: `extract correct tokens and handle undefined`,
        file: `idl/test/hover-help/awesomerasterintersection.pro`,
        position: [
          {
            line: 87,
            character: 10,
          },
          {
            line: 90,
            character: 7,
          },
          {
            line: 91,
            character: 25,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly identifies keywords from routine calls`,
    fileName: `ex-2.spec.ts`,
    tests: [
      {
        name: `extract correct tokens and handle undefined`,
        file: `idl/test/hover-help/myfunc.pro`,
        position: [
          {
            line: 24,
            character: 12,
          },
          {
            line: 24,
            character: 20,
          },
          {
            line: 27,
            character: 6,
          },
          {
            line: 32,
            character: 6,
          },
          {
            line: 40,
            character: 13,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly finds no information for parameters in docs but not code`,
    fileName: `ex-3.spec.ts`,
    tests: [
      {
        name: `with keywords and arguments`,
        file: `idl/test/hover-help/only_code.pro`,
        position: [
          {
            line: 26,
            character: 2,
          },
          {
            line: 27,
            character: 2,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Verify hover-help for`,
    fileName: `init-methods.spec.ts`,
    tests: [
      {
        name: `init methods`,
        file: `idl/test/hover-help/init_method.pro`,
        position: [
          {
            line: 13,
            character: 14,
          },
          {
            line: 16,
            character: 19,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly provide hover help for`,
    fileName: `keywords.spec.ts`,
    tests: [
      {
        name: `abbreviated keywords`,
        file: `idl/test/hover-help/keywords.pro`,
        position: [
          {
            line: 4,
            character: 13,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly display help for literal types`,
    fileName: `literal-types.spec.ts`,
    tests: [
      {
        name: `for numbers and strings`,
        file: `idl/test/hover-help/literal_types.pro`,
        position: [
          {
            line: 1,
            character: 2,
          },
          {
            line: 2,
            character: 2,
          },
          {
            line: 3,
            character: 2,
          },
          {
            line: 4,
            character: 2,
          },
          {
            line: 5,
            character: 2,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly does not provide hover help`,
    fileName: `no-end.spec.ts`,
    tests: [
      {
        name: `for end tokens but does for the beginning`,
        file: `idl/test/hover-help/middle_functions.pro`,
        position: [
          {
            line: 3,
            character: 6,
          },
          {
            line: 3,
            character: 10,
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
        name: `case 1`,
        file: `idl/test/hover-help/obj_new.pro`,
        position: [
          {
            line: 53,
            character: 12,
          },
        ],
      },
      {
        name: `case 2`,
        file: `idl/test/hover-help/obj_new.pro`,
        position: [
          {
            line: 56,
            character: 12,
          },
        ],
      },
      {
        name: `keywords`,
        file: `idl/test/hover-help/obj_new.pro`,
        position: [
          {
            line: 56,
            character: 35,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Provide hover help for`,
    fileName: `structures.spec.ts`,
    tests: [
      {
        name: `anonymous structures`,
        file: `idl/test/hover-help/structures.pro`,
        position: [
          {
            line: 8,
            character: 10,
          },
          {
            line: 9,
            character: 12,
          },
          {
            line: 10,
            character: 14,
          },
          {
            line: 11,
            character: 12,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Provide hover help for`,
    fileName: `structures-properties.spec.ts`,
    tests: [
      {
        name: `named structure properties`,
        file: `idl/test/hover-help/structures2.pro`,
        position: [
          {
            line: 13,
            character: 24,
          },
          {
            line: 13,
            character: 34,
          },
        ],
      },
      {
        name: `anonymous structure properties`,
        file: `idl/test/hover-help/structures2.pro`,
        position: [
          {
            line: 15,
            character: 9,
          },
          {
            line: 15,
            character: 25,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly provide hover help for`,
    fileName: `syntax-errors.spec.ts`,
    tests: [
      {
        name: `incorrect function call`,
        file: `idl/test/hover-help/syntax_error.pro`,
        position: [
          {
            line: 1,
            character: 8,
          },
        ],
      },
      {
        name: `the end of the function call start (regression test for crash)`,
        file: `idl/test/hover-help/syntax_error.pro`,
        position: [
          {
            line: 1,
            character: 11,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Task type hover help`,
    fileName: `tasks.spec.ts`,
    tests: [
      {
        name: `as regression for task type parsing and serialization`,
        file: `idl/test/hover-help/tasks.pro`,
        position: [
          {
            line: 13,
            character: 14,
          },
          {
            line: 14,
            character: 14,
          },
          {
            line: 15,
            character: 14,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly provide hover help for`,
    fileName: `variables.spec.ts`,
    tests: [
      {
        name: `system variables`,
        file: `idl/test/hover-help/variables.pro`,
        position: [
          {
            line: 5,
            character: 2,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly provide hover help for`,
    fileName: `type-detection.methods.spec.ts`,
    tests: [
      {
        name: `function method`,
        file: `idl/test/hover-help/types.pro`,
        position: [
          {
            line: 10,
            character: 13,
          },
        ],
      },
      {
        name: `procedure methods`,
        file: `idl/test/hover-help/types.pro`,
        position: [
          {
            line: 13,
            character: 6,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly provide hover help for`,
    fileName: `type-detection.properties.spec.ts`,
    tests: [
      {
        name: `first level properties that exist`,
        file: `idl/test/hover-help/types.pro`,
        position: [
          {
            line: 16,
            character: 16,
          },
        ],
      },
      {
        name: `secondary properties that exist`,
        file: `idl/test/hover-help/types.pro`,
        position: [
          {
            line: 16,
            character: 23,
          },
        ],
      },
      {
        name: `first level properties that dont exist`,
        file: `idl/test/hover-help/types.pro`,
        position: [
          {
            line: 19,
            character: 16,
          },
        ],
      },
      {
        name: `secondary properties that dont exist`,
        file: `idl/test/hover-help/types.pro`,
        position: [
          {
            line: 22,
            character: 25,
          },
        ],
      },
      {
        name: `static properties that exist`,
        file: `idl/test/hover-help/types.pro`,
        position: [
          {
            line: 25,
            character: 16,
          },
        ],
      },
      {
        name: `static properties that dont exist`,
        file: `idl/test/hover-help/types.pro`,
        position: [
          {
            line: 28,
            character: 22,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly provide hover help for`,
    fileName: `type-detection.methods-inheritance.spec.ts`,
    tests: [
      {
        name: `function method`,
        file: `idl/test/hover-help/types_inheritance.pro`,
        position: [
          {
            line: 10,
            character: 13,
          },
        ],
      },
      {
        name: `procedure methods`,
        file: `idl/test/hover-help/types_inheritance.pro`,
        position: [
          {
            line: 13,
            character: 6,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly provide hover help for inheritance of`,
    fileName: `type-detection.properties-inheritance.spec.ts`,
    tests: [
      {
        name: `first level properties that exist`,
        file: `idl/test/hover-help/types_inheritance.pro`,
        position: [
          {
            line: 16,
            character: 16,
          },
        ],
      },
      {
        name: `secondary properties that exist`,
        file: `idl/test/hover-help/types_inheritance.pro`,
        position: [
          {
            line: 16,
            character: 23,
          },
        ],
      },
      {
        name: `first level properties that dont exist`,
        file: `idl/test/hover-help/types_inheritance.pro`,
        position: [
          {
            line: 19,
            character: 16,
          },
        ],
      },
      {
        name: `secondary properties that dont exist`,
        file: `idl/test/hover-help/types_inheritance.pro`,
        position: [
          {
            line: 22,
            character: 25,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly provide hover help for system variable`,
    fileName: `type-detection.sysvar.spec.ts`,
    tests: [
      {
        name: `properties that exist`,
        file: `idl/test/hover-help/types_sysvar.pro`,
        position: [
          {
            line: 3,
            character: 15,
          },
        ],
      },
      {
        name: `properties that don't exist`,
        file: `idl/test/hover-help/types_sysvar.pro`,
        position: [
          {
            line: 4,
            character: 14,
          },
        ],
      },
    ],
  },
  {
    suiteName: `Correctly provide hover help for keywords`,
    fileName: `type-detection.keywords.spec.ts`,
    tests: [
      {
        name: `in method calls`,
        file: `idl/test/hover-help/types_keywords.pro`,
        position: [
          {
            line: 10,
            character: 27,
          },
          {
            line: 12,
            character: 19,
          },
          {
            line: 12,
            character: 27,
          },
        ],
      },
    ],
  },
];
