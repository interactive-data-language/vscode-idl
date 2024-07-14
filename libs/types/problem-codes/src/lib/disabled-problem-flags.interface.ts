/** Disable all problems in file */
type IDLDisableAllProblemsFlag = 'idl-disable';

/** Disable problems on this line */
type IDLDisableLineProblemsFlag = 'idl-disable-line';

/** Disable next line of problems */
type IDLDisableNextLineProblemsFlag = 'idl-disable-next-line';

/**
 * Disabled problem flags
 */
export type IDLDisabledProblemFlags =
  | IDLDisableAllProblemsFlag
  | IDLDisableLineProblemsFlag
  | IDLDisableNextLineProblemsFlag;

// strictly types lookup of our allowed problem flags
interface IDisabledProblemFlags {
  /** Disable all problems in file */
  ALL: IDLDisableAllProblemsFlag;
  /** Disable problems on this line */
  LINE: IDLDisableLineProblemsFlag;
  /** Disable next line of problems */
  NEXT: IDLDisableNextLineProblemsFlag;
}

/**
 * Known problem flags that come from our regex
 */
export const DISABLED_PROBLEM_FLAGS: IDisabledProblemFlags = {
  ALL: 'idl-disable',
  LINE: 'idl-disable-line',
  NEXT: 'idl-disable-next-line',
};
