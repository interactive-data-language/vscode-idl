;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the value of an expectation is null or
;   undefined using IDL's ```idl isa()``` function with the
;   `NULL` keyword set.
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
;   (it.expects(!NULL)).toBeNull
;   (it.expects(42))._not_.toBeNull
;   ```
;
;-
pro expectation::toBeNull, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; process the expectation
  self._processExpectation, $
    'to be null', $
    self.hasValue, $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
