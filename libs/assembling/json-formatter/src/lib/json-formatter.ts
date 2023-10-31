import { FormatterType, IAssemblerOptions } from '@idl/assembling/config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const stringify = require('json-stringify-pretty-compact');

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
