import { IAutoTest } from '../tests.interface';

/**
 * Automated tests for token parsing and syntax highlighting
 */
export const AUTO_TOKEN_TESTS: IAutoTest[] = [
  {
    suiteName: `Validates assignment parsing`,
    fileName: `assignment.spec.ts`,
    tests: [
      { name: `parses variable assignment`, code: `a = 5` },
      { name: `parses system variable assignment`, code: `!null = 5` },
      { name: `brackets with assignment`, code: `a[i] = b` },
      {
        name: 'parses variable assignment with line continuation',
        code: [`z = $`, `  5`],
      },
      {
        name: `assignment with parentheses`,
        code: `(b) = 15`,
      },
      {
        name: `procedure after assignment in loop and keyword`,
        code: `for i=0, myFunc(a=42) do print, i`,
      },
    ],
  },
  {
    suiteName: `Validates block parsing auto-closes`,
    fileName: `blocks.spec.ts`,
    tests: [
      {
        name: `lib example from kruskal_wallis.pro`,
        code: [
          ``,
          `if !true then     $`,
          ``,
          `while !true DO BEGIN`,
          `  a = 42 `,
          `ENDWHILE $`,
          ``,
          `ELSE  stop = stop+1`,
          `end`,
        ],
      },
    ],
  },
  {
    suiteName: `Validates bracket parsing`,
    fileName: `brackets.spec.ts`,
    tests: [
      { name: `parses standalone brackets`, code: `[1 + 2]` },
      {
        name: `parses standalone brackets with line continuations`,
        code: [`[1 + $`, `  2]`],
      },
      {
        name: `indexing and compound expression`,
        code: `array1[1 + 2] * (1 + 2)`,
      },
      {
        name: `brackets with assignment`,
        code: `_a[i] = 5 * b`,
      },
      {
        name: `brackets with compound assignment`,
        code: `_aA$[i] *= b`,
      },
    ],
  },
  {
    suiteName: `Validates colon parsing`,
    fileName: `colon.spec.ts`,
    tests: [
      { name: `simple colon test`, code: `[:]` },
      { name: `array indexing`, code: `a[0:I] = 42` },
    ],
  },
  {
    suiteName: `Validates comma parsing (mostly covered elsewhere)`,
    fileName: `commas.spec.ts`,
    tests: [
      { name: `don't find commas on their own`, code: `,` },
      { name: `find commas in function`, code: `f(,)` },
      { name: `find commas in pro`, code: `p,` },
    ],
  },
  {
    suiteName: `Validates comment parsing`,
    fileName: `comments.spec.ts`,
    tests: [
      { name: `parses simple comments`, code: ` ; something()` },
      {
        name: `parses code with comments at the end`,
        code: `a = b() ; something()`,
      },
      {
        name: `parses simple comments with TODO`,
        code: ` ; TODO: something()`,
      },
      {
        name: `parses code with comments at the end with TODO`,
        code: `a = b() ; TODO: something()`,
      },
      {
        name: `parses code with comments and line continuations`,
        code: [`a = $ ; TODO: something()`, `  b()`],
      },
    ],
  },
  {
    suiteName: `Validates control statement parsing`,
    fileName: `control.1.spec.ts`,
    tests: [
      {
        name: `parses basic control statements`,
        code: [
          `break`,
          `continue`,
          `jump: a = func()`,
          `jump: mypro, $`,
          `  5`,
          `jumpy17$: ;comment`,
        ],
      },
      {
        name: `parses break in if statements`,
        code: `if !true then break`,
      },
      {
        name: `parses continue in if statements`,
        code: `if !true then continue`,
      },
      {
        name: `parses continue and break in loops`,
        code: [`for i=0,99 do begin`, `  continue`, `  break`, `endfor`],
      },
      {
        name: `parses jump in blocks`,
        code: [`for i=0,99 do begin`, `  jump:`, `endfor`],
      },
      {
        name: `parses compound control statements`,
        code: [
          `common, group, var1, var2, var3 ; comment`,
          `compile_opt, idl2, $ ; line continuation`,
          `  hidden`,
          `compile_opt`,
          `forward_function, idl2, hidden`,
          `goto, label`,
        ],
      },
      {
        name: 'goto in in statement',
        code: `if not wild then goto, done else printf, outunit`,
      },
      {
        name: 'statements end at line separator',
        code: 'GOTO, do_six & END',
      },
    ],
  },
  {
    suiteName: `Validates executive command parsing`,
    fileName: `executive-command.spec.ts`,
    tests: [
      { name: `simple 1`, code: `.compile` },
      { name: `simple 2`, code: `.run myfile.pro` },
      { name: `simple 3 start with spaces`, code: `  .run myfile.pro` },
      { name: `ignore methods`, code: `obj.method` },
      { name: `ignore properties`, code: `!null = obj.method` },
    ],
  },
  {
    suiteName: `Validates include statements, but not correct location`,
    fileName: `include.spec.ts`,
    tests: [
      {
        name: `basic test`,
        code: `@includeme`,
      },
      {
        name: `don't find in functions`,
        code: `a = myfunc(@bad)`,
      },
      {
        name: `find in loops`,
        code: `for i=0,99 do @very_wrong`,
      },
      {
        name: `don't find in expressions`,
        code: `a = @include_wrong + @way_bad`,
      },
      {
        name: `don't capture afterwards`,
        code: `@include.pro ; comment`,
      },
    ],
  },
  {
    suiteName: 'Validates lambda functions parsed as special token',
    fileName: 'lambda.spec.ts',
    tests: [
      {
        name: `correctly parse lambda functions`,
        code: `a = lambda(x:x+2)`,
      },
    ],
  },
  {
    suiteName: `Validates line modifier (separators)`,
    fileName: `line-modifiers.spec.ts`,
    tests: [
      {
        name: `parses multi-line as single-line`,
        code: [`a = a + b() & proc & a.procMethod,1 & $`, `a={struct}`],
      },
      {
        name: `loops properly stop in line modifier`,
        code: [
          `proc & for i=0,99 do print, i & while !true do b = awesome() & foreach val, b, key do print, key, val & endedit`,
        ],
      },
      {
        name: `line separators in case statement`,
        code: [
          `CASE typ OF`,
          `  7: begin val = "<Undefined>" & cnt = 1  & endcase`,
          `  8: val = tiff_sint(val, 0, len=cnt)`,
          `ENDCASE`,
        ],
      },
      {
        name: 'verifies nested line continuations use basic token',
        code: `scale=scale, $, $`,
      },
    ],
  },
  {
    suiteName: `Validates for if-then-else parsing [1]`,
    fileName: `logic.if-then-else.1.spec.ts`,
    tests: [
      { name: `parses basic if-then loop`, code: `if !true then print, 'yes'` },
      {
        name: `parses basic if-then-else loop`,
        code: `if ~doIt then print, 'yes' else a = yellow()`,
      },
      {
        name: `parses basic if-then loop with line continuation 1`,
        code: [`if !true $`, `  then print, 'yes'`],
      },
      {
        name: `parses basic if-then loop with line continuation 2`,
        code: [`if !true $`, `  then print $`, `  , 'yes'`],
      },
      {
        name: `parses basic if-then-else loop with line continuation 1`,
        code: [`if !true then print, 'yes' $`, `  else print, 'no'`],
      },
      {
        name: `parses basic if-then-else loop with line continuation 2`,
        code: [`if !true then print, 'yes' $`, `  else $`, `  print, 'no'`],
      },
      {
        name: `nested if-then-else`,
        code: `if ~(myFunc(_a17$) * 2) then if !false then print, 'yes'`,
      },
    ],
  },
  {
    suiteName: `Validates for if-then-else parsing [2]`,
    fileName: `logic.if-then-else.2.spec.ts`,
    tests: [
      {
        name: `with blocks [1]`,
        code: [
          `if a++ then begin`,
          `  super = awesome()`,
          `endif else print, 'else'`,
        ],
      },
    ],
  },
  {
    suiteName: `Validates for if-then-else parsing [3]`,
    fileName: `logic.if-then-else.3.spec.ts`,
    tests: [
      {
        name: `example from IDL code [1]`,
        code: `if i ne 0 then a[0, m1-i] = y ;Symmetrical`,
      },
      {
        name: `example from IDL code [2]`,
        code: [
          `if (ISA(equation)) then begin`,
          `  graphic.SetProperty, EQUATION=equation`,
          `  arg1 = equation`,
          `  if (ISA(style)) then arg2 = style`,
          `endif`,
        ],
      },
      {
        name: `example from IDL code [3]`,
        code: [
          `IF (nms[i-1, j] && ~marked[i-1, j]) THEN $`,
          `  canny_follow, i-1, j, nms, marked`,
        ],
      },
      {
        name: `example from IDL code [4]`,
        code: [
          `IF (max(step) && ~n_elements(stepflag)) THEN $`,
          `  suppMag = nmsupp_mask * mag`,
        ],
      },
      {
        name: `example from IDL code [5]`,
        code: [
          `if (~Isa(hDefinition, 'Hash') || $`,
          `    ~hDefinition.HasKey('schema') || $`,
          `    ~(hDefinition['schema']).StartsWith('IDLColorGradientDefinition', /FOLD_CASE)) then begin`,
          `  message, 'File does not contain a valid color gradient definition.', /NONAME `,
          `endif`,
        ],
      },
    ],
  },
  {
    suiteName: `Validates case statement`,
    fileName: `logic.case.1.spec.ts`,
    tests: [
      {
        name: `parses case loop with many syntaxes`,
        code: [
          `CASE x OF`,
          `   ; something cool`,
          `1 $`,
          `  : $`,
          `   PRINT, 'one' + func()`,
          `ELSE: BEGIN`,
          `   dat = {myStruct}`,
          `   PRINT, 'Please enter a value between 1 and 4'`,
          `   END`,
          `ENDCASE`,
        ],
      },
      {
        name: `nested case statement`,
        code: [
          `CASE x OF`,
          `1: PRINT, 'one'`,
          `ELSE: BEGIN`,
          `  CASE x OF`,
          `    2: PRINT, 'two'`,
          `    ELSE: BEGIN`,
          `    END`,
          `  ENDCASE`,
          `END`,
          `ENDCASE`,
        ],
      },
    ],
  },
  {
    suiteName: `Validates switch statement`,
    fileName: `logic.switch.1.spec.ts`,
    tests: [
      {
        name: `parses switch loop with many syntaxes`,
        code: [
          `SWITCH x OF`,
          `   ; something cool`,
          `1 $`,
          `  : $`,
          `   PRINT, 'one' + func()`,
          `ELSE: BEGIN`,
          `   dat = {myStruct}`,
          `   PRINT, 'Please enter a value between 1 and 4'`,
          `   END`,
          `ENDSWITCH`,
        ],
      },
      {
        name: `nested switch statement`,
        code: [
          `SWITCH x OF`,
          `1: PRINT, 'one'`,
          `ELSE: BEGIN`,
          `  SWITCH x OF`,
          `    2: PRINT, 'two'`,
          `    ELSE: BEGIN`,
          `    END`,
          `  ENDSWITCH`,
          `END`,
          `ENDSWITCH`,
        ],
      },
    ],
  },
  {
    suiteName: `Validates for ternary statement parsing`,
    fileName: `logic.ternary.1.spec.ts`,
    tests: [
      { name: `simplest ternary statement`, code: `a = something ? 5 : 6` },
      {
        name: `nested ternary statement grouped`,
        code: `a = !true ? (!false ? 7 : 8) : 6`,
      },
      {
        name: `nested ternary statement without grouping`,
        code: `mypro, something ? ~something ? 7 : 8 : 6, 2`,
      },
      {
        name: `ternary as argument`,
        code: `a = myfunc(something ? otherfunc() : !awesomesauce) + 3`,
      },
      {
        name: `operators end on ternary statements`,
        code: `a = 5*something ? 5- 4 : 6^3`,
      },
      {
        name: `multi-line ternary 1`,
        code: [`a = _myvar $`, `  ? 'jello' : "jelly"`],
      },
      {
        name: `multi-line ternary 2`,
        code: [
          `a = myfunc( $`,
          `  a,b,c)  ? b4d  $`,
          `  : $`,
          `  s1nt4x3x4mple`,
        ],
      },
      {
        name: `ternary works in braces as expected`,
        code: [`_17 = arr[!true ? 0 : -3: -1]`],
      },
    ],
  },
  {
    suiteName: `Validates for loop parsing`,
    fileName: `loops.for.spec.ts`,
    tests: [
      { name: `parses basic for loop`, code: `for i=0, 99 do print, i` },
      {
        name: `parses basic for loop with increment`,
        code: `for i=0, 99, 2 do !null = myFunc(i)`,
      },
      {
        name: `parses basic for loop with line continuation`,
        code: [`for i=0, jj do $`, `  print, i`],
      },
      {
        name: `parses basic for loop with block`,
        code: [`for i=0, 99 do begin`, `  !null = myFunc(i)`, `endfor`],
      },
      {
        name: `parses nested for loop`,
        code: `for i=0, 99 do for j=0, 99 do print, i + j`,
      },
    ],
  },
  {
    suiteName: `Validates foreach loop parsing`,
    fileName: `loops.foreach.spec.ts`,
    tests: [
      {
        name: `parses basic foreach loop`,
        code: `foreach val, arr do print, i`,
      },
      {
        name: `parses basic foreach loop with key`,
        code: `foreach val, arr, idx do !null = myFunc(i)`,
      },
      {
        name: `parses basic foreach loop with line continuation`,
        code: [`foreach val, arr do $`, `  print, i`],
      },
      {
        name: `parses basic foreach loop with block`,
        code: [
          `foreach val, arr do begin`,
          `  !null = myFunc(i)`,
          `endforeach`,
        ],
      },
      {
        name: `parses nested foreach loop`,
        code: `foreach val, arr do foreach val2, val do print, val2`,
      },
    ],
  },
  {
    suiteName: `Validates repeat loop parsing`,
    fileName: `loops.repeat.spec.ts`,
    tests: [
      {
        name: `parses basic repeat loop`,
        code: `REPEAT A = A * 2 UNTIL A GT B`,
      },
      {
        name: `parses procedure in repeat loop`,
        code: `REPEAT PRINT, A UNTIL A GT B`,
      },
      {
        name: `parses basic repeat loop with line continuations`,
        code: [`REPEAT A = $`, `  A * 2 UNTIL $`, `  A GT B`],
      },
      {
        name: `parses basic repeat loop with block`,
        code: [`REPEAT BEGIN`, `  A = A * 2`, `ENDREP UNTIL A GT B`],
      },
      {
        name: `correctly parses loops with if statements inside`,
        code: [`repeat if !true then break until !true`],
      },
    ],
  },
  {
    suiteName: `Validates while loop parsing`,
    fileName: `loops.while.spec.ts`,
    tests: [
      {
        name: `parses basic while loop`,
        code: `while !true do print, i`,
      },
      {
        name: `parses basic nested while loop`,
        code: `while !true do while !false do print, i`,
      },
      {
        name: `parses basic while loop with line continuation`,
        code: [`while !true do $`, `  print,  $`, `  i`],
      },
      {
        name: `parses basic while loop with block`,
        code: [`while (a eq 5) do begin`, `  !null = myFunc(i)`, `endwhile`],
      },
    ],
  },
  {
    suiteName: `Validates function method parsing`,
    fileName: `methods.functions.spec.ts`,
    tests: [
      {
        name: `parses function methods with dots`,
        code: `!NULL = a.myFunc(1)`,
      },
      {
        name: `parses function methods with arrows`,
        code: `!NULL = a->myFunc(1)`,
      },
      {
        name: `parses super function methods with dots`,
        code: `a.super::myfunc(1)`,
      },
      {
        name: `parses super function methods with arrows`,
        code: `a->super::myfunc(a)`,
      },
      {
        name: `parses function methods with dots and line continuation`,
        code: [`!NULL = a.myFunc( $`, `  1)`],
      },
      {
        name: `single-character function method`,
        code: `a.b()`,
      },
    ],
  },
  {
    suiteName: `Validates procedure method parsing`,
    fileName: `methods.procedures.spec.ts`,
    tests: [
      {
        name: `parses procedure methods with dots`,
        code: `a.myProc, 1`,
      },
      {
        name: `parses procedure methods with arrows`,
        code: `a->myProc, a`,
      },
      {
        name: `parses super procedure methods with dots`,
        code: `a.super::myProc, 1`,
      },
      {
        name: `parses super procedure methods with arrows`,
        code: `a->super::myProc, a`,
      },
      {
        name: `parses procedure methods with dots and line continuations`,
        code: [`a.myProc, $`, `  1`],
      },
      {
        name: `procedure method from IDL lib`,
        code: [
          `((*state).markers).Add, CGRAD_NEW_MARKER(POSITION=marker['position'], $`,
          `                                         COLOR=color, $`,
          `                                         MIDDLE=marker['middle'])`,
        ],
      },
      {
        name: `single-character procedure method`,
        code: `a.b`,
      },
    ],
  },
  {
    suiteName: 'Validates special cases for number parsing',
    fileName: 'numbers.spec.ts',
    tests: [
      {
        name: `correctly parse scientific notations`,
        code: [`a = -1e34`, `a = -1e34i`, `a = -1e34j`],
      },
      {
        name: `correctly parse scientific notations with negatives 1`,
        code: [`a = 1e-34`, `a = 1e-34i`, `a = 1e-34j`],
      },
      {
        name: `correctly parse scientific notations with negatives 2`,
        code: [`a = 1e-`, `a = 1e-i`, `a = 1e-j`],
      },
      {
        name: `correctly parse hex notation`,
        code: [
          `a = 0x8FFF + 0x8Fub + 0x8FulL`,
          `a = 0x8FFFI + 0x8FubI + 0x8FulLi`,
          `a = 0x8FFFJ + 0x8Fubj + 0x8FulLJ`,
        ],
      },
      {
        name: `correctly parse octal notation`,
        code: [
          `a = 0o8FFF + 0o8Fub + 0o8FulL`,
          `a = 0o8FFFI + 0o8FubI + 0o8FulLi`,
          `a = 0o8FFFJ + 0o8Fubj + 0o8FulLJ`,
        ],
      },
      {
        name: `correctly parse binary notation`,
        code: [
          `a = 0b8FFF + 0b8Fub + 0b8FulL`,
          `a = 0b8FFFI + 0b8FubI + 0b8FulLi`,
          `a = 0b8FFFJ + 0b8Fubj + 0b8FulLJ`,
        ],
      },
      {
        name: `correctly parse scientific notations with doubles`,
        code: [`a = -1d34`, `a = -1d34i`, `a = -1d34j`],
      },
      {
        name: `correctly parse scientific notations with doubles with negatives 1`,
        code: [`a = 1d-34`, `a = 1d-34i`, `a = 1d-34j`],
      },
      {
        name: `correctly parse scientific notations with doubles with negatives 2`,
        code: [`a = 1d-`, `a = 1d-i`, `a = 1d-j`],
      },
      {
        name: `correctly parse new syntax for complex`,
        code: [`a = 1i`, `a = 1j`],
      },
      {
        name: `catch unfinished dot statement 1`,
        code: `a.`,
      },
      {
        name: `catch unfinished dot statement 2`,
        code: `a = b.`,
      },
      {
        name: `catch standalone dot`,
        code: `a = .`,
      },
      {
        name: `edge case scientific`,
        code: `a = .1e+12`,
      },
      {
        name: `solo dot`,
        code: `.`,
      },
    ],
  },
  {
    suiteName: 'Validates special cases for number string parsing',
    fileName: 'number-string.spec.ts',
    tests: [
      {
        name: `verify octal parsing`,
        code: `"36 + "45`,
      },
      {
        name: `verify octal parsing`,
        code: `"36b + "45ull`,
      },
      {
        name: `verify single quote binary`,
        code: `'101010'b`,
      },
      {
        name: `verify single quote hex`,
        code: `'10101'x`,
      },
      {
        name: `verify single quote octal`,
        code: `'10101'o`,
      },
      {
        name: `verify double quote binary`,
        code: `"101010"b`,
      },
      {
        name: `verify double quote hex`,
        code: `"10101"x`,
      },
      {
        name: `verify double quote octal`,
        code: `"10101"o`,
      },
      {
        name: `verify case as hex`,
        code: `'7FFF'XS`,
      },
      {
        name: `verify case as hex`,
        code: `'8FFF'XS`,
      },
    ],
  },
  {
    suiteName: 'Validates special cases for number string parsing',
    fileName: 'number-string.complex-i.spec.ts',
    tests: [
      {
        name: `verify octal parsing`,
        code: `"36i + "45i`,
      },
      {
        name: `verify octal parsing`,
        code: `"36bi + "45ulli`,
      },
      {
        name: `verify single quote binary`,
        code: `'101010'bi`,
      },
      {
        name: `verify single quote hex`,
        code: `'10101'xi`,
      },
      {
        name: `verify single quote octal`,
        code: `'10101'oi`,
      },
      {
        name: `verify double quote binary`,
        code: `"101010"bi`,
      },
      {
        name: `verify double quote hex`,
        code: `"10101"xi`,
      },
      {
        name: `verify double quote octal`,
        code: `"10101"oi`,
      },
      {
        name: `verify case as hex`,
        code: `'7FFF'XSi`,
      },
      {
        name: `verify case as hex`,
        code: `'8FFF'XSi`,
      },
    ],
  },
  {
    suiteName: 'Validates special cases for number string parsing',
    fileName: 'number-string.complex-j.spec.ts',
    tests: [
      {
        name: `verify octal parsing`,
        code: `"36j + "45j`,
      },
      {
        name: `verify octal parsing`,
        code: `"36bj + "45ullj`,
      },
      {
        name: `verify single quote binary`,
        code: `'101010'bj`,
      },
      {
        name: `verify single quote hex`,
        code: `'10101'xj`,
      },
      {
        name: `verify single quote octal`,
        code: `'10101'oj`,
      },
      {
        name: `verify double quote binary`,
        code: `"101010"bj`,
      },
      {
        name: `verify double quote hex`,
        code: `"10101"xj`,
      },
      {
        name: `verify double quote octal`,
        code: `"10101"oj`,
      },
      {
        name: `verify case as hex`,
        code: `'7FFF'XSj`,
      },
      {
        name: `verify case as hex`,
        code: `'8FFF'XSj`,
      },
    ],
  },
  {
    suiteName: `Validates compound operator parsing`,
    fileName: `operators.compound.spec.ts`,
    tests: [
      {
        name: `parses with line continuation`,
        code: [`z *= $`, `  5`],
      },
      {
        name: `does not recurse with "||" operator`,
        code: `a || b || c`,
      },
      {
        name: `does not recurse with "or" operator`,
        code: `a or b or c`,
      },
      {
        name: `captures all statements with "&&" operator`,
        code: `a && b && c`,
      },
      {
        name: `captures all statements with "&&" operator`,
        code: `a and b and c`,
      },
    ],
  },
  {
    suiteName: `Validates operator parsing`,
    fileName: `operators.spec.ts`,
    tests: [
      {
        name: `close on braces`,
        code: `{1+2}`,
      },
      {
        name: `close on brackets`,
        code: `[1+2]`,
      },
      {
        name: `close on parentheses`,
        code: `(1+2)`,
      },
      {
        name: `close on commas`,
        code: `1+2,3+4`,
      },
      {
        name: `close on then and else`,
        code: `if 1+2 then a = 3+4 else a = 4^3`,
      },
      {
        name: `close on do in loops`,
        code: `for i=0, 99-1 do print, i`,
      },
      {
        name: 'operators with line continuations',
        code: [`zach + $ `, `awesome`],
      },
      {
        name: 'operators end on "of"',
        code: [
          `case n_params()-1 of`,
          `  0: call_method, method_name, oObj[i], _extra=e`,
          `  1: call_method, method_name, oObj[i], p1, _extra=e`,
          `endcase`,
        ],
      },
      {
        name: 'operators end on arrow function',
        code: `*(*pState).pTitle->SetProperty, color=[255, 255, 255]`,
      },
      {
        name: 'operators end on procedure method',
        code: `*pTitle.SetProperty, color=[255, 255, 255]`,
      },
      {
        name: 'operators do not end on function method',
        code: `*pTitle.SetProperty(color=[255, 255, 255])`,
      },
      {
        name: 'operators do not end on function method',
        code: `*pTitle->SetProperty(color=[255, 255, 255])`,
      },
      {
        name: 'special token for increment',
        code: [`++a`, `a++`],
      },
      {
        name: 'special token for decrement',
        code: [`--a`, `a+--`],
      },
      {
        name: 'next to each other',
        code: `a = b++ + 5`,
      },
    ],
  },
  {
    suiteName: `Validates parentheses parsing`,
    fileName: `parentheses.spec.ts`,
    tests: [
      {
        name: `parses standalone parentheses`,
        code: `(1 + 2)`,
      },
      {
        name: `separate function from parentheses`,
        code: `myFunc(1 + 2) * (1 + 2)`,
      },
      {
        name: `parses standalone parentheses with line continuation`,
        code: [`(1 + $ `, `  2)`],
      },
    ],
  },
  {
    suiteName: `Validates prompt parsing`,
    fileName: `prompts.spec.ts`,
    tests: [
      {
        name: `parses IDL prompt`,
        code: `IDL> print, 42`,
      },
      {
        name: `parses ENVI prompt`,
        code: `ENVI> print, 17`,
      },
    ],
  },
  {
    suiteName: `Validates property parsing`,
    fileName: `properties.spec.ts`,
    tests: [
      {
        name: `parses property assignment`,
        code: `a.thing = 5`,
      },
      {
        name: `parses property access`,
        code: `b = a.thing`,
      },
      {
        name: `parses property access with line continuation`,
        code: [`b = $`, `  a.thing`],
      },
      {
        name: `parses nested property access`,
        code: `b = a.thing1.thing2`,
      },
      {
        name: `parses property access as arguments`,
        code: `myPro, a.thing, b.thing`,
      },
      {
        name: `property example from IDL lib`,
        code: `(*state).bottomSelection = lMarkers.Count()-1`,
      },
      {
        name: `structure property via indexing`,
        code: `a = b.(i)`,
      },
    ],
  },
  {
    suiteName: `Validates Python code parsing`,
    fileName: `python.spec.ts`,
    tests: [
      {
        name: `parses IDL prompt`,
        code: `>>>import numpy as np`,
      },
    ],
  },
  {
    suiteName: `Validates quote parsing`,
    fileName: `quotes.spec.ts`,
    tests: [
      {
        name: `parses standalone single quotes`,
        code: `'myFunc(1 + 2)'`,
      },
      {
        name: `parses standalone double quotes`,
        code: `"myFunc(1 + 2)"`,
      },
      {
        name: `verify single quotes without closing`,
        code: `'string`,
      },
      {
        name: `verify double quotes without closing`,
        code: `"string`,
      },
      {
        name: `confusing single quote`,
        code: `hDefinition['schema']).StartsWith('IDLColorGradientDefinition', /FOLD_CASE)`,
      },
      {
        name: `confusing double quote`,
        code: `hDefinition["schema"]).StartsWith("IDLColorGradientDefinition", /FOLD_CASE)`,
      },
      {
        name: 'quotes end at important statements 1',
        code: [`if "bad-quote"then "bad-quote"else`],
      },
      {
        name: 'quotes end at important statements 2',
        code: [`case "bad-quote"of`],
      },
      {
        name: 'quotes end at important statements 3',
        code: [`for "bad-quote"do`],
      },
      {
        name: 'quotes end at important statements 4',
        code: [`repeat 'bad-quote'until`],
      },
      {
        name: 'quotes end at important statements 5',
        code: [`if 'bad-quote'then 'bad-quote'else`],
      },
      {
        name: 'quotes end at important statements 6',
        code: [`case 'bad-quote'of`],
      },
      {
        name: 'quotes end at important statements 7',
        code: [`for 'bad-quote'do`],
      },
      {
        name: 'quotes end at important statements 8',
        code: [`repeat 'bad-quote'until`],
      },
      {
        name: 'verifies quote vs number is correctly identified',
        code: [`arr = ["0.00000000"]`],
      },
    ],
  },
  {
    suiteName: `Validates escaped quote parsing`,
    fileName: `quotes.escaped.spec.ts`,
    tests: [
      {
        name: `simple single quote`,
        code: `'Resolve_Routine, ''%s'', Is_Function=%d'`,
      },
      {
        name: `simple double quote`,
        code: `"Resolve_Routine, ""%s"", Is_Function=%d"`,
      },
      {
        name: `complex single quote`,
        code: `'Resolve_Routine, ''%s'', Is_Function=%d''lots of''other''string'`,
      },
      {
        name: `complex double quote`,
        code: `"Resolve_Routine, ""%s"", Is_Function=%d""lots of""other""string"`,
      },
    ],
  },
  {
    suiteName: `Validates edge case quote parsing`,
    fileName: `quotes.edge-cases.spec.ts`,
    tests: [
      {
        name: `for number-string like strings`,
        code: `a = "5"`,
      },
    ],
  },
  {
    suiteName: `Validates function parsing`,
    fileName: `routines.functions.spec.ts`,
    tests: [
      {
        name: `parses standalone functions`,
        code: `myFunc(1 + 2)`,
      },
      {
        name: `parses nested functions`,
        code: `myFunc(myFunc2(_y7$) + 2)`,
      },
      {
        name: `separate function from parentheses`,
        code: `myFunc(1 + 2) * (1 + 2)`,
      },
      {
        name: `parses standalone functions with line continuations`,
        code: [`myFunc(1 $`, `  + 2)`],
      },
      {
        name: `single-character function`,
        code: `a()`,
      },
    ],
  },
  {
    suiteName: `Validates keyword parsing`,
    fileName: `routines.keywords.spec.ts`,
    tests: [
      {
        name: `parses keyword assignment`,
        code: `myfunc(a = 5)`,
      },
      {
        name: `parses multiple keywords`,
        code: `_otherfunc(a = 5, _b=42)`,
      },
      {
        name: `parses multiple keywords with line continuation`,
        code: [`myfunc(a = 5, $`, `  _b=42)`],
      },
      {
        name: `parses keyword assignment with line continuation`,
        code: [`myfunc(a $`, `  = 5)`],
      },
      {
        name: `parses variable assignment`,
        code: `_y = _superFunction(a = 5)`,
      },
    ],
  },
  {
    suiteName: `Validates procedure parsing`,
    fileName: `routines.procedures.spec.ts`,
    tests: [
      {
        name: `parses standalone procedures`,
        code: `myPro, 1 + 2`,
      },
      {
        name: `separate pro from variables`,
        code: `myPro, arg1, arg2`,
      },
      {
        name: `pro with line continuations`,
        code: [`myPro, $`, `  arg1, arg2`],
      },
      {
        name: `pro in loop after arguments and function`,
        code: `for i=0, 2*5-jello(1) do print, i`,
      },
      {
        name: `single-character procedure`,
        code: `a`,
      },
    ],
  },
  {
    suiteName: `Validates routine spacing`,
    fileName: `routines.spacing.spec.ts`,
    tests: [
      {
        name: `functions`,
        code: `myFunc    (1 + 2)`,
      },
      {
        name: `procedures`,
        code: `mypro   ,`,
      },
      {
        name: `function method (dots)`,
        code: `a . method ()`,
      },
      {
        name: `function method (arrow)`,
        code: `a -> method ()`,
      },
      {
        name: `procedure method 1 (dots)`,
        code: `a . method `,
      },
      {
        name: `procedure method 2 (dots)`,
        code: `a . method , `,
      },
      {
        name: `procedure method 1 (arrow)`,
        code: `a -> method `,
      },
      {
        name: `procedure method 2 (arrow)`,
        code: `a -> method , `,
      },
    ],
  },
  {
    suiteName: 'Validates routine parsing',
    fileName: 'routines.definitions.1.spec.ts',
    tests: [
      {
        name: 'verifies procedure with arguments and keywords',
        code: [
          `PRO EndMagic, arg1, $ ; comment`,
          `  arg2, KW1 = $`,
          `  kw1, KW2 = kw2`,
          ``,
          `END`,
        ],
      },
      {
        name: 'verifies functions with arguments and keywords',
        code: [
          `function myfunc, arg1, $ ; comment`,
          `  arg2, KW1 = $`,
          `  kw1, KW2 = kw2`,
          ``,
          `end`,
        ],
      },
      {
        name: 'verifies procedure method with arguments and keywords',
        code: [
          `PRO myclass::mymethod, arg1, $ ; comment`,
          `  ; skip empty lines`,
          `  arg2, KW1 = $`,
          `  kw1, KW2 = kw2`,
          ``,
          `END`,
        ],
      },
      {
        name: 'verifies function method with arguments and keywords',
        code: [
          `function myfuncclass::mymethod, arg1, $ ; comment`,
          ``,
          `  arg2, KW1 = $`,
          ``,
          `  kw1, KW2 = kw2`,
          ``,
          `end`,
        ],
      },
      {
        name: 'verifies more than one routine',
        code: [
          `Function f1`,
          `  return, 5`,
          `end`,
          ``,
          `pro p1`,
          `  print, 42`,
          `end`,
        ],
      },
    ],
  },
  {
    suiteName: 'Validates routine parsing',
    fileName: 'routines.definitions.2.spec.ts',
    tests: [
      {
        name: 'verifies we only stop on "end"',
        code: [`PRO EndMagic, Unit, Id`, `  PRINTF, Unit`, `END`],
      },
      {
        name: 'verifies we parse names with "!"',
        code: [`pro !sosobad,`, `END`],
      },
      {
        name: 'verifies we parse method names with "!"',
        code: [`pro !sosobad::method,`, `END`],
      },
      {
        name: 'routines in a very bad single-line',
        code: `FUNCTION VarName, Ptr & RETURN,'' & END`,
      },
    ],
  },
  {
    suiteName: `Verify string literal processing`,
    fileName: `string-literal.spec.ts`,
    tests: [
      {
        name: `simple with substitution`,
        code: `a = \`my string with \${expression + 5}\``,
      },
      {
        name: `simple without substitution`,
        code: `a = \`my string without substitution\``,
      },
      {
        name: `properly capture nested literals`,
        code: `a = \`start \${ \`nested\` }  else\``,
      },
      {
        name: `complex nested case`,
        code: `a = \`something \${func(a = b, \`nested\`, /kw) + 6*12} else \${5*5 + \`something\` + nested}  some\``,
      },
      {
        name: `parse escaped backticks`,
        code: `a = \`something \\\` included  \``,
      },
      {
        name: `preserve spacing when extracting tokens`,
        code: `a = \` first \``,
      },
      {
        name: `template literal string with formatting`,
        code: `a = \`\${1.234,"%10.3f"}\``,
      },
    ],
  },
  {
    suiteName: `Verify string literal processing with multi-line statements`,
    fileName: `string-literal.multiline.spec.ts`,
    tests: [
      {
        name: `preserve spacing and handle multi-line string literals`,
        code: [
          `compile_opt idl2`,
          `; thing`,
          `a = \` first`,
          `    second`,
          `  third`,
          `last\``,
          `end`,
        ],
      },
    ],
  },
  {
    suiteName: `Verify string literal escape characters`,
    fileName: `string-literal.escape.spec.ts`,
    tests: [
      {
        name: `for syntax highlighting`,
        code: [
          `compile_opt idl2`,
          `a = \`\\\`\``,
          `a = \`\\$\``,
          `a = \`\\\\\``,
          `a = \`\\b\``,
          `a = \`\\f\``,
          `a = \`\\n\``,
          `a = \`\\r\``,
          `a = \`\\t\``,
          `a = \`\\v\``,
          `a = \`\\x00 \\XaF\``,
          `a = \`\\a \``, // parse as escape, validator finds error
          `end`,
        ],
      },
    ],
  },
  {
    suiteName: `Validates structure parsing`,
    fileName: `structures.1.spec.ts`,
    tests: [
      {
        name: `verifies simplest structure parsing`,
        code: `_z5$ = {thing}`,
      },
      {
        name: `verifies multi-line structure name parsing`,
        code: [`_17$ = { $`, `  thing}`],
      },
      {
        name: `verifies simplest property parsing without structure name`,
        code: `_17$ = {thing:z}`,
      },
      {
        name: `verifies simplest property parsing without structure name and line continuation`,
        code: [`_17$ = { $`, `  thing:z}`],
      },
      {
        name: `verifies simplest nested structure parsing`,
        code: `_z5$ = {thing1:{thing2:z}}`,
      },
      {
        name: `verifies structure with inheritance`,
        code: `_z5$ = {thing, inherits _jklol}`,
      },
      {
        name: `verifies all components in single-line`,
        code: `a17 = {_th1g, abc:def, b:5, c:f()}`,
      },
    ],
  },
  {
    suiteName: `Validates structure parsing`,
    fileName: `structures.2.spec.ts`,
    tests: [
      {
        name: `verifies multiple structure names (even though wrong syntax)`,
        code: `a = {one,two,three,inherits thing, inherits other, prop:5} ; comment`,
      },
      {
        name: `verifies nested structures, line continuations, and comments`,
        code: [`_17$ = { $ ; something`, `  thing: {name, some:value}}`],
      },
      {
        name: `verifies weird syntax for named structures`,
        code: [
          `new_event = {FILESEL_EVENT, parent, ev.top, 0L, $`,
          `path+filename, 0L, theFilter}`,
        ],
      },
      {
        name: `structure names with exclamation points`,
        code: `a = {!exciting}`,
      },
      {
        name: `structure names and then line continuation`,
        code: `void = {mlLabelingTool_GraphicOverlay            $`,
      },
      {
        name: `inherits supports spaces`,
        code: [`  void = {IDLitDataIDLArray2D, $`, `  inherits   IDLitData}`],
      },
    ],
  },
  {
    suiteName: `Validates unexpected closer parsing`,
    fileName: `unexpected.1.spec.ts`,
    tests: [
      {
        name: `verifies we catch unexpected closers (other tests cover correctly catching real closers instead of these)`,
        code: [
          `)`,
          `]`,
          `}`,
          `endif`,
          `endelse`,
          `endfor`,
          `endforeach`,
          `endrep`,
          `endwhile`,
          `endswitch`,
          `endcase`,
          `end`,
        ],
      },
    ],
  },
  {
    suiteName: `Validates unknown token parsing`,
    fileName: `unknown.spec.ts`,
    tests: [
      {
        name: `improper arrow function`,
        code: `sEvent.component-> $`,
      },
      {
        name: `text after comment`,
        code: `a = $ bad bad`,
      },
      {
        name: 'unknown has right positioning with zero-width matches',
        code: 'scale=scale, $, $',
      },
    ],
  },
];
