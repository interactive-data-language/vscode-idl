import { GenerateTaskResult } from '@idl/generators/tasks-shared';
import { basename } from 'path';

/**
 * Generates a main level program that can be embedded into our PRO code if we do not
 * have one already.
 *
 * This main level program is boilerplate and includes:
 *
 * 1. Compile opt
 * 2. Starts ENVI
 * 3. Loads task from disk
 * 4. Example code for running the task
 * 5. Example code for running the procedure (for debugging)
 */
export function GenerateENVITaskMainLevelProgram(
  result: GenerateTaskResult<true>
): string {
  /** In code, variable for task name */
  const taskVarName = 'myTask';

  /**
   * Text for properties
   */
  const propText: string[] = [];

  /** Task parameters */
  const params = result.task.parameters;

  // process each parameter
  for (let i = 0; i < params.length; i++) {
    if (params[i].direction === 'input') {
      propText.push(`${taskVarName}.${params[i].name} = !null`);
    }
  }

  /** Task parameters */
  const kws = Object.values(result.procedure.meta.kws);

  /** output keyword reset */
  const outputReset: string[] = [];

  /** Keyword text for calling routine */
  const keywords: string[] = [];

  // process each parameter
  for (let i = 0; i < kws.length; i++) {
    if (
      kws[i].direction !== 'in' ||
      kws[i].display.toLowerCase().endsWith('_uri')
    ) {
      outputReset.push(`${kws[i].display.toLowerCase()} = !null`);
      keywords.push(`  ${kws[i].display} = ${kws[i].display.toLowerCase()}`);
    } else {
      keywords.push(`  ${kws[i].display} = !null`);
    }
  }

  /**
   * Code for main level program (unformatted)
   */
  const code: string[] = [
    ``,
    `; Main level program`,
    `compile_opt idl2`,
    ``,
    `;+ Start ENVI (feel free to add "/headless" so the UI does not appear)`,
    `e = envi()`,
    ``,
    `;+`,
    `; This code always loads the latest task from disk for ENVI`,
    `; to be aware of`,
    `;`,
    `; If you make changes to your task, the next time you run this, `,
    `; ENVI will pick them up and is great for easy development`,
    `;+`,
    `${taskVarName} = ENVITask(routine_dir() + '${basename(result.taskFile)}')`,
    ``,
    `; TODO: set task parameters`,
    propText.join('\n'),
    ``,
    `; run our awesome task`,
    `${taskVarName}.execute`,
    ``,
    `;+`,
    `; If you have problems with your task, it can be easier to run`,
    `; as a procedure instead`,
    `;`,
    `; Remove the return statement just below to run our procedure instead of`,
    `; the task, but remember to comment out the task execution code above so`,
    `; things don't run twice!`,
    `;-`,
    `return`,
    ``,
    `; Set/reset the values of output keywords so we have a fresh run`,
    outputReset.join('\n'),
    ``,
    `;+`,
    `; Run our procedure`,
    `; `,
    `; TODO: Set keywords`,
    `;-`,
    `${result.procedure.meta.display}, $`,
    `${keywords.join(', $\n')}`,
    ``,
    `end`,
  ];

  // join and return
  return code.join('\n');
}
