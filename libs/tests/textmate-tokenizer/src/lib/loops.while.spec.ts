import { TextMateParse } from '@idl/test-helpers';

describe(`[auto generated] Validates while loop parsing`, () => {
  it(`[auto generated] parses basic while loop`, async () => {
    // test code to extract tokens from
    const code = [`while !true do print, i`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'while',
        startIndex: 0,
        endIndex: 5,
        scopes: ['source.idl', 'group.loop.whileidl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: '!true',
        startIndex: 6,
        endIndex: 11,
        scopes: ['source.idl', 'group.loop.whileidl', 'constant.language.idl'],
      },
      {
        line: 0,
        match: 'do',
        startIndex: 12,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.loop.whileidl',
          'group.loop.do.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'print',
        startIndex: 15,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.loop.whileidl',
          'group.loop.do.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 20,
        endIndex: 21,
        scopes: [
          'source.idl',
          'group.loop.whileidl',
          'group.loop.do.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'i',
        startIndex: 22,
        endIndex: 23,
        scopes: [
          'source.idl',
          'group.loop.whileidl',
          'group.loop.do.idl',
          'group.call.pro.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses basic nested while loop`, async () => {
    // test code to extract tokens from
    const code = [`while !true do while !false do print, i`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'while',
        startIndex: 0,
        endIndex: 5,
        scopes: ['source.idl', 'group.loop.whileidl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: '!true',
        startIndex: 6,
        endIndex: 11,
        scopes: ['source.idl', 'group.loop.whileidl', 'constant.language.idl'],
      },
      {
        line: 0,
        match: 'do',
        startIndex: 12,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.loop.whileidl',
          'group.loop.do.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: ' while',
        startIndex: 14,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.loop.whileidl',
          'group.loop.do.idl',
          'group.loop.whileidl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: '!false',
        startIndex: 21,
        endIndex: 27,
        scopes: [
          'source.idl',
          'group.loop.whileidl',
          'group.loop.do.idl',
          'group.loop.whileidl',
          'constant.language.idl',
        ],
      },
      {
        line: 0,
        match: 'do',
        startIndex: 28,
        endIndex: 30,
        scopes: [
          'source.idl',
          'group.loop.whileidl',
          'group.loop.do.idl',
          'group.loop.whileidl',
          'group.loop.do.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'print',
        startIndex: 31,
        endIndex: 36,
        scopes: [
          'source.idl',
          'group.loop.whileidl',
          'group.loop.do.idl',
          'group.loop.whileidl',
          'group.loop.do.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 36,
        endIndex: 37,
        scopes: [
          'source.idl',
          'group.loop.whileidl',
          'group.loop.do.idl',
          'group.loop.whileidl',
          'group.loop.do.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'i',
        startIndex: 38,
        endIndex: 39,
        scopes: [
          'source.idl',
          'group.loop.whileidl',
          'group.loop.do.idl',
          'group.loop.whileidl',
          'group.loop.do.idl',
          'group.call.pro.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses basic while loop with line continuation`, async () => {
    // test code to extract tokens from
    const code = [`while !true do $`, `  print,  $`, `  i`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'while',
        startIndex: 0,
        endIndex: 5,
        scopes: ['source.idl', 'group.loop.whileidl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: '!true',
        startIndex: 6,
        endIndex: 11,
        scopes: ['source.idl', 'group.loop.whileidl', 'constant.language.idl'],
      },
      {
        line: 0,
        match: 'do',
        startIndex: 12,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.loop.whileidl',
          'group.loop.do.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: '$',
        startIndex: 15,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.loop.whileidl',
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
          'group.loop.whileidl',
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
          'group.loop.whileidl',
          'group.loop.do.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: '$',
        startIndex: 10,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.loop.whileidl',
          'group.loop.do.idl',
          'group.call.pro.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 2,
        match: 'i',
        startIndex: 2,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.loop.whileidl',
          'group.loop.do.idl',
          'group.call.pro.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses basic while loop with block`, async () => {
    // test code to extract tokens from
    const code = [`while (a eq 5) do begin`, `  !null = myFunc(i)`, `endwhile`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'while',
        startIndex: 0,
        endIndex: 5,
        scopes: ['source.idl', 'group.loop.whileidl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: '(',
        startIndex: 6,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.loop.whileidl',
          'group.brackets.paren.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: 'a',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.loop.whileidl',
          'group.brackets.paren.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: 'eq',
        startIndex: 9,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.loop.whileidl',
          'group.brackets.paren.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: '5',
        startIndex: 12,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.loop.whileidl',
          'group.brackets.paren.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 13,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.loop.whileidl',
          'group.brackets.paren.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: 'do',
        startIndex: 15,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.loop.whileidl',
          'group.loop.do.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: ' begin',
        startIndex: 17,
        endIndex: 23,
        scopes: [
          'source.idl',
          'group.loop.whileidl',
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
          'group.loop.whileidl',
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
          'group.loop.whileidl',
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
          'group.loop.whileidl',
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
          'group.loop.whileidl',
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
          'group.loop.whileidl',
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
          'group.loop.whileidl',
          'group.loop.do.idl',
          'group.block.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 2,
        match: 'endwhile',
        startIndex: 0,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.loop.whileidl',
          'group.loop.do.idl',
          'group.block.idl',
          'keyword.control.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
