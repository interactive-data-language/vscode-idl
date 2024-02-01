import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import { JSONFormatter } from '@idl/assembling/json-formatter';
import {
  ENVITask,
  ENVITaskLegacy,
  ENVITaskLegacyVersion,
  ENVITaskSchemaVersion,
  IDLTask,
  IDLTaskSchemaVersion,
  ParsedTask,
} from '@idl/types/tasks';
import copy from 'fast-copy';

import { ENVITaskFormatter } from './formatters/envitask-formatter';
import { ENVITaskLegacyFormatter } from './formatters/envitask-legacy-formatter';
import { IDLTaskFormatter } from './formatters/idltask-formatter';
import { TrimProperties } from './formatters/trim-properties';

/**
 * Formats a task and handles the logic of managing formatting for different task types
 */
export function TaskFormatter<T extends FormatterType>(
  task: ParsedTask,
  options: IAssemblerOptions<T>
): string | undefined {
  /** Copy our task so we can freely manipulate it */
  let useTask = copy(task);

  // determine how to procees
  switch (true) {
    case (task as ENVITaskLegacy<ENVITaskLegacyVersion>)?.version !== undefined:
      useTask = ENVITaskLegacyFormatter(
        useTask as ENVITaskLegacy<ENVITaskLegacyVersion>,
        options
      );
      break;
    case (task as ENVITask<ENVITaskSchemaVersion>)?.schema
      .toLowerCase()
      .startsWith('envi'):
      useTask = ENVITaskFormatter(
        useTask as ENVITask<ENVITaskSchemaVersion>,
        options
      );
      break;
    case (task as IDLTask<IDLTaskSchemaVersion>)?.schema
      .toLowerCase()
      .startsWith('idl'):
      useTask = IDLTaskFormatter(
        useTask as IDLTask<IDLTaskSchemaVersion>,
        options
      );
      break;
    default:
      break;
  }

  // remove excess white space from all strings
  TrimProperties(useTask);

  // format and return
  return JSONFormatter(useTask, options);
}
