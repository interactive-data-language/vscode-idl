import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { AdjustCase } from '@idl/assembling/shared';
import { ENVITaskLegacy, ENVITaskLegacyVersion } from '@idl/data-types/tasks';

import {
  REFERENCE_ENVI_TASK_LEGACY,
  REFERENCE_ENVI_TASK_LEGACY_PARAMETER,
} from '../references/envitasklegacy.interface';
import { OrderObject } from './order-object';

/**
 * Formats legacy ENVI Tasks
 */
export function ENVITaskLegacyFormatter<T extends FormatterType>(
  task: ENVITaskLegacy<ENVITaskLegacyVersion>,
  options: IAssemblerOptions<T>
): ENVITaskLegacy<ENVITaskLegacyVersion> {
  // get parameters
  const params = task.parameters;

  // process
  for (let i = 0; i < params.length; i++) {
    const param = params[i];

    // check if we have a keyword
    if (param.keyword !== undefined) {
      param.keyword = AdjustCase(
        param.keyword.replace(/\s/g, ''),
        options.style.keywords
      );
    }

    // check for name
    if (param.name !== undefined) {
      param.name = AdjustCase(
        param.name.replace(/\s/g, ''),
        options.style.keywords
      );
    }

    if (param.direction !== undefined) {
      param.direction = AdjustCase(
        param.direction.replace(/\s/g, ''),
        options.style.control
      );
    }

    if (param.parameterType !== undefined) {
      param.parameterType = AdjustCase(
        param.parameterType.replace(/\s/g, ''),
        options.style.control
      ) as any;
    }

    // order parameter
    params[i] = OrderObject(param, REFERENCE_ENVI_TASK_LEGACY_PARAMETER);
  }

  // order and return
  return OrderObject(task, REFERENCE_ENVI_TASK_LEGACY);
}
