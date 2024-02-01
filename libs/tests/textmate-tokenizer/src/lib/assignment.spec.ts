import { TextMateParse } from '@idl/tests/helpers';

describe(`[auto generated] Validates assignment parsing`, () => {
  it(`[auto generated] parses variable assignment`, async () => {
    // test code to extract tokens from
    const code = [`a = 5`];

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
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses system variable assignment`, async () => {
    // test code to extract tokens from
    const code = [`!null = 5`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '!null',
        startIndex: 0,
        endIndex: 5,
        scopes: ['source.idl', 'constant.language.idl'],
      },
      {
        line: 0,
        match: '=',
        startIndex: 6,
        endIndex: 7,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '5',
        startIndex: 8,
        endIndex: 9,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] brackets with assignment`, async () => {
    // test code to extract tokens from
    const code = [`a[i] = b`];

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
        match: '[',
        startIndex: 1,
        endIndex: 2,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 0,
        match: 'i',
        startIndex: 2,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ']',
        startIndex: 3,
        endIndex: 4,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 0,
        match: '=',
        startIndex: 5,
        endIndex: 6,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: 'b',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses variable assignment with line continuation`, async () => {
    // test code to extract tokens from
    const code = [`z = $`, `  5`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'z',
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
        line: 1,
        match: '5',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] assignment with parentheses`, async () => {
    // test code to extract tokens from
    const code = [`(b) = 15`];

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
        match: 'b',
        startIndex: 1,
        endIndex: 2,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 2,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'meta.brace.round.idl',
        ],
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
        match: '15',
        startIndex: 6,
        endIndex: 8,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] procedure after assignment in loop and keyword`, async () => {
    // test code to extract tokens from
    const code = [`for i=0, myFunc(a=42) do print, i`];

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
        match: 'myFunc',
        startIndex: 9,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.call.func.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 15,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: 'a',
        startIndex: 16,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.call.func.idl',
          'parameter.usage.keyword.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 0,
        match: '=',
        startIndex: 17,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.call.func.idl',
          'parameter.usage.keyword.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '42',
        startIndex: 18,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.call.func.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 20,
        endIndex: 21,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: 'do',
        startIndex: 22,
        endIndex: 24,
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
        startIndex: 25,
        endIndex: 30,
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
        startIndex: 30,
        endIndex: 31,
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
        startIndex: 32,
        endIndex: 33,
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
});
