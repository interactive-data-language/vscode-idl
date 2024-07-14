/**
 * Gets insertion text for function calls with special cases
 * for ENVI tasks
 */
export function TaskFunctionName(name: string, quote: string): string {
  /** Lower case for comparison */
  const lc = name.toLowerCase();

  /**
   * Check if ENVI or IDL task
   */
  if (lc.startsWith('envi')) {
    return `ENVITask(${quote}${name.substring(4, name.length - 4)}${quote})`;
  } else {
    return `IDLTask(${quote}${name.substring(3, name.length - 4)}${quote})`;
  }
}

/**
 * Gets insertion text for function calls with special cases
 * for ENVI tasks
 */
export function TaskNameOnly(name: string): string {
  /** Lower case for comparison */
  const lc = name.toLowerCase();

  /**
   * Check if ENVI or IDL task
   */
  if (lc.startsWith('envi')) {
    return name.substring(4, name.length - 4);
  } else {
    return name.substring(4, name.length - 4);
  }
}
