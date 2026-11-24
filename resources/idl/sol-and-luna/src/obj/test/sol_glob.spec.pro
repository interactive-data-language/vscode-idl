;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

; make a file and its folders
;+
; :Arguments:
;   root: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   rel: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
pro sol_glob_spec_touch, root, rel
  compile_opt idl2, hidden
  file = root + path_sep() + rel.replace('/', path_sep())
  file_mkdir, file_dirname(file)
  openw, lun, file, /get_lun
  printf, lun, ';test'
  free_lun, lun
end

; relative, sorted, forward slash names joined into one string
;+
; :Returns: String
;
; :Arguments:
;   root: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   files: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function sol_glob_spec_names, root, files
  compile_opt idl2, hidden
  if (files eq !null) then return, ''
  rel = strmid(files, strlen(root) + 1)
  rel = rel.replace('\', '/')
  return, strjoin(rel[sort(rel)], '|')
end

; true if sol_glob raises an error
;+
; :Returns: 1 | 0
;
; :Arguments:
;   root: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   include: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function sol_glob_spec_fails, root, include
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  !null = sol_glob(root, include)
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

; build a folder with files to search
root = file_dirname(routine_filepath()) + path_sep() + 'tmp_sol_glob'

; lets test this!
l = luna()

; build a folder with files to search after luna has found its source files
file_delete, root, /recursive, /allow_nonexistent, /quiet
foreach rel, ['a.pro', 'b.pro', 'a.spec.pro', 'ab.txt', 'sub/c.pro', 'sub/deep/d.pro', 'sub/deep/d.spec.pro'] do begin
  sol_glob_spec_touch, root, rel
endforeach

  ; create a suite
  suite = l.suite('Test suite for sol_glob')

    it = suite.test('matches * within a single folder')
      (it.expects(sol_glob_spec_names(root, sol_glob(root, '*.pro')))).toEqual, 'a.pro|a.spec.pro|b.pro'
      (it.expects(sol_glob_spec_names(root, sol_glob(root, 'sub/*.pro')))).toEqual, 'sub/c.pro'

    it = suite.test('matches ? as exactly one character')
      (it.expects(sol_glob_spec_names(root, sol_glob(root, '?.pro')))).toEqual, 'a.pro|b.pro'
      (it.expects(sol_glob_spec_names(root, sol_glob(root, '??.txt')))).toEqual, 'ab.txt'

    it = suite.test('matches ** across folders, including none')
      (it.expects(sol_glob_spec_names(root, sol_glob(root, '**/*.pro')))).toEqual, $
        'a.pro|a.spec.pro|b.pro|sub/c.pro|sub/deep/d.pro|sub/deep/d.spec.pro'
      (it.expects(sol_glob_spec_names(root, sol_glob(root, 'sub/**/*.pro')))).toEqual, $
        'sub/c.pro|sub/deep/d.pro|sub/deep/d.spec.pro'
      (it.expects(sol_glob_spec_names(root, sol_glob(root, 'sub/**')))).toEqual, $
        'sub/c.pro|sub/deep/d.pro|sub/deep/d.spec.pro'

    it = suite.test('applies excludes and combines multiple includes')
      (it.expects(sol_glob_spec_names(root, sol_glob(root, '**/*.pro', '**/*.spec.pro')))).toEqual, $
        'a.pro|b.pro|sub/c.pro|sub/deep/d.pro'
      (it.expects(sol_glob_spec_names(root, sol_glob(root, ['a.pro', 'sub/c.pro'])))).toEqual, 'a.pro|sub/c.pro'
      (it.expects(sol_glob_spec_names(root, sol_glob(root, ['**/*.pro', '**/*.txt'], ['sub/**', 'b.pro'])))).toEqual, $
        'a.pro|a.spec.pro|ab.txt'

    it = suite.test('accepts forward and back slashes and a leading ./')
      (it.expects(sol_glob_spec_names(root, sol_glob(root, 'sub\deep\*.pro')))).toEqual, $
        'sub/deep/d.pro|sub/deep/d.spec.pro'
      (it.expects(sol_glob_spec_names(root, sol_glob(root, './sub/deep/*.pro')))).toEqual, $
        'sub/deep/d.pro|sub/deep/d.spec.pro'
      (it.expects(sol_glob_spec_names(root, sol_glob(root, '**/*.pro', '**\*.spec.pro')))).toEqual, $
        'a.pro|b.pro|sub/c.pro|sub/deep/d.pro'
      (it.expects(sol_glob_spec_names(root, sol_glob(root + path_sep(), 'sub/c.pro')))).toEqual, 'sub/c.pro'

    it = suite.test('returns full paths with native separators')
      files = sol_glob(root, 'sub/c.pro', count = count)
      (it.expects(files)).toEqual, root + path_sep() + 'sub' + path_sep() + 'c.pro'
      (it.expects(count)).toEqual, 1

    it = suite.test('returns null when nothing matches')
      (it.expects(sol_glob(root, '*.nothing'))).toBeNull
      (it.expects(sol_glob(root, !null))).toBeNull
      (it.expects(sol_glob(root, '**/*.pro', '**/*'))).toBeNull

    it = suite.test('only ignores case on Windows')
      expected = (!version.OS_FAMILY eq 'Windows') ? 'a.pro|b.pro' : ''
      (it.expects(sol_glob_spec_names(root, sol_glob(root, '?.PRO')))).toEqual, expected

    it = suite.test('errors for a root that is not a folder or a pattern leaving the root')
      (it.expects(sol_glob_spec_fails(root + path_sep() + 'does_not_exist', '*.pro'))).toEqual, 1
      (it.expects(sol_glob_spec_fails(root, '../*.pro'))).toEqual, 1
      (it.expects(sol_glob_spec_fails(root, '*.pro'))).toEqual, 0

      file_delete, root, /recursive, /allow_nonexistent, /quiet
l.generateTestSummary
end
