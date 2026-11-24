;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Runs toExist and returns 1 if it raised an error.
;
; :Returns: any
;
; :Arguments:
;   e: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function toexist_spec_raises, e
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toExist
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

file = filepath('toexist_spec.txt', /tmp)
openw, lun, file, /get_lun
printf, lun, 'luna'
free_lun, lun
dir = filepath('', /tmp)
missing = filepath('toexist_spec_missing', /tmp)

  suite = l.suite('toExist')

    it = suite.test('passes for files and directories')
      (it.expects(file)).toExist
      (it.expects(dir)).toExist
      (it.expects([file, dir])).toExist

    it = suite.test('fails for missing paths')
      (it.expects(missing)).toExist, /_expect_failure
      (it.expects([file, missing])).toExist, /_expect_failure
      (it.expects('')).toExist, /_expect_failure

    it = suite.test('can be negated')
      (it.expects(missing))._not_.toExist
      (it.expects(file))._not_.toExist, /_expect_failure

    it = suite.test('raises an error for invalid input')
      (it.expects(toexist_spec_raises(it.expects(1)))).toBeTrue

      file_delete, file, /quiet

l.generateTestSummary
end
