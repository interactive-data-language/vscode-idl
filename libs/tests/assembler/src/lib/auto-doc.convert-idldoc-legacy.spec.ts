import { Assembler } from '@idl/assembler';
import { CancellationToken } from '@idl/cancellation-tokens';
import { LogManager } from '@idl/logger';
import { GetTokenNames } from '@idl/parser';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { SyntaxProblems } from '@idl/parsing/problem-codes';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Convert old IDL Doc comments`, () => {
  it(`[auto generated] for procedures`, async () => {
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
      'my_file.pro',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // extract token names
    const tokenizedNames = GetTokenNames(tokenized);

    // format code
    const formatted = Assembler(tokenized, new CancellationToken(), {
      autoDoc: true,
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `;+`,
        `; :Description:`,
        `;   LatLon_Distance`,
        `;     Computes the distance of a rhumb line connecting two points on a sphere or spheroid`,
        `;`,
        `; :Arguments:`,
        `;   lon1: in, required, any`,
        `;     Longitude and latitude of the 1st point, p0`,
        `;   lat1: in, required, any`,
        `;     Longitude and latitude of the 1st point, p0`,
        `;   lon2: in, required, any`,
        `;     Longitude and latitude of the 2nd point, p1`,
        `;   lat2: in, required, any`,
        `;     Longitude and latitude of the 2nd point, p1`,
        `;   method: in, required, any`,
        `;     The method to be used, options are:`,
        `;       1 - Haversine (sphere) - selected by default`,
        `;       2 - Vincenty  (spheroid)`,
        `;`,
        `; :Keywords:`,
        `;   meters: bidirectional, required, any`,
        `;     Set this keyword to return the distance in meters`,
        `;   radians: bidirectional, required, any`,
        `;     Set this keyword if inputs are specified in radians (the default is degrees)`,
        `;   radius: bidirectional, required, any`,
        `;     Set this keyword to a value specifying the radius of the sphere to be used, in [km]`,
        `;       the default value is the Authalic radius (equal area hyothetical perfect sphere) = 6371.0072`,
        `;   semimajor_axis: bidirectional, required, any`,
        `;     Set this keyword to the length of the semimajor axis of the reference ellipsoid, in [m]`,
        `;       the default value is the WGS-84 6378137`,
        `;   semiminor_axis: bidirectional, required, any`,
        `;     Set this keyword to the length of the semiminor axis of the reference ellipsoid, in [m]`,
        `;       the default value is the WGS-84 6356752.314245`,
        `;`,
        `; :References:`,
        `;   Haversine formula ( great-circle distance between two points on a sphere )`,
        `;     https://en.wikipedia.org/wiki/Haversine_formula`,
        `;   Vincenty formula ( distance between two points on the surface of a spheroid )`,
        `;     https://en.wikipedia.org/wiki/Vincenty%27s_formulae`,
        `;     https://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf`,
        `;`,
        `; :Revisions:`,
        `;   Thu Jul 29, 2021 - Introduce the Vincenty equation (computation of distances over an spheroid)`,
        `;   Sun Apr 23, 2023 - Fix the Vincenty calculation at latitudes close to zero`,
        `;   Wed May 10, 2023 - Allow arrays in the Vincenty method`,
        `;`,
        `;-`,
        `pro idltasktest, lon1, lat1, lon2, lat2, method, meters = meters, radians = radians, radius = radius, semimajor_axis = semimajor_axis, semiminor_axis = semiminor_axis`,
        `  compile_opt idl2`,
        `end`,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);

      // parse formatted code
      const reParsed = await index.getParsedProCode(
        'my_file.pro',
        formatted,
        new CancellationToken(),
        { postProcess: true }
      );

      // make sure the syntax trees are the same as they were before
      expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 104,
        info: 'Unused variable "meters"',
        start: [47, 58, 6],
        end: [47, 58, 6],
      },
      {
        code: 104,
        info: 'Unused variable "radians"',
        start: [47, 76, 7],
        end: [47, 76, 7],
      },
      {
        code: 104,
        info: 'Unused variable "radius"',
        start: [47, 95, 6],
        end: [47, 95, 6],
      },
      {
        code: 104,
        info: 'Unused variable "semimajor_axis"',
        start: [47, 120, 14],
        end: [47, 120, 14],
      },
      {
        code: 104,
        info: 'Unused variable "semiminor_axis"',
        start: [47, 153, 14],
        end: [47, 153, 14],
      },
      {
        code: 104,
        info: 'Unused variable "lon1"',
        start: [47, 17, 4],
        end: [47, 17, 4],
      },
      {
        code: 104,
        info: 'Unused variable "lat1"',
        start: [47, 23, 4],
        end: [47, 23, 4],
      },
      {
        code: 104,
        info: 'Unused variable "lon2"',
        start: [47, 29, 4],
        end: [47, 29, 4],
      },
      {
        code: 104,
        info: 'Unused variable "lat2"',
        start: [47, 35, 4],
        end: [47, 35, 4],
      },
      {
        code: 104,
        info: 'Unused variable "method"',
        start: [47, 41, 6],
        end: [47, 41, 6],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });

  it(`[auto generated] for functions`, async () => {
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
      'my_file.pro',
      code,
      new CancellationToken(),
      { postProcess: true }
    );

    // extract token names
    const tokenizedNames = GetTokenNames(tokenized);

    // format code
    const formatted = Assembler(tokenized, new CancellationToken(), {
      autoDoc: true,
      autoFix: false,
      formatter: 'fiddle',
    });

    // verify formatting
    if (formatted === undefined) {
      expect(formatted).toEqual(undefined);
    } else {
      // define expected problems
      const expectedFormatting: string[] = [
        `;+`,
        `; :Description:`,
        `;   LatLon_Distance`,
        `;     Computes the distance of a rhumb line connecting two points on a sphere or spheroid`,
        `;`,
        `; :Returns: any`,
        `;`,
        `; :Arguments:`,
        `;   lon1: in, required, any`,
        `;     Longitude and latitude of the 1st point, p0`,
        `;   lat1: in, required, any`,
        `;     Longitude and latitude of the 1st point, p0`,
        `;   lon2: in, required, any`,
        `;     Longitude and latitude of the 2nd point, p1`,
        `;   lat2: in, required, any`,
        `;     Longitude and latitude of the 2nd point, p1`,
        `;   method: in, required, any`,
        `;     The method to be used, options are:`,
        `;       1 - Haversine (sphere) - selected by default`,
        `;       2 - Vincenty  (spheroid)`,
        `;`,
        `; :Keywords:`,
        `;   meters: bidirectional, required, any`,
        `;     Set this keyword to return the distance in meters`,
        `;   radians: bidirectional, required, any`,
        `;     Set this keyword if inputs are specified in radians (the default is degrees)`,
        `;   radius: bidirectional, required, any`,
        `;     Set this keyword to a value specifying the radius of the sphere to be used, in [km]`,
        `;       the default value is the Authalic radius (equal area hyothetical perfect sphere) = 6371.0072`,
        `;   semimajor_axis: bidirectional, required, any`,
        `;     Set this keyword to the length of the semimajor axis of the reference ellipsoid, in [m]`,
        `;       the default value is the WGS-84 6378137`,
        `;   semiminor_axis: bidirectional, required, any`,
        `;     Set this keyword to the length of the semiminor axis of the reference ellipsoid, in [m]`,
        `;       the default value is the WGS-84 6356752.314245`,
        `;`,
        `; :References:`,
        `;   Haversine formula ( great-circle distance between two points on a sphere )`,
        `;     https://en.wikipedia.org/wiki/Haversine_formula`,
        `;   Vincenty formula ( distance between two points on the surface of a spheroid )`,
        `;     https://en.wikipedia.org/wiki/Vincenty%27s_formulae`,
        `;     https://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf`,
        `;`,
        `; :Revisions:`,
        `;   Thu Jul 29, 2021 - Introduce the Vincenty equation (computation of distances over an spheroid)`,
        `;   Sun Apr 23, 2023 - Fix the Vincenty calculation at latitudes close to zero`,
        `;   Wed May 10, 2023 - Allow arrays in the Vincenty method`,
        `;`,
        `;-`,
        `function idltasktest, lon1, lat1, lon2, lat2, method, meters = meters, radians = radians, radius = radius, semimajor_axis = semimajor_axis, semiminor_axis = semiminor_axis`,
        `  compile_opt idl2`,
        ``,
        `  return, 1`,
        `end`,
      ];

      // verify formatting
      expect(formatted.split(`\n`)).toEqual(expectedFormatting);

      // parse formatted code
      const reParsed = await index.getParsedProCode(
        'my_file.pro',
        formatted,
        new CancellationToken(),
        { postProcess: true }
      );

      // make sure the syntax trees are the same as they were before
      expect(GetTokenNames(reParsed)).toEqual(tokenizedNames);
    }

    // define expected problems
    const expectedProblems: SyntaxProblems = [
      {
        code: 104,
        info: 'Unused variable "meters"',
        start: [49, 63, 6],
        end: [49, 63, 6],
      },
      {
        code: 104,
        info: 'Unused variable "radians"',
        start: [49, 81, 7],
        end: [49, 81, 7],
      },
      {
        code: 104,
        info: 'Unused variable "radius"',
        start: [49, 100, 6],
        end: [49, 100, 6],
      },
      {
        code: 104,
        info: 'Unused variable "semimajor_axis"',
        start: [49, 125, 14],
        end: [49, 125, 14],
      },
      {
        code: 104,
        info: 'Unused variable "semiminor_axis"',
        start: [49, 158, 14],
        end: [49, 158, 14],
      },
      {
        code: 104,
        info: 'Unused variable "lon1"',
        start: [49, 22, 4],
        end: [49, 22, 4],
      },
      {
        code: 104,
        info: 'Unused variable "lat1"',
        start: [49, 28, 4],
        end: [49, 28, 4],
      },
      {
        code: 104,
        info: 'Unused variable "lon2"',
        start: [49, 34, 4],
        end: [49, 34, 4],
      },
      {
        code: 104,
        info: 'Unused variable "lat2"',
        start: [49, 40, 4],
        end: [49, 40, 4],
      },
      {
        code: 104,
        info: 'Unused variable "method"',
        start: [49, 46, 6],
        end: [49, 46, 6],
      },
    ];

    // verify problems
    expect(
      tokenized.parseProblems.concat(tokenized.postProcessProblems)
    ).toEqual(expectedProblems);
  });
});
