import { ValidateTaskFile } from './task.schema';

describe('Task file validation', () => {
  const envi = {
    schema: 'envitask_3.3',
    name: 'MyTask',
    base_class: 'ENVITaskFromProcedure',
    routine: 'my_task',
    parameters: [{ name: 'INPUT', type: 'ENVIRASTER', direction: 'input' }],
  };

  it('accepts valid ENVI tasks', () => {
    expect(ValidateTaskFile(envi).success).toBeTruthy();
  });

  it('accepts valid legacy ENVI tasks', () => {
    expect(
      ValidateTaskFile({
        version: '5.3',
        name: 'MyTask',
        baseClass: 'ENVITaskFromProcedure',
        description: 'Does things',
        parameters: [
          {
            name: 'INPUT',
            dataType: 'ENVIRASTER',
            direction: 'input',
            description: 'Input',
            parameterType: 'required',
          },
        ],
      }).success,
    ).toBeTruthy();
  });

  it('requires a routine for procedure tasks', () => {
    const { routine, ...noRoutine } = envi;
    expect(routine).toBeDefined();
    expect(ValidateTaskFile(noRoutine).success).toBeFalsy();
  });

  it('reports invalid parameters and schema values', () => {
    expect(
      ValidateTaskFile({ ...envi, parameters: [{ name: 'INPUT' }] }).success,
    ).toBeFalsy();
    expect(
      ValidateTaskFile({ ...envi, schema: 'unknown' }).success,
    ).toBeFalsy();
    expect(ValidateTaskFile([]).success).toBeFalsy();
  });
});
