;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Runs toBeFile and returns 1 if it raised an error.
;
; :Returns: any
;
; :Arguments:
;   e: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function tobefile_spec_raises, e
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toBeFile
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

file = filepath('tobefile_spec.txt', /tmp)
openw, lun, file, /get_lun
printf, lun, 'luna'
free_lun, lun
dir = filepath('', /tmp)
missing = filepath('tobefile_spec_missing.txt', /tmp)

  suite = l.suite('toBeFile')

    it = suite.test('passes for an existing file')
      (it.expects(file)).toBeFile
      (it.expects([file, file])).toBeFile

    it = suite.test('fails for directories and missing paths')
      (it.expects(dir)).toBeFile, /_expect_failure
      (it.expects(missing)).toBeFile, /_expect_failure
      (it.expects([file, missing])).toBeFile, /_expect_failure

    it = suite.test('can be negated')
      (it.expects(missing))._not_.toBeFile
      (it.expects(file))._not_.toBeFile, /_expect_failure

    it = suite.test('raises an error for invalid input')
      (it.expects(tobefile_spec_raises(it.expects(1)))).toBeTrue

      file_delete, file, /quiet

l.generateTestSummary
end
