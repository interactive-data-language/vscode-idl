import type { ENVITask, ENVITaskSchemaVersion } from './envitask.interface';
import type {
  ENVITaskLegacy,
  ENVITaskLegacyVersion,
} from './envitasklegacy.interface';
import type { IDLTask, IDLTaskSchemaVersion } from './idltask.interface';

/**
 * Type for parsed task file
 */
export type ParsedTask =
  | ENVITask<ENVITaskSchemaVersion>
  | ENVITaskLegacy<ENVITaskLegacyVersion>
  | IDLTask<IDLTaskSchemaVersion>;
