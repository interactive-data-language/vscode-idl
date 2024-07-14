import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import {
  MIGRATION_TYPE_LOOKUP,
  MigrationType,
} from '@idl/assembling/migrators-types';
import { CancellationToken } from '@idl/cancellation-tokens';
import { IParsed } from '@idl/parsing/syntax-tree';

import { MigrateToDL30 } from './migrate-to-dl30';

/**
 * Code migration tool that updates code!
 */
export async function Migrator(
  migrationType: MigrationType,
  parsed: IParsed,
  formatting: IAssemblerOptions<FormatterType>,
  cancel: CancellationToken
) {
  switch (migrationType) {
    case MIGRATION_TYPE_LOOKUP.ENVI_DL_30:
      return await MigrateToDL30(parsed, formatting, cancel);
    default:
      throw new Error(`Unknown migration type of ${migrationType}`);
  }
}
