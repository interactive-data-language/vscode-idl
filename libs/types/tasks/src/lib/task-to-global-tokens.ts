import {
  DocsToMarkdown,
  IDL_DOCS_HEADERS,
  MARKDOWN_TYPE_LOOKUP,
} from '@idl/parsing/syntax-tree';

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
import { IGlobalsToTrack } from './task-to-global-token.interface';

/**
 * Converts a parsed task definition to global routines so that we have auto-complete, hover, help
 * and integration with IDL.
 */
export function TaskToGlobalToken(task: ParsedTask): IGlobalsToTrack {
  /** Results from loading task */
  let res: IGlobalsToTrack;

  // determine how to process
  switch (true) {
    case (task as ENVITaskLegacy<ENVITaskLegacyVersion>)?.version !== undefined:
      res = LegacyENVITaskToGlobal(
        task as ENVITaskLegacy<ENVITaskLegacyVersion>
      );
      break;
    case ((task as ENVITask<ENVITaskSchemaVersion>)?.schema || '')
      .toLowerCase()
      .startsWith('envi'):
      res = ENVITaskToGlobal(task as ENVITask<ENVITaskSchemaVersion>);
      break;
    case ((task as IDLTask<IDLTaskSchemaVersion>)?.schema || '')
      .toLowerCase()
      .startsWith('idl'):
      res = IDLTaskToGlobal(task as IDLTask<IDLTaskSchemaVersion>);
      break;
    default:
      break;
  }

  /**
   * Update function docs
   */
  // save description
  res.function.meta.docsLookup[IDL_DOCS_HEADERS.DEFAULT] =
    res.function.meta.docs;

  // build nice docs
  res.function.meta.docs = DocsToMarkdown(MARKDOWN_TYPE_LOOKUP.TASK, {
    name: res.function.name,
    meta: res.function.meta,
    taskProperties: res.structure,
  });
  delete res.function.meta.docsLookup[IDL_DOCS_HEADERS.DEFAULT];

  /**
   * Add structure metadata
   */
  res.structure.meta.docsLookup = {};
  res.structure.meta.docsLookup[IDL_DOCS_HEADERS.DEFAULT] =
    res.structure.meta.docs;

  /**
   * Create structure documentation
   */
  res.structure.meta.docs = DocsToMarkdown(MARKDOWN_TYPE_LOOKUP.STRUCTURE, {
    name: res.structure.name,
    meta: res.structure.meta,
  });
  delete res.structure.meta.docsLookup[IDL_DOCS_HEADERS.DEFAULT];

  return res;
}
