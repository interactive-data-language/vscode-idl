import { TextMateParse } from '@idl/test-helpers';

describe(`[auto generated] Validates keyword parsing`, () => {
  it(`[auto generated] parses keyword assignment`, async () => {
    // test code to extract tokens from
    const code = [`myfunc(a = 5)`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'myfunc',
        startIndex: 0,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.call.func.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 6,
        endIndex: 7,
        scopes: ['source.idl', 'group.call.func.idl', 'meta.brace.round.idl'],
      },
      {
        line: 0,
        match: 'a',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.call.func.idl',
          'parameter.usage.keyword.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 0,
        match: ' =',
        startIndex: 8,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.call.func.idl',
          'parameter.usage.keyword.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '5',
        startIndex: 11,
        endIndex: 12,
        scopes: ['source.idl', 'group.call.func.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: ')',
        startIndex: 12,
        endIndex: 13,
        scopes: ['source.idl', 'group.call.func.idl', 'meta.brace.round.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses multiple keywords`, async () => {
    // test code to extract tokens from
    const code = [`_otherfunc(a = 5, _b=42)`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '_otherfunc',
        startIndex: 0,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.call.func.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 10,
        endIndex: 11,
        scopes: ['source.idl', 'group.call.func.idl', 'meta.brace.round.idl'],
      },
      {
        line: 0,
        match: 'a',
        startIndex: 11,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.call.func.idl',
          'parameter.usage.keyword.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 0,
        match: ' =',
        startIndex: 12,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.call.func.idl',
          'parameter.usage.keyword.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '5',
        startIndex: 15,
        endIndex: 16,
        scopes: ['source.idl', 'group.call.func.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: ',',
        startIndex: 16,
        endIndex: 17,
        scopes: ['source.idl', 'group.call.func.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '_b',
        startIndex: 18,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.call.func.idl',
          'parameter.usage.keyword.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 0,
        match: '=',
        startIndex: 20,
        endIndex: 21,
        scopes: [
          'source.idl',
          'group.call.func.idl',
          'parameter.usage.keyword.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '42',
        startIndex: 21,
        endIndex: 23,
        scopes: ['source.idl', 'group.call.func.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: ')',
        startIndex: 23,
        endIndex: 24,
        scopes: ['source.idl', 'group.call.func.idl', 'meta.brace.round.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses multiple keywords with line continuation`, async () => {
    // test code to extract tokens from
    const code = [`myfunc(a = 5, $`, `  _b=42)`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'myfunc',
        startIndex: 0,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.call.func.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 6,
        endIndex: 7,
        scopes: ['source.idl', 'group.call.func.idl', 'meta.brace.round.idl'],
      },
      {
        line: 0,
        match: 'a',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.call.func.idl',
          'parameter.usage.keyword.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 0,
        match: ' =',
        startIndex: 8,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.call.func.idl',
          'parameter.usage.keyword.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '5',
        startIndex: 11,
        endIndex: 12,
        scopes: ['source.idl', 'group.call.func.idl', 'constant.numeric.idl'],
      },
      {
        line: 0,
        match: ',',
        startIndex: 12,
        endIndex: 13,
        scopes: ['source.idl', 'group.call.func.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '$',
        startIndex: 14,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.call.func.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: '_b',
        startIndex: 2,
        endIndex: 4,
        scopes: [
          'source.idl',
          'group.call.func.idl',
          'parameter.usage.keyword.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 1,
        match: '=',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.call.func.idl',
          'parameter.usage.keyword.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: '42',
        startIndex: 5,
        endIndex: 7,
        scopes: ['source.idl', 'group.call.func.idl', 'constant.numeric.idl'],
      },
      {
        line: 1,
        match: ')',
        startIndex: 7,
        endIndex: 8,
        scopes: ['source.idl', 'group.call.func.idl', 'meta.brace.round.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses keyword assignment with line continuation`, async () => {
    // test code to extract tokens from
    const code = [`myfunc(a $`, `  = 5)`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'myfunc',
        startIndex: 0,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.call.func.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 6,
        endIndex: 7,
        scopes: ['source.idl', 'group.call.func.idl', 'meta.brace.round.idl'],
      },
      {
        line: 0,
        match: 'a',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.call.func.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '$',
        startIndex: 9,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.call.func.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: '  = ',
        startIndex: 0,
        endIndex: 4,
        scopes: ['source.idl', 'group.call.func.idl'],
      },
      {
        line: 1,
        match: '5',
        startIndex: 4,
        endIndex: 5,
        scopes: ['source.idl', 'group.call.func.idl', 'constant.numeric.idl'],
      },
      {
        line: 1,
        match: ')',
        startIndex: 5,
        endIndex: 6,
        scopes: ['source.idl', 'group.call.func.idl', 'meta.brace.round.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses variable assignment`, async () => {
    // test code to extract tokens from
    const code = [`_y = _superFunction(a = 5)`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '_y',
        startIndex: 0,
        endIndex: 2,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '=',
        startIndex: 3,
        endIndex: 4,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '_superFunction',
        startIndex: 5,
        endIndex: 19,
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
        startIndex: 19,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: 'a',
        startIndex: 20,
        endIndex: 21,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'parameter.usage.keyword.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 0,
        match: ' =',
        startIndex: 21,
        endIndex: 23,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'parameter.usage.keyword.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '5',
        startIndex: 24,
        endIndex: 25,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 25,
        endIndex: 26,
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
