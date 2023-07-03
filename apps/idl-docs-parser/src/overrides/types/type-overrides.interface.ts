import { GetExtensionPath } from '@idl/shared';
import { readFileSync } from 'fs';

import {
  IFunctionMethodTypeOverride,
  IFunctionTypeOverride,
  IProcedureMethodTypeOverride,
  IProcedureTypeOverride,
  IStructureTypeOverride,
} from './types.interface';

/**
 * Type overrides for functions
 */
export const FUNCTION_TYPE_OVERRIDES: IFunctionTypeOverride = JSON.parse(
  readFileSync(
    GetExtensionPath('apps/idl-docs-parser/src/overrides/types/functions.json'),
    {
      encoding: 'utf-8',
    }
  )
);

/**
 * Type overrides for function methods
 */
export const FUNCTION_METHOD_TYPE_OVERRIDES: IFunctionMethodTypeOverride =
  JSON.parse(
    readFileSync(
      GetExtensionPath(
        'apps/idl-docs-parser/src/overrides/types/function-methods.json'
      ),
      {
        encoding: 'utf-8',
      }
    )
  );

/**
 * Type overrides for procedures
 */
export const PROCEDURE_TYPE_OVERRIDES: IProcedureTypeOverride = JSON.parse(
  readFileSync(
    GetExtensionPath(
      'apps/idl-docs-parser/src/overrides/types/procedures.json'
    ),
    {
      encoding: 'utf-8',
    }
  )
);

/**
 * Type overrides for procedure methods
 */
export const PROCEDURE_METHOD_TYPE_OVERRIDES: IProcedureMethodTypeOverride =
  JSON.parse(
    readFileSync(
      GetExtensionPath(
        'apps/idl-docs-parser/src/overrides/types/procedure-methods.json'
      ),
      {
        encoding: 'utf-8',
      }
    )
  );

/**
 * Type overrides for structures
 */
export const IDL_STRUCTURE_TYPE_OVERRIDES: IStructureTypeOverride = JSON.parse(
  readFileSync(
    GetExtensionPath(
      'apps/idl-docs-parser/src/overrides/types/structures.json'
    ),
    {
      encoding: 'utf-8',
    }
  )
);
