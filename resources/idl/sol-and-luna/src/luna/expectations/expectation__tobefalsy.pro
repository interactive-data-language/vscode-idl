;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value is falsy, which is the
;   opposite of ```idl toBeTruthy```. A value is falsy if it is
;   missing (`!NULL`), an empty string, zero, a null pointer or
;   object, or an empty list, hash, orderedhash or dictionary.
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
;   (it.expects('')).toBeFalsy
;   (it.expects(0)).toBeFalsy
;   (it.expects(!NULL)).toBeFalsy
;   (it.expects(list())).toBeFalsy
;   ```
;
;-
pro expectation::toBeFalsy, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; process the expectation
  self._processExpectation, 'to be falsy', self._isTruthy(), $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
