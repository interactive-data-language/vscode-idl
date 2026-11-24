;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value is an object and can
;   run the specified function method with the provided
;   arguments/keywords.
;
;   Note that, if you need to test a static method, you can use
;   one of the two following approaches:
;
;   ```idl
;   (it.expects('execute')).toRunFunction, 'someObj.staticMethod()'
;   (it.expects(1)).toEqual, execute('someObj.staticMethod()')
;   ```
;
; :Arguments:
;   method: in, required, String
;     Specify the method that you want to run.
;   arg1: in, optional, any
;     First argument passed on to the method being called.
;   arg2: in, optional, any
;     Second argument passed on to the method being called.
;   arg3: in, optional, any
;     Third argument passed on to the method being called.
;   arg4: in, optional, any
;     Fourth argument passed on to the method being called.
;   arg5: in, optional, any
;     Fifth argument passed on to the method being called.
;   arg6: in, optional, any
;     Sixth argument passed on to the method being called.
;   arg7: in, optional, any
;     Seventh argument passed on to the method being called.
;   arg8: in, optional, any
;     Eighth argument passed on to the method being called.
;
; :Keywords:
;   _expect_failure: in, optional, Boolean
;     If the test fails for some reason, set this to
;     force passing because we expected failure. This is
;     an **internal** keyword and should not be used.
;   _ref_extra: in, optional, any
;     All other specified keywords will be passed to the method
;     that is being called.
;   debug: in, optional, Boolean
;     If set, errors in the procedure/function will be stopped
;     on to make it easier to debug errors.
;   output: out, optional, any
;     Keyword that contains the result of running the function and
;     can be useful to verify the return value.
;   time: in, optional, Boolean
;     If set, the time to run the function will be added to the test
;     summary. Note that this is different from profiling the tests
;     and only times this specific function call.
;
; :Examples:
;   ```idl
;   ;create an object
;   e = it.expects(plot(/TEST, /BUFFER))
;
;   ;run a function method
;   e.toRunFunctionMethod, 'copyWindow', OUTPUT = value
;
;   ;verify result
;   (it.expects(value))._not_.toBeNull
;   ```
;
;-
pro expectation::toRunFunctionMethod, method, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, _ref_extra = extra, $
  _expect_failure = _expect_failure, $
  debug = debug, $
  output = output, $
  time = time
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; validate our input
  sol_validate, hash('method', ['required', 'string'])

  ; call the function method
  self._runRoutine, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, $
    _extra = extra, _nparams = n_params() - 1, _expect_error = 0, $
    _method = keyword_set(method) ? method : 1, $
    _debug = debug, $
    _output = output, $
    _str = 'to run function method', $
    _expect_failure = _expect_failure, $
    _time = time
end
