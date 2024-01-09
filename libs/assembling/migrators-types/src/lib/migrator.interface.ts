/** ENVI DL 3.0 APi migration */
type ENVIDL30Migration = 'envi-dl-3.0';

/**
 * Known migrators
 */
export type MigrationType = ENVIDL30Migration;

/**
 * Strictly typed known migrations
 */
interface IKnownMigrationTypes {
  ENVI_DL_30: ENVIDL30Migration;
}

/**
 * Lookup of known migrators
 */
export const MIGRATION_TYPE_LOOKUP: IKnownMigrationTypes = {
  ENVI_DL_30: 'envi-dl-3.0',
};
