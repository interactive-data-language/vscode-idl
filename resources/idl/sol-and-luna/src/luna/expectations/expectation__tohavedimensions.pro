;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value has exact dimensions (as
;   returned by ```idl size(/dimensions)```). Object references are
;   not supported and a scalar has the dimensions 0.
;
; :Arguments:
;   dims: in, required, Int | Array<Int>
;     Specify the expected dimensions.
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
;   (it.expects(bytarr(512, 512, 3))).toHaveDimensions, [512, 512, 3]
;   (it.expects(findgen(5)))._not_.toHaveDimensions, [6]
;   ```
;
;-
pro expectation::toHaveDimensions, dims, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required to check dimensions!', level = -1
  endif

  ; validate input
  sol_validate, hash('dims', ['required'])
  if ~isa(dims, /integer) or isa(dims, /boolean) then begin
    message, 'Dimensions must be an integer or array of integers!', level = -1
  endif

  ; compare dimensions
  actual = self._dimensions(self.value[0])
  pass = array_equal(long64(actual), long64(dims))

  ; process the expectation
  self._processExpectation, 'to have dimensions [' + strjoin(strtrim(dims, 2), ', ') + ']', ~pass, $
    received = '[' + strjoin(strtrim(actual, 2), ', ') + ']', $
    _expect_failure = _expect_failure
end
