/**
 * Get keyboard request initialized by IDL's get_kbrd() function
 */
export type GetKeyboardRequest = 'getKeyboard';

type SingleChar = 0;
type SingleCharOrANSI = 1;
type SingleASCIIOrFunctionKey = 2;

type GetKeyboardType = SingleChar | SingleCharOrANSI | SingleASCIIOrFunctionKey;

/**
 * Get keyboard parameters
 */
export type GetKeyboardParams = {
  wait: boolean;
  type: GetKeyboardType;
};

/**
 * Get keyboard response
 */
export type GetKeyboardResponse = string;
