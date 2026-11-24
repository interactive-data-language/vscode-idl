;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value (a path, or array of paths)
;   is an existing regular file.
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
;   (it.expects(outputFile)).toBeFile
;   (it.expects(outputDir))._not_.toBeFile
;   ```
;
;-
pro expectation::toBeFile, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required!', level = -1
  endif
  if ~isa(self.value[0], /string) then begin
    message, 'Expectation value must be a string path!', level = -1
  endif

  ; process the expectation
  self._processExpectation, 'to be a file', ~min(file_test(self.value[0], /regular)), $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
