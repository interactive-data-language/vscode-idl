;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value (a hash, orderedhash, or
;   dictionary) has a key.
;
; :Arguments:
;   key: in, required, String | Number
;     Specify the key to look for.
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
;   (it.expects(hash('name', 'luna'))).toHaveKey, 'name'
;   (it.expects(dictionary('name', 'luna')))._not_.toHaveKey, 'age'
;   ```
;
;-
pro expectation::toHaveKey, key, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required!', level = -1
  endif

  ; validate inputs
  sol_validate, hash('key', ['required'])
  if ~self._isKeyed() then begin
    message, 'Expectation value must be a hash, orderedhash, or dictionary!', level = -1
  endif
  if ~(isa(key, /string, /scalar) or isa(key, /number, /scalar)) then begin
    message, 'Key must be a scalar string or number!', level = -1
  endif

  ; process the expectation
  self._processExpectation, 'to have key ' + strtrim(key, 2), ~(self.value[0]).hasKey(key), $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
