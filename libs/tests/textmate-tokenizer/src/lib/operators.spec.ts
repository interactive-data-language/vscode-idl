import { TextMateParse } from '@idl/test-helpers';

describe(`[auto generated] Validates operator parsing`, () => {
  it(`[auto generated] close on braces`, async () => {
    // test code to extract tokens from
    const code = [`{1+2}`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '{',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'group.structure.idl', 'meta.brace.idl'],
      },
      {
        line: 0,
        match: '1+2',
        startIndex: 1,
        endIndex: 4,
        scopes: ['source.idl', 'group.structure.idl'],
      },
      {
        line: 0,
        match: '}',
        startIndex: 4,
        endIndex: 5,
        scopes: ['source.idl', 'group.structure.idl', 'meta.brace.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] close on brackets`, async () => {
    // test code to extract tokens from
    const code = [`[1+2]`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '[',
        startIndex: 0,
        endIndex: 1,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 0,
        match: '1',
        startIndex: 1,
        endIndex: 2,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: '+',
        startIndex: 2,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '2',
        startIndex: 3,
        endIndex: 4,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ']',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] close on parentheses`, async () => {
    // test code to extract tokens from
    const code = [`(1+2)`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '(',
        startIndex: 0,
        endIndex: 1,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '1',
        startIndex: 1,
        endIndex: 2,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: '+',
        startIndex: 2,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '2',
        startIndex: 3,
        endIndex: 4,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'meta.brace.round.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] close on commas`, async () => {
    // test code to extract tokens from
    const code = [`1+2,3+4`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '1',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: '+',
        startIndex: 1,
        endIndex: 2,
        scopes: ['source.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '2',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: ',',
        startIndex: 3,
        endIndex: 4,
        scopes: ['source.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '3',
        startIndex: 4,
        endIndex: 5,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: '+',
        startIndex: 5,
        endIndex: 6,
        scopes: ['source.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '4',
        startIndex: 6,
        endIndex: 7,
        scopes: ['source.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] close on then and else`, async () => {
    // test code to extract tokens from
    const code = [`if 1+2 then a = 3+4 else a = 4^3`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'if',
        startIndex: 0,
        endIndex: 2,
        scopes: ['source.idl', 'group.logic.if.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: '1',
        startIndex: 3,
        endIndex: 4,
        scopes: ['source.idl', 'group.logic.if.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: '+',
        startIndex: 4,
        endIndex: 5,
        scopes: ['source.idl', 'group.logic.if.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '2',
        startIndex: 5,
        endIndex: 6,
        scopes: ['source.idl', 'group.logic.if.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: 'then',
        startIndex: 7,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'a',
        startIndex: 12,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '=',
        startIndex: 14,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.assignment.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '3',
        startIndex: 16,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.assignment.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: '+',
        startIndex: 17,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.assignment.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '4',
        startIndex: 18,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.assignment.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: 'else',
        startIndex: 20,
        endIndex: 24,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'a',
        startIndex: 25,
        endIndex: 26,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '=',
        startIndex: 27,
        endIndex: 28,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'group.assignment.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '4',
        startIndex: 29,
        endIndex: 30,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'group.assignment.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: '^',
        startIndex: 30,
        endIndex: 31,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'group.assignment.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '3',
        startIndex: 31,
        endIndex: 32,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'group.assignment.idl',
          'constant.numeric.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] close on do in loops`, async () => {
    // test code to extract tokens from
    const code = [`for i=0, 99-1 do print, i`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'for',
        startIndex: 0,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'i',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '=',
        startIndex: 5,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '0',
        startIndex: 6,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '99',
        startIndex: 9,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: '-',
        startIndex: 11,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '1',
        startIndex: 12,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: 'do',
        startIndex: 14,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'print',
        startIndex: 17,
        endIndex: 22,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 22,
        endIndex: 23,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'i',
        startIndex: 24,
        endIndex: 25,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.call.pro.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] operators with line continuations`, async () => {
    // test code to extract tokens from
    const code = [`zach + $ `, `awesome`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'zach',
        startIndex: 0,
        endIndex: 4,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '+',
        startIndex: 5,
        endIndex: 6,
        scopes: ['source.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '$',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'awesome',
        startIndex: 0,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] operators end on "of"`, async () => {
    // test code to extract tokens from
    const code = [
      `case n_params()-1 of`,
      `  0: call_method, method_name, oObj[i], _extra=e`,
      `  1: call_method, method_name, oObj[i], p1, _extra=e`,
      `endcase`,
    ];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'case',
        startIndex: 0,
        endIndex: 4,
        scopes: ['source.idl', 'group.logic.case.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: 'n_params',
        startIndex: 5,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.call.func.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 13,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 14,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '-',
        startIndex: 15,
        endIndex: 16,
        scopes: ['source.idl', 'group.logic.case.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '1',
        startIndex: 16,
        endIndex: 17,
        scopes: ['source.idl', 'group.logic.case.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: 'of',
        startIndex: 18,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 1,
        match: '0',
        startIndex: 2,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 1,
        match: ':',
        startIndex: 3,
        endIndex: 4,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 1,
        match: 'call_method',
        startIndex: 5,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 1,
        match: ',',
        startIndex: 16,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'method_name',
        startIndex: 18,
        endIndex: 29,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 1,
        match: ',',
        startIndex: 29,
        endIndex: 30,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'oObj',
        startIndex: 31,
        endIndex: 35,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 1,
        match: '[',
        startIndex: 35,
        endIndex: 36,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 1,
        match: 'i',
        startIndex: 36,
        endIndex: 37,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'group.brackets.square.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 1,
        match: ']',
        startIndex: 37,
        endIndex: 38,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 1,
        match: ',',
        startIndex: 38,
        endIndex: 39,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: '_extra',
        startIndex: 40,
        endIndex: 46,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'parameter.usage.keyword.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 1,
        match: '=',
        startIndex: 46,
        endIndex: 47,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'parameter.usage.keyword.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'e',
        startIndex: 47,
        endIndex: 48,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 2,
        match: '1',
        startIndex: 2,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 2,
        match: ':',
        startIndex: 3,
        endIndex: 4,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 2,
        match: 'call_method',
        startIndex: 5,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 2,
        match: ',',
        startIndex: 16,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 2,
        match: 'method_name',
        startIndex: 18,
        endIndex: 29,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 2,
        match: ',',
        startIndex: 29,
        endIndex: 30,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 2,
        match: 'oObj',
        startIndex: 31,
        endIndex: 35,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 2,
        match: '[',
        startIndex: 35,
        endIndex: 36,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 2,
        match: 'i',
        startIndex: 36,
        endIndex: 37,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'group.brackets.square.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 2,
        match: ']',
        startIndex: 37,
        endIndex: 38,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 2,
        match: ',',
        startIndex: 38,
        endIndex: 39,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 2,
        match: 'p1',
        startIndex: 40,
        endIndex: 42,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 2,
        match: ',',
        startIndex: 42,
        endIndex: 43,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 2,
        match: '_extra',
        startIndex: 44,
        endIndex: 50,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'parameter.usage.keyword.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 2,
        match: '=',
        startIndex: 50,
        endIndex: 51,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'parameter.usage.keyword.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 2,
        match: 'e',
        startIndex: 51,
        endIndex: 52,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'group.logic.then.idl',
          'group.call.pro.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 3,
        match: 'endcase',
        startIndex: 0,
        endIndex: 7,
        scopes: ['source.idl', 'group.logic.case.idl', 'keyword.control.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] operators end on arrow function`, async () => {
    // test code to extract tokens from
    const code = [`*(*pState).pTitle->SetProperty, color=[255, 255, 255]`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '*',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'entity.name.type.idl'],
      },
      {
        line: 0,
        match: '(',
        startIndex: 1,
        endIndex: 2,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '*',
        startIndex: 2,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'entity.name.type.idl',
        ],
      },
      {
        line: 0,
        match: 'pState',
        startIndex: 3,
        endIndex: 9,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 9,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '.',
        startIndex: 10,
        endIndex: 11,
        scopes: ['source.idl'],
      },
      {
        line: 0,
        match: 'pTitle',
        startIndex: 11,
        endIndex: 17,
        scopes: ['source.idl', 'entity.other.attribute-name.idl'],
      },
      {
        line: 0,
        match: '->',
        startIndex: 17,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'SetProperty',
        startIndex: 19,
        endIndex: 30,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'support.function.idl-procedure-method',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 30,
        endIndex: 31,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'color',
        startIndex: 32,
        endIndex: 37,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'parameter.usage.keyword.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 0,
        match: '=',
        startIndex: 37,
        endIndex: 38,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'parameter.usage.keyword.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '[',
        startIndex: 38,
        endIndex: 39,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 0,
        match: '255',
        startIndex: 39,
        endIndex: 42,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.brackets.square.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ', ',
        startIndex: 42,
        endIndex: 44,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.brackets.square.idl',
        ],
      },
      {
        line: 0,
        match: '255',
        startIndex: 44,
        endIndex: 47,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.brackets.square.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ', ',
        startIndex: 47,
        endIndex: 49,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.brackets.square.idl',
        ],
      },
      {
        line: 0,
        match: '255',
        startIndex: 49,
        endIndex: 52,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.brackets.square.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ']',
        startIndex: 52,
        endIndex: 53,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] operators end on procedure method`, async () => {
    // test code to extract tokens from
    const code = [`*pTitle.SetProperty, color=[255, 255, 255]`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '*',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'entity.name.type.idl'],
      },
      {
        line: 0,
        match: 'pTitle',
        startIndex: 1,
        endIndex: 7,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '.',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'SetProperty',
        startIndex: 8,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'support.function.idl-procedure-method',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 19,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'color',
        startIndex: 21,
        endIndex: 26,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'parameter.usage.keyword.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 0,
        match: '=',
        startIndex: 26,
        endIndex: 27,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'parameter.usage.keyword.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '[',
        startIndex: 27,
        endIndex: 28,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 0,
        match: '255',
        startIndex: 28,
        endIndex: 31,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.brackets.square.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ', ',
        startIndex: 31,
        endIndex: 33,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.brackets.square.idl',
        ],
      },
      {
        line: 0,
        match: '255',
        startIndex: 33,
        endIndex: 36,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.brackets.square.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ', ',
        startIndex: 36,
        endIndex: 38,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.brackets.square.idl',
        ],
      },
      {
        line: 0,
        match: '255',
        startIndex: 38,
        endIndex: 41,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.brackets.square.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ']',
        startIndex: 41,
        endIndex: 42,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] operators do not end on function method`, async () => {
    // test code to extract tokens from
    const code = [`*pTitle.SetProperty(color=[255, 255, 255])`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '*',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'entity.name.type.idl'],
      },
      {
        line: 0,
        match: 'pTitle',
        startIndex: 1,
        endIndex: 7,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '.',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'SetProperty',
        startIndex: 8,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'entity.name.function.idl-method.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 19,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: 'color',
        startIndex: 20,
        endIndex: 25,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'parameter.usage.keyword.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 0,
        match: '=',
        startIndex: 25,
        endIndex: 26,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'parameter.usage.keyword.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '[',
        startIndex: 26,
        endIndex: 27,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 0,
        match: '255',
        startIndex: 27,
        endIndex: 30,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'group.brackets.square.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ', ',
        startIndex: 30,
        endIndex: 32,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'group.brackets.square.idl',
        ],
      },
      {
        line: 0,
        match: '255',
        startIndex: 32,
        endIndex: 35,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'group.brackets.square.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ', ',
        startIndex: 35,
        endIndex: 37,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'group.brackets.square.idl',
        ],
      },
      {
        line: 0,
        match: '255',
        startIndex: 37,
        endIndex: 40,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'group.brackets.square.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ']',
        startIndex: 40,
        endIndex: 41,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 41,
        endIndex: 42,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'meta.brace.round.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] operators do not end on function method`, async () => {
    // test code to extract tokens from
    const code = [`*pTitle->SetProperty(color=[255, 255, 255])`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '*',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'entity.name.type.idl'],
      },
      {
        line: 0,
        match: 'pTitle',
        startIndex: 1,
        endIndex: 7,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '->',
        startIndex: 7,
        endIndex: 9,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'SetProperty',
        startIndex: 9,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'entity.name.function.idl-method.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 20,
        endIndex: 21,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: 'color',
        startIndex: 21,
        endIndex: 26,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'parameter.usage.keyword.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 0,
        match: '=',
        startIndex: 26,
        endIndex: 27,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'parameter.usage.keyword.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '[',
        startIndex: 27,
        endIndex: 28,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 0,
        match: '255',
        startIndex: 28,
        endIndex: 31,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'group.brackets.square.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ', ',
        startIndex: 31,
        endIndex: 33,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'group.brackets.square.idl',
        ],
      },
      {
        line: 0,
        match: '255',
        startIndex: 33,
        endIndex: 36,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'group.brackets.square.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ', ',
        startIndex: 36,
        endIndex: 38,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'group.brackets.square.idl',
        ],
      },
      {
        line: 0,
        match: '255',
        startIndex: 38,
        endIndex: 41,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'group.brackets.square.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ']',
        startIndex: 41,
        endIndex: 42,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 42,
        endIndex: 43,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'meta.brace.round.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] special token for increment`, async () => {
    // test code to extract tokens from
    const code = [`++a`, `a++`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '++',
        startIndex: 0,
        endIndex: 2,
        scopes: ['source.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: 'a',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 1,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 1,
        match: '++',
        startIndex: 1,
        endIndex: 3,
        scopes: ['source.idl', 'keyword.operator.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] special token for decrement`, async () => {
    // test code to extract tokens from
    const code = [`--a`, `a+--`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '--',
        startIndex: 0,
        endIndex: 2,
        scopes: ['source.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: 'a',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 1,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 1,
        match: '+',
        startIndex: 1,
        endIndex: 2,
        scopes: ['source.idl', 'keyword.operator.idl'],
      },
      {
        line: 1,
        match: '--',
        startIndex: 2,
        endIndex: 4,
        scopes: ['source.idl', 'keyword.operator.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] next to each other`, async () => {
    // test code to extract tokens from
    const code = [`a = b++ + 5`];

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
        match: 'b',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '++',
        startIndex: 5,
        endIndex: 7,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '+',
        startIndex: 8,
        endIndex: 9,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '5',
        startIndex: 10,
        endIndex: 11,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
