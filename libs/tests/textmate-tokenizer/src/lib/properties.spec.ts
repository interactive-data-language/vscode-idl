import { TextMateParse } from '@idl/test-helpers';

describe(`[auto generated] Validates property parsing`, () => {
  it(`[auto generated] parses property assignment`, async () => {
    // test code to extract tokens from
    const code = [`a.thing = 5`];

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
        match: '.',
        startIndex: 1,
        endIndex: 2,
        scopes: ['source.idl'],
      },
      {
        line: 0,
        match: 'thing',
        startIndex: 2,
        endIndex: 7,
        scopes: ['source.idl', 'entity.other.attribute-name.idl'],
      },
      {
        line: 0,
        match: '=',
        startIndex: 8,
        endIndex: 9,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '5',
        startIndex: 10,
        endIndex: 11,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses property access`, async () => {
    // test code to extract tokens from
    const code = [`b = a.thing`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'b',
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
        match: 'a',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '.',
        startIndex: 5,
        endIndex: 6,
        scopes: ['source.idl', 'group.assignment.idl'],
      },
      {
        line: 0,
        match: 'thing',
        startIndex: 6,
        endIndex: 11,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'entity.other.attribute-name.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses property access with line continuation`, async () => {
    // test code to extract tokens from
    const code = [`b = $`, `  a.thing`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'b',
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
        match: '$',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'a',
        startIndex: 2,
        endIndex: 3,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 1,
        match: '.',
        startIndex: 3,
        endIndex: 4,
        scopes: ['source.idl', 'group.assignment.idl'],
      },
      {
        line: 1,
        match: 'thing',
        startIndex: 4,
        endIndex: 9,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'entity.other.attribute-name.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses nested property access`, async () => {
    // test code to extract tokens from
    const code = [`b = a.thing1.thing2`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'b',
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
        match: 'a',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '.',
        startIndex: 5,
        endIndex: 6,
        scopes: ['source.idl', 'group.assignment.idl'],
      },
      {
        line: 0,
        match: 'thing1',
        startIndex: 6,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 0,
        match: '.',
        startIndex: 12,
        endIndex: 13,
        scopes: ['source.idl', 'group.assignment.idl'],
      },
      {
        line: 0,
        match: 'thing2',
        startIndex: 13,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'entity.other.attribute-name.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] parses property access as arguments`, async () => {
    // test code to extract tokens from
    const code = [`myPro, a.thing, b.thing`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'myPro',
        startIndex: 0,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 5,
        endIndex: 6,
        scopes: ['source.idl', 'group.call.pro.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: 'a',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '.',
        startIndex: 8,
        endIndex: 9,
        scopes: ['source.idl', 'group.call.pro.idl'],
      },
      {
        line: 0,
        match: 'thing',
        startIndex: 9,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 14,
        endIndex: 15,
        scopes: ['source.idl', 'group.call.pro.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: 'b',
        startIndex: 16,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '.',
        startIndex: 17,
        endIndex: 18,
        scopes: ['source.idl', 'group.call.pro.idl'],
      },
      {
        line: 0,
        match: 'thing',
        startIndex: 18,
        endIndex: 23,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'entity.other.attribute-name.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] property example from IDL lib`, async () => {
    // test code to extract tokens from
    const code = [`(*state).bottomSelection = lMarkers.Count()-1`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '(',
        startIndex: 0,
        endIndex: 1,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '*',
        startIndex: 1,
        endIndex: 2,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'entity.name.type.idl',
        ],
      },
      {
        line: 0,
        match: 'state',
        startIndex: 2,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.brackets.paren.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '.',
        startIndex: 8,
        endIndex: 9,
        scopes: ['source.idl'],
      },
      {
        line: 0,
        match: 'bottomSelection',
        startIndex: 9,
        endIndex: 24,
        scopes: ['source.idl', 'entity.other.attribute-name.idl'],
      },
      {
        line: 0,
        match: '=',
        startIndex: 25,
        endIndex: 26,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: 'lMarkers',
        startIndex: 27,
        endIndex: 35,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '.',
        startIndex: 35,
        endIndex: 36,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func-method.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'Count',
        startIndex: 36,
        endIndex: 41,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func-method.idl',
          'entity.name.function.idl-method.idl',
        ],
      },
      {
        line: 0,
        match: '(',
        startIndex: 41,
        endIndex: 42,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.call.func-method.idl',
          'meta.brace.round.idl',
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
          'group.call.func-method.idl',
          'meta.brace.round.idl',
        ],
      },
      {
        line: 0,
        match: '-',
        startIndex: 43,
        endIndex: 44,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '1',
        startIndex: 44,
        endIndex: 45,
        scopes: ['source.idl', 'group.assignment.idl', 'constant.numeric.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] structure property via indexing`, async () => {
    // test code to extract tokens from
    const code = [`a = b.(i)`];

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
        match: 'b',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '.(',
        startIndex: 5,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.property.indexed.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 0,
        match: 'i',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.property.indexed.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ')',
        startIndex: 8,
        endIndex: 9,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.property.indexed.idl',
          'entity.other.attribute-name.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
