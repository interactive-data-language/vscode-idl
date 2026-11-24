;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value (an object) has a method.
;   The method name is not case sensitive and may be a function
;   or a procedure method.
;
; :Arguments:
;   name: in, required, String
;     Specify the name of the method to look for.
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
;   (it.expects(list())).toHaveMethod, 'add'
;   (it.expects(list()))._not_.toHaveMethod, 'bogus'
;   ```
;
;-
pro expectation::toHaveMethod, name, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required!', level = -1
  endif

  ; validate inputs
  sol_validate, hash('name', ['required'])
  if ~isa(name, /string, /scalar) then begin
    message, 'Method name must be a scalar string!', level = -1
  endif
  value = self.value[0]
  if ~(size(value, /type) eq 11) then begin
    message, 'Expectation value must be an object!', level = -1
  endif
  if ~obj_valid(value) then begin
    message, 'Expectation value must be a valid object!', level = -1
  endif

  ; process the expectation
  self._processExpectation, 'to have method ' + name, ~obj_hasmethod(value, name), $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
