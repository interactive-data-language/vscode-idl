;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Runs toEndWith and returns 1 if it raised an error.
;
; :Returns: any
;
; :Arguments:
;   e: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   suffix: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function toendwith_spec_raises, e, suffix
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toEndWith, suffix
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toEndWith')

    it = suite.test('passes when the string ends with the suffix')
      (it.expects('image.tif')).toEndWith, '.tif'
      (it.expects('tif')).toEndWith, 'tif'
      (it.expects('tif')).toEndWith, ''

    it = suite.test('fails otherwise')
      (it.expects('image.tif')).toEndWith, '.png', /_expect_failure
      (it.expects('f')).toEndWith, '.tif', /_expect_failure
      (it.expects('image.TIF')).toEndWith, '.tif', /_expect_failure

    it = suite.test('ignores case with /FOLD_CASE')
      (it.expects('IMAGE.TIF')).toEndWith, '.tif', /fold_case
      (it.expects('IMAGE.TIF')).toEndWith, '.png', /fold_case, /_expect_failure

    it = suite.test('requires every element of an array to pass')
      (it.expects(['a.tif', 'b.tif'])).toEndWith, '.tif'
      (it.expects(['a.tif', 'b.png'])).toEndWith, '.tif', /_expect_failure

    it = suite.test('can be negated')
      (it.expects('a.png'))._not_.toEndWith, '.tif'
      (it.expects('a.tif'))._not_.toEndWith, '.tif', /_expect_failure

    it = suite.test('raises an error for invalid input')
      (it.expects(toendwith_spec_raises(it.expects(42), 'a'))).toBeTrue
      (it.expects(toendwith_spec_raises(it.expects('a'), 42))).toBeTrue

l.generateTestSummary
end
