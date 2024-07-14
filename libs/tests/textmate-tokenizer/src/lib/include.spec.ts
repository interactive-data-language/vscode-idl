import { TextMateParse } from '@idl/tests/helpers';

describe(`[auto generated] Validates include statements, but not correct location`, () => {
  it(`[auto generated] basic test`, async () => {
    // test code to extract tokens from
    const code = [`@includeme`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '@includeme',
        startIndex: 0,
        endIndex: 10,
        scopes: ['source.idl', 'entity.name.type.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] don't find in functions`, async () => {
    // test code to extract tokens from
    const code = [`a = myfunc(@bad)`];

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
        match: '@bad',
        startIndex: 11,
        endIndex: 15,
        scopes: ['source.idl', 'group.assignment.idl', 'group.call.func.idl'],
      },
      {
        line: 0,
        match: ')',
        startIndex: 15,
        endIndex: 16,
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

  it(`[auto generated] find in loops`, async () => {
    // test code to extract tokens from
    const code = [`for i=0,99 do @very_wrong`];

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
        startIndex: 8,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: 'do',
        startIndex: 11,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: '@very_wrong',
        startIndex: 14,
        endIndex: 25,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'entity.name.type.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] don't find in expressions`, async () => {
    // test code to extract tokens from
    const code = [`a = @include_wrong + @way_bad`];

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
        match: ' @include_wrong ',
        startIndex: 3,
        endIndex: 19,
        scopes: ['source.idl', 'group.assignment.idl'],
      },
      {
        line: 0,
        match: '+',
        startIndex: 19,
        endIndex: 20,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: ' @way_bad',
        startIndex: 20,
        endIndex: 29,
        scopes: ['source.idl', 'group.assignment.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] don't capture afterwards`, async () => {
    // test code to extract tokens from
    const code = [`@include.pro ; comment`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '@include.pro',
        startIndex: 0,
        endIndex: 12,
        scopes: ['source.idl', 'entity.name.type.idl'],
      },
      {
        line: 0,
        match: '; ',
        startIndex: 13,
        endIndex: 15,
        scopes: ['source.idl', 'comment.line.idl'],
      },
      {
        line: 0,
        match: 'comment',
        startIndex: 15,
        endIndex: 22,
        scopes: ['source.idl', 'comment.line.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
