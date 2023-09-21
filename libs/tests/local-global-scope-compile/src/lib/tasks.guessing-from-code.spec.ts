import { CancellationToken } from '@idl/cancellation-tokens';
import { GlobalTokens, ICompileOptions } from '@idl/data-types/core';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify behaviors for task types`, () => {
  it(`[auto generated] where we determine types from code`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // test code to extract tokens from
    const code = [
      `compile_opt idl2`,
      ``,
      `mosaic1 = ENVITask('BuildMosaicRaster')`,
      `mosaic2 = ENVITask(routine_dir() + 'buildmosaicraster.task')`,
      ``,
      `uri = 'buildmosaicraster.task'`,
      `mosaic3 = ENVITask(uri)`,
      ``,
      `envitaskany1 = ENVITask(uri + uri)`,
      ``,
      `idlmosaic1 = IDLTask('BuildMosaicRaster')`,
      `idlmosaic2 = IDLTask(routine_dir() + 'buildmosaicraster.task')`,
      ``,
      `idlmosaic3 = IDLTask(uri)`,
      ``,
      `idltaskany1 = IDLTask(uri + uri)`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // define expected local variables
    const expectedVars: ILocalTokens = {
      func: {},
      pro: {},
      main: {
        mosaic1: {
          type: 'v',
          name: 'mosaic1',
          pos: [2, 0, 7],
          meta: {
            display: 'mosaic1',
            isDefined: true,
            usage: [[2, 0, 7]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'envibuildmosaicrastertask',
                display: 'ENVITask<BuildMosaicRaster>',
                args: [
                  [
                    {
                      name: 'BuildMosaicRaster',
                      display: 'BuildMosaicRaster',
                      args: [],
                      meta: {},
                    },
                  ],
                ],
                meta: {},
              },
            ],
          },
        },
        mosaic2: {
          type: 'v',
          name: 'mosaic2',
          pos: [3, 0, 7],
          meta: {
            display: 'mosaic2',
            isDefined: true,
            usage: [[3, 0, 7]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'envibuildmosaicrastertask',
                display: 'ENVITask<BuildMosaicRaster>',
                args: [
                  [
                    {
                      name: 'BuildMosaicRaster',
                      display: 'BuildMosaicRaster',
                      args: [],
                      meta: {},
                    },
                  ],
                ],
                meta: {},
              },
            ],
          },
        },
        uri: {
          type: 'v',
          name: 'uri',
          pos: [5, 0, 3],
          meta: {
            display: 'uri',
            isDefined: true,
            usage: [
              [5, 0, 3],
              [6, 19, 3],
              [8, 24, 3],
              [8, 30, 3],
              [13, 21, 3],
              [15, 22, 3],
              [15, 28, 3],
            ],
            docs: '',
            source: 'user',
            type: [
              {
                display: 'String',
                name: 'String',
                args: [],
                meta: {},
                value: 'buildmosaicraster.task',
              },
            ],
          },
        },
        mosaic3: {
          type: 'v',
          name: 'mosaic3',
          pos: [6, 0, 7],
          meta: {
            display: 'mosaic3',
            isDefined: true,
            usage: [[6, 0, 7]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'envibuildmosaicrastertask',
                display: 'ENVITask<BuildMosaicRaster>',
                args: [
                  [
                    {
                      name: 'BuildMosaicRaster',
                      display: 'BuildMosaicRaster',
                      args: [],
                      meta: {},
                    },
                  ],
                ],
                meta: {},
              },
            ],
          },
        },
        envitaskany1: {
          type: 'v',
          name: 'envitaskany1',
          pos: [8, 0, 12],
          meta: {
            display: 'envitaskany1',
            isDefined: true,
            usage: [[8, 0, 12]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'envitask',
                display: 'ENVITask<any>',
                args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
                meta: {},
              },
            ],
          },
        },
        idlmosaic1: {
          type: 'v',
          name: 'idlmosaic1',
          pos: [10, 0, 10],
          meta: {
            display: 'idlmosaic1',
            isDefined: true,
            usage: [[10, 0, 10]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'idlbuildmosaicrastertask',
                display: 'IDLTask<buildmosaicraster>',
                args: [
                  [
                    {
                      name: 'buildmosaicraster',
                      display: 'buildmosaicraster',
                      args: [],
                      meta: {},
                    },
                  ],
                ],
                meta: {},
              },
            ],
          },
        },
        idlmosaic2: {
          type: 'v',
          name: 'idlmosaic2',
          pos: [11, 0, 10],
          meta: {
            display: 'idlmosaic2',
            isDefined: true,
            usage: [[11, 0, 10]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'idlbuildmosaicrastertask',
                display: 'IDLTask<buildmosaicraster>',
                args: [
                  [
                    {
                      name: 'buildmosaicraster',
                      display: 'buildmosaicraster',
                      args: [],
                      meta: {},
                    },
                  ],
                ],
                meta: {},
              },
            ],
          },
        },
        idlmosaic3: {
          type: 'v',
          name: 'idlmosaic3',
          pos: [13, 0, 10],
          meta: {
            display: 'idlmosaic3',
            isDefined: true,
            usage: [[13, 0, 10]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'idlbuildmosaicrastertask',
                display: 'IDLTask<buildmosaicraster>',
                args: [
                  [
                    {
                      name: 'buildmosaicraster',
                      display: 'buildmosaicraster',
                      args: [],
                      meta: {},
                    },
                  ],
                ],
                meta: {},
              },
            ],
          },
        },
        idltaskany1: {
          type: 'v',
          name: 'idltaskany1',
          pos: [15, 0, 11],
          meta: {
            display: 'idltaskany1',
            isDefined: true,
            usage: [[15, 0, 11]],
            docs: '',
            source: 'user',
            type: [
              {
                name: 'idltask',
                display: 'IDLTask<any>',
                args: [[{ name: 'any', display: 'any', args: [], meta: {} }]],
                meta: {},
              },
            ],
          },
        },
      },
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'p',
        name: '$main$',
        pos: [0, 0, 11],
        meta: {
          display: '$main$',
          docs: 'Main level program',
          docsLookup: {},
          args: {},
          kws: {},
          source: 'user',
          struct: [],
        },
      },
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: {},
      pro: {},
      main: ['idl2'],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
