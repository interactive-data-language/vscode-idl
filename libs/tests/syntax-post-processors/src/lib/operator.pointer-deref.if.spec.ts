import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { SyntaxTree } from '@idl/parsing/syntax-tree';
import { SyntaxProblems } from '@idl/types/problem-codes';

describe(`[auto generated] Correctly identify pointer dereferencing`, () => {
  it(`[auto generated] in if-then-else`, () => {
    // test code to extract tokens from
    const code = [`if *val then *var = 42 else *var = 84`];

    // extract tokens
    const tokenized = Parser(code, new CancellationToken());

    // define expected syntax tree
    const expectedTree: SyntaxTree = [
      {
        type: 0,
        name: 54,
        pos: [0, 0, 2],
        idx: 0,
        match: [],
        scope: [],
        parseProblems: [],
        kids: [
          {
            type: 0,
            name: 41,
            pos: [0, 0, 2],
            match: ['if'],
            idx: 0,
            scope: [54],
            parseProblems: [],
            end: { pos: [0, 37, 0], match: [''] },
            kids: [
              {
                type: 0,
                name: 63,
                pos: [0, 3, 1],
                match: ['*'],
                idx: 0,
                scope: [54, 41],
                parseProblems: [],
                end: { pos: [0, 8, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [0, 4, 3],
                    match: ['val'],
                    idx: 0,
                    scope: [54, 41, 63],
                    parseProblems: [],
                  },
                ],
              },
              {
                type: 0,
                name: 46,
                pos: [0, 8, 4],
                match: ['then'],
                idx: 1,
                scope: [54, 41],
                parseProblems: [],
                end: { pos: [0, 23, 0], match: [''] },
                kids: [
                  {
                    type: 0,
                    name: 63,
                    pos: [0, 13, 1],
                    match: ['*'],
                    idx: 0,
                    scope: [54, 41, 46],
                    parseProblems: [],
                    end: { pos: [0, 23, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [0, 14, 3],
                        match: ['var'],
                        idx: 0,
                        scope: [54, 41, 46, 63],
                        parseProblems: [],
                      },
                      {
                        type: 0,
                        name: 3,
                        pos: [0, 18, 1],
                        match: ['='],
                        idx: 1,
                        scope: [54, 41, 46, 63],
                        parseProblems: [],
                        end: { pos: [0, 23, 0], match: [''] },
                        kids: [
                          {
                            type: 1,
                            name: 56,
                            pos: [0, 20, 2],
                            match: ['42'],
                            idx: 0,
                            scope: [54, 41, 46, 63, 3],
                            parseProblems: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 0,
                name: 38,
                pos: [0, 23, 4],
                match: ['else'],
                idx: 2,
                scope: [54, 41],
                parseProblems: [],
                end: { pos: [0, 37, 0], match: [''] },
                kids: [
                  {
                    type: 0,
                    name: 63,
                    pos: [0, 28, 1],
                    match: ['*'],
                    idx: 0,
                    scope: [54, 41, 38],
                    parseProblems: [],
                    end: { pos: [0, 37, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [0, 29, 3],
                        match: ['var'],
                        idx: 0,
                        scope: [54, 41, 38, 63],
                        parseProblems: [],
                      },
                      {
                        type: 0,
                        name: 3,
                        pos: [0, 33, 1],
                        match: ['='],
                        idx: 1,
                        scope: [54, 41, 38, 63],
                        parseProblems: [],
                        end: { pos: [0, 37, 0], match: [''] },
                        kids: [
                          {
                            type: 1,
                            name: 56,
                            pos: [0, 35, 2],
                            match: ['84'],
                            idx: 0,
                            scope: [54, 41, 38, 63, 3],
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
