import { ParseIDLType } from '@idl/types/core';

import { OverrideParamOrProp } from './shared.interface';

export const HTTP_REQUEST_ARGS: { [key: string]: OverrideParamOrProp } = {
  url: {
    display: 'URL',
    type: ParseIDLType('String'),
    direction: 'in',
  },
};

export const HTTP_REQUEST_BASE_KEYWORDS: {
  [key: string]: OverrideParamOrProp;
} = {
  callback_function: {
    display: 'callback_function',
    direction: 'in',
    type: ParseIDLType('String'),
  },
  callback_data: {
    display: 'callback_data',
    direction: 'in',
    type: ParseIDLType('any'),
  },
  headers: {
    display: 'headers',
    direction: 'in',
    type: ParseIDLType('Hash | Dictionary | Structure'),
  },
  options: {
    display: 'options',
    direction: 'in',
    type: ParseIDLType('Hash | Dictionary | Structure'),
  },
};

export const HTTP_REQUEST_KEYWORDS: { [key: string]: OverrideParamOrProp } = {
  ...HTTP_REQUEST_BASE_KEYWORDS,
  escape: {
    display: 'escape',
    direction: 'in',
    type: ParseIDLType('Bool'),
  },
  params: {
    display: 'params',
    direction: 'in',
    type: ParseIDLType('any'),
  },
};
