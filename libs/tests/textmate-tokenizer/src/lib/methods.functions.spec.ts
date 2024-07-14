import { TextMateParse } from '@idl/tests/helpers';

describe(`[auto generated] Validates function method parsing`, () => {
  it(`[auto generated] parses function methods with dots`, async () => {
    // test code to extract tokens from
    const code = [`!NULL = a.myFunc(1)`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '!NULL',
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
        match: 'a',
        startIndex: 8,
        endIndex: 9,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '.',
        startIndex: 9,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'myFunc',
        startIndex: 10,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func-method.idl',
          'entity.name.function.idl-method.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 16,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func-method.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '1',
        startIndex: 17,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func-method.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 18,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func-method.idl',
          'meta.brace.round.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses function methods with arrows`, async () => {
    // test code to extract tokens from
    const code = [`!NULL = a->myFunc(1)`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '!NULL',
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
        match: 'a',
        startIndex: 8,
        endIndex: 9,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '->',
        startIndex: 9,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'myFunc',
        startIndex: 11,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func-method.idl',
          'entity.name.function.idl-method.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 17,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func-method.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '1',
        startIndex: 18,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func-method.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 19,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func-method.idl',
          'meta.brace.round.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses super function methods with dots`, async () => {
    // test code to extract tokens from
    const code = [`a.super::myfunc(1)`];

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
        match: '.',
        startIndex: 1,
        endIndex: 2,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'super::myfunc',
        startIndex: 2,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'entity.name.function.idl-method.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 15,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '1',
        startIndex: 16,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 17,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'meta.brace.round.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses super function methods with arrows`, async () => {
    // test code to extract tokens from
    const code = [`a->super::myfunc(a)`];

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
        match: '->',
        startIndex: 1,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'super::myfunc',
        startIndex: 3,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'entity.name.function.idl-method.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 16,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: 'a',
        startIndex: 17,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 18,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'meta.brace.round.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses function methods with dots and line continuation`, async () => {
    // test code to extract tokens from
    const code = [`!NULL = a.myFunc( $`, `  1)`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '!NULL',
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
        match: 'a',
        startIndex: 8,
        endIndex: 9,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '.',
        startIndex: 9,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'myFunc',
        startIndex: 10,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func-method.idl',
          'entity.name.function.idl-method.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 16,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func-method.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '$',
        startIndex: 18,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func-method.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: '1',
        startIndex: 2,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func-method.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 1,
        match: ')',
        startIndex: 3,
        endIndex: 4,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func-method.idl',
          'meta.brace.round.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] single-character function method`, async () => {
    // test code to extract tokens from
    const code = [`a.b()`];

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
        match: '.',
        startIndex: 1,
        endIndex: 2,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'b',
        startIndex: 2,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'entity.name.function.idl-method.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 3,
        endIndex: 4,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'meta.brace.round.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
