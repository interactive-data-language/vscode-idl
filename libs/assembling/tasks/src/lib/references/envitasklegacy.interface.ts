import {
  ENVITaskLegacy,
  ENVITaskLegacyParameter,
  ENVITaskLegacyVersion532,
} from '@idl/data-types/tasks';

/**
 * ENVI Task Legacy reference for key order of root properties
 */
export const REFERENCE_ENVI_TASK_LEGACY: ENVITaskLegacy<ENVITaskLegacyVersion532> =
  {
    version: '5.3.2',
    name: '',
    displayName: '',
    description: '',
    baseClass: '',
    routine: '',
    parameters: [],
  };

/**
 * ENVI Task Legacy reference for key order of root properties
 */
export const REFERENCE_ENVI_TASK_LEGACY_PARAMETER: ENVITaskLegacyParameter<ENVITaskLegacyVersion532> =
  {
    name: '',
    displayName: '',
    keyword: '',
    description: '',
    direction: 'input',
    parameterType: 'required',
    hidden: false,
    dataType: '',
    defaultValue: '',
    min: '',
    max: '',
    choiceList: [],
  };
