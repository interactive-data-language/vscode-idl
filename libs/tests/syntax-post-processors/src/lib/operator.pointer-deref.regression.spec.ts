import { CancellationToken } from '@idl/cancellation-tokens';
import { Parser } from '@idl/parser';
import { SyntaxTree } from '@idl/parsing/syntax-tree';
import { SyntaxProblems } from '@idl/types/problem-codes';

describe(`[auto generated] Correctly identify array indexing`, () => {
  it(`[auto generated] instead of de-referencing`, () => {
    // test code to extract tokens from
    const code = [
      `compile_opt idl2`,
      `temp = reform(mask[i*8 : min([s[1] - 1, i*8 + 7]), j])`,
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
        end: { match: ['end'], pos: [2, 0, 3] },
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
            name: 85,
            pos: [1, 0, 4],
            match: ['temp'],
            idx: 1,
            scope: [54],
            parseProblems: [],
          },
          {
            type: 0,
            name: 3,
            pos: [1, 5, 1],
            match: ['='],
            idx: 2,
            scope: [54],
            parseProblems: [],
            end: { pos: [1, 54, 0], match: [''] },
            kids: [
              {
                type: 0,
                name: 8,
                pos: [1, 7, 7],
                match: ['reform(', 'reform'],
                idx: 0,
                scope: [54, 3],
                parseProblems: [],
                end: { pos: [1, 53, 1], match: [')'] },
                kids: [
                  {
                    type: 1,
                    name: 85,
                    pos: [1, 14, 4],
                    match: ['mask'],
                    idx: 0,
                    scope: [54, 3, 8],
                    parseProblems: [],
                  },
                  {
                    type: 0,
                    name: 7,
                    pos: [1, 18, 1],
                    match: ['['],
                    idx: 1,
                    scope: [54, 3, 8],
                    parseProblems: [],
                    end: { pos: [1, 52, 1], match: [']'] },
                    kids: [
                      {
                        type: 1,
                        name: 85,
                        pos: [1, 19, 1],
                        match: ['i'],
                        idx: 0,
                        scope: [54, 3, 8, 7],
                        parseProblems: [],
                      },
                      {
                        type: 0,
                        name: 57,
                        pos: [1, 20, 1],
                        match: ['*'],
                        idx: 1,
                        scope: [54, 3, 8, 7],
                        parseProblems: [],
                        end: { pos: [1, 23, 0], match: [''] },
                        kids: [
                          {
                            type: 1,
                            name: 56,
                            pos: [1, 21, 1],
                            match: ['8'],
                            idx: 0,
                            scope: [54, 3, 8, 7, 57],
                            parseProblems: [],
                          },
                        ],
                      },
                      {
                        type: 1,
                        name: 13,
                        pos: [1, 23, 1],
                        match: [':'],
                        idx: 2,
                        scope: [54, 3, 8, 7],
                        parseProblems: [],
                      },
                      {
                        type: 0,
                        name: 8,
                        pos: [1, 25, 4],
                        match: ['min(', 'min'],
                        idx: 3,
                        scope: [54, 3, 8, 7],
                        parseProblems: [],
                        end: { pos: [1, 48, 1], match: [')'] },
                        kids: [
                          {
                            type: 0,
                            name: 7,
                            pos: [1, 29, 1],
                            match: ['['],
                            idx: 0,
                            scope: [54, 3, 8, 7, 8],
                            parseProblems: [],
                            end: { pos: [1, 47, 1], match: [']'] },
                            kids: [
                              {
                                type: 1,
                                name: 85,
                                pos: [1, 30, 1],
                                match: ['s'],
                                idx: 0,
                                scope: [54, 3, 8, 7, 8, 7],
                                parseProblems: [],
                              },
                              {
                                type: 0,
                                name: 7,
                                pos: [1, 31, 1],
                                match: ['['],
                                idx: 1,
                                scope: [54, 3, 8, 7, 8, 7],
                                parseProblems: [],
                                end: { pos: [1, 33, 1], match: [']'] },
                                kids: [
                                  {
                                    type: 1,
                                    name: 56,
                                    pos: [1, 32, 1],
                                    match: ['1'],
                                    idx: 0,
                                    scope: [54, 3, 8, 7, 8, 7, 7],
                                    parseProblems: [],
                                  },
                                ],
                              },
                              {
                                type: 0,
                                name: 57,
                                pos: [1, 35, 1],
                                match: ['-'],
                                idx: 2,
                                scope: [54, 3, 8, 7, 8, 7],
                                parseProblems: [],
                                end: { pos: [1, 38, 0], match: [''] },
                                kids: [
                                  {
                                    type: 1,
                                    name: 56,
                                    pos: [1, 37, 1],
                                    match: ['1'],
                                    idx: 0,
                                    scope: [54, 3, 8, 7, 8, 7, 57],
                                    parseProblems: [],
                                  },
                                ],
                              },
                              {
                                type: 1,
                                name: 14,
                                pos: [1, 38, 1],
                                match: [','],
                                idx: 3,
                                scope: [54, 3, 8, 7, 8, 7],
                                parseProblems: [],
                              },
                              {
                                type: 1,
                                name: 85,
                                pos: [1, 40, 1],
                                match: ['i'],
                                idx: 4,
                                scope: [54, 3, 8, 7, 8, 7],
                                parseProblems: [],
                              },
                              {
                                type: 0,
                                name: 57,
                                pos: [1, 41, 1],
                                match: ['*'],
                                idx: 5,
                                scope: [54, 3, 8, 7, 8, 7],
                                parseProblems: [],
                                end: { pos: [1, 47, 0], match: [''] },
                                kids: [
                                  {
                                    type: 1,
                                    name: 56,
                                    pos: [1, 42, 1],
                                    match: ['8'],
                                    idx: 0,
                                    scope: [54, 3, 8, 7, 8, 7, 57],
                                    parseProblems: [],
                                  },
                                  {
                                    type: 0,
                                    name: 57,
                                    pos: [1, 44, 1],
                                    match: ['+'],
                                    idx: 1,
                                    scope: [54, 3, 8, 7, 8, 7, 57],
                                    parseProblems: [],
                                    end: { pos: [1, 47, 0], match: [''] },
                                    kids: [
                                      {
                                        type: 1,
                                        name: 56,
                                        pos: [1, 46, 1],
                                        match: ['7'],
                                        idx: 0,
                                        scope: [54, 3, 8, 7, 8, 7, 57, 57],
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
                      {
                        type: 1,
                        name: 14,
                        pos: [1, 49, 1],
                        match: [','],
                        idx: 4,
                        scope: [54, 3, 8, 7],
                        parseProblems: [],
                      },
                      {
                        type: 1,
                        name: 85,
                        pos: [1, 51, 1],
                        match: ['j'],
                        idx: 5,
                        scope: [54, 3, 8, 7],
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
