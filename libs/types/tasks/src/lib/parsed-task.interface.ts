import { ENVITask, ENVITaskSchemaVersion } from './envitask.interface';
import {
  ENVITaskLegacy,
  ENVITaskLegacyVersion,
} from './envitasklegacy.interface';
import { IDLTask, IDLTaskSchemaVersion } from './idltask.interface';

/**
 * Type for parsed task file
 */
export type ParsedTask =
  | ENVITask<ENVITaskSchemaVersion>
  | IDLTask<IDLTaskSchemaVersion>
  | ENVITaskLegacy<ENVITaskLegacyVersion>;
