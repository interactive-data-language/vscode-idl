import { GlobalRoutineTokenType, IGlobalIndexedToken } from '@idl/types/core';

/**
 * Type for callbacks that clean specific types of tokens, depending on what we found
 */
export type Cleaners<T extends GlobalRoutineTokenType> = {
  [key: string]: (token: IGlobalIndexedToken<T>) => void;
};
