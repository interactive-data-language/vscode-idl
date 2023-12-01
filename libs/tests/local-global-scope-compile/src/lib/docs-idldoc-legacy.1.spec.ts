import { CancellationToken } from '@idl/cancellation-tokens';
import { GlobalTokens, ICompileOptions } from '@idl/data-types/core';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { ILocalTokens } from '@idl/parsing/syntax-tree';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Parse legacy IDL Doc styles`, () => {
  it(`[auto generated] for procedure`, async () => {
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
      `;+`,
      `; LatLon_Distance`,
      `;   Computes the distance of a rhumb line connecting two points on a sphere or spheroid`,
      `;`,
      `; @param lon1, lat1 {input} Longitude and latitude of the 1st point, p0`,
      `; @param lon2, lat2 {input} Longitude and latitude of the 2nd point, p1`,
      `; @param method {input} The method to be used, options are:`,
      `;   1 - Haversine (sphere) - selected by default`,
      `;   2 - Vincenty  (spheroid)`,
      `;`,
      `; @keyword meters  Set this keyword to return the distance in meters`,
      `; @keyword radians Set this keyword if inputs are specified in radians (the default is degrees)`,
      `; @keyword radius  Set this keyword to a value specifying the radius of the sphere to be used, in [km]`,
      `;   the default value is the Authalic radius (equal area hyothetical perfect sphere) = 6371.0072`,
      `; @keyword semimajor_axis Set this keyword to the length of the semimajor axis of the reference ellipsoid, in [m]`,
      `;   the default value is the WGS-84 6378137`,
      `; @keyword semiminor_axis Set this keyword to the length of the semiminor axis of the reference ellipsoid, in [m]`,
      `;   the default value is the WGS-84 6356752.314245`,
      `;`,
      `; @references`,
      `;   Haversine formula ( great-circle distance between two points on a sphere )`,
      `;     https://en.wikipedia.org/wiki/Haversine_formula`,
      `;   Vincenty formula ( distance between two points on the surface of a spheroid )`,
      `;     https://en.wikipedia.org/wiki/Vincenty%27s_formulae`,
      `;     https://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf`,
      `;`,
      `; @history`,
      `;   Thu Jul 29, 2021 - Introduce the Vincenty equation (computation of distances over an spheroid)`,
      `;   Sun Apr 23, 2023 - Fix the Vincenty calculation at latitudes close to zero`,
      `;   Wed May 10, 2023 - Allow arrays in the Vincenty method`,
      `;-`,
      `pro idltasktest, lon1, lat1, lon2, lat2, method, meters = meters, radians = radians, radius  = radius, semimajor_axis = semimajor_axis, semiminor_axis = semiminor_axis`,
      `  compile_opt idl2 `,
      ``,
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
      pro: {
        idltasktest: {
          meters: {
            type: 'v',
            name: 'meters',
            pos: [31, 58, 6],
            meta: {
              display: 'meters',
              isDefined: true,
              usage: [[31, 58, 6]],
              docs: 'Set this keyword to return the distance in meters',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          radians: {
            type: 'v',
            name: 'radians',
            pos: [31, 76, 7],
            meta: {
              display: 'radians',
              isDefined: true,
              usage: [[31, 76, 7]],
              docs: 'Set this keyword if inputs are specified in radians (the default is degrees)',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          radius: {
            type: 'v',
            name: 'radius',
            pos: [31, 95, 6],
            meta: {
              display: 'radius',
              isDefined: true,
              usage: [[31, 95, 6]],
              docs: 'Set this keyword to a value specifying the radius of the sphere to be used, in [km]\n  the default value is the Authalic radius (equal area hyothetical perfect sphere) = 6371.0072',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          semimajor_axis: {
            type: 'v',
            name: 'semimajor_axis',
            pos: [31, 120, 14],
            meta: {
              display: 'semimajor_axis',
              isDefined: true,
              usage: [[31, 120, 14]],
              docs: 'Set this keyword to the length of the semimajor axis of the reference ellipsoid, in [m]\n  the default value is the WGS-84 6378137',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          semiminor_axis: {
            type: 'v',
            name: 'semiminor_axis',
            pos: [31, 153, 14],
            meta: {
              display: 'semiminor_axis',
              isDefined: true,
              usage: [[31, 153, 14]],
              docs: 'Set this keyword to the length of the semiminor axis of the reference ellipsoid, in [m]\n  the default value is the WGS-84 6356752.314245',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          lon1: {
            type: 'v',
            name: 'lon1',
            pos: [31, 17, 4],
            meta: {
              display: 'lon1',
              isDefined: true,
              usage: [[31, 17, 4]],
              docs: 'Longitude and latitude of the 1st point, p0',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          lat1: {
            type: 'v',
            name: 'lat1',
            pos: [31, 23, 4],
            meta: {
              display: 'lat1',
              isDefined: true,
              usage: [[31, 23, 4]],
              docs: 'Longitude and latitude of the 1st point, p0',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          lon2: {
            type: 'v',
            name: 'lon2',
            pos: [31, 29, 4],
            meta: {
              display: 'lon2',
              isDefined: true,
              usage: [[31, 29, 4]],
              docs: 'Longitude and latitude of the 2nd point, p1',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          lat2: {
            type: 'v',
            name: 'lat2',
            pos: [31, 35, 4],
            meta: {
              display: 'lat2',
              isDefined: true,
              usage: [[31, 35, 4]],
              docs: 'Longitude and latitude of the 2nd point, p1',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          method: {
            type: 'v',
            name: 'method',
            pos: [31, 41, 6],
            meta: {
              display: 'method',
              isDefined: true,
              usage: [[31, 41, 6]],
              docs: 'The method to be used, options are:\n  1 - Haversine (sphere) - selected by default\n  2 - Vincenty  (spheroid)',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
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
        name: 'idltasktest',
        pos: [31, 4, 11],
        meta: {
          source: 'user',
          args: {
            lon1: {
              docs: 'Longitude and latitude of the 1st point, p0',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'lon1',
              code: true,
              pos: [31, 17, 4],
            },
            lat1: {
              docs: 'Longitude and latitude of the 1st point, p0',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'lat1',
              code: true,
              pos: [31, 23, 4],
            },
            lon2: {
              docs: 'Longitude and latitude of the 2nd point, p1',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'lon2',
              code: true,
              pos: [31, 29, 4],
            },
            lat2: {
              docs: 'Longitude and latitude of the 2nd point, p1',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'lat2',
              code: true,
              pos: [31, 35, 4],
            },
            method: {
              docs: 'The method to be used, options are:\n  1 - Haversine (sphere) - selected by default\n  2 - Vincenty  (spheroid)',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'method',
              code: true,
              pos: [31, 41, 6],
            },
          },
          docs: '\n```idl\nidltasktest, lon1, lat1, lon2, lat2, method, $\n meters = any, $\n radians = any, $\n radius = any, $\n semimajor_axis = any, $\n semiminor_axis = any\n```\n\nLatLon_Distance\n  Computes the distance of a rhumb line connecting two points on a sphere or spheroid\n\n#### Arguments\n\n- **lon1**: in, required, any\n\n  Longitude and latitude of the 1st point, p0\n\n- **lat1**: in, required, any\n\n  Longitude and latitude of the 1st point, p0\n\n- **lon2**: in, required, any\n\n  Longitude and latitude of the 2nd point, p1\n\n- **lat2**: in, required, any\n\n  Longitude and latitude of the 2nd point, p1\n\n- **method**: in, required, any\n\n  The method to be used, options are:\n    1 - Haversine (sphere) - selected by default\n    2 - Vincenty  (spheroid)\n\n\n#### Keywords\n\n- **meters**: bidirectional, required, any\n\n    Set this keyword to return the distance in meters\n\n- **radians**: bidirectional, required, any\n\n    Set this keyword if inputs are specified in radians (the default is degrees)\n\n- **radius**: bidirectional, required, any\n\n    Set this keyword to a value specifying the radius of the sphere to be used, in [km]\n      the default value is the Authalic radius (equal area hyothetical perfect sphere) = 6371.0072\n\n- **semimajor_axis**: bidirectional, required, any\n\n    Set this keyword to the length of the semimajor axis of the reference ellipsoid, in [m]\n      the default value is the WGS-84 6378137\n\n- **semiminor_axis**: bidirectional, required, any\n\n    Set this keyword to the length of the semiminor axis of the reference ellipsoid, in [m]\n      the default value is the WGS-84 6356752.314245\n\n\n### References\n\nHaversine formula ( great-circle distance between two points on a sphere )\n  https://en.wikipedia.org/wiki/Haversine_formula\nVincenty formula ( distance between two points on the surface of a spheroid )\n  https://en.wikipedia.org/wiki/Vincenty%27s_formulae\n  https://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf\n### Revisions\n\nThu Jul 29, 2021 - Introduce the Vincenty equation (computation of distances over an spheroid)\nSun Apr 23, 2023 - Fix the Vincenty calculation at latitudes close to zero\nWed May 10, 2023 - Allow arrays in the Vincenty method',
          docsLookup: {
            default:
              'LatLon_Distance\n  Computes the distance of a rhumb line connecting two points on a sphere or spheroid',
            references:
              'Haversine formula ( great-circle distance between two points on a sphere )\n  https://en.wikipedia.org/wiki/Haversine_formula\nVincenty formula ( distance between two points on the surface of a spheroid )\n  https://en.wikipedia.org/wiki/Vincenty%27s_formulae\n  https://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf',
            revisions:
              'Thu Jul 29, 2021 - Introduce the Vincenty equation (computation of distances over an spheroid)\nSun Apr 23, 2023 - Fix the Vincenty calculation at latitudes close to zero\nWed May 10, 2023 - Allow arrays in the Vincenty method',
          },
          display: 'idltasktest',
          kws: {
            meters: {
              docs: 'Set this keyword to return the distance in meters',
              direction: 'bidirectional',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'meters',
              code: true,
              pos: [31, 49, 6],
            },
            radians: {
              docs: 'Set this keyword if inputs are specified in radians (the default is degrees)',
              direction: 'bidirectional',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'radians',
              code: true,
              pos: [31, 66, 7],
            },
            radius: {
              docs: 'Set this keyword to a value specifying the radius of the sphere to be used, in [km]\n  the default value is the Authalic radius (equal area hyothetical perfect sphere) = 6371.0072',
              direction: 'bidirectional',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'radius',
              code: true,
              pos: [31, 85, 6],
            },
            semimajor_axis: {
              docs: 'Set this keyword to the length of the semimajor axis of the reference ellipsoid, in [m]\n  the default value is the WGS-84 6378137',
              direction: 'bidirectional',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'semimajor_axis',
              code: true,
              pos: [31, 103, 14],
            },
            semiminor_axis: {
              docs: 'Set this keyword to the length of the semiminor axis of the reference ellipsoid, in [m]\n  the default value is the WGS-84 6356752.314245',
              direction: 'bidirectional',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'semiminor_axis',
              code: true,
              pos: [31, 136, 14],
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
      pro: { idltasktest: ['idl2'] },
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });

  it(`[auto generated] for function`, async () => {
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
      `;+`,
      `; LatLon_Distance`,
      `;   Computes the distance of a rhumb line connecting two points on a sphere or spheroid`,
      `;`,
      `; @param lon1, lat1 {input} Longitude and latitude of the 1st point, p0`,
      `; @param lon2, lat2 {input} Longitude and latitude of the 2nd point, p1`,
      `; @param method {input} The method to be used, options are:`,
      `;   1 - Haversine (sphere) - selected by default`,
      `;   2 - Vincenty  (spheroid)`,
      `;`,
      `; @keyword meters  Set this keyword to return the distance in meters`,
      `; @keyword radians Set this keyword if inputs are specified in radians (the default is degrees)`,
      `; @keyword radius  Set this keyword to a value specifying the radius of the sphere to be used, in [km]`,
      `;   the default value is the Authalic radius (equal area hyothetical perfect sphere) = 6371.0072`,
      `; @keyword semimajor_axis Set this keyword to the length of the semimajor axis of the reference ellipsoid, in [m]`,
      `;   the default value is the WGS-84 6378137`,
      `; @keyword semiminor_axis Set this keyword to the length of the semiminor axis of the reference ellipsoid, in [m]`,
      `;   the default value is the WGS-84 6356752.314245`,
      `;`,
      `; @returns The distance between the 2 points, [km] by default`,
      `;`,
      `; @references`,
      `;   Haversine formula ( great-circle distance between two points on a sphere )`,
      `;     https://en.wikipedia.org/wiki/Haversine_formula`,
      `;   Vincenty formula ( distance between two points on the surface of a spheroid )`,
      `;     https://en.wikipedia.org/wiki/Vincenty%27s_formulae`,
      `;     https://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf`,
      `;`,
      `; @history`,
      `;   Thu Jul 29, 2021 - Introduce the Vincenty equation (computation of distances over an spheroid)`,
      `;   Sun Apr 23, 2023 - Fix the Vincenty calculation at latitudes close to zero`,
      `;   Wed May 10, 2023 - Allow arrays in the Vincenty method`,
      `;-`,
      `function idltasktest, lon1, lat1, lon2, lat2, method, meters = meters, radians = radians, radius  = radius, semimajor_axis = semimajor_axis, semiminor_axis = semiminor_axis`,
      `  compile_opt idl2 `,
      ``,
      `  return, 1`,
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
      func: {
        idltasktest: {
          meters: {
            type: 'v',
            name: 'meters',
            pos: [33, 63, 6],
            meta: {
              display: 'meters',
              isDefined: true,
              usage: [[33, 63, 6]],
              docs: 'Set this keyword to return the distance in meters',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          radians: {
            type: 'v',
            name: 'radians',
            pos: [33, 81, 7],
            meta: {
              display: 'radians',
              isDefined: true,
              usage: [[33, 81, 7]],
              docs: 'Set this keyword if inputs are specified in radians (the default is degrees)',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          radius: {
            type: 'v',
            name: 'radius',
            pos: [33, 100, 6],
            meta: {
              display: 'radius',
              isDefined: true,
              usage: [[33, 100, 6]],
              docs: 'Set this keyword to a value specifying the radius of the sphere to be used, in [km]\n  the default value is the Authalic radius (equal area hyothetical perfect sphere) = 6371.0072',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          semimajor_axis: {
            type: 'v',
            name: 'semimajor_axis',
            pos: [33, 125, 14],
            meta: {
              display: 'semimajor_axis',
              isDefined: true,
              usage: [[33, 125, 14]],
              docs: 'Set this keyword to the length of the semimajor axis of the reference ellipsoid, in [m]\n  the default value is the WGS-84 6378137',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          semiminor_axis: {
            type: 'v',
            name: 'semiminor_axis',
            pos: [33, 158, 14],
            meta: {
              display: 'semiminor_axis',
              isDefined: true,
              usage: [[33, 158, 14]],
              docs: 'Set this keyword to the length of the semiminor axis of the reference ellipsoid, in [m]\n  the default value is the WGS-84 6356752.314245',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          lon1: {
            type: 'v',
            name: 'lon1',
            pos: [33, 22, 4],
            meta: {
              display: 'lon1',
              isDefined: true,
              usage: [[33, 22, 4]],
              docs: 'Longitude and latitude of the 1st point, p0',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          lat1: {
            type: 'v',
            name: 'lat1',
            pos: [33, 28, 4],
            meta: {
              display: 'lat1',
              isDefined: true,
              usage: [[33, 28, 4]],
              docs: 'Longitude and latitude of the 1st point, p0',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          lon2: {
            type: 'v',
            name: 'lon2',
            pos: [33, 34, 4],
            meta: {
              display: 'lon2',
              isDefined: true,
              usage: [[33, 34, 4]],
              docs: 'Longitude and latitude of the 2nd point, p1',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          lat2: {
            type: 'v',
            name: 'lat2',
            pos: [33, 40, 4],
            meta: {
              display: 'lat2',
              isDefined: true,
              usage: [[33, 40, 4]],
              docs: 'Longitude and latitude of the 2nd point, p1',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
          method: {
            type: 'v',
            name: 'method',
            pos: [33, 46, 6],
            meta: {
              display: 'method',
              isDefined: true,
              usage: [[33, 46, 6]],
              docs: 'The method to be used, options are:\n  1 - Haversine (sphere) - selected by default\n  2 - Vincenty  (spheroid)',
              source: 'user',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            },
          },
        },
      },
      pro: {},
      main: {},
    };

    // verify results
    expect(tokenized.local).toEqual(expectedVars);

    // define expected global variables
    const expectedGlobal: GlobalTokens = [
      {
        type: 'f',
        name: 'idltasktest',
        pos: [33, 9, 11],
        meta: {
          source: 'user',
          args: {
            lon1: {
              docs: 'Longitude and latitude of the 1st point, p0',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'lon1',
              code: true,
              pos: [33, 22, 4],
            },
            lat1: {
              docs: 'Longitude and latitude of the 1st point, p0',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'lat1',
              code: true,
              pos: [33, 28, 4],
            },
            lon2: {
              docs: 'Longitude and latitude of the 2nd point, p1',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'lon2',
              code: true,
              pos: [33, 34, 4],
            },
            lat2: {
              docs: 'Longitude and latitude of the 2nd point, p1',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'lat2',
              code: true,
              pos: [33, 40, 4],
            },
            method: {
              docs: 'The method to be used, options are:\n  1 - Haversine (sphere) - selected by default\n  2 - Vincenty  (spheroid)',
              direction: 'in',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'method',
              code: true,
              pos: [33, 46, 6],
            },
          },
          docs: '\n```idl\nresult = idltasktest( lon1, lat1, lon2, lat2, method, $\n meters = any, $\n radians = any, $\n radius = any, $\n semimajor_axis = any, $\n semiminor_axis = any)\n```\n\nLatLon_Distance\n  Computes the distance of a rhumb line connecting two points on a sphere or spheroid\n\n#### Arguments\n\n- **lon1**: in, required, any\n\n  Longitude and latitude of the 1st point, p0\n\n- **lat1**: in, required, any\n\n  Longitude and latitude of the 1st point, p0\n\n- **lon2**: in, required, any\n\n  Longitude and latitude of the 2nd point, p1\n\n- **lat2**: in, required, any\n\n  Longitude and latitude of the 2nd point, p1\n\n- **method**: in, required, any\n\n  The method to be used, options are:\n    1 - Haversine (sphere) - selected by default\n    2 - Vincenty  (spheroid)\n\n\n#### Keywords\n\n- **meters**: bidirectional, required, any\n\n    Set this keyword to return the distance in meters\n\n- **radians**: bidirectional, required, any\n\n    Set this keyword if inputs are specified in radians (the default is degrees)\n\n- **radius**: bidirectional, required, any\n\n    Set this keyword to a value specifying the radius of the sphere to be used, in [km]\n      the default value is the Authalic radius (equal area hyothetical perfect sphere) = 6371.0072\n\n- **semimajor_axis**: bidirectional, required, any\n\n    Set this keyword to the length of the semimajor axis of the reference ellipsoid, in [m]\n      the default value is the WGS-84 6378137\n\n- **semiminor_axis**: bidirectional, required, any\n\n    Set this keyword to the length of the semiminor axis of the reference ellipsoid, in [m]\n      the default value is the WGS-84 6356752.314245\n\n\n### References\n\nHaversine formula ( great-circle distance between two points on a sphere )\n  https://en.wikipedia.org/wiki/Haversine_formula\nVincenty formula ( distance between two points on the surface of a spheroid )\n  https://en.wikipedia.org/wiki/Vincenty%27s_formulae\n  https://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf\n### Revisions\n\nThu Jul 29, 2021 - Introduce the Vincenty equation (computation of distances over an spheroid)\nSun Apr 23, 2023 - Fix the Vincenty calculation at latitudes close to zero\nWed May 10, 2023 - Allow arrays in the Vincenty method',
          docsLookup: {
            default:
              'LatLon_Distance\n  Computes the distance of a rhumb line connecting two points on a sphere or spheroid',
            returns: 'The distance between the 2 points, [km] by default',
            references:
              'Haversine formula ( great-circle distance between two points on a sphere )\n  https://en.wikipedia.org/wiki/Haversine_formula\nVincenty formula ( distance between two points on the surface of a spheroid )\n  https://en.wikipedia.org/wiki/Vincenty%27s_formulae\n  https://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf',
            revisions:
              'Thu Jul 29, 2021 - Introduce the Vincenty equation (computation of distances over an spheroid)\nSun Apr 23, 2023 - Fix the Vincenty calculation at latitudes close to zero\nWed May 10, 2023 - Allow arrays in the Vincenty method',
          },
          display: 'idltasktest',
          kws: {
            meters: {
              docs: 'Set this keyword to return the distance in meters',
              direction: 'bidirectional',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'meters',
              code: true,
              pos: [33, 54, 6],
            },
            radians: {
              docs: 'Set this keyword if inputs are specified in radians (the default is degrees)',
              direction: 'bidirectional',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'radians',
              code: true,
              pos: [33, 71, 7],
            },
            radius: {
              docs: 'Set this keyword to a value specifying the radius of the sphere to be used, in [km]\n  the default value is the Authalic radius (equal area hyothetical perfect sphere) = 6371.0072',
              direction: 'bidirectional',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'radius',
              code: true,
              pos: [33, 90, 6],
            },
            semimajor_axis: {
              docs: 'Set this keyword to the length of the semimajor axis of the reference ellipsoid, in [m]\n  the default value is the WGS-84 6378137',
              direction: 'bidirectional',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'semimajor_axis',
              code: true,
              pos: [33, 108, 14],
            },
            semiminor_axis: {
              docs: 'Set this keyword to the length of the semiminor axis of the reference ellipsoid, in [m]\n  the default value is the WGS-84 6356752.314245',
              direction: 'bidirectional',
              source: 'internal',
              type: [{ name: 'any', display: 'any', args: [], meta: {} }],
              private: false,
              req: true,
              display: 'semiminor_axis',
              code: true,
              pos: [33, 141, 14],
            },
          },
          private: false,
          returns: [{ name: 'any', display: 'any', args: [], meta: {} }],
          struct: [],
        },
        file: 'not-real',
      },
    ];

    // verify results
    expect(tokenized.global).toEqual(expectedGlobal);

    // define expected compile options
    const expectedCompile: ICompileOptions = {
      func: { idltasktest: ['idl2'] },
      pro: {},
      main: [],
    };

    // verify results
    expect(tokenized.compile).toEqual(expectedCompile);
  });
});
