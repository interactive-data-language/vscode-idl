;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value is less than a number.
;   If the value is an array, **every** element must be less.
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
;   (it.expects(3)).toBeLessThan, 4
;   (it.expects([3, 4]))._not_.toBeLessThan, 4
;   ```
;
;-
pro expectation::toBeLessThan, compare, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  self._requireNumber, compare

  ; process the expectation
  self._processExpectation, 'to be less than ' + strtrim(compare, 2), $
    total(self.value[0] lt compare) ne n_elements(self.value[0]), $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
