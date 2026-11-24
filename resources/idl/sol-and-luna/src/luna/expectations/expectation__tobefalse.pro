;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value is falsy by using an
;   if statement like this:
;
;       if ~(expectationValue) then begin
;         ;passed
;       endif
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
;   (it.expects(!FALSE)).toBeFalse
;   (it.expects(!TRUE))._not_.toBeFalse
;   ```
;
;-
pro expectation::toBeFalse, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required!', level = -1
  endif

  ; make sure we are not an array
  if ~isa(self.value[0], /scalar) then begin
    message, 'Expectation value is not a scalar, requried!', level = -1
  endif

  ; check if we are true or not
  if (self.value[0]) then begin
    self._processExpectation, 'to be false ', 1, $
      received = self._describeValue(), $
      _expect_failure = _expect_failure
  endif else begin
    self._processExpectation, 'to be false ', 0, $
      received = self._describeValue(), $
      _expect_failure = _expect_failure
  endelse
end
