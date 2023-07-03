import { TextMateParse } from '@idl/test-helpers';

describe(`[auto generated] Validates repeat loop parsing`, () => {
  it(`[auto generated] parses basic repeat loop`, async () => {
    // test code to extract tokens from
    const code = [`REPEAT A = A * 2 UNTIL A GT B`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'REPEAT',
        startIndex: 0,
        endIndex: 6,
        scopes: ['source.idl', 'group.loop.repeat.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: 'A',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '=',
        startIndex: 9,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.assignment.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'A',
        startIndex: 11,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.assignment.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '*',
        startIndex: 13,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.assignment.idl',
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
          'group.loop.repeat.idl',
          'group.assignment.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: 'UNTIL',
        startIndex: 17,
        endIndex: 22,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.loop.until.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'A',
        startIndex: 23,
        endIndex: 24,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.loop.until.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: 'GT',
        startIndex: 25,
        endIndex: 27,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.loop.until.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'B',
        startIndex: 28,
        endIndex: 29,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.loop.until.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses procedure in repeat loop`, async () => {
    // test code to extract tokens from
    const code = [`REPEAT PRINT, A UNTIL A GT B`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'REPEAT',
        startIndex: 0,
        endIndex: 6,
        scopes: ['source.idl', 'group.loop.repeat.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: 'PRINT',
        startIndex: 7,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 12,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'A',
        startIndex: 14,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.call.pro.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: 'UNTIL',
        startIndex: 16,
        endIndex: 21,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.loop.until.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'A',
        startIndex: 22,
        endIndex: 23,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.loop.until.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: 'GT',
        startIndex: 24,
        endIndex: 26,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.loop.until.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'B',
        startIndex: 27,
        endIndex: 28,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.loop.until.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses basic repeat loop with line continuations`, async () => {
    // test code to extract tokens from
    const code = [`REPEAT A = $`, `  A * 2 UNTIL $`, `  A GT B`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'REPEAT',
        startIndex: 0,
        endIndex: 6,
        scopes: ['source.idl', 'group.loop.repeat.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: 'A',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '=',
        startIndex: 9,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.assignment.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '$',
        startIndex: 11,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.assignment.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'A',
        startIndex: 2,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.assignment.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 1,
        match: '*',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.assignment.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: '2',
        startIndex: 6,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.assignment.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 1,
        match: 'UNTIL',
        startIndex: 8,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.loop.until.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 1,
        match: '$',
        startIndex: 14,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.loop.until.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 2,
        match: 'A',
        startIndex: 2,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.loop.until.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 2,
        match: 'GT',
        startIndex: 4,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.loop.until.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 2,
        match: 'B',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.loop.until.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses basic repeat loop with block`, async () => {
    // test code to extract tokens from
    const code = [`REPEAT BEGIN`, `  A = A * 2`, `ENDREP UNTIL A GT B`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'REPEAT',
        startIndex: 0,
        endIndex: 6,
        scopes: ['source.idl', 'group.loop.repeat.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: ' BEGIN',
        startIndex: 6,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.block.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 1,
        match: 'A',
        startIndex: 2,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.block.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 1,
        match: '=',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.block.idl',
          'group.assignment.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'A',
        startIndex: 6,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.block.idl',
          'group.assignment.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 1,
        match: '*',
        startIndex: 8,
        endIndex: 9,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.block.idl',
          'group.assignment.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: '2',
        startIndex: 10,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.block.idl',
          'group.assignment.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 2,
        match: 'ENDREP',
        startIndex: 0,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.block.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 2,
        match: 'UNTIL',
        startIndex: 7,
        endIndex: 12,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 2,
        match: 'A',
        startIndex: 13,
        endIndex: 14,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 2,
        match: 'GT',
        startIndex: 15,
        endIndex: 17,
        scopes: ['source.idl', 'keyword.control.idl'],
      },
      {
        line: 2,
        match: 'B',
        startIndex: 18,
        endIndex: 19,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] correctly parses loops with if statements inside`, async () => {
    // test code to extract tokens from
    const code = [`repeat if !true then break until !true`];

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
        match: ' if',
        startIndex: 6,
        endIndex: 9,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.logic.if.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: '!true',
        startIndex: 10,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.logic.if.idl',
          'constant.language.idl',
        ],
      },
      {
        line: 0,
        match: 'then',
        startIndex: 16,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: ' break',
        startIndex: 20,
        endIndex: 26,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'until',
        startIndex: 27,
        endIndex: 32,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '!true',
        startIndex: 33,
        endIndex: 38,
        scopes: [
          'source.idl',
          'group.loop.repeat.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'constant.language.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
