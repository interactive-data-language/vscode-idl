;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value is an array. A structure or
;   object reference is an array when it contains more than one element.
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
;   (it.expects([1, 2, 3])).toBeArray
;   (it.expects(42))._not_.toBeArray
;   ```
;
;-
pro expectation::toBeArray, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required to check dimensions!', level = -1
  endif

  ; process the expectation
  self._processExpectation, 'to be an array', ~self._isArray(), $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
