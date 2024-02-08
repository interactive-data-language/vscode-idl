import { IAutoAssemblerTest } from '../tests.interface';

/**
 * Automated tests with regards to problems that we fix
 */
export const AUTO_PROBLEM_FIXING_TESTS: IAutoAssemblerTest[] = [
  {
    suiteName: `Verify tokens after main get removed on formatting`,
    fileName: `code.3.after-main.spec.ts`,
    tests: [
      {
        name: `basic case`,
        code: [
          `compile_opt idl2`,
          `a = $ ; comment`,
          `  5`,
          `end`,
          ``,
          `; bad`,
          ` worse = not 42`,
        ],
      },
    ],
  },
  {
    suiteName: `Verify function to array for`,
    fileName: `code.14.colon-in-func.spec.ts`,
    tests: [
      {
        name: `basic case`,
        code: [`compile_opt idl2`, `coefs = coefs_spc(*, 0 : junk - 1)`, `end`],
      },
    ],
  },
  {
    suiteName: `Verify function method to array for`,
    fileName: `code.15.colon-in-func-method.spec.ts`,
    tests: [
      {
        name: `basic case`,
        code: [`compile_opt idl2`, `a = objOrStruct.var(0 : -1)`, `end`],
      },
    ],
  },
  {
    suiteName: `Verify we remove excess args`,
    fileName: `code.20.return-vals-pro.spec.ts`,
    tests: [
      {
        name: `for procedures`,
        code: [
          `;+`,
          `;-`,
          `pro myname`,
          `  compile_opt idl2`,
          ``,
          `  ; comment`,
          `  return, 42`,
          ``,
          `end`,
        ],
      },
      {
        name: `for procedure methods`,
        code: [
          `;+`,
          `;-`,
          `pro myclass::myname`,
          `  compile_opt idl2`,
          ``,
          `  a = 5`,
          `  return, 42`,
          `end`,
        ],
      },
      {
        name: `for main level programs`,
        code: [`; main`, `compile_opt idl2`, ``, `return, 42`, ``, `end`],
      },
    ],
  },
  {
    suiteName: `Verify we remove excess args`,
    fileName: `code.21.return-vals-func.spec.ts`,
    tests: [
      {
        name: `for functions`,
        code: [
          `;+`,
          `; :Returns:`,
          `;   any`,
          `;`,
          `;-`,
          `function myname`,
          `  compile_opt idl2`,
          ``,
          `  ;comment`,
          `  ; comment`,
          `  return, !null, $`,
          `    2, myfunc()`,
          `end`,
        ],
      },
      {
        name: `for function methods`,
        code: [
          `;+`,
          `; :Returns:`,
          `;   any`,
          `;`,
          `;-`,
          `function myclass::myname`,
          `  compile_opt idl2`,
          ``,
          `  a = 5`,
          `  return, !null, 2`,
          `end`,
        ],
      },
    ],
  },
  {
    suiteName: `Verify we add missing return statement`,
    fileName: `code.31.return-missing.spec.ts`,
    tests: [
      {
        name: `for functions`,
        code: [
          `;+`,
          `; :Returns:`,
          `;   any`,
          `;`,
          `;-`,
          `function myname`,
          `  compile_opt idl2`,
          ``,
          `  ;comment`,
          `end`,
        ],
      },
      {
        name: `for function methods`,
        code: [
          `;+`,
          `; :Returns:`,
          `;   any`,
          `;`,
          `;-`,
          `function myclass::myname`,
          `  compile_opt idl2`,
          ``,
          `  a = 5`,
          `end`,
        ],
      },
    ],
  },
  {
    suiteName: `Verify tokens after line continuation get removed on formatting`,
    fileName: `code.35.after-continuation.spec.ts`,
    tests: [
      {
        name: `basic case`,
        code: [`compile_opt idl2`, `a = $ 5 * bad ; comment`, `  5`, `end`],
      },
    ],
  },
  {
    suiteName: `Verify we add compile opt idl2`,
    fileName: `code.38.no-comp-opt.spec.ts`,
    tests: [
      {
        name: `for functions`,
        code: [
          `;+`,
          `; :Returns:`,
          `;   any`,
          `;`,
          `;-`,
          `function myfunc`,
          ``,
          `  return, 1`,
          `end`,
        ],
      },
      {
        name: `for function methods`,
        code: [
          `;+`,
          `; :Returns:`,
          `;   any`,
          `;`,
          `;-`,
          `function myclass::myfunc`,
          ``,
          `  return, 1`,
          `end`,
        ],
      },
      {
        name: `for procedures`,
        code: [`;+`, `;-`, `pro mypro`, ``, `end`],
      },
      {
        name: `for procedure methods`,
        code: [`;+`, `;-`, `pro myclass::mypro`, ``, `end`],
      },
      {
        name: `for main case 1`,
        code: [`; comment`, ``, `end`],
      },
      {
        name: `for main case 2`,
        code: [`a = 5`, ``, `end`],
      },
      {
        name: `for main case 3`,
        code: [``, `; comment`, ``, `a = 42`, ``, `end`],
      },
      {
        name: `for main case 4`,
        code: [``, `; comment`, ``, `a = 42`, ``, `end`],
      },
      {
        name: `with args and keywords`,
        code: [
          `function myfunc,$`,
          `a, b, $`,
          `kw2 = kw2`,
          ``,
          `  return, 1`,
          `end`,
        ],
      },
    ],
  },
  {
    suiteName: `Verify we add compile opt idl2`,
    fileName: `code.38.no-comp-opt.edge-cases.spec.ts`,
    tests: [
      {
        name: `for functions without names`,
        code: [
          `;+`,
          `; :Returns:`,
          `;   any`,
          `;`,
          `;-`,
          `function`,
          ``,
          `end`,
        ],
      },
      {
        name: `for procedures without names`,
        code: [`;+`, `; :Returns:`, `;   any`, `;`, `;-`, `pro`, ``, `end`],
      },
    ],
  },
  {
    suiteName: `Verify we add compile opt idl2`,
    fileName: `code.38.no-comp-opt.notebooks.spec.ts`,
    tests: [
      {
        name: `for functions`,
        code: [
          `;+`,
          `; :Returns:`,
          `;   any`,
          `;`,
          `;-`,
          `function myfunc`,
          ``,
          `  return, 1`,
          `end`,
        ],
        parseConfig: {
          isNotebook: true,
        },
      },
      {
        name: `for function methods`,
        code: [
          `;+`,
          `; :Returns:`,
          `;   any`,
          `;`,
          `;-`,
          `function myclass::myfunc`,
          ``,
          `  return, 1`,
          `end`,
        ],
        parseConfig: {
          isNotebook: true,
        },
      },
      {
        name: `for procedures`,
        code: [`;+`, `;-`, `pro mypro`, ``, `end`],
        parseConfig: {
          isNotebook: true,
        },
      },
      {
        name: `for procedure methods`,
        code: [`;+`, `;-`, `pro myclass::mypro`, ``, `end`],
        parseConfig: {
          isNotebook: true,
        },
      },
      {
        name: `for main case 1`,
        code: [`; comment`, ``, `end`],
        parseConfig: {
          isNotebook: true,
        },
      },
      {
        name: `for main case 2`,
        code: [`a = 5`, ``, `end`],
        parseConfig: {
          isNotebook: true,
        },
      },
      {
        name: `for main case 3`,
        code: [``, `; comment`, ``, `a = 42`, ``, `end`],
        parseConfig: {
          isNotebook: true,
        },
      },
      {
        name: `for main case 4`,
        code: [``, `; comment`, ``, `a = 42`, ``, `end`],
        parseConfig: {
          isNotebook: true,
        },
      },
      {
        name: `with args and keywords`,
        code: [
          `function myfunc,$`,
          `a, b, $`,
          `kw2 = kw2`,
          ``,
          `  return, 1`,
          `end`,
        ],
        parseConfig: {
          isNotebook: true,
        },
      },
    ],
  },
  {
    suiteName: `Verify we change procedure init methods to function methods`,
    fileName: `code.76.init-method-pro.spec.ts`,
    tests: [
      {
        name: `without return statements`,
        code: [
          `PRO myclass2::init`,
          `  compile_opt idl2`,
          ``,
          `end`,
          ``,
          ``,
          `pro myclass::init`,
          `  compile_opt idl2`,
          ``,
          `  ; comment`,
          `end`,
        ],
      },
      {
        name: `with return statements`,
        code: [
          `pro myclass::init`,
          `  compile_opt idl2`,
          ``,
          `  ; comment`,
          `  return, !null`,
          `end`,
          ``,
          `PRO myclass2::init`,
          `  compile_opt idl2`,
          `  return`,
          `end`,
          ``,
          ``,
          `pro myclass::init`,
          `  compile_opt idl2`,
          `  return`,
          `end`,
        ],
      },
    ],
  },
  {
    suiteName: `Verify we correctly fix brackets for indexing`,
    fileName: `code.105.illegal-var-index.spec.ts`,
    tests: [
      {
        name: `for simple case`,
        code: [`;+ my var`, `a = 5`, ``, `!null = a()`, ``, `end`],
      },
      {
        name: `do no change when compile opt strictarr`,
        code: [`compile_opt strictarr`, `a = 5`, ``, `!null = a()`, ``, `end`],
      },
      {
        name: `do no change when compile opt idl2`,
        code: [`compile_opt idl2`, `a = 5`, ``, `!null = a()`, ``, `end`],
      },
      {
        name: `do no change when compile opt idl3`,
        code: [`compile_opt idl3`, `a = 5`, ``, `!null = a()`, ``, `end`],
      },
    ],
  },
  {
    suiteName: `Verify we remove excess args`,
    fileName: `dont-fix.when disabled.spec.ts`,
    tests: [
      {
        name: `for procedures`,
        code: [
          `;+`,
          `; idl-disable`,
          `;-`,
          `pro myname`,
          `  compile_opt idl2`,
          ``,
          `  ; comment`,
          `  return, 42`,
          ``,
          `end`,
        ],
      },
      {
        name: `for procedure methods`,
        code: [
          `;+`,
          `; idl-disable`,
          `;-`,
          `pro myclass::myname`,
          `  compile_opt idl2`,
          ``,
          `  a = 5`,
          `  return, 42`,
          `end`,
        ],
      },
      {
        name: `for main level programs`,
        code: [
          `; idl-disable`,
          `; main`,
          `compile_opt idl2`,
          ``,
          `return, 42`,
          ``,
          `end`,
        ],
      },
    ],
  },
];
