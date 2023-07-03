import { TextMateParse } from '@idl/test-helpers';

describe(`[auto generated] Validates quote parsing`, () => {
  it(`[auto generated] parses standalone single quotes`, async () => {
    // test code to extract tokens from
    const code = [`'myFunc(1 + 2)'`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: "'",
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'string.quoted.single.idl'],
      },
      {
        line: 0,
        match: 'myFunc(1 + 2)',
        startIndex: 1,
        endIndex: 14,
        scopes: ['source.idl', 'string.quoted.single.idl'],
      },
      {
        line: 0,
        match: "'",
        startIndex: 14,
        endIndex: 15,
        scopes: ['source.idl', 'string.quoted.single.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses standalone double quotes`, async () => {
    // test code to extract tokens from
    const code = [`"myFunc(1 + 2)"`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '"',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'string.quoted.double.idl'],
      },
      {
        line: 0,
        match: 'myFunc(1 + 2)',
        startIndex: 1,
        endIndex: 14,
        scopes: ['source.idl', 'string.quoted.double.idl'],
      },
      {
        line: 0,
        match: '"',
        startIndex: 14,
        endIndex: 15,
        scopes: ['source.idl', 'string.quoted.double.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify single quotes without closing`, async () => {
    // test code to extract tokens from
    const code = [`'string`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: "'",
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'string.quoted.single.idl'],
      },
      {
        line: 0,
        match: 'string',
        startIndex: 1,
        endIndex: 7,
        scopes: ['source.idl', 'string.quoted.single.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verify double quotes without closing`, async () => {
    // test code to extract tokens from
    const code = [`"string`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '"',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'string.quoted.double.idl'],
      },
      {
        line: 0,
        match: 'string',
        startIndex: 1,
        endIndex: 7,
        scopes: ['source.idl', 'string.quoted.double.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] confusing single quote`, async () => {
    // test code to extract tokens from
    const code = [
      `hDefinition['schema']).StartsWith('IDLColorGradientDefinition', /FOLD_CASE)`,
    ];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'hDefinition',
        startIndex: 0,
        endIndex: 11,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '[',
        startIndex: 11,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 0,
        match: "'",
        startIndex: 12,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: 'schema',
        startIndex: 13,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: "'",
        startIndex: 19,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: ']',
        startIndex: 20,
        endIndex: 21,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 21,
        endIndex: 22,
        scopes: ['source.idl'],
      },
      {
        line: 0,
        match: '.',
        startIndex: 22,
        endIndex: 23,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'StartsWith',
        startIndex: 23,
        endIndex: 33,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'entity.name.function.idl-method.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 33,
        endIndex: 34,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: "'",
        startIndex: 34,
        endIndex: 35,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: 'IDLColorGradientDefinition',
        startIndex: 35,
        endIndex: 61,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: "'",
        startIndex: 61,
        endIndex: 62,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 62,
        endIndex: 63,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '/FOLD_CASE',
        startIndex: 64,
        endIndex: 74,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'parameter.usage.keyword.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 74,
        endIndex: 75,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'meta.brace.round.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] confusing double quote`, async () => {
    // test code to extract tokens from
    const code = [
      `hDefinition["schema"]).StartsWith("IDLColorGradientDefinition", /FOLD_CASE)`,
    ];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'hDefinition',
        startIndex: 0,
        endIndex: 11,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '[',
        startIndex: 11,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 0,
        match: '"',
        startIndex: 12,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: 'schema',
        startIndex: 13,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: '"',
        startIndex: 19,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: ']',
        startIndex: 20,
        endIndex: 21,
        scopes: [
          'source.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 21,
        endIndex: 22,
        scopes: ['source.idl'],
      },
      {
        line: 0,
        match: '.',
        startIndex: 22,
        endIndex: 23,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'StartsWith',
        startIndex: 23,
        endIndex: 33,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'entity.name.function.idl-method.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 33,
        endIndex: 34,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '"',
        startIndex: 34,
        endIndex: 35,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: 'IDLColorGradientDefinition',
        startIndex: 35,
        endIndex: 61,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: '"',
        startIndex: 61,
        endIndex: 62,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 62,
        endIndex: 63,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '/FOLD_CASE',
        startIndex: 64,
        endIndex: 74,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'parameter.usage.keyword.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 74,
        endIndex: 75,
        scopes: [
          'source.idl',
          'group.call.func-method.idl',
          'meta.brace.round.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] quotes end at important statements 1`, async () => {
    // test code to extract tokens from
    const code = [`if "bad-quote"then "bad-quote"else`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'if',
        startIndex: 0,
        endIndex: 2,
        scopes: ['source.idl', 'group.logic.if.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: '"',
        startIndex: 3,
        endIndex: 4,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: 'bad-quote',
        startIndex: 4,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: '"',
        startIndex: 13,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: 'then',
        startIndex: 14,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: '"',
        startIndex: 19,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: 'bad-quote',
        startIndex: 20,
        endIndex: 29,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: '"',
        startIndex: 29,
        endIndex: 30,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: 'else',
        startIndex: 30,
        endIndex: 34,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'keyword.control.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] quotes end at important statements 2`, async () => {
    // test code to extract tokens from
    const code = [`case "bad-quote"of`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'case',
        startIndex: 0,
        endIndex: 4,
        scopes: ['source.idl', 'group.logic.case.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: '"',
        startIndex: 5,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: 'bad-quote',
        startIndex: 6,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: '"',
        startIndex: 15,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: 'of',
        startIndex: 16,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'keyword.control.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] quotes end at important statements 3`, async () => {
    // test code to extract tokens from
    const code = [`for "bad-quote"do`];

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
        match: '"',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: 'bad-quote',
        startIndex: 5,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: '"',
        startIndex: 14,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: 'do',
        startIndex: 15,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'keyword.control.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] quotes end at important statements 4`, async () => {
    // test code to extract tokens from
    const code = [`repeat 'bad-quote'until`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'repeat',
        startIndex: 0,
        endIndex: 6,
        scopes: ['source.idl', 'group.loop.repeat.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: "'",
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: 'bad-quote',
        startIndex: 8,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: "'",
        startIndex: 17,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: 'until',
        startIndex: 18,
        endIndex: 23,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.loop.until.idl',
          'keyword.control.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] quotes end at important statements 5`, async () => {
    // test code to extract tokens from
    const code = [`if 'bad-quote'then 'bad-quote'else`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'if',
        startIndex: 0,
        endIndex: 2,
        scopes: ['source.idl', 'group.logic.if.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: "'",
        startIndex: 3,
        endIndex: 4,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: 'bad-quote',
        startIndex: 4,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: "'",
        startIndex: 13,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: 'then',
        startIndex: 14,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: "'",
        startIndex: 19,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: 'bad-quote',
        startIndex: 20,
        endIndex: 29,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: "'",
        startIndex: 29,
        endIndex: 30,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: 'else',
        startIndex: 30,
        endIndex: 34,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'keyword.control.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] quotes end at important statements 6`, async () => {
    // test code to extract tokens from
    const code = [`case 'bad-quote'of`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'case',
        startIndex: 0,
        endIndex: 4,
        scopes: ['source.idl', 'group.logic.case.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: "'",
        startIndex: 5,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: 'bad-quote',
        startIndex: 6,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: "'",
        startIndex: 15,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: 'of',
        startIndex: 16,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.logic.case.idl',
          'group.logic.of.idl',
          'keyword.control.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] quotes end at important statements 7`, async () => {
    // test code to extract tokens from
    const code = [`for 'bad-quote'do`];

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
        match: "'",
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: 'bad-quote',
        startIndex: 5,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: "'",
        startIndex: 14,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: 'do',
        startIndex: 15,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'keyword.control.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] quotes end at important statements 8`, async () => {
    // test code to extract tokens from
    const code = [`repeat 'bad-quote'until`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'repeat',
        startIndex: 0,
        endIndex: 6,
        scopes: ['source.idl', 'group.loop.repeat.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: "'",
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: 'bad-quote',
        startIndex: 8,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: "'",
        startIndex: 17,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 0,
        match: 'until',
        startIndex: 18,
        endIndex: 23,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.loop.until.idl',
          'keyword.control.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verifies quote vs number is correctly identified`, async () => {
    // test code to extract tokens from
    const code = [`arr = ["0.00000000"]`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'arr',
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
        match: '[',
        startIndex: 6,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
      {
        line: 0,
        match: '"',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.brackets.square.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: '0.00000000',
        startIndex: 8,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.brackets.square.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: '"',
        startIndex: 18,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.brackets.square.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: ']',
        startIndex: 19,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.brackets.square.idl',
          'meta.brace.square.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
