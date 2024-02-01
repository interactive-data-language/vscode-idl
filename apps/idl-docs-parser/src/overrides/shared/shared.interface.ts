import { IParameterOrPropertyDetails } from '@idl/types/core';

export interface ISharedArgsOrKeywords {
  [key: string]: Partial<IParameterOrPropertyDetails>;
}

export type OverrideParamOrProp = Partial<IParameterOrPropertyDetails>;
