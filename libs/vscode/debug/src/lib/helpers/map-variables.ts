import { IDLVariable } from '@idl/types/idl/idl-process';
import { Variable } from '@vscode/debugadapter';

/**
 * Maps variables from what IDL captures to what VSCode needs
 */
export function MapVariables(vars: IDLVariable[]): Variable[] {
  // initialize output
  const mapped: Variable[] = [];

  // process all variables
  for (let i = 0; i < vars.length; i++) {
    mapped.push({
      name: vars[i].name,
      // add description if we have it, otherwise just use the type
      value: vars[i].description
        ? `${vars[i].type}, ${vars[i].description}`
        : vars[i].type,
      variablesReference: 0,
    });
  }

  return mapped;
}
