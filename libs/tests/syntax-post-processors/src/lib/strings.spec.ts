import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { SyntaxTree } from '@idl/parsing/syntax-tree';
import { SyntaxProblems } from '@idl/types/problem-codes';

describe(`[auto generated] Correctly merge strings together`, () => {
  it(`[auto generated] merge single quotes`, () => {
    // test code to extract tokens from
    const code = [`a = 'string''escaped'`];

    // extract tokens
    const tokenized = Parser(code, new CancellationToken());

    // define expected syntax tree
    const expectedTree: SyntaxTree = [
      {
        type: 0,
        name: 54,
        pos: [0, 0, 1],
        idx: 0,
        match: [],
        scope: [],
        parseProblems: [],
        kids: [
          {
            type: 1,
            name: 85,
            pos: [0, 0, 1],
            match: ['a'],
            idx: 0,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [0, 2, 1],
            match: ['='],
            idx: 1,
            scope: [54],
            parseProblems: [],
            end: { pos: [0, 21, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 68,
                pos: [0, 4, 17],
                match: ["'string''escaped'", "string''escaped"],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
              },
            ],
          },
        ],
      },
    ];

    // verify results
    expect(tokenized.tree).toEqual(expectedTree);

    // define expected problems
    const expectedProblems: SyntaxProblems = [];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] merge double quotes`, () => {
    // test code to extract tokens from
    const code = [`a = "string""escaped"`];

    // extract tokens
    const tokenized = Parser(code, new CancellationToken());

    // define expected syntax tree
    const expectedTree: SyntaxTree = [
      {
        type: 0,
        name: 54,
        pos: [0, 0, 1],
        idx: 0,
        match: [],
        scope: [],
        parseProblems: [],
        kids: [
          {
            type: 1,
            name: 85,
            pos: [0, 0, 1],
            match: ['a'],
            idx: 0,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [0, 2, 1],
            match: ['='],
            idx: 1,
            scope: [54],
            parseProblems: [],
            end: { pos: [0, 21, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 67,
                pos: [0, 4, 17],
                match: ['"string""escaped"', 'string""escaped'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
              },
            ],
          },
        ],
      },
    ];

    // verify results
    expect(tokenized.tree).toEqual(expectedTree);

    // define expected problems
    const expectedProblems: SyntaxProblems = [];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] ignore single quotes that cannot be merged`, () => {
    // test code to extract tokens from
    const code = [`a = 'string' 'escaped'`];

    // extract tokens
    const tokenized = Parser(code, new CancellationToken());

    // define expected syntax tree
    const expectedTree: SyntaxTree = [
      {
        type: 0,
        name: 54,
        pos: [0, 0, 1],
        idx: 0,
        match: [],
        scope: [],
        parseProblems: [],
        kids: [
          {
            type: 1,
            name: 85,
            pos: [0, 0, 1],
            match: ['a'],
            idx: 0,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [0, 2, 1],
            match: ['='],
            idx: 1,
            scope: [54],
            parseProblems: [],
            end: { pos: [0, 22, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 68,
                pos: [0, 4, 8],
                match: ["'string'", 'string'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [16],
              },
              {
                type: 1,
                name: 68,
                pos: [0, 13, 9],
                match: ["'escaped'", 'escaped'],
                idx: 1,
                scope: [54, 3],
                parseProblems: [16],
              },
            ],
          },
        ],
      },
    ];

    // verify results
    expect(tokenized.tree).toEqual(expectedTree);

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 16,
        info: 'Two statements of the same type are not allowed to be next to each other without a separator or operator',
        start: [0, 4, 8],
        end: [0, 13, 9],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] ignore double quotes that cannot be merged`, () => {
    // test code to extract tokens from
    const code = [`a = "string" "escaped"`];

    // extract tokens
    const tokenized = Parser(code, new CancellationToken());

    // define expected syntax tree
    const expectedTree: SyntaxTree = [
      {
        type: 0,
        name: 54,
        pos: [0, 0, 1],
        idx: 0,
        match: [],
        scope: [],
        parseProblems: [],
        kids: [
          {
            type: 1,
            name: 85,
            pos: [0, 0, 1],
            match: ['a'],
            idx: 0,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [0, 2, 1],
            match: ['='],
            idx: 1,
            scope: [54],
            parseProblems: [],
            end: { pos: [0, 22, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 67,
                pos: [0, 4, 8],
                match: ['"string"', 'string'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [16],
              },
              {
                type: 1,
                name: 67,
                pos: [0, 13, 9],
                match: ['"escaped"', 'escaped'],
                idx: 1,
                scope: [54, 3],
                parseProblems: [16],
              },
            ],
          },
        ],
      },
    ];

    // verify results
    expect(tokenized.tree).toEqual(expectedTree);

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 16,
        info: 'Two statements of the same type are not allowed to be next to each other without a separator or operator',
        start: [0, 4, 8],
        end: [0, 13, 9],
        canReport: true,
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
