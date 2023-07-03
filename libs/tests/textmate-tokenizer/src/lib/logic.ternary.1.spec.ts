import { TextMateParse } from '@idl/test-helpers';

describe(`[auto generated] Validates for ternary statement parsing`, () => {
  it(`[auto generated] simplest ternary statement`, async () => {
    // test code to extract tokens from
    const code = [`a = something ? 5 : 6`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: 'something',
        startIndex: 4,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '?',
        startIndex: 14,
        endIndex: 15,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: '5',
        startIndex: 16,
        endIndex: 17,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: ' : ',
        startIndex: 17,
        endIndex: 20,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: '6',
        startIndex: 20,
        endIndex: 21,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] nested ternary statement grouped`, async () => {
    // test code to extract tokens from
    const code = [`a = !true ? (!false ? 7 : 8) : 6`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '!true',
        startIndex: 4,
        endIndex: 9,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.language.idl'],
      },
      {
        line: 0,
        match: '?',
        startIndex: 10,
        endIndex: 11,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: '(',
        startIndex: 12,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.brackets.paren.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '!false',
        startIndex: 13,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.brackets.paren.idl',
          'constant.language.idl',
        ],
      },
      {
        line: 0,
        match: '?',
        startIndex: 20,
        endIndex: 21,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.brackets.paren.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: '7',
        startIndex: 22,
        endIndex: 23,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.brackets.paren.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ' : ',
        startIndex: 23,
        endIndex: 26,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.brackets.paren.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: '8',
        startIndex: 26,
        endIndex: 27,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.brackets.paren.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 27,
        endIndex: 28,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.brackets.paren.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: ' : ',
        startIndex: 28,
        endIndex: 31,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: '6',
        startIndex: 31,
        endIndex: 32,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] nested ternary statement without grouping`, async () => {
    // test code to extract tokens from
    const code = [`mypro, something ? ~something ? 7 : 8 : 6, 2`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'mypro',
        startIndex: 0,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 5,
        endIndex: 6,
        scopes: ['source.idl', 'group.call.pro.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: 'something',
        startIndex: 7,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '?',
        startIndex: 17,
        endIndex: 18,
        scopes: ['source.idl', 'group.call.pro.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: '~',
        startIndex: 19,
        endIndex: 20,
        scopes: ['source.idl', 'group.call.pro.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: 'something',
        startIndex: 20,
        endIndex: 29,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '?',
        startIndex: 30,
        endIndex: 31,
        scopes: ['source.idl', 'group.call.pro.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: '7',
        startIndex: 32,
        endIndex: 33,
        scopes: ['source.idl', 'group.call.pro.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: ' : ',
        startIndex: 33,
        endIndex: 36,
        scopes: ['source.idl', 'group.call.pro.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: '8',
        startIndex: 36,
        endIndex: 37,
        scopes: ['source.idl', 'group.call.pro.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: ' : ',
        startIndex: 37,
        endIndex: 40,
        scopes: ['source.idl', 'group.call.pro.idl'],
      },
      {
        line: 0,
        match: '6',
        startIndex: 40,
        endIndex: 41,
        scopes: ['source.idl', 'group.call.pro.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: ',',
        startIndex: 41,
        endIndex: 42,
        scopes: ['source.idl', 'group.call.pro.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '2',
        startIndex: 43,
        endIndex: 44,
        scopes: ['source.idl', 'group.call.pro.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] ternary as argument`, async () => {
    // test code to extract tokens from
    const code = [`a = myfunc(something ? otherfunc() : !awesomesauce) + 3`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: 'myfunc',
        startIndex: 4,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 10,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: 'something',
        startIndex: 11,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '?',
        startIndex: 21,
        endIndex: 22,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'otherfunc',
        startIndex: 23,
        endIndex: 32,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'group.call.func.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 32,
        endIndex: 33,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 33,
        endIndex: 34,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: ' : ',
        startIndex: 34,
        endIndex: 37,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: '!awesomesauce',
        startIndex: 37,
        endIndex: 50,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'constant.language.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 50,
        endIndex: 51,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '+',
        startIndex: 52,
        endIndex: 53,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '3',
        startIndex: 54,
        endIndex: 55,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] operators end on ternary statements`, async () => {
    // test code to extract tokens from
    const code = [`a = 5*something ? 5- 4 : 6^3`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '5',
        startIndex: 4,
        endIndex: 5,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: '*',
        startIndex: 5,
        endIndex: 6,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: 'something',
        startIndex: 6,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '?',
        startIndex: 16,
        endIndex: 17,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: '5',
        startIndex: 18,
        endIndex: 19,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: '-',
        startIndex: 19,
        endIndex: 20,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '4',
        startIndex: 21,
        endIndex: 22,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: ' : ',
        startIndex: 22,
        endIndex: 25,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: '6',
        startIndex: 25,
        endIndex: 26,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: '^',
        startIndex: 26,
        endIndex: 27,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '3',
        startIndex: 27,
        endIndex: 28,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] multi-line ternary 1`, async () => {
    // test code to extract tokens from
    const code = [`a = _myvar $`, `  ? 'jello' : "jelly"`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '_myvar',
        startIndex: 4,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '$',
        startIndex: 11,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: '?',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.control.idl'],
      },
      {
        line: 1,
        match: "'",
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 1,
        match: 'jello',
        startIndex: 5,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 1,
        match: "'",
        startIndex: 10,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 1,
        match: ' : ',
        startIndex: 11,
        endIndex: 14,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.control.idl'],
      },
      {
        line: 1,
        match: '"',
        startIndex: 14,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 1,
        match: 'jelly',
        startIndex: 15,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 1,
        match: '"',
        startIndex: 20,
        endIndex: 21,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.quoted.double.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] multi-line ternary 2`, async () => {
    // test code to extract tokens from
    const code = [
      `a = myfunc( $`,
      `  a,b,c)  ? b4d  $`,
      `  : $`,
      `  s1nt4x3x4mple`,
    ];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: 'myfunc',
        startIndex: 4,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 10,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '$',
        startIndex: 12,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'a',
        startIndex: 2,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 1,
        match: ',',
        startIndex: 3,
        endIndex: 4,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'b',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 1,
        match: ',',
        startIndex: 5,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'c',
        startIndex: 6,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 1,
        match: ')',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 1,
        match: '?',
        startIndex: 10,
        endIndex: 11,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.control.idl'],
      },
      {
        line: 1,
        match: 'b4d',
        startIndex: 12,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 1,
        match: '$',
        startIndex: 17,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 2,
        match: '  : ',
        startIndex: 0,
        endIndex: 4,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.control.idl'],
      },
      {
        line: 2,
        match: '$',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 3,
        match: 's1nt4x3x4mple',
        startIndex: 2,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] ternary works in braces as expected`, async () => {
    // test code to extract tokens from
    const code = [`_17 = arr[!true ? 0 : -3: -1]`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '_17',
        startIndex: 0,
        endIndex: 3,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '=',
        startIndex: 4,
        endIndex: 5,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: 'arr',
        startIndex: 6,
        endIndex: 9,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '[',
        startIndex: 9,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 0,
        match: '!true',
        startIndex: 10,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.brackets.square.idl',
          'constant.language.idl',
        ],
      },
      {
        line: 0,
        match: '?',
        startIndex: 16,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.brackets.square.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: '0',
        startIndex: 18,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.brackets.square.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ' : ',
        startIndex: 19,
        endIndex: 22,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.brackets.square.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: '-',
        startIndex: 22,
        endIndex: 23,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.brackets.square.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '3',
        startIndex: 23,
        endIndex: 24,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.brackets.square.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ': ',
        startIndex: 24,
        endIndex: 26,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.brackets.square.idl',
        ],
      },
      {
        line: 0,
        match: '-',
        startIndex: 26,
        endIndex: 27,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.brackets.square.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '1',
        startIndex: 27,
        endIndex: 28,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.brackets.square.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ']',
        startIndex: 28,
        endIndex: 29,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
