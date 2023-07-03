import { GlobalProcedureToken } from '@idl/data-types/core';

import { Cleaners } from './cleaners.interface';

/**
 * Clean up procedures
 */
export const PROCEDURE_CLEANERS: Cleaners<GlobalProcedureToken> = {
  print: (token) => {
    delete token.meta.args['unit'];
    const args = Object.values(token.meta.args);
    for (let i = 0; i < args.length; i++) {
      args[i].direction = 'in';
    }
  },
  printf: (token) => {
    const args = Object.values(token.meta.args);
    for (let i = 0; i < args.length; i++) {
      args[i].direction = 'in';
    }
  },
  read: (token) => {
    delete token.meta.args['prompt'];
    delete token.meta.args['unit'];
  },
  readf: (token) => {
    delete token.meta.args['prompt'];
  },
};
