;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value is a valid IDL
;   task by using the ```idl IDLTask()``` function. The
;   expectations value should be set to the name of a
;   task.
;
; :Keywords:
;   _expect_failure: in, optional, Boolean
;     If the test fails for some reason, set this to
;     force passing because we expected failure. This
;     keyword is for internal use only.
;
; :Examples:
;
;   ```idl
;   (it.expects('addition'))._not_.toBeAValidIDLTask
;   ```
;
;-
pro expectation::toBeAValidIDLTask, $
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
  sol_validate, hash('val', 'string')

  ; try to create our task
  !null = IDLTask(val, error = error)

  ; process the expectation
  self._processExpectation, 'to be a valid IDL task', keyword_set(error), $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
