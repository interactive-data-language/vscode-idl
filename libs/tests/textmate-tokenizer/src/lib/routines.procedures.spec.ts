import { TextMateParse } from '@idl/tests/helpers';

describe(`[auto generated] Validates procedure parsing`, () => {
  it(`[auto generated] parses standalone procedures`, async () => {
    // test code to extract tokens from
    const code = [`myPro, 1 + 2`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'myPro',
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
        match: '1',
        startIndex: 7,
        endIndex: 8,
        scopes: ['source.idl', 'group.call.pro.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: '+',
        startIndex: 9,
        endIndex: 10,
        scopes: ['source.idl', 'group.call.pro.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '2',
        startIndex: 11,
        endIndex: 12,
        scopes: ['source.idl', 'group.call.pro.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] separate pro from variables`, async () => {
    // test code to extract tokens from
    const code = [`myPro, arg1, arg2`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'myPro',
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
        match: 'arg1',
        startIndex: 7,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 11,
        endIndex: 12,
        scopes: ['source.idl', 'group.call.pro.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: 'arg2',
        startIndex: 13,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] pro with line continuations`, async () => {
    // test code to extract tokens from
    const code = [`myPro, $`, `  arg1, arg2`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'myPro',
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
        match: '$',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'arg1',
        startIndex: 2,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 1,
        match: ',',
        startIndex: 6,
        endIndex: 7,
        scopes: ['source.idl', 'group.call.pro.idl', 'keyword.operator.idl'],
      },
      {
        line: 1,
        match: 'arg2',
        startIndex: 8,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] pro in loop after arguments and function`, async () => {
    // test code to extract tokens from
    const code = [`for i=0, 2*5-jello(1) do print, i`];

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
        match: '2',
        startIndex: 9,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: '*',
        startIndex: 10,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '5',
        startIndex: 11,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: '-',
        startIndex: 12,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'jello',
        startIndex: 13,
        endIndex: 18,
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
        startIndex: 18,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '1',
        startIndex: 19,
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

  it(`[auto generated] single-character procedure`, async () => {
    // test code to extract tokens from
    const code = [`a`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
