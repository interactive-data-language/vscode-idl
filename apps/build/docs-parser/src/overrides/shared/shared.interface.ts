import { IParameterOrPropertyDetails } from '@idl/types/idl-data-types';

export interface ISharedArgsOrKeywords {
  [key: string]: Partial<IParameterOrPropertyDetails>;
}

export type OverrideParamOrProp = Partial<IParameterOrPropertyDetails>;
