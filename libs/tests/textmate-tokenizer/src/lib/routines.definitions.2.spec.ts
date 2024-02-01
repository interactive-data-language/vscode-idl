import { TextMateParse } from '@idl/tests/helpers';

describe(`[auto generated] Validates routine parsing`, () => {
  it(`[auto generated] verifies we only stop on "end"`, async () => {
    // test code to extract tokens from
    const code = [`PRO EndMagic, Unit, Id`, `  PRINTF, Unit`, `END`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'PRO',
        startIndex: 0,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'EndMagic',
        startIndex: 4,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 0,
        match: ', ',
        startIndex: 12,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
        ],
      },
      {
        line: 0,
        match: 'Unit',
        startIndex: 14,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'variable.parameter.idl',
        ],
      },
      {
        line: 0,
        match: ', ',
        startIndex: 18,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
        ],
      },
      {
        line: 0,
        match: 'Id',
        startIndex: 20,
        endIndex: 22,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'variable.parameter.idl',
        ],
      },
      {
        line: 1,
        match: 'PRINTF',
        startIndex: 2,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 1,
        match: ',',
        startIndex: 8,
        endIndex: 9,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'Unit',
        startIndex: 10,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.call.pro.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 2,
        match: 'END',
        startIndex: 0,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'keyword.control.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verifies we parse names with "!"`, async () => {
    // test code to extract tokens from
    const code = [`pro !sosobad,`, `END`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'pro',
        startIndex: 0,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: '!sosobad',
        startIndex: 4,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'constant.language.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 12,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'END',
        startIndex: 0,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'keyword.control.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verifies we parse method names with "!"`, async () => {
    // test code to extract tokens from
    const code = [`pro !sosobad::method,`, `END`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'pro',
        startIndex: 0,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: '!sosobad',
        startIndex: 4,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'constant.language.idl',
        ],
      },
      {
        line: 0,
        match: '::',
        startIndex: 12,
        endIndex: 14,
        scopes: ['source.idl', 'group.routine.definition.idl'],
      },
      {
        line: 0,
        match: 'method',
        startIndex: 14,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 20,
        endIndex: 21,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.call.pro.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'END',
        startIndex: 0,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'keyword.control.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] routines in a very bad single-line`, async () => {
    // test code to extract tokens from
    const code = [`FUNCTION VarName, Ptr & RETURN,'' & END`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'FUNCTION',
        startIndex: 0,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'VarName',
        startIndex: 9,
        endIndex: 16,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'entity.name.function.idl',
        ],
      },
      {
        line: 0,
        match: ', ',
        startIndex: 16,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
        ],
      },
      {
        line: 0,
        match: 'Ptr',
        startIndex: 18,
        endIndex: 21,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'variable.parameter.idl',
        ],
      },
      {
        line: 0,
        match: '&',
        startIndex: 22,
        endIndex: 23,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
        ],
      },
      {
        line: 0,
        match: 'RETURN',
        startIndex: 24,
        endIndex: 30,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'variable.parameter.idl',
        ],
      },
      {
        line: 0,
        match: ",'' &",
        startIndex: 30,
        endIndex: 35,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
        ],
      },
      {
        line: 0,
        match: 'END',
        startIndex: 36,
        endIndex: 39,
        scopes: [
          'source.idl',
          'group.routine.definition.idl',
          'group.routine.name.idl',
          'variable.parameter.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
