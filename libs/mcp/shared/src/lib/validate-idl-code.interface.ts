import { TOKEN_NAMES, TokenName } from '@idl/tokenizer';

/**
 * Tokens that we dont allow when we validate code
 */
export const DISALLOWED_TOKENS: Partial<Record<TokenName, string>> = {};
DISALLOWED_TOKENS[TOKEN_NAMES.LINE_SEPARATION] =
  'Only a single IDL command can be executed at a time. Ampersand detection which is a multi-line statement';
DISALLOWED_TOKENS[TOKEN_NAMES.LINE_SEPARATION_BASIC] =
  DISALLOWED_TOKENS[TOKEN_NAMES.LINE_SEPARATION];

/**
 * Lower-case names for procedures we can't run for security reasons
 */
export const DISALLOWED_PROCEDURES: { [key: string]: undefined } = {};

// File I/O operations
DISALLOWED_PROCEDURES['openr'] = undefined;
DISALLOWED_PROCEDURES['openw'] = undefined;
DISALLOWED_PROCEDURES['openu'] = undefined;
DISALLOWED_PROCEDURES['close'] = undefined;
DISALLOWED_PROCEDURES['file_delete'] = undefined;
DISALLOWED_PROCEDURES['file_move'] = undefined;
DISALLOWED_PROCEDURES['file_copy'] = undefined;
DISALLOWED_PROCEDURES['file_mkdir'] = undefined;
DISALLOWED_PROCEDURES['file_chmod'] = undefined;
DISALLOWED_PROCEDURES['file_link'] = undefined;
DISALLOWED_PROCEDURES['file_tar'] = undefined;
DISALLOWED_PROCEDURES['file_zip'] = undefined;
DISALLOWED_PROCEDURES['file_gzip'] = undefined;
DISALLOWED_PROCEDURES['file_unzip'] = undefined;
DISALLOWED_PROCEDURES['file_untar'] = undefined;
DISALLOWED_PROCEDURES['file_gunzip'] = undefined;
DISALLOWED_PROCEDURES['printf'] = undefined;
DISALLOWED_PROCEDURES['writeu'] = undefined;
DISALLOWED_PROCEDURES['readu'] = undefined;
DISALLOWED_PROCEDURES['readf'] = undefined;
DISALLOWED_PROCEDURES['save'] = undefined;
DISALLOWED_PROCEDURES['restore'] = undefined;

// Process spawning and system operations
DISALLOWED_PROCEDURES['spawn'] = undefined;
DISALLOWED_PROCEDURES['cd'] = undefined;
DISALLOWED_PROCEDURES['pushd'] = undefined;
DISALLOWED_PROCEDURES['popd'] = undefined;

// Dynamic execution and code loading
DISALLOWED_PROCEDURES['call_procedure'] = undefined;
DISALLOWED_PROCEDURES['linkimage'] = undefined;
DISALLOWED_PROCEDURES['resolve_routine'] = undefined;
DISALLOWED_PROCEDURES['resolve_all'] = undefined;
DISALLOWED_PROCEDURES['dlm_load'] = undefined;

// Environment manipulation
DISALLOWED_PROCEDURES['setenv'] = undefined;

// Session and device operations
DISALLOWED_PROCEDURES['journal'] = undefined;
DISALLOWED_PROCEDURES['socket'] = undefined;
DISALLOWED_PROCEDURES['set_plot'] = undefined;
DISALLOWED_PROCEDURES['device'] = undefined;
DISALLOWED_PROCEDURES['online_help'] = undefined;

/**
 * Lower-case names of functions that we can't run for security reasons
 */
export const DISALLOWED_FUNCTIONS: { [key: string]: undefined } = {};
DISALLOWED_FUNCTIONS['obj_new'] = undefined;

// Dynamic execution and external code
DISALLOWED_FUNCTIONS['execute'] = undefined;
DISALLOWED_FUNCTIONS['call_function'] = undefined;
DISALLOWED_FUNCTIONS['call_method'] = undefined;
DISALLOWED_FUNCTIONS['call_external'] = undefined;

// Environment access
DISALLOWED_FUNCTIONS['getenv'] = undefined;
