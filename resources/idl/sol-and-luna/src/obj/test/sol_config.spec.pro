;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

; write a configuration file
;+
; :Arguments:
;   file: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   text: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
pro sol_config_spec_write, file, text
  compile_opt idl2, hidden
  file_mkdir, file_dirname(file)
  openw, lun, file, /get_lun
  printf, lun, text
  free_lun, lun
end

; error message from loading a configuration, empty if it loads
;+
; :Returns: any
;
; :Arguments:
;   file: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   text: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function sol_config_spec_error, file, text
  compile_opt idl2, hidden
  sol_config_spec_write, file, text
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    msg = !error_state.msg
    message, /reset
    return, msg
  endif
  cfg = sol_config(file)
  catch, /cancel
  return, ''
end

compile_opt idl2, hidden

; work in a folder that we remove at the end
root = file_dirname(routine_filepath()) + path_sep() + 'tmp_sol_config'
file_delete, root, /recursive, /allow_nonexistent, /quiet
file_mkdir, root
file = root + path_sep() + 'idltest.json'

; lets test this!
l = luna()

  ; create a suite
  suite = l.suite('Test suite for sol_config')

    it = suite.test('uses the defaults for a missing file without creating it')
      cfg = sol_config(file)
      (it.expects(file_test(file))).toEqual, 0
      (it.expects(cfg.exists)).toEqual, 0
      (it.expects(cfg.dir)).toEqual, root
      (it.expects(strjoin(cfg.include, '|'))).toEqual, 'src/**/*.spec.pro'
      (it.expects(cfg.exclude)).toBeNull
      (it.expects(strjoin(cfg.sourceInclude, '|'))).toEqual, 'src/**/*.pro'
      (it.expects(strjoin(cfg.sourceExclude, '|'))).toEqual, '**/*.spec.pro'
      (it.expects(cfg.isolation)).toEqual, 'process'
      (it.expects(cfg.stopOnFailure)).toEqual, 0
      (it.expects(cfg.coverageEnabled)).toEqual, 1
      (it.expects(cfg.coverageProfile)).toEqual, 0
      (it.expects(cfg.outputLevel)).toEqual, 'normal'
      (it.expects(cfg.quiet)).toEqual, 0
      (it.expects(cfg.verbose)).toEqual, 0
      (it.expects(cfg.logFile)).toEqual, root + path_sep() + 'idltest.log'
      (it.expects(cfg.debug)).toEqual, 0
      (it.expects(file_test(file))).toEqual, 0

    it = suite.test('applies defaults for missing options without modifying the file')
      sol_config_spec_write, file, '{"run": {"isolation": "SHARED"}, "include": "tests/*.spec.pro"}'
      before = file_info(file)
      cfg = sol_config(file)
      after = file_info(file)
      (it.expects(cfg.exists)).toEqual, 1
      (it.expects(cfg.isolation)).toEqual, 'shared'
      (it.expects(strjoin(cfg.include, '|'))).toEqual, 'tests/*.spec.pro'
      (it.expects(cfg.coverageEnabled)).toEqual, 1
      (it.expects(cfg.outputLevel)).toEqual, 'normal'
      (it.expects(after.size)).toEqual, before.size
      (it.expects(after.mtime)).toEqual, before.mtime
      (it.expects(strjoin(Luna_Sol_Base_Obj.read_file(file), ''))).toEqual, '{"run": {"isolation": "SHARED"}, "include": "tests/*.spec.pro"}'

    it = suite.test('reads every option')
      sol_config_spec_write, file, '{"include": ["a/**/*.spec.pro", "b/*.spec.pro"], "exclude": ["a/skip/**"],' + $
        '"source": {"include": [], "exclude": ["x/**"]}, "run": {"isolation": "shared", "stopOnFailure": true},' + $
        '"coverage": {"enabled": false, "profile": true}, "output": {"level": "verbose", "log": "out/test.log"}, "debug": true}'
      cfg = sol_config(file)
      (it.expects(strjoin(cfg.include, '|'))).toEqual, 'a/**/*.spec.pro|b/*.spec.pro'
      (it.expects(strjoin(cfg.exclude, '|'))).toEqual, 'a/skip/**'
      (it.expects(cfg.sourceInclude)).toBeNull
      (it.expects(strjoin(cfg.sourceExclude, '|'))).toEqual, 'x/**'
      (it.expects(cfg.isolation)).toEqual, 'shared'
      (it.expects(cfg.stopOnFailure)).toEqual, 1
      (it.expects(cfg.coverageEnabled)).toEqual, 0
      (it.expects(cfg.coverageProfile)).toEqual, 1
      (it.expects(cfg.outputLevel)).toEqual, 'verbose'
      (it.expects(cfg.quiet)).toEqual, 0
      (it.expects(cfg.verbose)).toEqual, 1
      (it.expects(cfg.logFile)).toEqual, root + path_sep() + 'out/test.log'
      (it.expects(cfg.debug)).toEqual, 1
      (it.expects(cfg.findSource())).toBeNull

    it = suite.test('maps the quiet output level')
      sol_config_spec_write, file, '{"output": {"level": "quiet"}}'
      cfg = sol_config(file)
      (it.expects(cfg.quiet)).toEqual, 1
      (it.expects(cfg.verbose)).toEqual, 0

    it = suite.test('finds test and source files with the globs')
      sol_config_spec_write, root + path_sep() + 'src' + path_sep() + 'a.pro', ';a'
      sol_config_spec_write, root + path_sep() + 'src' + path_sep() + 'a.spec.pro', ';a'
      file_delete, file
      cfg = sol_config(file)
      (it.expects(file_basename(cfg.findTests()))).toEqual, 'a.spec.pro'
      (it.expects(file_basename(cfg.findSource()))).toEqual, 'a.pro'

    it = suite.test('raises clear errors for invalid values')
      (it.expects(sol_config_spec_error(file, '{"run": {"isolation": "thread"}}'))).toContainString, 'run.isolation'
      (it.expects(sol_config_spec_error(file, '{"output": {"level": "loud"}}'))).toContainString, 'output.level'
      (it.expects(sol_config_spec_error(file, '{"debug": "yes"}'))).toContainString, 'debug'
      (it.expects(sol_config_spec_error(file, '{"coverage": {"enabled": 1}}'))).toContainString, 'coverage.enabled'
      (it.expects(sol_config_spec_error(file, '{"include": [1, 2]}'))).toContainString, 'include'
      (it.expects(sol_config_spec_error(file, '{"include": 5}'))).toContainString, 'include'
      (it.expects(sol_config_spec_error(file, '{"source": []}'))).toContainString, 'source'
      (it.expects(sol_config_spec_error(file, '{"output": {"log": ""}}'))).toContainString, 'output.log'
      (it.expects(sol_config_spec_error(file, '{"unknown": 1}'))).toContainString, 'unknown'
      (it.expects(sol_config_spec_error(file, '{"run": {"timeout": 1}}'))).toContainString, 'run.timeout'
      (it.expects(sol_config_spec_error(file, '[1, 2]'))).toContainString, 'top level'
      (it.expects(sol_config_spec_error(file, '{not json'))).toContainString, 'idltest.json'
      (it.expects(sol_config_spec_error(file, '{}'))).toEqual, ''

      file_delete, root, /recursive, /allow_nonexistent, /quiet
l.generateTestSummary
end
