import { IAutoTest } from '../tests.interface';

/**
 * Automated tests to make sure post-processors for parsing do what they are
 * supposed to (i.e. map/tweak tokens)
 */
export const AUTO_POST_PROCESSOR_TESTS: IAutoTest[] = [
  {
    suiteName: `Correctly extract argument definitions from code`,
    fileName: `arg-defs.spec.ts`,
    tests: [
      {
        name: 'Convert variables to arguments in standard routine definitions',
        code: [
          `pro mypro, arg1, arg2, arg3, KW1=kw1,$ ; commment`,
          `  KW2 = kw2, KW3 = kw3`,
          `  compile_opt idl2`,
          ``,
          `end`,
        ],
      },
      {
        name: 'Convert variables to arguments in routine method definition',
        code: [
          `pro mypro, arg1, arg2, arg3, KW1=kw1,$ ; commment`,
          `  KW2 = kw2, KW3 = kw3`,
          `  compile_opt idl2`,
          ``,
          `end`,
        ],
      },
    ],
  },
  {
    suiteName: `Correctly map arrows`,
    fileName: `arrows.spec.ts`,
    tests: [
      {
        name: 'as procedure-method, but incomplete',
        code: [`compile_opt idl2`, `a->`, `end`],
      },
      {
        name: 'as function method, but incomplete',
        code: [`compile_opt idl2`, `a = b->`, `end`],
      },
    ],
  },
  {
    suiteName: `Correctly map comments to comment blocks`,
    fileName: `comment-blocks.1.spec.ts`,
    tests: [
      {
        name: 'ignore normal comments',
        code: [
          `compile_opt idl2`,
          `; i am properly ignored like i should be`,
          `a = 5`,
          `end`,
        ],
      },
      {
        name: 'single-line blocks',
        code: [
          `compile_opt idl2`,
          `;+ i am a basic block on only one line`,
          `a = 5`,
          `end`,
        ],
      },
      {
        name: 'multi-line blocks without end',
        code: [
          `compile_opt idl2`,
          `;+`,
          `; something about docs`,
          `; like, really cool information`,
          `a = 5`,
          `end`,
        ],
      },
      {
        name: 'multi-line blocks with close',
        code: [
          `compile_opt idl2`,
          `;+`,
          `; worlds greatest documenter`,
          `;- ended`,
          `a = 5`,
          `end`,
        ],
      },
      {
        name: 'multi-line blocks with close',
        code: [
          `compile_opt idl2`,
          `;+ definition of life`,
          `a = 42`,

          `;+ second definition of life`,
          `fortyTwo = 42`,
          `end`,
        ],
      },
    ],
  },
  {
    suiteName: `Advanced comment block cases`,
    fileName: `comment-blocks.2.spec.ts`,
    tests: [
      {
        name: 'end on block end and dont include excess comments',
        code: [
          `compile_opt idl2`,
          `;+`,
          `; worlds greatest documenter`,
          `;-`,
          `; not included in block`,
          `a = 5`,
          `end`,
        ],
      },
      {
        name: 'allow two blocks next to each other',
        code: [
          `compile_opt idl2`,
          `;+`,
          `; first block`,
          `;-`,
          `;+`,
          `; second block`,
          `;-`,
          `a = 5`,
          `end`,
        ],
      },
      {
        name: 'capture recursive blocks',
        code: [
          `compile_opt idl2`,
          `;+`,
          `; first block`,
          `;-`,
          ``,
          `if !true then begin`,
          `  ;+`,
          `  ; second block`,
          `  ;-`,
          `  a = 5`,
          `endif`,
          ``,
          `end`,
        ],
      },
    ],
  },
  {
    suiteName: `Confusing comment blocks `,
    fileName: `comment-blocks.3.spec.ts`,
    tests: [
      {
        name: 'ignore markdown lists',
        code: [
          `compile_opt idl2`,
          `;+`,
          `; worlds greatest documenter`,
          `; - some bulleted list`,
          `; - some bulleted list`,
          `;-`,
          `a = 5`,
          `end`,
        ],
      },
    ],
  },
  {
    suiteName: `Correctly map options for compound control statements`,
    fileName: `control-options.spec.ts`,
    tests: [
      {
        name: 'Convert variables to control options',
        code: [
          `pro mypro`,
          `  compile_opt idl2`,
          `  common blockName ; ignore for now`,
          `  forward_function myfunc1, myfunc2, myfunc3`,
          `  goto, stmnt`,
          `  on_ioerror, stmnt`,
          ``,
          `end`,
        ],
      },
    ],
  },
  {
    suiteName: `Correctly map periods to dots`,
    fileName: `dot.spec.ts`,
    tests: [
      {
        name: 'as procedure-method or property access, but incomplete',
        code: [`compile_opt idl2`, `a.`, `end`],
      },
      {
        name: 'as function method or property access, but incomplete',
        code: [`compile_opt idl2`, `a = b.`, `end`],
      },
      {
        name: 'standalone 1',
        code: [`compile_opt idl2`, `a = .`, `end`],
      },
      {
        name: 'standalone 2',
        code: [`compile_opt idl2`, `.`, `end`],
      },
    ],
  },
  {
    suiteName: `Correctly extract keyword names from routine calls`,
    fileName: `keywords.spec.ts`,
    tests: [
      {
        name: 'Convert variables to keywords when calling procedures',
        code: [
          `compile_opt idl2`,
          `mypro, arg1, arg2, arg3, KW1=kw1,$ ; commment`,
          `  KW2 = kw2, KW3 = kw3`,
          ``,
          `end`,
        ],
      },
      {
        name: 'Convert variables to keywords when calling procedure methods',
        code: [
          `compile_opt idl2`,
          `obj.method, arg1, arg2, arg3, KW1=kw1,$ ; commment`,
          `  KW2 = kw2, KW3 = kw3`,
          ``,
          `end`,
        ],
      },
      {
        name: 'Convert variables to keywords when calling functions',
        code: [
          `compile_opt idl2`,
          `res = mypro(arg1, arg2, arg3, KW1=kw1,$ ; commment`,
          `  KW2 = kw2, KW3 = kw3)`,
          ``,
          `end`,
        ],
      },
      {
        name: 'Convert variables to keywords when calling function methods',
        code: [
          `compile_opt idl2`,
          `res = obj.method(arg1, arg2, arg3, KW1=kw1,$ ; commment`,
          `  KW2 = kw2, KW3 = kw3)`,
          ``,
          `end`,
        ],
      },
    ],
  },
  {
    suiteName: `Correctly detect binary keywords`,
    fileName: `keywords-binary.spec.ts`,
    tests: [
      {
        name: `in procedure`,
        code: `mypro, /kw1, /KW2`,
      },
      {
        name: `in procedure method`,
        code: [`myclass.method, $`, `  /KW3, KW=!true`],
      },
      {
        name: `in function`,
        code: `a = myfunc(/KW1, /KW2)`,
      },
      {
        name: `in function method`,
        code: [`ZACH = AWESOME.SAUCE(/kw3, $`, `/KW17, KW18 = !false)`],
      },
      {
        name: `preserve other children after keyword`,
        code: [
          `compile_opt idl2`,
          `tvcrs,x,y,/dev $	;Restore cursor`,
          `          kw=2`,
          ``,
          `end`,
        ],
      },
      {
        name: `properly handle comments in function calls`,
        code: [
          `compile_opt idl2`,
          `wDatatable = WIDGET_TABLE(id_datarow, $`,
          `;        FORMAT='(A)', $`,
          `  /RESIZEABLE_COLUMNS)`,
          ``,
          `end`,
        ],
      },
    ],
  },

  {
    suiteName: `Correctly extract keyword definitions`,
    fileName: `keyword-defs.spec.ts`,
    tests: [
      {
        name: 'Convert variables to keywords in standard routine definitions',
        code: [
          `pro mypro, arg1, arg2, arg3, KW1=kw1,$ ; commment`,
          `  KW2 = kw2, KW3 = kw3`,
          `  compile_opt idl2`,
          ``,
          `end`,
        ],
      },
      {
        name: 'Convert variables to keywords in routine method definition',
        code: [
          `pro mypro::mymethod, arg1, arg2, arg3, KW1=kw1,$ ; commment`,
          `  KW2 = kw2, KW3 = kw3`,
          `  compile_opt idl2`,
          ``,
          `end`,
        ],
      },
      {
        name: 'from complex example',
        code: [
          `function TS_HANTS2, timeseries, $`,
          `amplitudes = amp, $`,
          `delta = delta, $`,
          `dod = dod, $`,
          `double = double, $`,
          `err_tolerance = err_tolerance, $`,
          `; FREQUENCIES=freq, $`,
          `HIGH = HIGH, $`,
          `low = low, $`,
          `num_frequencies = num_frequencies, $`,
          `num_period = num_period, $`,
          `phases = phases, $`,
          `range_maximum = range_maximum, $`,
          `range_minimum = range_minimum, $`,
          `time_sample = time_sample, $`,
          `num_images = num_images`,
          ``,
          `compile_opt idl2`,
          ``,
          `a = IDL_Number.total()`,
          ``,
          `return, name`,
          `end`,
        ],
      },
    ],
  },
  {
    suiteName: `Correctly maps main level tokens`,
    fileName: `main.spec.ts`,
    tests: [
      {
        name: `do nothing without main level`,
        code: [`function myfunc`, `compile_opt idl2`, `  return,1`, `end`],
      },
      {
        name: `process single-line code 1`,
        code: [`a = plot(/TEST)`],
      },
      {
        name: `process single-line code 2`,
        code: [`a = \`\${42, '42'}\${42, '42'}\``],
      },
      {
        name: `catch correct`,
        code: [
          `function myfunc`,
          `  compile_opt idl2`,
          `  return,1`,
          `end`,
          ``,
          `compile_opt idl2`,
          `; main level`,
          `something = 42`,
          `end`,
        ],
      },
      {
        name: `catch with no end`,
        code: [
          `function myfunc`,
          `  compile_opt idl2`,
          `  return,1`,
          `end`,
          ``,
          `compile_opt idl2`,
          `; main level`,
          `something = 42`,
        ],
      },
      {
        name: `catch with statements after the end`,
        code: [
          `function myfunc`,
          `  compile_opt idl2`,
          `  return,1`,
          `end`,
          ``,
          `compile_opt idl2`,
          `; main level`,
          `something = 42`,
          `end`,
          `; bad comment`,
          `something = else`,
        ],
      },
      {
        name: `ignore only comments 1`,
        code: [
          `function myfunc`,
          `  compile_opt idl2`,
          `  return,1`,
          `end`,
          ``,
          `; main level`,
          `; another comment`,
        ],
      },
      {
        name: `ignore only comments 2`,
        code: [
          `function myfunc`,
          `  compile_opt idl2`,
          `  return,1`,
          `end ; -----------`,
          ``,
          `; main level`,
          `; another comment`,
        ],
      },
      {
        name: `edge case`,
        code: [
          `function myfunc`,
          `  compile_opt idl2`,
          `  return,1`,
          `end`,
          ``,
          `!null = myfunc()`,
        ],
      },
    ],
  },
  {
    suiteName: `Correctly identify pointer dereferencing`,
    fileName: `operator.pointer-deref.basic.spec.ts`,
    tests: [
      {
        name: `ignore multiplication`,
        code: [`a = 6 * 7`],
      },
      {
        name: `ignore multiplication`,
        code: [`a = (6) * (7)`],
      },
      {
        name: `assignment`,
        code: [`a = *var`],
      },
      {
        name: `after operators`,
        code: [`a = 5 + *var`],
      },
      {
        name: `after mod operator`,
        code: [`a = mod *var`],
      },
      {
        name: `after logical operators`,
        code: [`a = 5 le *var`],
      },
      {
        name: `single line`,
        code: [`*ptr = 42`],
      },
    ],
  },
  {
    suiteName: `Correctly identify pointer dereferencing`,
    fileName: `operator.pointer-deref.loops.spec.ts`,
    tests: [
      {
        name: `in for loop statements`,
        code: [`for i=*var, *other do *val = 42`],
      },
      {
        name: `in foreach loop statements`,
        code: [`foreach val, *thing, key do *val = 42`],
      },
      {
        name: `in while loop statements`,
        code: [`while *var do *val = 42`],
      },
      {
        name: `in repeat loop statements`,
        code: [`repeat *val = 42 until *var`],
      },
    ],
  },
  {
    suiteName: `Correctly identify pointer dereferencing`,
    fileName: `operator.pointer-deref.if.spec.ts`,
    tests: [
      {
        name: `in if-then-else`,
        code: [`if *val then *var = 42 else *var = 84`],
      },
    ],
  },
  {
    suiteName: `Correctly identify pointer dereferencing`,
    fileName: `operator.pointer-deref.case.spec.ts`,
    tests: [
      {
        name: `all parts of case statement`,
        code: [
          `compile_opt idl2`,
          `case *val of`,
          `  *thing: *other = 42`,
          `  else: *value = 84`,
          `endcase`,
          `end`,
        ],
      },
    ],
  },
  {
    suiteName: `Correctly identify pointer dereferencing`,
    fileName: `operator.pointer-deref.routines.spec.ts`,
    tests: [
      {
        name: `in functions`,
        code: [`a = func(*val, *other, kw=*last)`],
      },
      {
        name: `in function methods`,
        code: [`a = var.func(*val, *other, kw=*last)`],
      },
      {
        name: `in procedure definitions`,
        code: [
          `function mypro`,
          `  compile_opt idl2`,
          `  *val = 5`,
          `  *val2 = 5`,
          `  return, !null`,
          `end`,
        ],
      },
      {
        name: `in procedures`,
        code: [`mypro, *val, *other, kw=*last`],
      },
      {
        name: `in procedure methods`,
        code: [`var.mypro, *val, *other, kw=*last`],
      },
      {
        name: `in multi-line procedures`,
        code: [`mypro,$`, `  *val`, `end`],
      },
      {
        name: `in procedure definitions`,
        code: [
          `pro mypro`,
          `compile_opt idl2`,
          `  *val = 5`,
          `  *val2 = 5`,
          `  return`,
          `end`,
        ],
      },
    ],
  },
  {
    suiteName: `Correctly identify pointer dereferencing`,
    fileName: `operator.pointer-deref.paren.spec.ts`,
    tests: [
      {
        name: `as first statement in paren`,
        code: [`a = (*var)`],
      },
    ],
  },
  {
    suiteName: `Correctly identify pointer dereferencing`,
    fileName: `operator.pointer-deref.struct.spec.ts`,
    tests: [
      {
        name: `after structure properties`,
        code: [`a = {prop: *ptr}`],
      },
      {
        name: `after indexed structure properties`,
        code: [`a = var.(*thing)`],
      },
    ],
  },
  {
    suiteName: `Correctly identify pointer dereferencing`,
    fileName: `operator.pointer-deref.switch.spec.ts`,
    tests: [
      {
        name: `all parts of switch statement`,
        code: [
          ``,
          `compile_opt idl2`,
          `switch *val of`,
          `  *thing: *other = 42`,
          `  *thing2: *other = 42`,
          `  else: *value = 84`,
          `endcase`,
          `end`,
        ],
      },
    ],
  },
  {
    suiteName: `Correctly identify pointer dereferencing`,
    fileName: `operator.pointer-deref.ternary.spec.ts`,
    tests: [
      {
        name: `all parts of ternary operators`,
        code: [`a = *val ? *truthy : *falsy`],
      },
    ],
  },
  {
    suiteName: `Regression test for increment/decrement`,
    fileName: `operator.increment-decrement.regression.spec.ts`,
    tests: [
      {
        name: `operators`,
        code: [
          `compile_opt idl2`,
          `a = 5`,
          ``,
          `a++`,
          ``,
          `++a`,
          ``,
          `a++`,
          `end`,
        ],
      },
    ],
  },
  {
    suiteName: `Correctly identify array indexing`,
    fileName: `operator.indexing.array.spec.ts`,
    tests: [
      {
        name: `all parts of ternary operators`,
        code: [`compile_opt idl2`, `subsel = sel[*, 1:*val]`, `end`],
      },
    ],
  },
  {
    suiteName: `Correctly identify array indexing`,
    fileName: `operator.pointer-deref.regression.spec.ts`,
    tests: [
      {
        name: `instead of de-referencing`,
        code: [
          `compile_opt idl2`,
          `temp = reform(mask[i*8 : min([s[1] - 1, i*8 + 7]), j])`,
          `end`,
        ],
      },
    ],
  },
  {
    suiteName: `Correctly merge strings together`,
    fileName: `strings.spec.ts`,
    tests: [
      {
        name: `merge single quotes`,
        code: [`a = 'string''escaped'`],
      },
      {
        name: `merge double quotes`,
        code: [`a = "string""escaped"`],
      },
      {
        name: `ignore single quotes that cannot be merged`,
        code: [`a = 'string' 'escaped'`],
      },
      {
        name: `ignore double quotes that cannot be merged`,
        code: [`a = "string" "escaped"`],
      },
    ],
  },
  {
    suiteName: `Correctly identify variables instead of function calls`,
    fileName: `var-not-function.spec.ts`,
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
];
