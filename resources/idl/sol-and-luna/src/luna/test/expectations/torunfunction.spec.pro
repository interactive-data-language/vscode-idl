;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Returns: any
;
;-
function luna_function_that_raises_exception
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
function luna_function_that_does_not_raise_exception, kw2 = kw2
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
function luna_function_many_args, a1, a2, a3, a4, a5, a6, a7, a8
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
function luna_function_many_args_kw, a1, a2, a3, a4, a5, a6, a7, a8, kw = kw2
  compile_opt idl2, hidden
  ; do nothing
  return, !null
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toRunFunction')

    it = suite.test('makes sure tests for functions are valid')

      e = it.expects('luna_function_that_does_not_raise_exception')

        ; arguments and keywords the function does not accept raise errors
        (it.expects(e)).toThrow, 'toRunFunction', 1
        (it.expects(e)).toThrow, 'toRunFunction', kw = 1

        e._not_.toRunFunction, /_expect_failure

        ; run without error and return a value
        e.toRunFunction, output = value
      (it.expects(value))._not_.toBeNull

      ; a function that raises errors
      e = it.expects('luna_function_that_raises_exception')
        e._not_.toRunFunction
        e.toRunFunction, /_expect_failure

    it = suite.test('makes sure tests for function arguments/keywords are valid')

      e = it.expects('luna_function_many_args')
        e.toRunFunction
        e.toRunFunction, 1
        e.toRunFunction, 1, 2
        e.toRunFunction, 1, 2, 3
        e.toRunFunction, 1, 2, 3, 4
        e.toRunFunction, 1, 2, 3, 4, 5
        e.toRunFunction, 1, 2, 3, 4, 5, 6
        e.toRunFunction, 1, 2, 3, 4, 5, 6, 7, 8

      e = it.expects('luna_function_many_args_kw')
        e.toRunFunction, /kw
        e.toRunFunction, 1, /kw
        e.toRunFunction, 1, 2, /kw
        e.toRunFunction, 1, 2, 3, /kw
        e.toRunFunction, 1, 2, 3, 4, /kw
        e.toRunFunction, 1, 2, 3, 4, 5, /kw
        e.toRunFunction, 1, 2, 3, 4, 5, 6, /kw
        e.toRunFunction, 1, 2, 3, 4, 5, 6, 7, 8, /kw

l.generateTestSummary
end
