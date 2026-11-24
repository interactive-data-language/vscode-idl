;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
;-
pro luna_procedure_that_raises_exception
  compile_opt idl2, hidden
  message, 'Exception!'
end

;+
; :Keywords:
;   kw2: bidirectional, optional, any
;     Placeholder docs for argument, keyword, or property
;
;-
pro luna_procedure_that_does_not_raise_exception, kw2 = kw2
  compile_opt idl2, hidden
  ; no exception!
end

;+
; :Arguments:
;   a1-a8: bidirectional, optional, any
;     Placeholder docs for argument, keyword, or property
;
;-
pro luna_procedure_many_args, a1, a2, a3, a4, a5, a6, a7, a8
  compile_opt idl2, hidden
  ; do nothing
end

;+
; :Arguments:
;   a1-a8: bidirectional, optional, any
;     Placeholder docs for argument, keyword, or property
;
; :Keywords:
;   kw: bidirectional, optional, any
;     Placeholder docs for argument, keyword, or property
;
;-
pro luna_procedure_many_args_kw, a1, a2, a3, a4, a5, a6, a7, a8, kw = kw2
  compile_opt idl2, hidden
  ; do nothing
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toRunProcedure')

    it = suite.test('makes sure tests for procedures are valid')

      e = it.expects('luna_procedure_that_does_not_raise_exception')

        ; arguments and keywords the procedure does not accept raise errors
        (it.expects(e)).toThrow, 'toRunProcedure', 1
        (it.expects(e)).toThrow, 'toRunProcedure', kw = 1

        e._not_.toRunProcedure, /_expect_failure
        e.toRunProcedure, /time

      ; a procedure that raises errors
      e = it.expects('luna_procedure_that_raises_exception')
        e._not_.toRunProcedure
        e.toRunProcedure, /_expect_failure

    it = suite.test('makes sure tests for procedure arguments/keywords are valid')

      e = it.expects('luna_procedure_many_args')
        e.toRunProcedure
        e.toRunProcedure, 1
        e.toRunProcedure, 1, 2
        e.toRunProcedure, 1, 2, 3
        e.toRunProcedure, 1, 2, 3, 4
        e.toRunProcedure, 1, 2, 3, 4, 5
        e.toRunProcedure, 1, 2, 3, 4, 5, 6
        e.toRunProcedure, 1, 2, 3, 4, 5, 6, 7, 8

      e = it.expects('luna_procedure_many_args_kw')
        e.toRunProcedure, /kw
        e.toRunProcedure, 1, /kw
        e.toRunProcedure, 1, 2, /kw
        e.toRunProcedure, 1, 2, 3, /kw
        e.toRunProcedure, 1, 2, 3, 4, /kw
        e.toRunProcedure, 1, 2, 3, 4, 5, /kw
        e.toRunProcedure, 1, 2, 3, 4, 5, 6, /kw
        e.toRunProcedure, 1, 2, 3, 4, 5, 6, 7, 8, /kw

l.generateTestSummary
end
