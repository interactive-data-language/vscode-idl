import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { SyntaxProblems } from '@idl/parsing/problem-codes';
import { SyntaxTree } from '@idl/parsing/syntax-tree';

describe(`[auto generated] Correctly map comments to comment blocks`, () => {
  it(`[auto generated] ignore normal comments`, () => {
    // test code to extract tokens from
    const code = [
      `compile_opt idl2`,
      `; i am properly ignored like i should be`,
      `a = 5`,
      `end`,
    ];

    // extract tokens
    const tokenized = Parser(code, new CancellationToken());

    // define expected syntax tree
    const expectedTree: SyntaxTree = [
      {
        type: 0,
        name: 54,
        pos: [0, 0, 11],
        idx: 0,
        match: [],
        scope: [],
        parseProblems: [],
        end: { match: ['end'], pos: [3, 0, 3] },
        kids: [
          {
            type: 0,
            name: 20,
            pos: [0, 0, 11],
            match: ['compile_opt'],
            idx: 0,
            scope: [54],
            parseProblems: [],
            end: { pos: [0, 16, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 25,
                pos: [0, 12, 4],
                match: ['idl2'],
                idx: 0,
                scope: [54, 20],
                parseProblems: [],
              },
            ],
          },
          {
            type: 1,
            name: 15,
            pos: [1, 0, 40],
            match: ['; i am properly ignored like i should be'],
            idx: 1,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 1,
            name: 85,
            pos: [2, 0, 1],
            match: ['a'],
            idx: 2,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [2, 2, 1],
            match: ['='],
            idx: 3,
            scope: [54],
            parseProblems: [],
            end: { pos: [2, 5, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 56,
                pos: [2, 4, 1],
                match: ['5'],
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

  it(`[auto generated] single-line blocks`, () => {
    // test code to extract tokens from
    const code = [
      `compile_opt idl2`,
      `;+ i am a basic block on only one line`,
      `a = 5`,
      `end`,
    ];

    // extract tokens
    const tokenized = Parser(code, new CancellationToken());

    // define expected syntax tree
    const expectedTree: SyntaxTree = [
      {
        type: 0,
        name: 54,
        pos: [0, 0, 11],
        idx: 0,
        match: [],
        scope: [],
        parseProblems: [],
        end: { match: ['end'], pos: [3, 0, 3] },
        kids: [
          {
            type: 0,
            name: 20,
            pos: [0, 0, 11],
            match: ['compile_opt'],
            idx: 0,
            scope: [54],
            parseProblems: [],
            end: { pos: [0, 16, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 25,
                pos: [0, 12, 4],
                match: ['idl2'],
                idx: 0,
                scope: [54, 20],
                parseProblems: [],
              },
            ],
          },
          {
            type: 0,
            name: 16,
            pos: [1, 0, 38],
            match: [';+ i am a basic block on only one line'],
            idx: 1,
            scope: [54],
            parseProblems: [],
            end: { match: [], pos: [1, 0, 38] },
            kids: [
              {
                type: 1,
                name: 15,
                pos: [1, 0, 38],
                match: [';+ i am a basic block on only one line'],
                idx: 0,
                scope: [54, 16],
                parseProblems: [],
              },
            ],
          },
          {
            type: 1,
            name: 85,
            pos: [2, 0, 1],
            match: ['a'],
            idx: 2,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [2, 2, 1],
            match: ['='],
            idx: 3,
            scope: [54],
            parseProblems: [],
            end: { pos: [2, 5, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 56,
                pos: [2, 4, 1],
                match: ['5'],
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

  it(`[auto generated] multi-line blocks without end`, () => {
    // test code to extract tokens from
    const code = [
      `compile_opt idl2`,
      `;+`,
      `; something about docs`,
      `; like, really cool information`,
      `a = 5`,
      `end`,
    ];

    // extract tokens
    const tokenized = Parser(code, new CancellationToken());

    // define expected syntax tree
    const expectedTree: SyntaxTree = [
      {
        type: 0,
        name: 54,
        pos: [0, 0, 11],
        idx: 0,
        match: [],
        scope: [],
        parseProblems: [],
        end: { match: ['end'], pos: [5, 0, 3] },
        kids: [
          {
            type: 0,
            name: 20,
            pos: [0, 0, 11],
            match: ['compile_opt'],
            idx: 0,
            scope: [54],
            parseProblems: [],
            end: { pos: [0, 16, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 25,
                pos: [0, 12, 4],
                match: ['idl2'],
                idx: 0,
                scope: [54, 20],
                parseProblems: [],
              },
            ],
          },
          {
            type: 0,
            name: 16,
            pos: [1, 0, 2],
            match: [
              ';+',
              '; something about docs',
              '; like, really cool information',
            ],
            idx: 1,
            scope: [54],
            parseProblems: [],
            end: { match: [], pos: [3, 0, 31] },
            kids: [
              {
                type: 1,
                name: 15,
                pos: [1, 0, 2],
                match: [';+'],
                idx: 0,
                scope: [54, 16],
                parseProblems: [],
              },
              {
                type: 1,
                name: 15,
                pos: [2, 0, 22],
                match: ['; something about docs'],
                idx: 1,
                scope: [54, 16],
                parseProblems: [],
              },
              {
                type: 1,
                name: 15,
                pos: [3, 0, 31],
                match: ['; like, really cool information'],
                idx: 2,
                scope: [54, 16],
                parseProblems: [],
              },
            ],
          },
          {
            type: 1,
            name: 85,
            pos: [4, 0, 1],
            match: ['a'],
            idx: 2,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [4, 2, 1],
            match: ['='],
            idx: 3,
            scope: [54],
            parseProblems: [],
            end: { pos: [4, 5, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 56,
                pos: [4, 4, 1],
                match: ['5'],
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

  it(`[auto generated] multi-line blocks with close`, () => {
    // test code to extract tokens from
    const code = [
      `compile_opt idl2`,
      `;+`,
      `; worlds greatest documenter`,
      `;- ended`,
      `a = 5`,
      `end`,
    ];

    // extract tokens
    const tokenized = Parser(code, new CancellationToken());

    // define expected syntax tree
    const expectedTree: SyntaxTree = [
      {
        type: 0,
        name: 54,
        pos: [0, 0, 11],
        idx: 0,
        match: [],
        scope: [],
        parseProblems: [],
        end: { match: ['end'], pos: [5, 0, 3] },
        kids: [
          {
            type: 0,
            name: 20,
            pos: [0, 0, 11],
            match: ['compile_opt'],
            idx: 0,
            scope: [54],
            parseProblems: [],
            end: { pos: [0, 16, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 25,
                pos: [0, 12, 4],
                match: ['idl2'],
                idx: 0,
                scope: [54, 20],
                parseProblems: [],
              },
            ],
          },
          {
            type: 0,
            name: 16,
            pos: [1, 0, 2],
            match: [';+', '; worlds greatest documenter', ';- ended'],
            idx: 1,
            scope: [54],
            parseProblems: [],
            end: { match: [], pos: [3, 0, 8] },
            kids: [
              {
                type: 1,
                name: 15,
                pos: [1, 0, 2],
                match: [';+'],
                idx: 0,
                scope: [54, 16],
                parseProblems: [],
              },
              {
                type: 1,
                name: 15,
                pos: [2, 0, 28],
                match: ['; worlds greatest documenter'],
                idx: 1,
                scope: [54, 16],
                parseProblems: [],
              },
              {
                type: 1,
                name: 15,
                pos: [3, 0, 8],
                match: [';- ended'],
                idx: 2,
                scope: [54, 16],
                parseProblems: [],
              },
            ],
          },
          {
            type: 1,
            name: 85,
            pos: [4, 0, 1],
            match: ['a'],
            idx: 2,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [4, 2, 1],
            match: ['='],
            idx: 3,
            scope: [54],
            parseProblems: [],
            end: { pos: [4, 5, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 56,
                pos: [4, 4, 1],
                match: ['5'],
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
    const expectedProblems: SyntaxProblems = [
      {
        code: 59,
        info: 'Documentation is not left-aligned with the start of docs (not enough spaces before docs)',
        start: [3, 0, 8],
        end: [3, 0, 8],
      },
    ];

    // verify results
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] multi-line blocks with close`, () => {
    // test code to extract tokens from
    const code = [
      `compile_opt idl2`,
      `;+ definition of life`,
      `a = 42`,
      `;+ second definition of life`,
      `fortyTwo = 42`,
      `end`,
    ];

    // extract tokens
    const tokenized = Parser(code, new CancellationToken());

    // define expected syntax tree
    const expectedTree: SyntaxTree = [
      {
        type: 0,
        name: 54,
        pos: [0, 0, 11],
        idx: 0,
        match: [],
        scope: [],
        parseProblems: [],
        end: { match: ['end'], pos: [5, 0, 3] },
        kids: [
          {
            type: 0,
            name: 20,
            pos: [0, 0, 11],
            match: ['compile_opt'],
            idx: 0,
            scope: [54],
            parseProblems: [],
            end: { pos: [0, 16, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 25,
                pos: [0, 12, 4],
                match: ['idl2'],
                idx: 0,
                scope: [54, 20],
                parseProblems: [],
              },
            ],
          },
          {
            type: 0,
            name: 16,
            pos: [1, 0, 21],
            match: [';+ definition of life'],
            idx: 1,
            scope: [54],
            parseProblems: [],
            end: { match: [], pos: [1, 0, 21] },
            kids: [
              {
                type: 1,
                name: 15,
                pos: [1, 0, 21],
                match: [';+ definition of life'],
                idx: 0,
                scope: [54, 16],
                parseProblems: [],
              },
            ],
          },
          {
            type: 1,
            name: 85,
            pos: [2, 0, 1],
            match: ['a'],
            idx: 2,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [2, 2, 1],
            match: ['='],
            idx: 3,
            scope: [54],
            parseProblems: [],
            end: { pos: [2, 6, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 56,
                pos: [2, 4, 2],
                match: ['42'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
              },
            ],
          },
          {
            type: 0,
            name: 16,
            pos: [3, 0, 28],
            match: [';+ second definition of life'],
            idx: 4,
            scope: [54],
            parseProblems: [],
            end: { match: [], pos: [3, 0, 28] },
            kids: [
              {
                type: 1,
                name: 15,
                pos: [3, 0, 28],
                match: [';+ second definition of life'],
                idx: 0,
                scope: [54, 16],
                parseProblems: [],
              },
            ],
          },
          {
            type: 1,
            name: 85,
            pos: [4, 0, 8],
            match: ['fortyTwo'],
            idx: 5,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [4, 9, 1],
            match: ['='],
            idx: 6,
            scope: [54],
            parseProblems: [],
            end: { pos: [4, 13, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 56,
                pos: [4, 11, 2],
                match: ['42'],
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
});
