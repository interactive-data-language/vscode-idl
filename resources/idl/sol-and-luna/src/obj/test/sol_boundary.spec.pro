;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

; names of PRO files in the package whose code matches a regex (comments are ignored)
;+
; :Returns: String
;
; :Arguments:
;   root: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   files: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   regex: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function sol_boundary_spec_offenders, root, files, regex
  compile_opt idl2, hidden
  offenders = list()
  foreach file, files do begin
    lines = Luna_Sol_Base_Obj.read_file(file)
    if (lines eq !null) then continue
    code = lines.replace(';.*$', '')
    if (total(stregex(code, regex, /boolean, /fold_case)) gt 0) then begin
      offenders.add, strmid(file, strlen(root) + 1)
    endif
  endforeach
  if (offenders.count() eq 0) then return, ''
  return, strjoin(offenders.toArray(), ', ')
end

compile_opt idl2, hidden

; package root is two folders above this file (obj/test)
root = file_dirname(file_dirname(file_dirname(routine_filepath())))

l = luna()

  suite = l.suite('Sol and Luna package boundary')

    ; this file lists the forbidden names so it is excluded from the scan
    files = sol_glob(root, '**/*.pro', ['**/tmp_*/**', '**/sol_boundary.spec.pro'])

    it = suite.test('finds the package PRO files to check')
      (it.expects(n_elements(files) gt 10)).toBeTrue

    it = suite.test('does not use IDL Package Creator routines or objects')
      regex = '(^|[^a-z0-9_$])(idlpc|idlpb|idlpt|inputvalidator)[a-z0-9_]*([^a-z0-9_$]|$)'
      (it.expects(sol_boundary_spec_offenders(root, files, regex))).toEqual, ''

    it = suite.test('does not use the legacy idl.test.json config')
      (it.expects(sol_boundary_spec_offenders(root, files, 'idl\.test\.json'))).toEqual, ''

    it = suite.test('does not use ENVI outside of the ENVI task expectations')
      envi_files = files[where(~strmatch(files, '*expectation__*envitask.pro') and ~strmatch(files, '*toexecuteenvitask.spec.pro') and ~strmatch(files, '*tobeavalidenvitask.spec.pro'), /null)]
      (it.expects(sol_boundary_spec_offenders(root, envi_files, '(^|[^a-z0-9_$])envi[a-z_]*\('))).toEqual, ''

; summarize our tests
l.generateTestSummary
end
