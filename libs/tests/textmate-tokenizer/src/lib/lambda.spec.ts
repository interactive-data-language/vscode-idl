import { TextMateParse } from '@idl/tests/helpers';

describe(`[auto generated] Validates lambda functions parsed as special token`, () => {
  it(`[auto generated] correctly parse lambda functions`, async () => {
    // test code to extract tokens from
    const code = [`a = lambda(x:x+2)`];

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
        match: 'lambda',
        startIndex: 4,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'entity.name.type.idl',
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
        match: 'x',
        startIndex: 11,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ':',
        startIndex: 12,
        endIndex: 13,
        scopes: ['source.idl', 'group.assignment.idl', 'group.call.func.idl'],
      },
      {
        line: 0,
        match: 'x',
        startIndex: 13,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '+',
        startIndex: 14,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '2',
        startIndex: 15,
        endIndex: 16,
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
        startIndex: 16,
        endIndex: 17,
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
