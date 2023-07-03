import { TextMateParse } from '@idl/test-helpers';

describe(`[auto generated] Validates foreach loop parsing`, () => {
  it(`[auto generated] parses basic foreach loop`, async () => {
    // test code to extract tokens from
    const code = [`foreach val, arr do print, i`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'foreach',
        startIndex: 0,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'val',
        startIndex: 8,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ',',
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
        match: 'arr',
        startIndex: 13,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: 'do',
        startIndex: 17,
        endIndex: 19,
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
        startIndex: 20,
        endIndex: 25,
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
        startIndex: 25,
        endIndex: 26,
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
        startIndex: 27,
        endIndex: 28,
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

  it(`[auto generated] parses basic foreach loop with key`, async () => {
    // test code to extract tokens from
    const code = [`foreach val, arr, idx do !null = myFunc(i)`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'foreach',
        startIndex: 0,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'val',
        startIndex: 8,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ',',
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
        match: 'arr',
        startIndex: 13,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 16,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'idx',
        startIndex: 18,
        endIndex: 21,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'variable.other.readwrite.ts.idl',
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
        match: '!null',
        startIndex: 25,
        endIndex: 30,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'constant.language.idl',
        ],
      },
      {
        line: 0,
        match: '=',
        startIndex: 31,
        endIndex: 32,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.assignment.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'myFunc',
        startIndex: 33,
        endIndex: 39,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 39,
        endIndex: 40,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: 'i',
        startIndex: 40,
        endIndex: 41,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 41,
        endIndex: 42,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses basic foreach loop with line continuation`, async () => {
    // test code to extract tokens from
    const code = [`foreach val, arr do $`, `  print, i`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'foreach',
        startIndex: 0,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'val',
        startIndex: 8,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ',',
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
        match: 'arr',
        startIndex: 13,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: 'do',
        startIndex: 17,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: '$',
        startIndex: 20,
        endIndex: 21,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'print',
        startIndex: 2,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 1,
        match: ',',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'i',
        startIndex: 9,
        endIndex: 10,
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

  it(`[auto generated] parses basic foreach loop with block`, async () => {
    // test code to extract tokens from
    const code = [
      `foreach val, arr do begin`,
      `  !null = myFunc(i)`,
      `endforeach`,
    ];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'foreach',
        startIndex: 0,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'val',
        startIndex: 8,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ',',
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
        match: 'arr',
        startIndex: 13,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: 'do',
        startIndex: 17,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: ' begin',
        startIndex: 19,
        endIndex: 25,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.block.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 1,
        match: '!null',
        startIndex: 2,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.block.idl',
          'constant.language.idl',
        ],
      },
      {
        line: 1,
        match: '=',
        startIndex: 8,
        endIndex: 9,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.block.idl',
          'group.assignment.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'myFunc',
        startIndex: 10,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.block.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 1,
        match: '(',
        startIndex: 16,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.block.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 1,
        match: 'i',
        startIndex: 17,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.block.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 1,
        match: ')',
        startIndex: 18,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.block.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 2,
        match: 'endforeach',
        startIndex: 0,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.block.idl',
          'keyword.control.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses nested foreach loop`, async () => {
    // test code to extract tokens from
    const code = [`foreach val, arr do foreach val2, val do print, val2`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'foreach',
        startIndex: 0,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'val',
        startIndex: 8,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ',',
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
        match: 'arr',
        startIndex: 13,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: 'do',
        startIndex: 17,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'foreach',
        startIndex: 20,
        endIndex: 27,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.loop.for-foreach.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'val2',
        startIndex: 28,
        endIndex: 32,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.loop.for-foreach.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 32,
        endIndex: 33,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.loop.for-foreach.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'val',
        startIndex: 34,
        endIndex: 37,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.loop.for-foreach.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: 'do',
        startIndex: 38,
        endIndex: 40,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'print',
        startIndex: 41,
        endIndex: 46,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 46,
        endIndex: 47,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'val2',
        startIndex: 48,
        endIndex: 52,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
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
