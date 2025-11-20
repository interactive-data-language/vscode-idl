/** ENVI DL 3.0 APi migration */
type ENVIDL30Migration = 'envi-dl-3.0';

/** ENVI DL 4.0 APi migration */
type ENVIDL40Migration = 'envi-dl-4.0';

/**
 * Known migrators
 */
export type MigrationType = ENVIDL30Migration | ENVIDL40Migration;

/**
 * Strictly typed known migrations
 */
interface IKnownMigrationTypes {
  ENVI_DL_30: ENVIDL30Migration;
  ENVI_DL_40: ENVIDL40Migration;
}

/**
 * Lookup of known migrators
 */
export const MIGRATION_TYPE_LOOKUP: IKnownMigrationTypes = {
  ENVI_DL_30: 'envi-dl-3.0',
  ENVI_DL_40: 'envi-dl-4.0',
};
