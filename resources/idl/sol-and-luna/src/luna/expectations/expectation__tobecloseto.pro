;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value is close to a number,
;   which is useful for floating point math. If the value is an
;   array, **every** element must be close.
;
;   By default the absolute difference must be less than or equal
;   to the tolerance. With `RELATIVE`, the difference must be less
;   than or equal to the tolerance times the absolute compare value
;   (the absolute tolerance is used when the compare value is zero).
;
; :Arguments:
;   compare: in, required, Number
;     Specify a numeric scalar to compare against.
;
; :Keywords:
;   _expect_failure: in, optional, Boolean
;     If the test fails for some reason, set this to
;     force passing because we expected failure. This
;     keyword is for internal use only.
;   relative: in, optional, Boolean
;     If set, tolerance is relative to the compare value.
;   tolerance: in, optional, Number
;     Specify a non-negative numeric scalar for the allowed difference.
;
; :Examples:
;
;   ```idl
;   (it.expects(0.1 + 0.2)).toBeCloseTo, 0.3
;   (it.expects(mean(data))).toBeCloseTo, 10.0, TOLERANCE = 0.5
;   (it.expects(1001.0)).toBeCloseTo, 1000.0, TOLERANCE = 0.01, /RELATIVE
;   ```
;
;-
pro expectation::toBeCloseTo, compare, $
  tolerance = tolerance, $
  relative = relative, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  self._requireNumber, compare
  tol = (n_elements(tolerance) gt 0) ? tolerance : 1d-6
  self._requireNumber, tol, 'TOLERANCE'
  if (tol lt 0) then begin
    message, 'TOLERANCE must not be negative!', level = -1
  endif

  ; get the allowed difference
  allowed = tol
  if keyword_set(relative) and (compare ne 0) then allowed = tol * abs(compare)

  ; process the expectation
  self._processExpectation, 'to be close to ' + strtrim(compare, 2) + ' (' + (keyword_set(relative) ? 'relative ' : '') + 'tolerance ' + strtrim(tol, 2) + ')', $
    total(abs(double(self.value[0]) - compare) le allowed) ne n_elements(self.value[0]), $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
