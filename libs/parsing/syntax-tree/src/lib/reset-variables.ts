import { IParsed } from './parsed.interface';
import { LocalToken } from './populators/populate-local.interface';

/** Resets array of tokens */
function _ResetVariables(vars: LocalToken[]) {
  for (let i = 0; i < vars.length; i++) {
    if (vars[i].meta.canReset) {
      vars[i].meta.isDefined = false;
    }
  }
}

/**
 * Resets variables that can be reset so we can update types when we
 * just post-process code and don't do a full parse.
 *
 * This is needed because some variables are dynamic and some are static (i.e.
 * arguments and keywords)
 */
export function ResetVariables(parsed: IParsed): void {
  /**
   * Reset functions
   */
  const funcs = Object.keys(parsed.local.func);
  for (let i = 0; i < funcs.length; i++) {
    _ResetVariables(Object.values(parsed.local.func[funcs[i]]));
  }

  /**
   * Reset functions
   */
  const pros = Object.keys(parsed.local.pro);
  for (let i = 0; i < pros.length; i++) {
    _ResetVariables(Object.values(parsed.local.pro[pros[i]]));
  }

  /**
   * Reset main
   */
  _ResetVariables(Object.values(parsed.local.main));
}
