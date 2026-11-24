;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value (a hash, orderedhash, or
;   dictionary) has a key whose value equals another value. See
;   ```idl toContainEqual``` for how values are compared.
;
; :Arguments:
;   key: in, required, String | Number
;     Specify the key to look for.
;   value: in, required, any
;     Specify the value expected for the key.
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
;   (it.expects(hash('name', 'luna'))).toHaveKeyValue, 'name', 'luna'
;   (it.expects(hash('name', 'luna')))._not_.toHaveKeyValue, 'name', 'sol'
;   ```
;
;-
pro expectation::toHaveKeyValue, key, value, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required!', level = -1
  endif

  ; validate inputs
  sol_validate, hash('key', ['required'], 'value', ['required'])
  if ~self._isKeyed() then begin
    message, 'Expectation value must be a hash, orderedhash, or dictionary!', level = -1
  endif
  if ~(isa(key, /string, /scalar) or isa(key, /number, /scalar)) then begin
    message, 'Key must be a scalar string or number!', level = -1
  endif

  ; the key must exist and have the value
  pass = (self.value[0]).hasKey(key)
  if pass then pass = expectation_item_equal((self.value[0])[key], value)

  ; process the expectation
  self._processExpectation, 'to have key ' + strtrim(key, 2) + ' with the value', ~pass, $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
