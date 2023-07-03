import { GetExtensionPath } from '@idl/shared';
import { writeFileSync } from 'fs';

import {
  FUNCTION_METHOD_TYPE_OVERRIDES,
  FUNCTION_TYPE_OVERRIDES,
  IDL_STRUCTURE_TYPE_OVERRIDES,
  PROCEDURE_METHOD_TYPE_OVERRIDES,
  PROCEDURE_TYPE_OVERRIDES,
} from './types/type-overrides.interface';

/**
 * Normalize write process
 */
function WriteFile(uri: string, content: any) {
  writeFileSync(uri, JSON.stringify(content, null, 2));
}

/**
 * Saves type overrides to disk after populating from the
 * docs that we parsed.
 *
 * this makes sure that it is up-to-date with the latest and greatest.
 */
export function SaveTypeOverrides() {
  WriteFile(
    GetExtensionPath('apps/idl-docs-parser/src/overrides/types/functions.json'),
    FUNCTION_TYPE_OVERRIDES
  );

  WriteFile(
    GetExtensionPath(
      'apps/idl-docs-parser/src/overrides/types/function-methods.json'
    ),
    FUNCTION_METHOD_TYPE_OVERRIDES
  );

  WriteFile(
    GetExtensionPath(
      'apps/idl-docs-parser/src/overrides/types/procedures.json'
    ),
    PROCEDURE_TYPE_OVERRIDES
  );

  WriteFile(
    GetExtensionPath(
      'apps/idl-docs-parser/src/overrides/types/procedure-methods.json'
    ),
    PROCEDURE_METHOD_TYPE_OVERRIDES
  );

  WriteFile(
    GetExtensionPath(
      'apps/idl-docs-parser/src/overrides/types/structures.json'
    ),
    IDL_STRUCTURE_TYPE_OVERRIDES
  );
}
