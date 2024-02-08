import { TextMateParse } from '@idl/tests/helpers';

describe(`[auto generated] Verify string literal processing with multi-line statements`, () => {
  it(`[auto generated] preserve spacing and handle multi-line string literals`, async () => {
    // test code to extract tokens from
    const code = [
      `compile_opt idl2`,
      `; thing`,
      `a = \` first`,
      `    second`,
      `  third`,
      `last\``,
      `end`,
    ];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'compile_opt',
        startIndex: 0,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'idl2',
        startIndex: 12,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 1,
        match: '; ',
        startIndex: 0,
        endIndex: 2,
        scopes: ['source.idl', 'comment.line.idl'],
      },
      {
        line: 1,
        match: 'thing',
        startIndex: 2,
        endIndex: 7,
        scopes: ['source.idl', 'comment.line.idl'],
      },
      {
        line: 2,
        match: 'a',
        startIndex: 0,
        endIndex: 1,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 2,
        match: '=',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 2,
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
        line: 2,
        match: ' first',
        startIndex: 5,
        endIndex: 12,
        scopes: ['source.idl', 'group.assignment.idl', 'string.template.idl'],
      },
      {
        line: 3,
        match: '    second',
        startIndex: 0,
        endIndex: 11,
        scopes: ['source.idl', 'group.assignment.idl', 'string.template.idl'],
      },
      {
        line: 4,
        match: '  third',
        startIndex: 0,
        endIndex: 8,
        scopes: ['source.idl', 'group.assignment.idl', 'string.template.idl'],
      },
      {
        line: 5,
        match: 'last',
        startIndex: 0,
        endIndex: 4,
        scopes: ['source.idl', 'group.assignment.idl', 'string.template.idl'],
      },
      {
        line: 5,
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
        line: 6,
        match: 'end',
        startIndex: 0,
        endIndex: 3,
        scopes: ['source.idl', 'keyword.control.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
