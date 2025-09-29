import { ParseIDLType } from '@idl/types/idl-data-types';

import { OverrideParamOrProp } from './shared.interface';

export const HTTP_REQUEST_ARGS: { [key: string]: OverrideParamOrProp } = {
  url: {
    display: 'URL',
    type: IDLTypeHelper.parseIDLType('String'),
    direction: 'in',
  },
};

export const HTTP_REQUEST_BASE_KEYWORDS: {
  [key: string]: OverrideParamOrProp;
} = {
  callback_function: {
    display: 'callback_function',
    direction: 'in',
    type: IDLTypeHelper.parseIDLType('String'),
  },
  callback_data: {
    display: 'callback_data',
    direction: 'in',
    type: IDLTypeHelper.parseIDLType('any'),
  },
  headers: {
    display: 'headers',
    direction: 'in',
    type: IDLTypeHelper.parseIDLType('Hash | Dictionary | Structure'),
  },
  options: {
    display: 'options',
    direction: 'in',
    type: IDLTypeHelper.parseIDLType('Hash | Dictionary | Structure'),
  },
};

export const HTTP_REQUEST_KEYWORDS: { [key: string]: OverrideParamOrProp } = {
  ...HTTP_REQUEST_BASE_KEYWORDS,
  escape: {
    display: 'escape',
    direction: 'in',
    type: IDLTypeHelper.parseIDLType('Bool'),
  },
  params: {
    display: 'params',
    direction: 'in',
    type: IDLTypeHelper.parseIDLType('any'),
  },
};
