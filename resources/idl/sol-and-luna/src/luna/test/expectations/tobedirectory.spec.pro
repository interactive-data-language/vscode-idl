;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Runs toBeDirectory and returns 1 if it raised an error.
;
; :Returns: any
;
; :Arguments:
;   e: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function tobedirectory_spec_raises, e
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toBeDirectory
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

file = filepath('tobedirectory_spec.txt', /tmp)
openw, lun, file, /get_lun
printf, lun, 'luna'
free_lun, lun
dir = filepath('', /tmp)
missing = filepath('tobedirectory_spec_missing', /tmp)

  suite = l.suite('toBeDirectory')

    it = suite.test('passes for an existing directory')
      (it.expects(dir)).toBeDirectory
      (it.expects([dir, dir])).toBeDirectory

    it = suite.test('fails for files and missing paths')
      (it.expects(file)).toBeDirectory, /_expect_failure
      (it.expects(missing)).toBeDirectory, /_expect_failure
      (it.expects([dir, missing])).toBeDirectory, /_expect_failure

    it = suite.test('can be negated')
      (it.expects(file))._not_.toBeDirectory
      (it.expects(dir))._not_.toBeDirectory, /_expect_failure

    it = suite.test('raises an error for invalid input')
      (it.expects(tobedirectory_spec_raises(it.expects(1)))).toBeTrue

      file_delete, file, /quiet

l.generateTestSummary
end
