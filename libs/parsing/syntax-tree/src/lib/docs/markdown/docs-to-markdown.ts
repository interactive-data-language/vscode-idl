import { IDocs } from '@idl/types/syntax-tree';

import { GeneralToMarkdown } from './converters/general-to-markdown';
import { RoutinesToMarkdown } from './converters/routines-to-markdown';
import { StructureToMarkdown } from './converters/structure-to-markdown';
import { TaskToMarkdown } from './converters/task-to-markdown';
import { VariablesToMarkdown } from './converters/variables-to-markdown';
import {
  MARKDOWN_TYPE_LOOKUP,
  MarkdownInfo,
  MarkdownType,
  RoutineMarkdown,
  StructureMarkdown,
  TaskMarkdown,
} from './docs-to-markdown.interface';

/**
 * Converts documentation to markdown and adjusts formatting/logic
 * based on the type of feature we are converting to markdown
 */
export function DocsToMarkdown<T extends MarkdownType>(
  type: T,
  info: MarkdownInfo<T>
): string {
  // find the right converter
  switch (type) {
    case MARKDOWN_TYPE_LOOKUP.GENERAL:
      return GeneralToMarkdown(info as { [key: string]: string });
    case MARKDOWN_TYPE_LOOKUP.ROUTINE:
      return RoutinesToMarkdown(info as MarkdownInfo<RoutineMarkdown>);
    case MARKDOWN_TYPE_LOOKUP.STRUCTURE:
      return StructureToMarkdown(info as MarkdownInfo<StructureMarkdown>);
    case MARKDOWN_TYPE_LOOKUP.TASK:
      return TaskToMarkdown(info as MarkdownInfo<TaskMarkdown>);
    case MARKDOWN_TYPE_LOOKUP.VARIABLE:
      return VariablesToMarkdown(info as IDocs);
    default:
      throw new Error(
        `Unhandled docs conversion to markdown of type "${type}"`
      );
  }
}
