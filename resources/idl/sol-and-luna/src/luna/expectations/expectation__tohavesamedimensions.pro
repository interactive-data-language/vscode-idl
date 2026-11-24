;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value has the same dimensions as
;   another value. Object references are not supported.
;
; :Arguments:
;   compare: in, required, any
;     Specify the value to compare dimensions against.
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
;   (it.expects(findgen(3, 4))).toHaveSameDimensions, bytarr(3, 4)
;   (it.expects(findgen(3, 4)))._not_.toHaveSameDimensions, bytarr(4, 3)
;   ```
;
;-
pro expectation::toHaveSameDimensions, compare, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required to check dimensions!', level = -1
  endif

  ; validate input
  sol_validate, hash('compare', ['required'])

  ; compare dimensions
  pass = array_equal(long64(self._dimensions(self.value[0])), long64(self._dimensions(compare)))

  ; process the expectation
  self._processExpectation, 'to have the same dimensions', ~pass, $
    expected = 'dimensions [' + strjoin(strtrim(self._dimensions(compare), 2), ', ') + ']', $
    received = 'dimensions [' + strjoin(strtrim(self._dimensions(self.value[0]), 2), ', ') + ']', $
    _expect_failure = _expect_failure
end
