import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GlobalTokens, ICompileOptions } from '@idl/types/idl-data-types';
import { ILocalTokens } from '@idl/types/syntax-tree';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Types from`, () => {
  it(`[auto generated] legacy array creation`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0,
    );

    // test code to extract tokens from
    const code = [
      `;+`,
      `; :Description:`,
      `;   Queries the KY Bridges feature service for one or more bridge IDs, creates a`,
      `;   separate CityWorks inspection request for each bridge, and writes all matching`,
      `;   point features to a single shapefile.`,
      `;`,
      `; :Keywords:`,
      `;   BRIDGE_ID : in, required, type=StringArray`,
      `;     One or more bridge structure numbers (STRUCTURE_NUMBER_008)`,
      `;   INSPECTION_IDS : out, optional, type=StringArray`,
      `;     The IDs of the created CityWorks inspections, one per bridge`,
      `;   SHAPEFILE_URI : in, optional, type=string`,
      `;     Fully-qualified path for the output shapefile. Auto-generated if not provided.`,
      `;   OUTPUT_VECTOR : out, optional, type=ENVIVector`,
      `;     ENVIVector reference to the output bridge point shapefile`,
      `;`,
      `;-`,
      `pro create_inspection_request, $`,
      `  bridge_id = bridge_id, $`,
      `  inspection_ids = inspection_ids, $`,
      `  shapefile_uri = shapefile_uri, $`,
      `  output_vector = output_vector`,
      `  compile_opt idl2, hidden`,
      `end`,
    ];

    // extract tokens
    const tokenized = await index.getParsedProCode(
      'not-real',
      code,
      new CancellationToken(),
      { postProcess: true },
    );

    // define expected local variables
    const expectedVars: ILocalTokens = {
      func: {},
      pro: {
        create_inspection_request: {
          bridge_id: {
            type: 'v',
            name: 'bridge_id',
            pos: [18, 14, 9],
            meta: {
              display: 'bridge_id',
              isDefined: true,
              canReset: false,
              usage: [[18, 14, 9]],
              docs: 'One or more bridge structure numbers (STRUCTURE_NUMBER_008)',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<String>',
                  serialized: 'Array<String>',
                  args: [
                    [
                      {
                        name: 'String',
                        display: 'String',
                        serialized: 'String',
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
          inspection_ids: {
            type: 'v',
            name: 'inspection_ids',
            pos: [19, 19, 14],
            meta: {
              display: 'inspection_ids',
              isDefined: true,
              canReset: false,
              usage: [[19, 19, 14]],
              docs: 'The IDs of the created CityWorks inspections, one per bridge',
              source: 'user',
              type: [
                {
                  name: 'Array',
                  display: 'Array<String>',
                  serialized: 'Array<String>',
                  args: [
                    [
                      {
                        name: 'String',
                        display: 'String',
                        serialized: 'String',
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
          shapefile_uri: {
            type: 'v',
            name: 'shapefile_uri',
            pos: [20, 18, 13],
            meta: {
              display: 'shapefile_uri',
              isDefined: true,
              canReset: false,
              usage: [[20, 18, 13]],
              docs: 'Fully-qualified path for the output shapefile. Auto-generated if not provided.',
              source: 'user',
              type: [
                {
                  name: 'String',
                  display: 'String',
                  serialized: 'String',
                  args: [],
                  meta: {},
                },
              ],
            },
          },
          output_vector: {
            type: 'v',
            name: 'output_vector',
            pos: [21, 18, 13],
            meta: {
              display: 'output_vector',
              isDefined: true,
              canReset: false,
              usage: [[21, 18, 13]],
              docs: 'ENVIVector reference to the output bridge point shapefile',
              source: 'user',
              type: [
                {
                  name: 'ENVIVector',
                  display: 'ENVIVector',
                  serialized: 'ENVIVector',
                  args: [],
                  meta: {},
                },
              ],
            },
          },
        },
      },
      main: {},
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'p',
        name: 'create_inspection_request',
        pos: [17, 4, 25],
        range: { start: [17, 0, 4], end: [23, 0, 3] },
        meta: {
          source: 'user',
          args: {},
          docs: '\n```idl\ncreate_inspection_request, $\n  bridge_id = value, $\n  inspection_ids = value, $\n  output_vector = value, $\n  shapefile_uri = value\n```\n\nQueries the KY Bridges feature service for one or more bridge IDs, creates a\nseparate CityWorks inspection request for each bridge, and writes all matching\npoint features to a single shapefile.\n\n\n### Keywords\n\n- **bridge_id**: in, required, Array\\<String\\>\n\n    One or more bridge structure numbers (STRUCTURE_NUMBER_008)\n\n- **inspection_ids**: out, optional, Array\\<String\\>\n\n    The IDs of the created CityWorks inspections, one per bridge\n\n- **output_vector**: out, optional, ENVIVector\n\n    ENVIVector reference to the output bridge point shapefile\n\n- **shapefile_uri**: in, optional, String\n\n    Fully-qualified path for the output shapefile. Auto-generated if not provided.\n\n',
          docsLookup: {
            default:
              'Queries the KY Bridges feature service for one or more bridge IDs, creates a\nseparate CityWorks inspection request for each bridge, and writes all matching\npoint features to a single shapefile.',
          },
          display: 'create_inspection_request',
          kws: {
            bridge_id: {
              docs: 'One or more bridge structure numbers (STRUCTURE_NUMBER_008)',
              direction: 'in',
              source: 'internal',
              type: [
                {
                  name: 'Array',
                  display: 'Array<String>',
                  serialized: 'Array<String>',
                  args: [
                    [
                      {
                        name: 'String',
                        display: 'String',
                        serialized: 'String',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: {},
                },
              ],
              private: false,
              req: true,
              display: 'bridge_id',
              code: true,
              pos: [18, 2, 9],
            },
            inspection_ids: {
              docs: 'The IDs of the created CityWorks inspections, one per bridge',
              direction: 'out',
              source: 'internal',
              type: [
                {
                  name: 'Array',
                  display: 'Array<String>',
                  serialized: 'Array<String>',
                  args: [
                    [
                      {
                        name: 'String',
                        display: 'String',
                        serialized: 'String',
                        args: [],
                        meta: {},
                      },
                    ],
                  ],
                  meta: {},
                },
              ],
              private: false,
              req: false,
              display: 'inspection_ids',
              code: true,
              pos: [19, 2, 14],
            },
            output_vector: {
              docs: 'ENVIVector reference to the output bridge point shapefile',
              direction: 'out',
              source: 'internal',
              type: [
                {
                  name: 'ENVIVector',
                  display: 'ENVIVector',
                  serialized: 'ENVIVector',
                  args: [],
                  meta: {},
                },
              ],
              private: false,
              req: false,
              display: 'output_vector',
              code: true,
              pos: [21, 2, 13],
            },
            shapefile_uri: {
              docs: 'Fully-qualified path for the output shapefile. Auto-generated if not provided.',
              direction: 'in',
              source: 'internal',
              type: [
                {
                  name: 'String',
                  display: 'String',
                  serialized: 'String',
                  args: [],
                  meta: {},
                },
              ],
              private: false,
              req: false,
              display: 'shapefile_uri',
              code: true,
              pos: [20, 2, 13],
            },
          },
          private: false,
          struct: [],
        },
        file: 'not-real',
      },
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: {},
      pro: { create_inspection_request: ['idl2', 'hidden'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
