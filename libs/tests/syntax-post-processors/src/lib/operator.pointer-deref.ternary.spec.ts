import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { SyntaxProblems } from '@idl/parsing/problem-codes';
import { SyntaxTree } from '@idl/parsing/syntax-tree';

describe(`[auto generated] Correctly identify pointer dereferencing`, () => {
  it(`[auto generated] all parts of ternary operators`, () => {
    // test code to extract tokens from
    const code = [`a = *val ? *truthy : *falsy`];

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
            end: { pos: [0, 27, 0], match: [''] },
            kids: [
              {
                type: 0,
                name: 63,
                pos: [0, 4, 1],
                match: ['*'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
                end: { pos: [0, 9, 0], match: [''] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [0, 5, 3],
                    match: ['val'],
                    idx: 0,
                    scope: [54, 3, 63],
                    parseProblems: [],
                  },
                ],
              },
              {
                type: 0,
                name: 45,
                pos: [0, 9, 1],
                match: ['?'],
                idx: 1,
                scope: [54, 3],
                parseProblems: [],
                end: { pos: [0, 27, 0], match: [''] },
                kids: [
                  {
                    type: 0,
                    name: 63,
                    pos: [0, 11, 1],
                    match: ['*'],
                    idx: 0,
                    scope: [54, 3, 45],
                    parseProblems: [],
                    end: { pos: [0, 19, 0], match: [''] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [0, 12, 6],
                        match: ['truthy'],
                        idx: 0,
                        scope: [54, 3, 45, 63],
                        parseProblems: [],
                      },
                    ],
                  },
                  {
                    type: 0,
                    name: 44,
                    pos: [0, 19, 1],
                    match: [':'],
                    idx: 1,
                    scope: [54, 3, 45],
                    parseProblems: [],
                    end: { pos: [0, 27, 0], match: [''] },
                    kids: [
                      {
                        type: 0,
                        name: 63,
                        pos: [0, 21, 1],
                        match: ['*'],
                        idx: 0,
                        scope: [54, 3, 45, 44],
                        parseProblems: [],
                        end: { pos: [0, 27, 0], match: [''] },
                        kids: [
                          {
                            type: 1,
                            name: 85,
                            pos: [0, 22, 5],
                            match: ['falsy'],
                            idx: 0,
                            scope: [54, 3, 45, 44, 63],
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
