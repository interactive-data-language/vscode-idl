import { TextMateParse } from '@idl/test-helpers';

describe(`[auto generated] Validates structure parsing`, () => {
  it(`[auto generated] verifies simplest structure parsing`, async () => {
    // test code to extract tokens from
    const code = [`_z5$ = {thing}`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '_z5$',
        startIndex: 0,
        endIndex: 4,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
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
        match: '{',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 0,
        match: 'thing',
        startIndex: 8,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'entity.name.type.idl',
        ],
      },
      {
        line: 0,
        match: '}',
        startIndex: 13,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verifies multi-line structure name parsing`, async () => {
    // test code to extract tokens from
    const code = [`_17$ = { $`, `  thing}`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '_17$',
        startIndex: 0,
        endIndex: 4,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
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
        match: '{',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 0,
        match: '$',
        startIndex: 9,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: '  thing',
        startIndex: 0,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'entity.name.type.idl',
        ],
      },
      {
        line: 1,
        match: '}',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verifies simplest property parsing without structure name`, async () => {
    // test code to extract tokens from
    const code = [`_17$ = {thing:z}`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '_17$',
        startIndex: 0,
        endIndex: 4,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
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
        match: '{',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 0,
        match: 'thing',
        startIndex: 8,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'entity.name.tag.idl',
        ],
      },
      {
        line: 0,
        match: ':',
        startIndex: 13,
        endIndex: 14,
        scopes: ['source.idl', 'group.assignment.idl', 'group.structure.idl'],
      },
      {
        line: 0,
        match: 'z',
        startIndex: 14,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '}',
        startIndex: 15,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verifies simplest property parsing without structure name and line continuation`, async () => {
    // test code to extract tokens from
    const code = [`_17$ = { $`, `  thing:z}`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '_17$',
        startIndex: 0,
        endIndex: 4,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
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
        match: '{',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 0,
        match: '$',
        startIndex: 9,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'thing',
        startIndex: 2,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'entity.name.tag.idl',
        ],
      },
      {
        line: 1,
        match: ':',
        startIndex: 7,
        endIndex: 8,
        scopes: ['source.idl', 'group.assignment.idl', 'group.structure.idl'],
      },
      {
        line: 1,
        match: 'z',
        startIndex: 8,
        endIndex: 9,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 1,
        match: '}',
        startIndex: 9,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verifies simplest nested structure parsing`, async () => {
    // test code to extract tokens from
    const code = [`_z5$ = {thing1:{thing2:z}}`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '_z5$',
        startIndex: 0,
        endIndex: 4,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
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
        match: '{',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 0,
        match: 'thing1',
        startIndex: 8,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'entity.name.tag.idl',
        ],
      },
      {
        line: 0,
        match: ':',
        startIndex: 14,
        endIndex: 15,
        scopes: ['source.idl', 'group.assignment.idl', 'group.structure.idl'],
      },
      {
        line: 0,
        match: '{',
        startIndex: 15,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 0,
        match: 'thing2',
        startIndex: 16,
        endIndex: 22,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'group.structure.idl',
          'entity.name.tag.idl',
        ],
      },
      {
        line: 0,
        match: ':',
        startIndex: 22,
        endIndex: 23,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'group.structure.idl',
        ],
      },
      {
        line: 0,
        match: 'z',
        startIndex: 23,
        endIndex: 24,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'group.structure.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '}',
        startIndex: 24,
        endIndex: 25,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 0,
        match: '}',
        startIndex: 25,
        endIndex: 26,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verifies structure with inheritance`, async () => {
    // test code to extract tokens from
    const code = [`_z5$ = {thing, inherits _jklol}`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '_z5$',
        startIndex: 0,
        endIndex: 4,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
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
        match: '{',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 0,
        match: 'thing',
        startIndex: 8,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'entity.name.type.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 13,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'inherits',
        startIndex: 15,
        endIndex: 23,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: '_jklol',
        startIndex: 24,
        endIndex: 30,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'storage.type.idl',
        ],
      },
      {
        line: 0,
        match: '}',
        startIndex: 30,
        endIndex: 31,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verifies all components in single-line`, async () => {
    // test code to extract tokens from
    const code = [`a17 = {_th1g, abc:def, b:5, c:f()}`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'a17',
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
        match: '{',
        startIndex: 6,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 0,
        match: '_th1g',
        startIndex: 7,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'entity.name.type.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 12,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'abc',
        startIndex: 14,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'entity.name.tag.idl',
        ],
      },
      {
        line: 0,
        match: ':',
        startIndex: 17,
        endIndex: 18,
        scopes: ['source.idl', 'group.assignment.idl', 'group.structure.idl'],
      },
      {
        line: 0,
        match: 'def',
        startIndex: 18,
        endIndex: 21,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 21,
        endIndex: 22,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'b',
        startIndex: 23,
        endIndex: 24,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'entity.name.tag.idl',
        ],
      },
      {
        line: 0,
        match: ':',
        startIndex: 24,
        endIndex: 25,
        scopes: ['source.idl', 'group.assignment.idl', 'group.structure.idl'],
      },
      {
        line: 0,
        match: '5',
        startIndex: 25,
        endIndex: 26,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 26,
        endIndex: 27,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'c',
        startIndex: 28,
        endIndex: 29,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'entity.name.tag.idl',
        ],
      },
      {
        line: 0,
        match: ':',
        startIndex: 29,
        endIndex: 30,
        scopes: ['source.idl', 'group.assignment.idl', 'group.structure.idl'],
      },
      {
        line: 0,
        match: 'f',
        startIndex: 30,
        endIndex: 31,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'group.call.func.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 31,
        endIndex: 32,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 32,
        endIndex: 33,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '}',
        startIndex: 33,
        endIndex: 34,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
