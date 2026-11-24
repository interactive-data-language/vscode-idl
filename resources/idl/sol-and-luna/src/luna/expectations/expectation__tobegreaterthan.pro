;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value is greater than a number.
;   If the value is an array, **every** element must be greater.
;   Negating the expectation means at least one element is not.
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
;
; :Examples:
;
;   ```idl
;   (it.expects(5)).toBeGreaterThan, 4
;   (it.expects([5, 6]))._not_.toBeGreaterThan, 5
;   ```
;
;-
pro expectation::toBeGreaterThan, compare, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  self._requireNumber, compare

  ; process the expectation
  self._processExpectation, 'to be greater than ' + strtrim(compare, 2), $
    total(self.value[0] gt compare) ne n_elements(self.value[0]), $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
