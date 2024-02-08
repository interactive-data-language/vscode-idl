import { TextMateParse } from '@idl/tests/helpers';

describe(`[auto generated] Validates comment parsing for idl-disabled`, () => {
  it(`[auto generated] example`, async () => {
    // test code to extract tokens from
    const code = [`;+ idl-disable`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: ';+ ',
        startIndex: 0,
        endIndex: 3,
        scopes: ['source.idl', 'comment.block.idl', 'comment.line.idl'],
      },
      {
        line: 0,
        match: 'idl-disable',
        startIndex: 3,
        endIndex: 14,
        scopes: [
          'source.idl',
          'comment.block.idl',
          'comment.line.idl',
          'markup.heading.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] example`, async () => {
    // test code to extract tokens from
    const code = [`;+ some comment idl-disable-next-line unused-var`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: ';+ ',
        startIndex: 0,
        endIndex: 3,
        scopes: ['source.idl', 'comment.block.idl', 'comment.line.idl'],
      },
      {
        line: 0,
        match: 'some comment ',
        startIndex: 3,
        endIndex: 16,
        scopes: ['source.idl', 'comment.block.idl', 'comment.line.idl'],
      },
      {
        line: 0,
        match: 'idl-disable-next-line',
        startIndex: 16,
        endIndex: 37,
        scopes: [
          'source.idl',
          'comment.block.idl',
          'comment.line.idl',
          'storage.type.class.jsdoc',
        ],
      },
      {
        line: 0,
        match: ' unused-var',
        startIndex: 37,
        endIndex: 48,
        scopes: ['source.idl', 'comment.block.idl', 'comment.line.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] example`, async () => {
    // test code to extract tokens from
    const code = [`;+ var comment idl-disable-next-line`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: ';+ ',
        startIndex: 0,
        endIndex: 3,
        scopes: ['source.idl', 'comment.block.idl', 'comment.line.idl'],
      },
      {
        line: 0,
        match: 'var comment ',
        startIndex: 3,
        endIndex: 15,
        scopes: ['source.idl', 'comment.block.idl', 'comment.line.idl'],
      },
      {
        line: 0,
        match: 'idl-disable-next-line',
        startIndex: 15,
        endIndex: 36,
        scopes: [
          'source.idl',
          'comment.block.idl',
          'comment.line.idl',
          'storage.type.class.jsdoc',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] example`, async () => {
    // test code to extract tokens from
    const code = [`; idl-disable`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '; ',
        startIndex: 0,
        endIndex: 2,
        scopes: ['source.idl', 'comment.line.idl'],
      },
      {
        line: 0,
        match: 'idl-disable',
        startIndex: 2,
        endIndex: 13,
        scopes: ['source.idl', 'comment.line.idl', 'markup.heading.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] example`, async () => {
    // test code to extract tokens from
    const code = [`; some comment idl-disable-next-line unused-var`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '; ',
        startIndex: 0,
        endIndex: 2,
        scopes: ['source.idl', 'comment.line.idl'],
      },
      {
        line: 0,
        match: 'some comment ',
        startIndex: 2,
        endIndex: 15,
        scopes: ['source.idl', 'comment.line.idl'],
      },
      {
        line: 0,
        match: 'idl-disable-next-line',
        startIndex: 15,
        endIndex: 36,
        scopes: ['source.idl', 'comment.line.idl', 'storage.type.class.jsdoc'],
      },
      {
        line: 0,
        match: ' unused-var',
        startIndex: 36,
        endIndex: 47,
        scopes: ['source.idl', 'comment.line.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] example`, async () => {
    // test code to extract tokens from
    const code = [`; var comment idl-disable-next-line`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '; ',
        startIndex: 0,
        endIndex: 2,
        scopes: ['source.idl', 'comment.line.idl'],
      },
      {
        line: 0,
        match: 'var comment ',
        startIndex: 2,
        endIndex: 14,
        scopes: ['source.idl', 'comment.line.idl'],
      },
      {
        line: 0,
        match: 'idl-disable-next-line',
        startIndex: 14,
        endIndex: 35,
        scopes: ['source.idl', 'comment.line.idl', 'storage.type.class.jsdoc'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
