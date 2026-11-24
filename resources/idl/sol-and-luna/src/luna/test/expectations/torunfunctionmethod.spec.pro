;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Returns: any
;
;-
function luna_test_obj::that_raises_exception
  compile_opt idl2, hidden
  message, 'Exception!'
end

;+
; :Returns: any
;
; :Keywords:
;   kw2: bidirectional, optional, any
;     Placeholder docs for argument, keyword, or property
;
;-
function luna_test_obj::does_not_raise_exception, kw2 = kw2
  compile_opt idl2, hidden
  ; no exception!
  return, 1
end

;+
; :Returns: any
;
; :Arguments:
;   a1-a8: bidirectional, optional, any
;     Placeholder docs for argument, keyword, or property
;
;-
function luna_test_obj::many_args, a1, a2, a3, a4, a5, a6, a7, a8
  compile_opt idl2, hidden
  ; do nothing
  return, !null
end

;+
; :Returns: any
;
; :Arguments:
;   a1-a8: bidirectional, optional, any
;     Placeholder docs for argument, keyword, or property
;
; :Keywords:
;   kw: bidirectional, optional, any
;     Placeholder docs for argument, keyword, or property
;
;-
function luna_test_obj::many_args_kw, a1, a2, a3, a4, a5, a6, a7, a8, kw = kw2
  compile_opt idl2, hidden
  ; do nothing
  return, !null
end

;+
; :Luna_Test_Obj:
;
;-
pro luna_test_obj__define
  compile_opt idl2, hidden
  !null = {Luna_Test_Obj, inherits IDL_Object}
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toRunFunctionMethod')

    it = suite.test('makes sure tests for function methods are valid')

      obj = obj_new('luna_test_obj')
      e = it.expects(obj)

        ; arguments and keywords the method does not accept raise errors
        (it.expects(e)).toThrow, 'toRunFunctionMethod', 'does_not_raise_exception', 1, 1
        (it.expects(e)).toThrow, 'toRunFunctionMethod', 'does_not_raise_exception', kw = 1

        e._not_.toRunFunctionMethod, 'does_not_raise_exception', /_expect_failure

        ; run without error and return a value
        e.toRunFunctionMethod, 'does_not_raise_exception', output = value
      (it.expects(value))._not_.toBeNull

      ; a method that raises errors
      e._not_.toRunFunctionMethod, 'that_raises_exception'
      e.toRunFunctionMethod, 'that_raises_exception', /_expect_failure

    it = suite.test('makes sure tests for function method arguments/keywords are valid')

      e = it.expects(obj_new('luna_test_obj'))
        e.toRunFunctionMethod, 'many_args'
        e.toRunFunctionMethod, 'many_args', 1
        e.toRunFunctionMethod, 'many_args', 1, 2
        e.toRunFunctionMethod, 'many_args', 1, 2, 3
        e.toRunFunctionMethod, 'many_args', 1, 2, 3, 4
        e.toRunFunctionMethod, 'many_args', 1, 2, 3, 4, 5
        e.toRunFunctionMethod, 'many_args', 1, 2, 3, 4, 5, 6
        e.toRunFunctionMethod, 'many_args', 1, 2, 3, 4, 5, 6, 7, 8

        e.toRunFunctionMethod, 'many_args_kw', /kw
        e.toRunFunctionMethod, 'many_args_kw', 1, /kw
        e.toRunFunctionMethod, 'many_args_kw', 1, 2, /kw
        e.toRunFunctionMethod, 'many_args_kw', 1, 2, 3, /kw
        e.toRunFunctionMethod, 'many_args_kw', 1, 2, 3, 4, /kw
        e.toRunFunctionMethod, 'many_args_kw', 1, 2, 3, 4, 5, /kw
        e.toRunFunctionMethod, 'many_args_kw', 1, 2, 3, 4, 5, 6, /kw
        e.toRunFunctionMethod, 'many_args_kw', 1, 2, 3, 4, 5, 6, 7, 8, /kw

l.generateTestSummary
end
