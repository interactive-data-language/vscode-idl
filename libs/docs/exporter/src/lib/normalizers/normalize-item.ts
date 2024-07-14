import { TransformCase } from '@idl/assembling/shared';
import { GlobalIndexedToken } from '@idl/parsing/index';
import {
  GLOBAL_TOKEN_TYPES,
  GlobalFunctionMethodToken,
  GlobalFunctionToken,
  GlobalProcedureMethodToken,
  GlobalProcedureToken,
  GlobalStructureToken,
  IGlobalIndexedToken,
  TASK_REGEX,
} from '@idl/types/core';

import { CURRENT_CONFIG } from '../docs-exporter';
import { NormalizeArgs } from './normalize-args';
import { NormalizeKeywords } from './normalize-keywords';
import { NormalizeProperties } from './normalize-properties';

/**
 * Normalizes global tokens so docs are always consistent
 */
export async function NormalizeItem(item: GlobalIndexedToken) {
  switch (item.type) {
    case GLOBAL_TOKEN_TYPES.FUNCTION: {
      const typed = item as IGlobalIndexedToken<GlobalFunctionToken>;

      // fix display name
      typed.meta.display = TransformCase(
        typed.meta.display,
        CURRENT_CONFIG.style.routines
      );

      // update parameters
      await NormalizeArgs(typed.meta.args);
      await NormalizeKeywords(typed.meta.kws);
      break;
    }
    case GLOBAL_TOKEN_TYPES.FUNCTION_METHOD: {
      const typed = item as IGlobalIndexedToken<GlobalFunctionMethodToken>;

      // fix display name
      const split = typed.meta.display.split('::');
      typed.meta.display = `${TransformCase(
        split[0],
        CURRENT_CONFIG.style.structureNames
      )}::${TransformCase(split[1], CURRENT_CONFIG.style.routineMethods)}`;

      // update parameters
      await NormalizeArgs(typed.meta.args);
      await NormalizeKeywords(typed.meta.kws);
      break;
    }
    case GLOBAL_TOKEN_TYPES.PROCEDURE: {
      const typed = item as IGlobalIndexedToken<GlobalProcedureToken>;

      // fix display name
      typed.meta.display = TransformCase(
        typed.meta.display,
        CURRENT_CONFIG.style.routines
      );

      // update parameters
      await NormalizeArgs(typed.meta.args);
      await NormalizeKeywords(typed.meta.kws);
      break;
    }
    case GLOBAL_TOKEN_TYPES.PROCEDURE_METHOD: {
      const typed = item as IGlobalIndexedToken<GlobalProcedureMethodToken>;

      // fix display name
      const split = typed.meta.display.split('::');
      typed.meta.display = `${TransformCase(
        split[0],
        CURRENT_CONFIG.style.structureNames
      )}::${TransformCase(split[1], CURRENT_CONFIG.style.routineMethods)}`;

      // update parameters
      await NormalizeArgs(typed.meta.args);
      await NormalizeKeywords(typed.meta.kws);
      break;
    }
    case GLOBAL_TOKEN_TYPES.STRUCTURE: {
      const typed = item as IGlobalIndexedToken<GlobalStructureToken>;

      // fix display name if not task
      if (!TASK_REGEX.test(item.name)) {
        typed.meta.display = TransformCase(
          typed.meta.display,
          CURRENT_CONFIG.style.structureNames
        );
      }

      // update props
      await NormalizeProperties(typed.meta.props);
      break;
    }
    default:
      break;
  }
}
