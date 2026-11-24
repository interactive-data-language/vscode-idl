;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that an expectation value matches a compare
;   value. It supports:
;
;   - scalars (i.e. strings, numbers)
;   - arrays (**MUST** have the exact same shape to be equal)
;   - hash
;   - orderedhash
;   - dictionary
;   - list
;
;   You can also compare lists to arrays and arrays to lists.
;
; :Arguments:
;   compare: in, required, any
;     Specify a value to compare against. This can be a scalar,
;     array, list, hash, orderedhash, or dictionary.
;
; :Keywords:
;   _expect_failure: in, optional, Boolean
;     If the test fails for some reason, set this to
;     force passing because we expected failure. This
;     keyword is for internal use only.
;   fold_case: in, optional, Boolean
;     Set this keyword to compare strings (scalars or arrays)
;     without regard to case.
;
; :Examples:
;
;   ```idl
;   (it.expects(hash('fortyTwo', 42))).toEqual, hash('fortyTwo', 42)
;   (it.expects(orderedhash('fortyTwo', 42))).toEqual, orderedhash('fortyTwo', 42)
;   (it.expects(dictionary('fortyTwo', 42))).toEqual, dictionary('fortyTwo', 42)
;   (it.expects(list('fortyTwo', 42))).toEqual, list('fortyTwo', 42)
;   (it.expects(['fortyTwo', '42'])).toEqual, ['fortyTwo', '42']
;   (it.expects(list('fortyTwo', '42'))).toEqual, ['fortyTwo', '42']
;   (it.expects(['fortyTwo', '42'])).toEqual, list('fortyTwo', '42')
;   ```
;
;-
pro expectation::toEqual, compare, $
  fold_case = fold_case, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required!', level = -1
  endif

  ; validate inputs
  sol_validate, hash('compare', ['required'])

  ; compare strings without case
  if keyword_set(fold_case) then begin
    if ~isa(self.value[0], /string) or ~isa(compare, /string) then begin
      message, 'FOLD_CASE requires the expectation value and compare value to be strings!', level = -1
    endif
    equal = array_equal(strlowcase(self.value[0]), strlowcase(compare)) * $
      array_equal(size(self.value[0], /dimensions), size(compare, /dimensions))
    self._processExpectation, 'to be equal (ignoring case)', ~equal, $
      expected = self._describe(compare), $
      received = self._describeValue(), $
      _expect_failure = _expect_failure
    return
  endif

  ; process our data types
  switch (1) of
    isa(self.value[0], 'hash'):
    isa(self.value[0], 'orderedhash'):
    isa(self.value[0], 'dictionary'): begin
      ; validate type
      sol_validate, hash('compare', ['hash', 'orderedhash', 'dictionary'])

      ; get our values
      value = self.value[0]

      ; get our keys and process each one
      keys = value.keys()
      count = 0
      foreach key, keys do begin
        if compare.hasKey(key) then count += (total(value[key] eq compare[key]) eq n_elements(value[key]))
      endforeach

      ; set flag for equating
      equal = count eq n_elements(keys)
      break
    end
    else: begin
      ; check how to process
      if isa(self.value[0], 'list') then begin
        if isa(compare, 'list') then begin
          equal = total(self.value[0] eq compare)
          n = n_elements(compare)
        endif else begin
          comp = list(compare, /extract)
          equal = total(self.value[0] eq comp)
          n = n_elements(comp)
        endelse

        ; make sure we have the right number of elements
        equal *= (n_elements(self.value[0]) eq n)
      endif else begin
        ; array and list
        if isa(compare, 'list') then begin
          equal = array_equal(self.value[0], compare.toArray())
        endif else begin
          if isa(self.value[0], /array) and isa(compare, /array) then begin
            equal = array_equal(self.value[0], compare) * array_equal(size(self.value[0], /dimensions), size(compare, /dimensions))
          endif else begin
            equal = array_equal(self.value[0], compare)
          endelse
        endelse
      endelse
    end
  endswitch

  ; process the expectation
  self._processExpectation, $
    'to be equal', $
    ~equal, $
    expected = self._describe(compare), $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
