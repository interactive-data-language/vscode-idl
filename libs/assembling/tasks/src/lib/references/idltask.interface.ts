import {
  IDLTask,
  IDLTaskParameter,
  IDLTaskSchema12,
} from '@idl/data-types/tasks';

/**
 * IDL Task reference for key order of root properties
 */
export const REFERENCE_IDL_TASK: IDLTask<IDLTaskSchema12> = {
  schema: 'idltask_1.2',
  name: '',
  display_name: '',
  revision: '',
  description: '',
  base_class: '',
  routine: '',
  tags: [],
  parameters: [],
};

/**
 * IDL Task reference for key order of root properties
 */
export const REFERENCE_IDL_TASK_PARAMETER: IDLTaskParameter<IDLTaskSchema12> = {
  name: '',
  display_name: '',
  keyword: '',
  description: '',
  direction: 'input',
  required: true,
  hidden: false,
  type: '',
  dimensions: '',
  defaultValue: '',
  min: '',
  max: '',
  choiceList: '',
};
