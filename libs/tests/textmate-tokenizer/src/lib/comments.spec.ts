import { TextMateParse } from '@idl/test-helpers';

describe(`[auto generated] Validates comment parsing`, () => {
  it(`[auto generated] parses simple comments`, async () => {
    // test code to extract tokens from
    const code = [` ; something()`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '; something()',
        startIndex: 1,
        endIndex: 14,
        scopes: ['source.idl', 'comment.line.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses code with comments at the end`, async () => {
    // test code to extract tokens from
    const code = [`a = b() ; something()`];

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
          'group.call.func.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 5,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 6,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '; something()',
        startIndex: 8,
        endIndex: 21,
        scopes: ['source.idl', 'comment.line.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses simple comments with TODO`, async () => {
    // test code to extract tokens from
    const code = [` ; TODO: something()`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '; ',
        startIndex: 1,
        endIndex: 3,
        scopes: ['source.idl', 'comment.line.idl'],
      },
      {
        line: 0,
        match: 'TODO:',
        startIndex: 3,
        endIndex: 8,
        scopes: [
          'source.idl',
          'comment.line.idl',
          'constant.character.escape.idl',
        ],
      },
      {
        line: 0,
        match: ' something()',
        startIndex: 8,
        endIndex: 20,
        scopes: ['source.idl', 'comment.line.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses code with comments at the end with TODO`, async () => {
    // test code to extract tokens from
    const code = [`a = b() ; TODO: something()`];

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
          'group.call.func.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 5,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 6,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '; ',
        startIndex: 8,
        endIndex: 10,
        scopes: ['source.idl', 'comment.line.idl'],
      },
      {
        line: 0,
        match: 'TODO:',
        startIndex: 10,
        endIndex: 15,
        scopes: [
          'source.idl',
          'comment.line.idl',
          'constant.character.escape.idl',
        ],
      },
      {
        line: 0,
        match: ' something()',
        startIndex: 15,
        endIndex: 27,
        scopes: ['source.idl', 'comment.line.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses code with comments and line continuations`, async () => {
    // test code to extract tokens from
    const code = [`a = $ ; TODO: something()`, `  b()`];

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
        line: 0,
        match: '; ',
        startIndex: 6,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.line-continuation.idl',
          'comment.line.idl',
        ],
      },
      {
        line: 0,
        match: 'TODO:',
        startIndex: 8,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.line-continuation.idl',
          'comment.line.idl',
          'constant.character.escape.idl',
        ],
      },
      {
        line: 0,
        match: ' something()',
        startIndex: 13,
        endIndex: 25,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.line-continuation.idl',
          'comment.line.idl',
        ],
      },
      {
        line: 1,
        match: 'b',
        startIndex: 2,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 1,
        match: '(',
        startIndex: 3,
        endIndex: 4,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 1,
        match: ')',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
