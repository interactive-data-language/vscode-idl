;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that a routine or object method runs without error and
;   finishes within a number of seconds. If the expectation value is a
;   string, it is the name of the procedure (or function, with
;   `function`) to call. If the value is an object, the first argument
;   after the time is the name of the method to call. All remaining
;   arguments and keywords are passed on.
;
; :Arguments:
;   seconds: in, required, Number
;     Specify the maximum number of seconds the call may take.
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
;   (it.expects('my_pro')).toRunWithin, 2.0, input
;   (it.expects('my_function')).toRunWithin, 0.5, input, /is_function
;   (it.expects(obj)).toRunWithin, 1, 'method', input
;   ```
;
;-
pro expectation::toRunWithin, seconds, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, $
  is_function = isFunction, $
  debug = debug, $
  _expect_failure = _expect_failure, $
  _ref_extra = extra
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  sol_validate, hash('seconds', ['required'])
  if ~isa(seconds, /number, /scalar) or isa(seconds, /complex) then begin
    message, 'Seconds must be a real scalar number!', level = -1
  endif
  nparams = n_params() - 1
  str = 'to run within ' + string(seconds, format = '(G0)') + ' seconds'

  if self.hasValue && (size(self.value[0], /type) eq 11) then begin
    if (nparams lt 1) then begin
      message, 'Method name required when the expectation value is an object!', level = -1
    endif
    self._runRoutine, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, $
      _extra = extra, _procedure = ~keyword_set(isFunction), _nparams = nparams - 1, _expect_error = 0, $
      _method = (isa(arg1, /string, /scalar) ? arg1 : 1), _max_time = seconds, $
      _str = str, _debug = debug, _expect_failure = _expect_failure
  endif else begin
    if (nparams gt 8) then begin
      message, 'Too many arguments, a maximum of 8 can be passed to the routine!', level = -1
    endif
    self._runRoutine, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, $
      _extra = extra, _procedure = ~keyword_set(isFunction), _nparams = nparams, _expect_error = 0, $
      _max_time = seconds, $
      _str = str, _debug = debug, _expect_failure = _expect_failure
  endelse
end
