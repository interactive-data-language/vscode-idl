import { TextMateParse } from '@idl/test-helpers';

describe(`[auto generated] Validates unexpected closer parsing`, () => {
  it(`[auto generated] verifies we catch unexpected closers (other tests cover correctly catching real closers instead of these)`, async () => {
    // test code to extract tokens from
    const code = [
      `)`,
      `]`,
      `}`,
      `endif`,
      `endelse`,
      `endfor`,
      `endforeach`,
      `endrep`,
      `endwhile`,
      `endswitch`,
      `endcase`,
      `end`,
    ];

    // extract tokens
    const tokenized = await TextMateParse(code);

    // define expected tokens
    const expected = [
      {
        line: 0,
        match: ')',
        startIndex: 0,
        endIndex: 2,
        scopes: ['source.idl'],
      },
      {
        line: 1,
        match: ']',
        startIndex: 0,
        endIndex: 2,
        scopes: ['source.idl'],
      },
      {
        line: 2,
        match: '}',
        startIndex: 0,
        endIndex: 2,
        scopes: ['source.idl'],
      },
      {
        line: 3,
        match: 'endif',
        startIndex: 0,
        endIndex: 5,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 4,
        match: 'endelse',
        startIndex: 0,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 5,
        match: 'endfor',
        startIndex: 0,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 6,
        match: 'endforeach',
        startIndex: 0,
        endIndex: 10,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 7,
        match: 'endrep',
        startIndex: 0,
        endIndex: 6,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 8,
        match: 'endwhile',
        startIndex: 0,
        endIndex: 8,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 9,
        match: 'endswitch',
        startIndex: 0,
        endIndex: 9,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 10,
        match: 'endcase',
        startIndex: 0,
        endIndex: 7,
        scopes: [
          'source.idl',
          'group.call.pro.idl',
          'support.function.idl-procedure',
        ],
      },
      {
        line: 11,
        match: 'end',
        startIndex: 0,
        endIndex: 3,
        scopes: ['source.idl', 'keyword.control.idl'],
      },
    ];
    expect(expected).toEqual(tokenized);
  });
});
