;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that running a routine or object method raises an error
;   whose message contains some text (case sensitive). The routine is
;   specified and called as described for ```idl toThrow```.
;
; :Arguments:
;   text: in, required, String
;     Specify text the error message must contain.
;   arg1: in, optional, any
;     Method name (objects) or first argument for the routine.
;   arg2: bidirectional, optional, any
;     Optional argument 2 for the routine or method.
;   arg3: bidirectional, optional, any
;     Optional argument 3 for the routine or method.
;   arg4: bidirectional, optional, any
;     Optional argument 4 for the routine or method.
;   arg5: bidirectional, optional, any
;     Optional argument 5 for the routine or method.
;   arg6: bidirectional, optional, any
;     Optional argument 6 for the routine or method.
;   arg7: bidirectional, optional, any
;     Optional argument 7 for the routine or method.
;   arg8: bidirectional, optional, any
;     Optional argument 8 for the routine or method.
;   arg9: bidirectional, optional, any
;     Optional argument 9 for the routine or method.
;
; :Keywords:
;   _expect_failure: in, optional, Boolean
;     If the test fails for some reason, set this to
;     force passing because we expected failure. This is
;     an **internal** keyword and should not be used.
;   _ref_extra: in, optional, any
;     All other keywords are passed to the routine or method.
;   debug: in, optional, Boolean
;     If set, errors are not caught to make debugging easier.
;   is_function: in, optional, Boolean
;     Set if the routine or method is a function. By default,
;     the routine or method is a procedure.
;
; :Examples:
;   ```idl
;   (it.expects('my_pro')).toThrowMessage, 'file not found', badInput
;   (it.expects('my_function')).toThrowMessage, 'file not found', badInput, /is_function
;   (it.expects(obj)).toThrowMessage, 'bad value', 'method', badInput
;   ```
;
;-
pro expectation::toThrowMessage, text, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, $
  is_function = isFunction, $
  debug = debug, $
  _expect_failure = _expect_failure, $
  _ref_extra = extra
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  sol_validate, hash('text', ['required', 'string'])
  if ~isa(text, /scalar) then begin
    message, 'Message text must be a scalar string!', level = -1
  endif

  self._throw, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, $
    _extra = extra, _nparams = n_params() - 1, _procedure = ~keyword_set(isFunction), $
    _error_contains = text, $
    _str = 'to throw message containing "' + text + '"', $
    _debug = debug, _expect_failure = _expect_failure
end
