import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import {
  MIGRATION_TYPE_LOOKUP,
  MigrationType,
} from '@idl/assembling/migrators-types';
import { CancellationToken } from '@idl/cancellation-tokens';
import { IParsed } from '@idl/types/syntax-tree';

import { MigrateToDL30 } from './migrate-to-dl30';
import { MigrateToDL40 } from './migrate-to-dl40';

/**
 * Code migration tool that updates code!
 */
export async function Migrator(
  migrationType: MigrationType,
  parsed: IParsed,
  formatting: IAssemblerOptions<FormatterType>,
  cancel: CancellationToken,
) {
  switch (migrationType) {
    case MIGRATION_TYPE_LOOKUP.ENVI_DL_30:
      return await MigrateToDL30(parsed, formatting, cancel);
    case MIGRATION_TYPE_LOOKUP.ENVI_DL_40:
      return await MigrateToDL40(parsed, formatting, cancel);
    default:
      throw new Error(`Unknown migration type of ${migrationType}`);
  }
}
