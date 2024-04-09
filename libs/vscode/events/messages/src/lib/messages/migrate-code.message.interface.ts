import { MigrationType } from '@idl/assembling/migrators-types';

/** Message to migrate ENVI DL API to 3.0 */
export type MigrateCodeLSPMessage = 'migrate-code';

/*
 * Payload to migrate to latest DL 3.0 API
 */
export interface MigrateCodeLSPPayload {
  /** File to migrate */
  uri: string;
  /** The type of migration */
  migrationType: MigrationType;
}

/*
 * Response when updating to DL 3.0
 */
export interface MigrateCodeLSPResponse {
  /** New file contents */
  text: string;
}
