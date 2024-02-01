import { TextMateParse } from '@idl/tests/helpers';

describe(`[auto generated] Validates executive command parsing`, () => {
  it(`[auto generated] simple 1`, async () => {
    // test code to extract tokens from
    const code = [`.compile`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '.compile',
        startIndex: 0,
        endIndex: 8,
        scopes: ['source.idl', 'entity.name.type.idl', 'entity.name.type.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] simple 2`, async () => {
    // test code to extract tokens from
    const code = [`.run myfile.pro`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '.run',
        startIndex: 0,
        endIndex: 4,
        scopes: ['source.idl', 'entity.name.type.idl', 'entity.name.type.idl'],
      },
      {
        line: 0,
        match: 'myfile.pro',
        startIndex: 5,
        endIndex: 15,
        scopes: [
          'source.idl',
          'entity.name.type.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] simple 3 start with spaces`, async () => {
    // test code to extract tokens from
    const code = [`  .run myfile.pro`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '.run',
        startIndex: 2,
        endIndex: 6,
        scopes: ['source.idl', 'entity.name.type.idl', 'entity.name.type.idl'],
      },
      {
        line: 0,
        match: 'myfile.pro',
        startIndex: 7,
        endIndex: 17,
        scopes: [
          'source.idl',
          'entity.name.type.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] ignore methods`, async () => {
    // test code to extract tokens from
    const code = [`obj.method`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'obj',
        startIndex: 0,
        endIndex: 3,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '.',
        startIndex: 3,
        endIndex: 4,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'method',
        startIndex: 4,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.call.pro-method.idl',
          'support.function.idl-procedure-method',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] ignore properties`, async () => {
    // test code to extract tokens from
    const code = [`!null = obj.method`];

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
        match: 'obj',
        startIndex: 8,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '.',
        startIndex: 11,
        endIndex: 12,
        scopes: ['source.idl', 'group.assignment.idl'],
      },
      {
        line: 0,
        match: 'method',
        startIndex: 12,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'entity.other.attribute-name.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
