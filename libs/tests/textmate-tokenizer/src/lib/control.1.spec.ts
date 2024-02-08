import { TextMateParse } from '@idl/tests/helpers';

describe(`[auto generated] Validates control statement parsing`, () => {
  it(`[auto generated] parses basic control statements`, async () => {
    // test code to extract tokens from
    const code = [
      `break`,
      `continue`,
      `jump: a = func()`,
      `jump: mypro, $`,
      `  5`,
      `jumpy17$: ;comment`,
    ];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'break',
        startIndex: 0,
        endIndex: 5,
        scopes: ['source.idl', 'keyword.control.idl'],
      },
      {
        line: 1,
        match: 'continue',
        startIndex: 0,
        endIndex: 8,
        scopes: ['source.idl', 'keyword.control.idl'],
      },
      {
        line: 2,
        match: 'jump:',
        startIndex: 0,
        endIndex: 5,
        scopes: ['source.idl', 'entity.name.type.idl'],
      },
      {
        line: 2,
        match: 'a',
        startIndex: 6,
        endIndex: 7,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 2,
        match: '=',
        startIndex: 8,
        endIndex: 9,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 2,
        match: 'func',
        startIndex: 10,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 2,
        match: '(',
        startIndex: 14,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 2,
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
      {
        line: 3,
        match: 'jump:',
        startIndex: 0,
        endIndex: 5,
        scopes: ['source.idl', 'entity.name.type.idl'],
      },
      {
        line: 3,
        match: 'mypro',
        startIndex: 6,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 3,
        match: ',',
        startIndex: 11,
        endIndex: 12,
        scopes: ['source.idl', 'group.call.pro.idl', 'keyword.operator.idl'],
      },
      {
        line: 3,
        match: '$',
        startIndex: 13,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 4,
        match: '5',
        startIndex: 2,
        endIndex: 3,
        scopes: ['source.idl', 'group.call.pro.idl', 'constant.numeric.idl'],
      },
      {
        line: 5,
        match: 'jumpy17$:',
        startIndex: 0,
        endIndex: 9,
        scopes: ['source.idl', 'entity.name.type.idl'],
      },
      {
        line: 5,
        match: ';',
        startIndex: 10,
        endIndex: 11,
        scopes: ['source.idl', 'comment.line.idl'],
      },
      {
        line: 5,
        match: 'comment',
        startIndex: 11,
        endIndex: 18,
        scopes: ['source.idl', 'comment.line.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses break in if statements`, async () => {
    // test code to extract tokens from
    const code = [`if !true then break`];

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
        match: '!true',
        startIndex: 3,
        endIndex: 8,
        scopes: ['source.idl', 'group.logic.if.idl', 'constant.language.idl'],
      },
      {
        line: 0,
        match: 'then',
        startIndex: 9,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: ' break',
        startIndex: 13,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'keyword.control.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses continue in if statements`, async () => {
    // test code to extract tokens from
    const code = [`if !true then continue`];

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
        match: '!true',
        startIndex: 3,
        endIndex: 8,
        scopes: ['source.idl', 'group.logic.if.idl', 'constant.language.idl'],
      },
      {
        line: 0,
        match: 'then',
        startIndex: 9,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: ' continue',
        startIndex: 13,
        endIndex: 22,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'keyword.control.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses continue and break in loops`, async () => {
    // test code to extract tokens from
    const code = [`for i=0,99 do begin`, `  continue`, `  break`, `endfor`];

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
        match: ' begin',
        startIndex: 13,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.block.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 1,
        match: '  continue',
        startIndex: 0,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.block.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 2,
        match: '  break',
        startIndex: 0,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.block.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 3,
        match: 'endfor',
        startIndex: 0,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.block.idl',
          'keyword.control.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses jump in blocks`, async () => {
    // test code to extract tokens from
    const code = [`for i=0,99 do begin`, `  jump:`, `endfor`];

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
        match: ' begin',
        startIndex: 13,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.block.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 1,
        match: 'jump:',
        startIndex: 2,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.block.idl',
          'entity.name.type.idl',
        ],
      },
      {
        line: 2,
        match: 'endfor',
        startIndex: 0,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.loop.for-foreach.idl',
          'group.loop.do.idl',
          'group.block.idl',
          'keyword.control.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses compound control statements`, async () => {
    // test code to extract tokens from
    const code = [
      `common, group, var1, var2, var3 ; comment`,
      `compile_opt, idl2, $ ; line continuation`,
      `  hidden`,
      `compile_opt`,
      `forward_function, idl2, hidden`,
      `goto, label`,
      `on_ioerror, bad_num`,
    ];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'common',
        startIndex: 0,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 6,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'group',
        startIndex: 8,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 13,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'var1',
        startIndex: 15,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 19,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'var2',
        startIndex: 21,
        endIndex: 25,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 25,
        endIndex: 26,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'var3',
        startIndex: 27,
        endIndex: 31,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '; ',
        startIndex: 32,
        endIndex: 34,
        scopes: ['source.idl', 'comment.line.idl'],
      },
      {
        line: 0,
        match: 'comment',
        startIndex: 34,
        endIndex: 41,
        scopes: ['source.idl', 'comment.line.idl'],
      },
      {
        line: 1,
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
        line: 1,
        match: ',',
        startIndex: 11,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'idl2',
        startIndex: 13,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 1,
        match: ',',
        startIndex: 17,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: '$',
        startIndex: 19,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: '; ',
        startIndex: 21,
        endIndex: 23,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'group.line-continuation.idl',
          'comment.line.idl',
        ],
      },
      {
        line: 1,
        match: 'line continuation',
        startIndex: 23,
        endIndex: 40,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'group.line-continuation.idl',
          'comment.line.idl',
        ],
      },
      {
        line: 2,
        match: 'hidden',
        startIndex: 2,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 3,
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
        line: 4,
        match: 'forward_function',
        startIndex: 0,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 4,
        match: ',',
        startIndex: 16,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 4,
        match: 'idl2',
        startIndex: 18,
        endIndex: 22,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 4,
        match: ',',
        startIndex: 22,
        endIndex: 23,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 4,
        match: 'hidden',
        startIndex: 24,
        endIndex: 30,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 5,
        match: 'goto',
        startIndex: 0,
        endIndex: 4,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 5,
        match: ',',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 5,
        match: 'label',
        startIndex: 6,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 6,
        match: 'on_ioerror',
        startIndex: 0,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 6,
        match: ',',
        startIndex: 10,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 6,
        match: 'bad_num',
        startIndex: 12,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] goto in in statement`, async () => {
    // test code to extract tokens from
    const code = [`if not wild then goto, done else printf, outunit`];

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
        match: 'not',
        startIndex: 3,
        endIndex: 6,
        scopes: ['source.idl', 'group.logic.if.idl', 'keyword.control.idl'],
      },
      {
        line: 0,
        match: 'wild',
        startIndex: 7,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: 'then',
        startIndex: 12,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: ' goto',
        startIndex: 16,
        endIndex: 21,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.control.compound.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 21,
        endIndex: 22,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.control.compound.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'done',
        startIndex: 23,
        endIndex: 27,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.control.compound.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: 'else',
        startIndex: 28,
        endIndex: 32,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.control.compound.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: 'printf',
        startIndex: 33,
        endIndex: 39,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.control.compound.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 39,
        endIndex: 40,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.control.compound.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'outunit',
        startIndex: 41,
        endIndex: 48,
        scopes: [
          'source.idl',
          'group.logic.if.idl',
          'group.logic.then.idl',
          'group.control.compound.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] statements end at line separator`, async () => {
    // test code to extract tokens from
    const code = [`GOTO, do_six & END`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'GOTO',
        startIndex: 0,
        endIndex: 4,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'do_six',
        startIndex: 6,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.control.compound.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '& ',
        startIndex: 13,
        endIndex: 15,
        scopes: ['source.idl'],
      },
      {
        line: 0,
        match: 'END',
        startIndex: 15,
        endIndex: 18,
        scopes: ['source.idl', 'keyword.control.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
