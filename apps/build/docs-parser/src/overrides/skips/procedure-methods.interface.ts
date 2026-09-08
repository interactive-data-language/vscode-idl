/**
 * Procedure methods that we should skip, used primarily for inheritance
 * edge cases where we need to ignore what comes in the docs
 */
export const PROCEDURE_METHOD_SKIPS: { [key: string]: any } = {};

PROCEDURE_METHOD_SKIPS['dictionary::remove'] = true;

PROCEDURE_METHOD_SKIPS['orderedhash::remove'] = true;
