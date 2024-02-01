import { TextMateParse } from '@idl/tests/helpers';

describe(`[auto generated] Validates for if-then-else parsing [2]`, () => {
  it(`[auto generated] with blocks [1]`, async () => {
    // test code to extract tokens from
    const code = [
      `if a++ then begin`,
      `  super = awesome()`,
      `endif else print, 'else'`,
    ];

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
        match: 'a',
        startIndex: 3,
        endIndex: 4,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '++',
        startIndex: 4,
        endIndex: 6,
        scopes: ['source.idl', 'group.logic.if.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: 'then',
        startIndex: 7,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: ' begin',
        startIndex: 11,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.block.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 1,
        match: 'super',
        startIndex: 2,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.block.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 1,
        match: '=',
        startIndex: 8,
        endIndex: 9,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.block.idl',
          'group.assignment.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'awesome',
        startIndex: 10,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.block.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 1,
        match: '(',
        startIndex: 17,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.block.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 1,
        match: ')',
        startIndex: 18,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.block.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 2,
        match: 'endif',
        startIndex: 0,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.block.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 2,
        match: 'else',
        startIndex: 6,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 2,
        match: 'print',
        startIndex: 11,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 2,
        match: ',',
        startIndex: 16,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 2,
        match: "'",
        startIndex: 18,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 2,
        match: 'else',
        startIndex: 19,
        endIndex: 23,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
      {
        line: 2,
        match: "'",
        startIndex: 23,
        endIndex: 24,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.logic.else.idl',
          'group.call.pro.idl',
          'string.quoted.single.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
