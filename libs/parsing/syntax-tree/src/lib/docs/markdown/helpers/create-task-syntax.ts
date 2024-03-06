import { GlobalStructureToken, IGlobalIndexedToken } from '@idl/types/core';

import { TaskFunctionName } from '../../../helpers/task-function-name';

/**
 * Gets syntax signature for a task
 */
export function CreateTaskSyntax(
  struct: IGlobalIndexedToken<GlobalStructureToken>,
  varName = 'myTask'
): string {
  // initialize the call for syntax
  const syntax: string[] = [];
  syntax.push('; create the task');
  syntax.push(`${varName} = ${TaskFunctionName(struct.meta.display, "'")}`);
  syntax.push('');

  /** Get properties */
  const props = Object.values(struct.meta.props);
  const input = props.filter((prop) => prop.direction === 'in');
  const output = props.filter((prop) => prop.direction === 'out');

  // add input properties
  if (input.length > 0) {
    syntax.push('; set input parameters');
    for (let i = 0; i < input.length; i++) {
      syntax.push(`${varName}.${input[i].display} = value`);
    }
    syntax.push('');
  }

  syntax.push('; run the task');
  syntax.push(`${varName}.execute`);

  // add input properties
  if (input.length > 0) {
    syntax.push('');
    syntax.push('; get output parameters');
    for (let i = 0; i < output.length; i++) {
      syntax.push(`${output[i].display} = ${varName}.${output[i].display}`);
    }
    syntax.push('');
  }

  return syntax.join('\n');
}
