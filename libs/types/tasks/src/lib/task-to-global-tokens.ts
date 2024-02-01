import { GlobalTokens } from '@idl/types/core';

import { ENVITaskToGlobal } from './converters/envi-task-to-global';
import { IDLTaskToGlobal } from './converters/idl-task-to-global';
import { LegacyENVITaskToGlobal } from './converters/legacy-envi-task-to-global';
import { ENVITask, ENVITaskSchemaVersion } from './envitask.interface';
import {
  ENVITaskLegacy,
  ENVITaskLegacyVersion,
} from './envitasklegacy.interface';
import { IDLTask, IDLTaskSchemaVersion } from './idltask.interface';
import { ParsedTask } from './parsed-task.interface';

/**
 * Converts a parsed task definition to global routines so that we have auto-complete, hover, help
 * and integration with IDL.
 */
export function TaskToGlobalToken(task: ParsedTask): GlobalTokens {
  /**
   * Global tokens that we need to create for our task file
   */
  const global: GlobalTokens = [];

  // determine how to procees
  switch (true) {
    case (task as ENVITaskLegacy<ENVITaskLegacyVersion>)?.version !== undefined:
      LegacyENVITaskToGlobal(
        global,
        task as ENVITaskLegacy<ENVITaskLegacyVersion>
      );
      break;
    case ((task as ENVITask<ENVITaskSchemaVersion>)?.schema || '')
      .toLowerCase()
      .startsWith('envi'):
      ENVITaskToGlobal(global, task as ENVITask<ENVITaskSchemaVersion>);
      break;
    case ((task as IDLTask<IDLTaskSchemaVersion>)?.schema || '')
      .toLowerCase()
      .startsWith('idl'):
      IDLTaskToGlobal(global, task as IDLTask<IDLTaskSchemaVersion>);
      break;
    default:
      break;
  }

  return global;
}
