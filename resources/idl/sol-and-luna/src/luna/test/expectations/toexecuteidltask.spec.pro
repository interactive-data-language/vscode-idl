;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toExecuteIDLTask')

    it = suite.test('fails until the task inputs are set')
      task = IDLTask('addition_example')
      (it.expects(task)).toExecuteIDLTask, /_expect_failure
      (it.expects(task)).toRunProcedureMethod, 'execute', /_expect_failure

    it = suite.test('passes when the task can run')
      task = IDLTask('addition_example')
      task.a = 37
      task.b = 5
      (it.expects(task)).toExecuteIDLTask
      (it.expects(task)).toRunProcedureMethod, 'execute'

l.generateTestSummary
end
