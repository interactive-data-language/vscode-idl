;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value is finite (not NaN and
;   not infinity). If the value is an array, **every** element
;   must be finite. Integers are always finite.
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
;   (it.expects(5.0)).toBeFinite
;   (it.expects(!values.f_infinity))._not_.toBeFinite
;   ```
;
;-
pro expectation::toBeFinite, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  if ~self.hasValue then begin
    message, 'Expectation value not set, required!', level = -1
  endif
  if ~isa(self.value[0], /number) then begin
    message, 'Expectation value is not a number!', level = -1
  endif

  ; process the expectation
  self._processExpectation, 'to be finite', $
    total(finite(self.value[0])) ne n_elements(self.value[0]), $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
