import { TextMateParse } from '@idl/tests/helpers';

describe(`[auto generated] Verify string literal processing`, () => {
  it(`[auto generated] simple with substitution`, async () => {
    // test code to extract tokens from
    const code = [`a = \`my string with \${expression + 5}\``];

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
        match: '`',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'string.template.idl',
        ],
      },
      {
        line: 0,
        match: 'my string with ',
        startIndex: 5,
        endIndex: 20,
        scopes: ['source.idl', 'group.assignment.idl', 'string.template.idl'],
      },
      {
        line: 0,
        match: '$',
        startIndex: 20,
        endIndex: 21,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'meta.brace.idl',
          'entity.name.type.idl',
        ],
      },
      {
        line: 0,
        match: '{',
        startIndex: 21,
        endIndex: 22,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 0,
        match: 'expression',
        startIndex: 22,
        endIndex: 32,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '+',
        startIndex: 33,
        endIndex: 34,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '5',
        startIndex: 35,
        endIndex: 36,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: '}',
        startIndex: 36,
        endIndex: 37,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 0,
        match: '`',
        startIndex: 37,
        endIndex: 38,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'string.template.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] simple without substitution`, async () => {
    // test code to extract tokens from
    const code = [`a = \`my string without substitution\``];

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
        match: '`',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'string.template.idl',
        ],
      },
      {
        line: 0,
        match: 'my string without substitution',
        startIndex: 5,
        endIndex: 35,
        scopes: ['source.idl', 'group.assignment.idl', 'string.template.idl'],
      },
      {
        line: 0,
        match: '`',
        startIndex: 35,
        endIndex: 36,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'string.template.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] properly capture nested literals`, async () => {
    // test code to extract tokens from
    const code = [`a = \`start \${ \`nested\` }  else\``];

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
        match: '`',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'string.template.idl',
        ],
      },
      {
        line: 0,
        match: 'start ',
        startIndex: 5,
        endIndex: 11,
        scopes: ['source.idl', 'group.assignment.idl', 'string.template.idl'],
      },
      {
        line: 0,
        match: '$',
        startIndex: 11,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'meta.brace.idl',
          'entity.name.type.idl',
        ],
      },
      {
        line: 0,
        match: '{',
        startIndex: 12,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 0,
        match: '`',
        startIndex: 14,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'string.template.idl',
          'string.template.idl',
        ],
      },
      {
        line: 0,
        match: 'nested',
        startIndex: 15,
        endIndex: 21,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'string.template.idl',
        ],
      },
      {
        line: 0,
        match: '`',
        startIndex: 21,
        endIndex: 22,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'string.template.idl',
          'string.template.idl',
        ],
      },
      {
        line: 0,
        match: '}',
        startIndex: 23,
        endIndex: 24,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 0,
        match: '  else',
        startIndex: 24,
        endIndex: 30,
        scopes: ['source.idl', 'group.assignment.idl', 'string.template.idl'],
      },
      {
        line: 0,
        match: '`',
        startIndex: 30,
        endIndex: 31,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'string.template.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] complex nested case`, async () => {
    // test code to extract tokens from
    const code = [
      `a = \`something \${func(a = b, \`nested\`, /kw) + 6*12} else \${5*5 + \`something\` + nested}  some\``,
    ];

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
        match: '`',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'string.template.idl',
        ],
      },
      {
        line: 0,
        match: 'something ',
        startIndex: 5,
        endIndex: 15,
        scopes: ['source.idl', 'group.assignment.idl', 'string.template.idl'],
      },
      {
        line: 0,
        match: '$',
        startIndex: 15,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'meta.brace.idl',
          'entity.name.type.idl',
        ],
      },
      {
        line: 0,
        match: '{',
        startIndex: 16,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 0,
        match: 'func',
        startIndex: 17,
        endIndex: 21,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'group.call.func.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 21,
        endIndex: 22,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: 'a',
        startIndex: 22,
        endIndex: 23,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'group.call.func.idl',
          'parameter.usage.keyword.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 0,
        match: ' =',
        startIndex: 23,
        endIndex: 25,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'group.call.func.idl',
          'parameter.usage.keyword.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'b',
        startIndex: 26,
        endIndex: 27,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'group.call.func.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 27,
        endIndex: 28,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'group.call.func.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '`',
        startIndex: 29,
        endIndex: 30,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'group.call.func.idl',
          'string.template.idl',
          'string.template.idl',
        ],
      },
      {
        line: 0,
        match: 'nested',
        startIndex: 30,
        endIndex: 36,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'group.call.func.idl',
          'string.template.idl',
        ],
      },
      {
        line: 0,
        match: '`',
        startIndex: 36,
        endIndex: 37,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'group.call.func.idl',
          'string.template.idl',
          'string.template.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 37,
        endIndex: 38,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'group.call.func.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '/kw',
        startIndex: 39,
        endIndex: 42,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'group.call.func.idl',
          'parameter.usage.keyword.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 42,
        endIndex: 43,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '+',
        startIndex: 44,
        endIndex: 45,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '6',
        startIndex: 46,
        endIndex: 47,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: '*',
        startIndex: 47,
        endIndex: 48,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '12',
        startIndex: 48,
        endIndex: 50,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: '}',
        startIndex: 50,
        endIndex: 51,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 0,
        match: ' else ',
        startIndex: 51,
        endIndex: 57,
        scopes: ['source.idl', 'group.assignment.idl', 'string.template.idl'],
      },
      {
        line: 0,
        match: '$',
        startIndex: 57,
        endIndex: 58,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'meta.brace.idl',
          'entity.name.type.idl',
        ],
      },
      {
        line: 0,
        match: '{',
        startIndex: 58,
        endIndex: 59,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 0,
        match: '5',
        startIndex: 59,
        endIndex: 60,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: '*',
        startIndex: 60,
        endIndex: 61,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '5',
        startIndex: 61,
        endIndex: 62,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: '+',
        startIndex: 63,
        endIndex: 64,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '`',
        startIndex: 65,
        endIndex: 66,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'string.template.idl',
          'string.template.idl',
        ],
      },
      {
        line: 0,
        match: 'something',
        startIndex: 66,
        endIndex: 75,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'string.template.idl',
        ],
      },
      {
        line: 0,
        match: '`',
        startIndex: 75,
        endIndex: 76,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'string.template.idl',
          'string.template.idl',
        ],
      },
      {
        line: 0,
        match: '+',
        startIndex: 77,
        endIndex: 78,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'nested',
        startIndex: 79,
        endIndex: 85,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '}',
        startIndex: 85,
        endIndex: 86,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 0,
        match: '  some',
        startIndex: 86,
        endIndex: 92,
        scopes: ['source.idl', 'group.assignment.idl', 'string.template.idl'],
      },
      {
        line: 0,
        match: '`',
        startIndex: 92,
        endIndex: 93,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'string.template.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parse escaped backticks`, async () => {
    // test code to extract tokens from
    const code = [`a = \`something \\\` included  \``];

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
        match: '`',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'string.template.idl',
        ],
      },
      {
        line: 0,
        match: 'something ',
        startIndex: 5,
        endIndex: 15,
        scopes: ['source.idl', 'group.assignment.idl', 'string.template.idl'],
      },
      {
        line: 0,
        match: '\\`',
        startIndex: 15,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'constant.character.escape.idl',
        ],
      },
      {
        line: 0,
        match: ' included  ',
        startIndex: 17,
        endIndex: 28,
        scopes: ['source.idl', 'group.assignment.idl', 'string.template.idl'],
      },
      {
        line: 0,
        match: '`',
        startIndex: 28,
        endIndex: 29,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'string.template.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] preserve spacing when extracting tokens`, async () => {
    // test code to extract tokens from
    const code = [`a = \` first \``];

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
        match: '`',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'string.template.idl',
        ],
      },
      {
        line: 0,
        match: ' first ',
        startIndex: 5,
        endIndex: 12,
        scopes: ['source.idl', 'group.assignment.idl', 'string.template.idl'],
      },
      {
        line: 0,
        match: '`',
        startIndex: 12,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'string.template.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] template literal string with formatting`, async () => {
    // test code to extract tokens from
    const code = [`a = \`\${1.234,"%10.3f"}\``];

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
        match: '`',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'string.template.idl',
        ],
      },
      {
        line: 0,
        match: '$',
        startIndex: 5,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'meta.brace.idl',
          'entity.name.type.idl',
        ],
      },
      {
        line: 0,
        match: '{',
        startIndex: 6,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 0,
        match: '1.234',
        startIndex: 7,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'constant.numeric.idl',
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
          'string.template.idl',
          'meta.embedded.idl',
        ],
      },
      {
        line: 0,
        match: '"',
        startIndex: 13,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: '%10.3f',
        startIndex: 14,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: '"',
        startIndex: 20,
        endIndex: 21,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'string.quoted.double.idl',
        ],
      },
      {
        line: 0,
        match: '}',
        startIndex: 21,
        endIndex: 22,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'meta.embedded.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 0,
        match: '`',
        startIndex: 22,
        endIndex: 23,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'string.template.idl',
          'string.template.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
