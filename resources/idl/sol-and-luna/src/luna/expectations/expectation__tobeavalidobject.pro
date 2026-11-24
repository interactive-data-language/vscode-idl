;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value is an object
;   by using the ```idl obj_valid()``` function.
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
;   p = plot(/BUFFER, /TEST)
;   (it.expects(p)).toBeAValidObject
;   ```
;
;-
pro expectation::toBeAValidObject, $
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

  ; make sure we have the right typecode
  if (size(val, /type) ne 11) then begin
    message, 'Expectation value set, but is not an object reference!', level = -1
  endif

  ; process the expectation
  self._processExpectation, 'to be a valid object', ~obj_valid(val), $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
