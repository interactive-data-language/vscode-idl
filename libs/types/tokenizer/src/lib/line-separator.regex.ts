/**
 * Regex for splitting on all variations of line endings
 *
 * We have a special case for only \r because of old-school mac code that
 * one customer came across
 */
export const LINE_SEPARATOR = /\r?\n|\r/g;
