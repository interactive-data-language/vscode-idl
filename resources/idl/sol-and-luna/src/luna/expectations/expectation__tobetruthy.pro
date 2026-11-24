;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value is truthy. Unlike
;   ```idl toBeTrue``` this does not require a scalar and
;   does not raise an error when no value is set. A value
;   is truthy if it is:
;
;   - a non-empty string
;   - a non-zero number
;   - a valid pointer or object reference (lists, hashes,
;     orderedhashes and dictionaries must also have at least
;     one element)
;   - a structure
;   - an array
;
;   Anything else, including a missing value (`!NULL`), is falsy.
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
;   (it.expects('text')).toBeTruthy
;   (it.expects(2)).toBeTruthy
;   (it.expects(list(1))).toBeTruthy
;   (it.expects(''))._not_.toBeTruthy
;   ```
;
;-
pro expectation::toBeTruthy, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; process the expectation
  self._processExpectation, 'to be truthy', ~self._isTruthy(), $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
