import { GetDisplayName } from '@idl/generators/tasks-shared';
import {
  GlobalProcedureToken,
  IDL_TYPE_LOOKUP,
  IDLTypeHelper,
  IGlobalIndexedToken,
  SerializeIDLType,
} from '@idl/types/core';
import { ENVITaskParameter, ENVITaskSchema33 } from '@idl/types/tasks';

/**
 * Makes the ENVI Task parameters from our procedure definition
 */
export function MakeENVITaskParameters(
  pro: IGlobalIndexedToken<GlobalProcedureToken>
): ENVITaskParameter<ENVITaskSchema33>[] {
  /**
   * Create parameters
   */
  const params: ENVITaskParameter<ENVITaskSchema33>[] = [];

  /**
   * Get our keywords
   */
  const kws = Object.values(pro.meta.kws);

  // add all keywords
  for (let i = 0; i < kws.length; i++) {
    /** Data type for our keyword */
    const type = kws[i].type;

    /** Name of our keyword */
    const name = kws[i].display.toLowerCase();

    /** First pass at parameter */
    const param: ENVITaskParameter<ENVITaskSchema33> = {
      name: kws[i].display,
      display_name: GetDisplayName(kws[i].display),
      description: kws[i].docs,
      type: '',
      required: true,
      direction: kws[i].direction === 'out' ? 'output' : 'input',
    };

    /**
     * Set data type and, if arrays, also set dims and get type args
     */
    if (IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.ARRAY)) {
      /** Get only array types */
      const arrays = IDLTypeHelper.getMatchingTypes(
        type,
        IDL_TYPE_LOOKUP.ARRAY
      );

      /** Get types for array */
      const args = IDLTypeHelper.getAllTypeArgs(arrays);

      // save type args (values we store in the array)
      param.type = SerializeIDLType(args) + 'Array';
      param.dimensions = '[*]';
    } else {
      param.type = SerializeIDLType(type);
    }

    // save
    params.push(param);

    /**
     * Check if we have a URI parmaeter
     */
    if (name.endsWith('_uri')) {
      param.type = 'ENVIURI';

      // add in auto extension
      switch (true) {
        case name.includes('vector') || name.includes('shapefile'):
          param.auto_extension = '.shp';
          break;
        case name.includes('roi'):
          param.auto_extension = '.dat';
          break;
        case name.includes('series'):
          param.auto_extension = '.series';
          break;
        default:
          param.auto_extension = '.dat';
          break;
      }
    }

    // check paired parameter
    switch (true) {
      /**
       * Paired raster
       */
      case name.endsWith('_raster_uri'): {
        // clean up name for our paired parameter
        const addName = name.replace(/_uri/i, '');

        /** First pass at parameter */
        const paired: ENVITaskParameter<ENVITaskSchema33> = {
          name: addName,
          display_name: addName,
          description: 'A reference to the ENVIRaster that is generated',
          type: 'ENVIRaster',
          required: true,
          direction: 'output',
          uri_param: name,
        };

        // save parameter
        params.push(paired);
        break;
      }
      /**
       * Paired vector
       */
      case name.endsWith('_vector_uri'): {
        // clean up name for our paired parameter
        const addName = name.replace(/_uri/i, '');

        /** First pass at parameter */
        const paired: ENVITaskParameter<ENVITaskSchema33> = {
          name: addName,
          display_name: addName,
          description: 'A reference to the ENVIVector that is generated',
          type: 'ENVIVector',
          required: true,
          direction: 'output',
          uri_param: name,
        };

        // save parameter
        params.push(paired);
        break;
      }
      default:
        break;
    }
  }

  return params;
}
