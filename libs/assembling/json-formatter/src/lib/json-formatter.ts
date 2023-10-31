import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';
import stringify from 'json-stringify-pretty-compact';

/**
 * Helper function that formats any JSON for us and can be used
 * anywhere
 */
export function JSONFormatter<T extends FormatterType>(
  toFormat: any,
  options: IAssemblerOptions<T>
): string {
  return stringify(toFormat, {
    indent: options.tabWidth,
  });
}
