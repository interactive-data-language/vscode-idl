import { TextMateParse } from '@idl/tests/helpers';

describe(`[auto generated] Validates structure parsing`, () => {
  it(`[auto generated] verifies multiple structure names (even though wrong syntax)`, async () => {
    // test code to extract tokens from
    const code = [
      `a = {one,two,three,inherits thing, inherits other, prop:5} ; comment`,
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
        match: '{',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 0,
        match: 'one',
        startIndex: 5,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'entity.name.type.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 8,
        endIndex: 9,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'two',
        startIndex: 9,
        endIndex: 12,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'variable.other.readwrite.ts.idl',
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
          'group.structure.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'three',
        startIndex: 13,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 18,
        endIndex: 19,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'inherits',
        startIndex: 19,
        endIndex: 27,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'thing',
        startIndex: 28,
        endIndex: 33,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'storage.type.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 33,
        endIndex: 34,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'inherits',
        startIndex: 35,
        endIndex: 43,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 0,
        match: 'other',
        startIndex: 44,
        endIndex: 49,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'storage.type.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 49,
        endIndex: 50,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'prop',
        startIndex: 51,
        endIndex: 55,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'entity.name.tag.idl',
        ],
      },
      {
        line: 0,
        match: ':',
        startIndex: 55,
        endIndex: 56,
        scopes: ['source.idl', 'group.assignment.idl', 'group.structure.idl'],
      },
      {
        line: 0,
        match: '5',
        startIndex: 56,
        endIndex: 57,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: '}',
        startIndex: 57,
        endIndex: 58,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 0,
        match: '; ',
        startIndex: 59,
        endIndex: 61,
        scopes: ['source.idl', 'comment.line.idl'],
      },
      {
        line: 0,
        match: 'comment',
        startIndex: 61,
        endIndex: 68,
        scopes: ['source.idl', 'comment.line.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verifies nested structures, line continuations, and comments`, async () => {
    // test code to extract tokens from
    const code = [`_17$ = { $ ; something`, `  thing: {name, some:value}}`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: '_17$',
        startIndex: 0,
        endIndex: 4,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '=',
        startIndex: 5,
        endIndex: 6,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '{',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 0,
        match: '$',
        startIndex: 9,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '; ',
        startIndex: 11,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'group.line-continuation.idl',
          'comment.line.idl',
        ],
      },
      {
        line: 0,
        match: 'something',
        startIndex: 13,
        endIndex: 22,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'group.line-continuation.idl',
          'comment.line.idl',
        ],
      },
      {
        line: 1,
        match: 'thing',
        startIndex: 2,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'entity.name.tag.idl',
        ],
      },
      {
        line: 1,
        match: ':',
        startIndex: 7,
        endIndex: 8,
        scopes: ['source.idl', 'group.assignment.idl', 'group.structure.idl'],
      },
      {
        line: 1,
        match: '{',
        startIndex: 9,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 1,
        match: 'name',
        startIndex: 10,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'group.structure.idl',
          'entity.name.type.idl',
        ],
      },
      {
        line: 1,
        match: ',',
        startIndex: 14,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'group.structure.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'some',
        startIndex: 16,
        endIndex: 20,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'group.structure.idl',
          'entity.name.tag.idl',
        ],
      },
      {
        line: 1,
        match: ':',
        startIndex: 20,
        endIndex: 21,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'group.structure.idl',
        ],
      },
      {
        line: 1,
        match: 'value',
        startIndex: 21,
        endIndex: 26,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'group.structure.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 1,
        match: '}',
        startIndex: 26,
        endIndex: 27,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 1,
        match: '}',
        startIndex: 27,
        endIndex: 28,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] verifies weird syntax for named structures`, async () => {
    // test code to extract tokens from
    const code = [
      `new_event = {FILESEL_EVENT, parent, ev.top, 0L, $`,
      `path+filename, 0L, theFilter}`,
    ];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'new_event',
        startIndex: 0,
        endIndex: 9,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '=',
        startIndex: 10,
        endIndex: 11,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '{',
        startIndex: 12,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 0,
        match: 'FILESEL_EVENT',
        startIndex: 13,
        endIndex: 26,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'entity.name.type.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 26,
        endIndex: 27,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'parent',
        startIndex: 28,
        endIndex: 34,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 34,
        endIndex: 35,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: 'ev',
        startIndex: 36,
        endIndex: 38,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 0,
        match: '.',
        startIndex: 38,
        endIndex: 39,
        scopes: ['source.idl', 'group.assignment.idl', 'group.structure.idl'],
      },
      {
        line: 0,
        match: 'top',
        startIndex: 39,
        endIndex: 42,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'entity.other.attribute-name.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 42,
        endIndex: 43,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '0L',
        startIndex: 44,
        endIndex: 46,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 46,
        endIndex: 47,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '$',
        startIndex: 48,
        endIndex: 49,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'path',
        startIndex: 0,
        endIndex: 4,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 1,
        match: '+',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'filename',
        startIndex: 5,
        endIndex: 13,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 1,
        match: ',',
        startIndex: 13,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: '0L',
        startIndex: 15,
        endIndex: 17,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'constant.numeric.idl',
        ],
      },
      {
        line: 1,
        match: ',',
        startIndex: 17,
        endIndex: 18,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'theFilter',
        startIndex: 19,
        endIndex: 28,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'variable.other.readwrite.ts.idl',
        ],
      },
      {
        line: 1,
        match: '}',
        startIndex: 28,
        endIndex: 29,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] structure names with exclamation points`, async () => {
    // test code to extract tokens from
    const code = [`a = {!exciting}`];

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
        match: '{',
        startIndex: 4,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 0,
        match: '!exciting',
        startIndex: 5,
        endIndex: 14,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'entity.name.type.idl',
        ],
      },
      {
        line: 0,
        match: '}',
        startIndex: 14,
        endIndex: 15,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] structure names and then line continuation`, async () => {
    // test code to extract tokens from
    const code = [`void = {mlLabelingTool_GraphicOverlay            $`];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'void',
        startIndex: 0,
        endIndex: 4,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '=',
        startIndex: 5,
        endIndex: 6,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '{',
        startIndex: 7,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 0,
        match: 'mlLabelingTool_GraphicOverlay            ',
        startIndex: 8,
        endIndex: 49,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'entity.name.type.idl',
        ],
      },
      {
        line: 0,
        match: '$',
        startIndex: 49,
        endIndex: 50,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });

  it(`[auto generated] inherits supports spaces`, async () => {
    // test code to extract tokens from
    const code = [
      `  void = {IDLitDataIDLArray2D, $`,
      `  inherits   IDLitData}`,
    ];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: 'void',
        startIndex: 2,
        endIndex: 6,
        scopes: ['source.idl', 'variable.other.readwrite.ts.idl'],
      },
      {
        line: 0,
        match: '=',
        startIndex: 7,
        endIndex: 8,
        scopes: ['source.idl', 'group.assignment.idl', 'keyword.operator.idl'],
      },
      {
        line: 0,
        match: '{',
        startIndex: 9,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
      {
        line: 0,
        match: 'IDLitDataIDLArray2D',
        startIndex: 10,
        endIndex: 29,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'entity.name.type.idl',
        ],
      },
      {
        line: 0,
        match: ',',
        startIndex: 29,
        endIndex: 30,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 0,
        match: '$',
        startIndex: 31,
        endIndex: 32,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'group.line-continuation.idl',
          'keyword.operator.idl',
        ],
      },
      {
        line: 1,
        match: 'inherits',
        startIndex: 2,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'keyword.control.idl',
        ],
      },
      {
        line: 1,
        match: 'IDLitData',
        startIndex: 13,
        endIndex: 22,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'storage.type.idl',
        ],
      },
      {
        line: 1,
        match: '}',
        startIndex: 22,
        endIndex: 23,
        scopes: [
          'source.idl',
          'group.assignment.idl',
          'group.structure.idl',
          'meta.brace.idl',
        ],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
