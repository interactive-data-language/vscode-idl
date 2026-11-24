;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value is between a low and high
;   number. The range is inclusive unless `EXCLUSIVE` is set. If
;   the value is an array, **every** element must be in range.
;
; :Arguments:
;   low: in, required, Number
;     Specify the lower bound as a numeric scalar.
;   high: in, required, Number
;     Specify the upper bound as a numeric scalar. Must be
;     greater than or equal to `low`.
;
; :Keywords:
;   _expect_failure: in, optional, Boolean
;     If the test fails for some reason, set this to
;     force passing because we expected failure. This
;     keyword is for internal use only.
;   exclusive: in, optional, Boolean
;     If set, values equal to `low` or `high` are not in range.
;
; :Examples:
;
;   ```idl
;   (it.expects(50)).toBeBetween, 0, 100
;   (it.expects(100))._not_.toBeBetween, 0, 100, /EXCLUSIVE
;   ```
;
;-
pro expectation::toBeBetween, low, high, $
  exclusive = exclusive, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  self._requireNumber, low, 'Low value'
  self._requireNumber, high, 'High value'
  if (low gt high) then begin
    message, 'Low value must be less than or equal to the high value!', level = -1
  endif

  ; check our range
  if keyword_set(exclusive) then begin
    inRange = (self.value[0] gt low) and (self.value[0] lt high)
  endif else begin
    inRange = (self.value[0] ge low) and (self.value[0] le high)
  endelse

  ; process the expectation
  self._processExpectation, 'to be between ' + strtrim(low, 2) + ' and ' + strtrim(high, 2) + (keyword_set(exclusive) ? ' (exclusive)' : ''), $
    total(inRange) ne n_elements(self.value[0]), $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
