;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value is a scalar (a single
;   value). Null is not a scalar. A structure or object reference is
;   a scalar when it contains exactly one element.
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
;   (it.expects(42)).toBeScalar
;   (it.expects('text')).toBeScalar
;   (it.expects([1, 2]))._not_.toBeScalar
;   ```
;
;-
pro expectation::toBeScalar, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required to check dimensions!', level = -1
  endif

  ; process the expectation
  self._processExpectation, 'to be a scalar', ~self._isScalar(), $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
