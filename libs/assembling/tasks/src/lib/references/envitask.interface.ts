import {
  ENVITask,
  ENVITaskParameter,
  ENVITaskSchema33,
} from '@idl/data-types/tasks';

/**
 * ENVI Task reference for key order of root properties
 */
export const REFERENCE_ENVI_TASK: ENVITask<ENVITaskSchema33> = {
  schema: 'envitask_3.3',
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
 * ENVI Task reference for key order of root properties
 */
export const REFERENCE_ENVI_TASK_PARAMETER: ENVITaskParameter<ENVITaskSchema33> =
  {
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
    auto_extension: '',
    is_directory: false,
    is_temporary: false,
    uri_param: '',
  };
