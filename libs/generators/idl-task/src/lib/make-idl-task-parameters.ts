import { GetDisplayName } from '@idl/generators/tasks-shared';
import { IDLTypeHelper } from '@idl/parsing/type-parser';
import {
  GlobalProcedureToken,
  IDL_TYPE_LOOKUP,
  IGlobalIndexedToken,
} from '@idl/types/idl-data-types';
import { IDLTaskParameter, IDLTaskSchema12 } from '@idl/types/tasks';

/**
 * Makes the ENVI Task parameters from our procedure definition
 */
export function MakeIDLTaskParameters(
  pro: IGlobalIndexedToken<GlobalProcedureToken>,
): IDLTaskParameter<IDLTaskSchema12>[] {
  /**
   * Create parameters
   */
  const params: IDLTaskParameter<IDLTaskSchema12>[] = [];

  /**
   * Get our keywords
   */
  const kws = Object.values(pro.meta.kws);

  // add all keywords
  for (let i = 0; i < kws.length; i++) {
    /** Data type for our keyword */
    const type = kws[i].type;

    /** First pass at parameter */
    const param: IDLTaskParameter<IDLTaskSchema12> = {
      name: kws[i].display,
      display_name: GetDisplayName(kws[i].display),
      description: kws[i].docs,
      type: '',
      required: true,
      direction: kws[i].direction === 'in' ? 'input' : 'output',
    };

    /**
     * Set data type and, if arrays, also set dims and get type args
     */
    if (IDLTypeHelper.isType(type, IDL_TYPE_LOOKUP.ARRAY)) {
      /** Get only array types */
      const arrays = IDLTypeHelper.getMatchingTypes(
        type,
        IDL_TYPE_LOOKUP.ARRAY,
      );

      /** Get types for array */
      const args = IDLTypeHelper.getAllTypeArgs(arrays);

      // save type args (values we store in the array)
      param.type = IDLTypeHelper.serializeIDLType(args, true) + 'Array';
      param.dimensions = '[*]';
    } else {
      param.type = IDLTypeHelper.serializeIDLType(type, true);
    }

    // save
    params.push(param);
  }

  return params;
}
