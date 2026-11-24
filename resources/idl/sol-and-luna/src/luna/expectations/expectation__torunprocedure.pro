;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value is a procedure and can
;   be called with the specified arguments/keywords.
;
; :Arguments:
;   arg1: in, optional, any
;     First argument passed on to the procedure being called.
;   arg2: in, optional, any
;     Second argument passed on to the procedure being called.
;   arg3: in, optional, any
;     Third argument passed on to the procedure being called.
;   arg4: in, optional, any
;     Fourth argument passed on to the procedure being called.
;   arg5: in, optional, any
;     Fifth argument passed on to the procedure being called.
;   arg6: in, optional, any
;     Sixth argument passed on to the procedure being called.
;   arg7: in, optional, any
;     Seventh argument passed on to the procedure being called.
;   arg8: in, optional, any
;     Eighth argument passed on to the procedure being called.
;
; :Keywords:
;   _expect_failure: in, optional, Boolean
;     If the test fails for some reason, set this to
;     force passing because we expected failure. This is
;     an **internal** keyword and should not be used.
;   _ref_extra: in, optional, any
;     All other specified keywords will be passed to the procedure
;     that is being called.
;   debug: in, optional, Boolean
;     If set, errors in the procedure/function will be stopped
;     on to make it easier to debug errors.
;   time: in, optional, Boolean
;     If set, the time to run the function will be added to the test
;     summary. Note that this is different from profiling the tests
;     and only times this specific function call.
;
; :Examples:
;   ```idl
;   ;run a function
;   (it.expects('my_pro')).toRunProcedure
;
;   ;return a value from our procedure with keywords and verify result
;   (it.expects('my_pro')).toRunProcedure, MY_KEYWORD = value
;   (it.expects(value))._not_.toBeNull
;   ```
;
;-
pro expectation::toRunProcedure, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, _ref_extra = extra, $
  _expect_failure = _expect_failure, $
  debug = debug, $
  time = time
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; call the procedure
  self._runRoutine, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, $
    _extra = extra, /_procedure, _nparams = n_params(), _expect_error = 0, $
    _str = 'to run procedure', $
    _debug = debug, $
    _expect_failure = _expect_failure, $
    _time = time
end
