import { FormatterType, IAssemblerInputOptions } from '@idl/assembling/config';
import { TaskFormatter } from '@idl/assembling/tasks';
import { ParsedTask } from '@idl/data-types/tasks';
import { MergeConfig } from '@idl/schemas/idl.json';

/**
 * Assembles a parsed task file back into string on disk using
 * the formatting options specified in you r"idl.json" files
 */
export function TaskAssembler<T extends FormatterType>(
  task: ParsedTask,
  options?: Partial<IAssemblerInputOptions<T>>
): string | undefined {
  /** Default-merged configuration to use */
  const useOptions = MergeConfig<T>(options);

  return TaskFormatter(task, useOptions);
}
