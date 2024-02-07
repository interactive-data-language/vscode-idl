import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { SyntaxTree } from '@idl/parsing/syntax-tree';
import { SyntaxProblems } from '@idl/types/problem-codes';

describe(`[auto generated] Advanced comment block cases`, () => {
  it(`[auto generated] end on block end and dont include excess comments`, () => {
    // test code to extract tokens from
    const code = [
      `compile_opt idl2`,
      `;+`,
      `; worlds greatest documenter`,
      `;-`,
      `; not included in block`,
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
        end: { match: ['end'], pos: [6, 0, 3] },
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
            match: [';+', '; worlds greatest documenter', ';-'],
            idx: 1,
            scope: [54],
            parseProblems: [],
            end: { match: [], pos: [3, 0, 2] },
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
                pos: [3, 0, 2],
                match: [';-'],
                idx: 2,
                scope: [54, 16],
                parseProblems: [],
              },
            ],
          },
          {
            type: 1,
            name: 15,
            pos: [4, 0, 23],
            match: ['; not included in block'],
            idx: 2,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 1,
            name: 85,
            pos: [5, 0, 1],
            match: ['a'],
            idx: 3,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [5, 2, 1],
            match: ['='],
            idx: 4,
            scope: [54],
            parseProblems: [],
            end: { pos: [5, 5, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 56,
                pos: [5, 4, 1],
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

  it(`[auto generated] allow two blocks next to each other`, () => {
    // test code to extract tokens from
    const code = [
      `compile_opt idl2`,
      `;+`,
      `; first block`,
      `;-`,
      `;+`,
      `; second block`,
      `;-`,
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
        end: { match: ['end'], pos: [8, 0, 3] },
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
            match: [';+', '; first block', ';-'],
            idx: 1,
            scope: [54],
            parseProblems: [],
            end: { match: [], pos: [3, 0, 2] },
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
                pos: [2, 0, 13],
                match: ['; first block'],
                idx: 1,
                scope: [54, 16],
                parseProblems: [],
              },
              {
                type: 1,
                name: 15,
                pos: [3, 0, 2],
                match: [';-'],
                idx: 2,
                scope: [54, 16],
                parseProblems: [],
              },
            ],
          },
          {
            type: 0,
            name: 16,
            pos: [4, 0, 2],
            match: [';+', '; second block', ';-'],
            idx: 2,
            scope: [54],
            parseProblems: [],
            end: { match: [], pos: [6, 0, 2] },
            kids: [
              {
                type: 1,
                name: 15,
                pos: [4, 0, 2],
                match: [';+'],
                idx: 0,
                scope: [54, 16],
                parseProblems: [],
              },
              {
                type: 1,
                name: 15,
                pos: [5, 0, 14],
                match: ['; second block'],
                idx: 1,
                scope: [54, 16],
                parseProblems: [],
              },
              {
                type: 1,
                name: 15,
                pos: [6, 0, 2],
                match: [';-'],
                idx: 2,
                scope: [54, 16],
                parseProblems: [],
              },
            ],
          },
          {
            type: 1,
            name: 85,
            pos: [7, 0, 1],
            match: ['a'],
            idx: 3,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [7, 2, 1],
            match: ['='],
            idx: 4,
            scope: [54],
            parseProblems: [],
            end: { pos: [7, 5, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 56,
                pos: [7, 4, 1],
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

  it(`[auto generated] capture recursive blocks`, () => {
    // test code to extract tokens from
    const code = [
      `compile_opt idl2`,
      `;+`,
      `; first block`,
      `;-`,
      ``,
      `if !true then begin`,
      `  ;+`,
      `  ; second block`,
      `  ;-`,
      `  a = 5`,
      `endif`,
      ``,
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
        end: { match: ['end'], pos: [12, 0, 3] },
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
            match: [';+', '; first block', ';-'],
            idx: 1,
            scope: [54],
            parseProblems: [],
            end: { match: [], pos: [3, 0, 2] },
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
                pos: [2, 0, 13],
                match: ['; first block'],
                idx: 1,
                scope: [54, 16],
                parseProblems: [],
              },
              {
                type: 1,
                name: 15,
                pos: [3, 0, 2],
                match: [';-'],
                idx: 2,
                scope: [54, 16],
                parseProblems: [],
              },
            ],
          },
          {
            type: 0,
            name: 41,
            pos: [5, 0, 2],
            match: ['if'],
            idx: 2,
            scope: [54],
            parseProblems: [],
            end: { pos: [10, 5, 0], match: [''] },
            kids: [
              {
                type: 1,
                name: 82,
                pos: [5, 3, 5],
                match: ['!true'],
                idx: 0,
                scope: [54, 41],
                parseProblems: [],
              },
              {
                type: 0,
                name: 46,
                pos: [5, 9, 4],
                match: ['then'],
                idx: 1,
                scope: [54, 41],
                parseProblems: [],
                end: { pos: [10, 5, 0], match: [''] },
                kids: [
                  {
                    type: 0,
                    name: 6,
                    pos: [5, 14, 5],
                    match: ['begin'],
                    idx: 0,
                    scope: [54, 41, 46],
                    parseProblems: [],
                    end: { pos: [10, 0, 5], match: ['endif'] },
                    kids: [
                      {
                        type: 0,
                        name: 16,
                        pos: [6, 2, 2],
                        match: [';+', '; second block', ';-'],
                        idx: 0,
                        scope: [54, 41, 46, 6],
                        parseProblems: [],
                        end: { match: [], pos: [8, 2, 2] },
                        kids: [
                          {
                            type: 1,
                            name: 15,
                            pos: [6, 2, 2],
                            match: [';+'],
                            idx: 0,
                            scope: [54, 41, 46, 6, 16],
                            parseProblems: [],
                          },
                          {
                            type: 1,
                            name: 15,
                            pos: [7, 2, 14],
                            match: ['; second block'],
                            idx: 1,
                            scope: [54, 41, 46, 6, 16],
                            parseProblems: [],
                          },
                          {
                            type: 1,
                            name: 15,
                            pos: [8, 2, 2],
                            match: [';-'],
                            idx: 2,
                            scope: [54, 41, 46, 6, 16],
                            parseProblems: [],
                          },
                        ],
                      },
                      {
                        type: 1,
                        name: 85,
                        pos: [9, 2, 1],
                        match: ['a'],
                        idx: 1,
                        scope: [54, 41, 46, 6],
                        parseProblems: [],
                      },
                      {
                        type: 0,
                        name: 3,
                        pos: [9, 4, 1],
                        match: ['='],
                        idx: 2,
                        scope: [54, 41, 46, 6],
                        parseProblems: [],
                        end: { pos: [9, 7, 0], match: [''] },
                        kids: [
                          {
                            type: 1,
                            name: 56,
                            pos: [9, 6, 1],
                            match: ['5'],
                            idx: 0,
                            scope: [54, 41, 46, 6, 3],
                            parseProblems: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
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
