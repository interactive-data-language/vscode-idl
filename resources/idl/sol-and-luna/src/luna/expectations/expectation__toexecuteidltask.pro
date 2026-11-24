;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies an expectation value to run the IDLTask::Execute
;   method. The expectation value must be an IDL Task.
;
; :Keywords:
;   _expect_failure: in, optional, Boolean
;     If the test fails for some reason, set this to
;     force passing because we expected failure. This
;     keyword is for internal use only.
;
; :Examples:
;   ```idl
;   ; create an IDL task
;   task = IDLTask('addition_example')
;
;   ;make sure to specify task input
;   task.a = 37
;   task.b = 5
;
;   ;run the task
;   (it.expects(task)).toExecuteIDLTask
;   ```
;
;-
pro expectation::toExecuteIDLTask, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required to check for valid object!', level = -1
  endif

  ; get our value
  val = self.value[0]

  ; make sure we have the right type
  sol_validate, hash('val', '_idltask')

  ; try to create our task
  val.execute, error = error

  ; process the expectation
  self._processExpectation, 'to execute IDL task', keyword_set(error), $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
