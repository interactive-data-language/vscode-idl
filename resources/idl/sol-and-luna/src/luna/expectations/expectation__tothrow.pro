;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that running a routine or object method raises an error.
;   If the expectation value is a string, it is the name of the procedure
;   (or function, with `is_function`) to call. If the value is an object,
;   the first argument is the name of the method to call. All remaining
;   arguments and keywords are passed on. Use `_not_` to verify that a
;   routine runs without error.
;
; :Arguments:
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
;   (it.expects('my_pro')).toThrow, badInput
;   (it.expects('my_function')).toThrow, badInput, /is_function
;   (it.expects(obj)).toThrow, 'method', badInput
;   (it.expects('my_pro'))._not_.toThrow, goodInput
;   ```
;
;-
pro expectation::toThrow, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, $
  is_function = isFunction, $
  debug = debug, $
  _expect_failure = _expect_failure, $
  _ref_extra = extra
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  self._throw, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, $
    _extra = extra, _nparams = n_params(), _procedure = ~keyword_set(isFunction), $
    _str = 'to throw', _debug = debug, _expect_failure = _expect_failure
end
