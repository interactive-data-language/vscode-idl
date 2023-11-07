import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { AdjustCase } from '@idl/assembling/shared';
import { ENVITask, ENVITaskSchemaVersion } from '@idl/data-types/tasks';

import {
  REFERENCE_ENVI_TASK,
  REFERENCE_ENVI_TASK_PARAMETER,
} from '../references/envitask.interface';
import { OrderObject } from './order-object';

/**
 * Formats legacy ENVI Tasks
 */
export function ENVITaskFormatter<T extends FormatterType>(
  task: ENVITask<ENVITaskSchemaVersion>,
  options: IAssemblerOptions<T>
): ENVITask<ENVITaskSchemaVersion> {
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

    // order parameter
    params[i] = OrderObject(param, REFERENCE_ENVI_TASK_PARAMETER);
  }

  // order and return
  return OrderObject(task, REFERENCE_ENVI_TASK);
}
