import { IDLVariable } from '@idl/idl';
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
      value: `${vars[i].type}, ${vars[i].description}`,
      variablesReference: 0,
    });
  }

  return mapped;
}
