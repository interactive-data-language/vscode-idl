/**
 * Function methods that we should skip, used primarily for inheritance
 * edge cases where we need to ignore what comes in the docs
 */
export const FUNCTION_METHOD_SKIPS: { [key: string]: any } = {};

FUNCTION_METHOD_SKIPS['dictionary::count'] = true;
FUNCTION_METHOD_SKIPS['dictionary::filter'] = true;
FUNCTION_METHOD_SKIPS['dictionary::haskey'] = true;
FUNCTION_METHOD_SKIPS['dictionary::isempty'] = true;
FUNCTION_METHOD_SKIPS['dictionary::isfoldcase'] = true;
FUNCTION_METHOD_SKIPS['dictionary::keys'] = true;
FUNCTION_METHOD_SKIPS['dictionary::map'] = true;
FUNCTION_METHOD_SKIPS['dictionary::reduce'] = true;
FUNCTION_METHOD_SKIPS['dictionary::remove'] = true;
FUNCTION_METHOD_SKIPS['dictionary::tostruct'] = true;
FUNCTION_METHOD_SKIPS['dictionary::values'] = true;
FUNCTION_METHOD_SKIPS['dictionary::where'] = true;

FUNCTION_METHOD_SKIPS['orderedhash::count'] = true;
FUNCTION_METHOD_SKIPS['orderedhash::filter'] = true;
FUNCTION_METHOD_SKIPS['orderedhash::haskey'] = true;
FUNCTION_METHOD_SKIPS['orderedhash::isempty'] = true;
FUNCTION_METHOD_SKIPS['orderedhash::isfoldcase'] = true;
FUNCTION_METHOD_SKIPS['orderedhash::keys'] = true;
FUNCTION_METHOD_SKIPS['orderedhash::map'] = true;
FUNCTION_METHOD_SKIPS['orderedhash::reduce'] = true;
FUNCTION_METHOD_SKIPS['orderedhash::remove'] = true;
FUNCTION_METHOD_SKIPS['orderedhash::tostruct'] = true;
FUNCTION_METHOD_SKIPS['orderedhash::values'] = true;
FUNCTION_METHOD_SKIPS['orderedhash::where'] = true;
