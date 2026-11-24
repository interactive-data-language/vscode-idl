;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Loads and validates the `idltest.json` configuration file for the
;   Sol test runner and the Luna test writer. The file is only ever read:
;   missing options get their default values in memory and the file on
;   disk is never created or modified.
;
;   Every option is optional, and unknown options are an error. These
;   are the options, with their default values:
;
;   ```json
;   {
;     "include": ["src/**/*.spec.pro"],
;     "exclude": [],
;     "source": {"include": ["src/**/*.pro"], "exclude": ["**/*.spec.pro"]},
;     "run": {"isolation": "process", "stopOnFailure": false},
;     "coverage": {"enabled": true, "profile": false},
;     "output": {"level": "normal", "log": "idltest.log"},
;     "debug": false
;   }
;   ```
;
;   - `include`, `exclude`: glob patterns for the test files, see `sol_glob`.
;   - `source.include`, `source.exclude`: glob patterns for the PRO code that
;     the tests cover. If `source.include` is empty, Luna only covers the code
;     for the test file that it is called from.
;   - `run.isolation`: `process` runs each test file in a new IDL process
;     and `shared` reuses one process for all test files.
;   - `run.stopOnFailure`: stop running test files after the first failure.
;   - `coverage.enabled`: track which lines of the source code were executed.
;   - `coverage.profile`: also profile the routines in the source code.
;   - `output.level`: `quiet` only prints warnings, `normal`, or `verbose`.
;   - `output.log`: name of the summary file, relative to the folder with
;     the configuration file.
;   - `debug`: stop on errors in Sol and Luna instead of returning to the
;     caller, and keep the output of the IDL processes that run the tests in
;     `sol.log` and `luna.log` next to the configuration file.
;
;   Paths and patterns are relative to the folder that contains the file.
;
; :Examples:
;   ```idl
;   cfg = sol_config('C:\my_package\idltest.json')
;   testFiles = cfg.FindTests()
;   print, cfg.outputLevel
;   ```
;
;-

;+
; :Private:
;
; :Description:
;   Raises an error for an option in the configuration file.
;
; :Arguments:
;   path: in, required, String
;     Name of the option, like `run.isolation`.
;   problem: in, required, String
;     What is wrong with the value.
;
;-
pro sol_config::_Fail, path, problem
  compile_opt idl2, hidden
  message, 'Invalid configuration file ' + self.file + ': option "' + path + '" ' + problem, level = -2
end

;+
; :Private:
;
; :Description:
;   Makes sure that a section of the configuration only has known options.
;
; :Arguments:
;   section: in, required, Hash<any>
;     Parsed section.
;   allowed: in, required, Array<String>
;     Names of the options that are valid for the section.
;   path: in, required, String
;     Name of the section for error messages, empty for the top level.
;
;-
pro sol_config::_CheckKeys, section, allowed, path
  compile_opt idl2, hidden
  foreach value, section, key do begin
    if (where(key eq allowed, /null) eq !null) then begin
      self._fail, (path eq '' ? '' : path + '.') + key, 'is not a known option. Valid options: ' + strjoin(allowed, ', ')
    endif
  endforeach
end

;+
; :Private:
;
; :Description:
;   Gets an object from the configuration, like the `run` section.
;
; :Returns: Hash<any>
;
; :Arguments:
;   parent: in, required, Hash<any>
;     Parsed section that holds the option.
;   key: in, required, String
;     Name of the option.
;   path: in, required, String
;     Full name of the option for error messages.
;
;-
function sol_config::_Section, parent, key, path
  compile_opt idl2, hidden
  if ~parent.hasKey(key) then return, orderedhash()
  if ~isa(parent[key], 'hash') then self._fail, path, 'must be an object'
  return, parent[key]
end

;+
; :Private:
;
; :Description:
;   Gets a boolean option.
;
; :Returns: Byte
;
; :Arguments:
;   parent: in, required, Hash<any>
;     Parsed section that holds the option.
;   key: in, required, String
;     Name of the option.
;   default: in, required, Boolean
;     Value if the option is not set.
;   path: in, required, String
;     Full name of the option for error messages.
;
;-
function sol_config::_Boolean, parent, key, default, path
  compile_opt idl2, hidden
  if ~parent.hasKey(key) then return, byte(default)
  if ~isa(parent[key], /boolean) then self._fail, path, 'must be true or false'
  return, byte(parent[key])
end

;+
; :Private:
;
; :Description:
;   Gets an option that must be one of a fixed set of strings.
;
; :Returns: String
;
; :Arguments:
;   parent: in, required, Hash<any>
;     Parsed section that holds the option.
;   key: in, required, String
;     Name of the option.
;   default: in, required, String
;     Value if the option is not set.
;   choices: in, required, Array<String>
;     Valid values, in lowercase.
;   path: in, required, String
;     Full name of the option for error messages.
;
;-
function sol_config::_Choice, parent, key, default, choices, path
  compile_opt idl2, hidden
  if ~parent.hasKey(key) then return, default
  value = parent[key]
  if ~isa(value, /string, /scalar) then begin
    self._fail, path, 'must be one of: ' + strjoin(choices, ', ')
  endif
  if (where(strlowcase(value) eq choices, /null) eq !null) then begin
    self._fail, path, 'has the invalid value "' + value + '", must be one of: ' + strjoin(choices, ', ')
  endif
  return, strlowcase(value)
end

;+
; :Private:
;
; :Description:
;   Gets an option that is a string or an array of strings.
;
; :Returns: List<String>
;
; :Arguments:
;   parent: in, required, Hash<any>
;     Parsed section that holds the option.
;   key: in, required, String
;     Name of the option.
;   default: in, required, Array<String>
;     Value if the option is not set.
;   path: in, required, String
;     Full name of the option for error messages.
;
;-
function sol_config::_Strings, parent, key, default, path
  compile_opt idl2, hidden
  result = list()
  if ~parent.hasKey(key) then begin
    if (n_elements(default) gt 0) then result.add, default, /extract
    return, result
  endif
  value = parent[key]
  case (1) of
    isa(value, /string, /scalar): result.add, value
    isa(value, 'list'): begin
      foreach item, value do begin
        if ~isa(item, /string, /scalar) then self._fail, path, 'must only contain strings'
        result.add, item
      endforeach
    end
    else: self._fail, path, 'must be a string or an array of strings'
  endcase
  return, result
end

;+
; :Private:
;
; :Description:
;   Reads the configuration file, validates it, and fills the properties
;   of the object. Missing options get their default values.
;
;-
pro sol_config::_Load
  compile_opt idl2, hidden

  ; parse the file, defaults are used for everything if it does not exist
  data = orderedhash()
  if file_test(self.file, /regular) then begin
    self.exists = 1b
    catch, err
    if (err ne 0) then begin
      catch, /cancel
      message, 'Invalid configuration file ' + self.file + ': ' + !error_state.MSG, level = -1
    endif
    data = json_parse(strjoin(Luna_Sol_Base_Obj.read_file(self.file), string(10b)))
    catch, /cancel
    if ~isa(data, 'hash') then begin
      message, 'Invalid configuration file ' + self.file + ': the top level must be an object', level = -1
    endif
  endif

  self._checkKeys, data, ['include', 'exclude', 'source', 'run', 'coverage', 'output', 'debug'], ''
  source = self._section(data, 'source', 'source')
  run = self._section(data, 'run', 'run')
  coverage = self._section(data, 'coverage', 'coverage')
  output = self._section(data, 'output', 'output')
  self._checkKeys, source, ['include', 'exclude'], 'source'
  self._checkKeys, run, ['isolation', 'stopOnFailure'], 'run'
  self._checkKeys, coverage, ['enabled', 'profile'], 'coverage'
  self._checkKeys, output, ['level', 'log'], 'output'

  self.include = self._strings(data, 'include', ['src/**/*.spec.pro'], 'include')
  self.exclude = self._strings(data, 'exclude', [], 'exclude')
  self.sourceInclude = self._strings(source, 'include', ['src/**/*.pro'], 'source.include')
  self.sourceExclude = self._strings(source, 'exclude', ['**/*.spec.pro'], 'source.exclude')
  self.isolation = self._choice(run, 'isolation', 'process', ['process', 'shared'], 'run.isolation')
  self.stopOnFailure = self._boolean(run, 'stopOnFailure', 0, 'run.stopOnFailure')
  self.coverageEnabled = self._boolean(coverage, 'enabled', 1, 'coverage.enabled')
  self.coverageProfile = self._boolean(coverage, 'profile', 0, 'coverage.profile')
  self.outputLevel = self._choice(output, 'level', 'normal', ['quiet', 'normal', 'verbose'], 'output.level')
  self.debug = self._boolean(data, 'debug', 0, 'debug')

  log = self._strings(output, 'log', ['idltest.log'], 'output.log')
  if (n_elements(log) ne 1) then self._fail, 'output.log', 'must be a single string'
  if (strtrim(log[0], 2) eq '') then self._fail, 'output.log', 'must not be empty'
  self.outputLog = strtrim(log[0], 2)
end

;+
; :Description:
;   Finds the test files that match the `include` and `exclude` options.
;
; :Returns: any
;
;-
function sol_config::FindTests
  compile_opt idl2, hidden
  return, sol_glob(self.dir, self.include.toArray(), self.exclude.toArray())
end

;+
; :Description:
;   Finds the source code files that match the `source.include` and
;   `source.exclude` options.
;
; :Returns: any
;
;-
function sol_config::FindSource
  compile_opt idl2, hidden
  if ~self.coverageEnabled then return, !null
  return, sol_glob(self.dir, self.sourceInclude.toArray(), self.sourceExclude.toArray())
end

;+
; :Description:
;   Get property method that works with the dot notation.
;
; :Keywords:
;   coverageenabled: out, optional, Boolean
;     True to track code coverage.
;   coverageprofile: out, optional, Boolean
;     True to also profile the source code.
;   debug: out, optional, Boolean
;     True to stop on errors.
;   dir: out, optional, String
;     Folder that contains the configuration file, which is the
;     folder that all paths in it are relative to.
;   exclude: out, optional, Array<String> | !null
;     Patterns for the test files to skip.
;   exists: out, optional, Boolean
;     True if the file exists, otherwise defaults are used.
;   file: out, optional, String
;     Fully-qualified path of the configuration file.
;   include: out, optional, Array<String> | !null
;     Patterns for the test files.
;   isolation: out, optional, String
;     `process` or `shared`.
;   logfile: out, optional, String
;     Fully-qualified path of the summary file.
;   outputlevel: out, optional, String
;     `quiet`, `normal`, or `verbose`.
;   outputlog: out, optional, String
;     Name of the summary file as written in the configuration.
;   quiet: out, optional, Int
;     Value of the `quiet` property of Sol and Luna for `outputLevel`.
;   sourceexclude: out, optional, Array<String> | !null
;     Patterns for the source code to skip.
;   sourceinclude: out, optional, Array<String> | !null
;     Patterns for the source code that is covered by the tests.
;   stoponfailure: out, optional, Boolean
;     True to stop after the first failed test file.
;   verbose: out, optional, Int
;     Value of the `verbose` property of Sol and Luna for `outputLevel`.
;
;-
pro sol_config::GetProperty, $
  file = file, dir = dir, exists = exists, $
  include = include, exclude = exclude, $
  sourceinclude = sourceInclude, sourceexclude = sourceExclude, $
  isolation = isolation, stoponfailure = stopOnFailure, $
  coverageenabled = coverageEnabled, coverageprofile = coverageProfile, $
  outputlevel = outputLevel, outputlog = outputLog, logfile = logFile, $
  quiet = quiet, verbose = verbose, debug = debug
  compile_opt idl2, hidden

  if arg_present(file) then file = self.file
  if arg_present(dir) then dir = self.dir
  if arg_present(exists) then exists = self.exists
  if arg_present(include) then include = self.include.toArray()
  if arg_present(exclude) then exclude = self.exclude.toArray()
  if arg_present(sourceInclude) then sourceInclude = self.sourceInclude.toArray()
  if arg_present(sourceExclude) then sourceExclude = self.sourceExclude.toArray()
  if arg_present(isolation) then isolation = self.isolation
  if arg_present(stopOnFailure) then stopOnFailure = self.stopOnFailure
  if arg_present(coverageEnabled) then coverageEnabled = self.coverageEnabled
  if arg_present(coverageProfile) then coverageProfile = self.coverageProfile
  if arg_present(outputLevel) then outputLevel = self.outputLevel
  if arg_present(outputLog) then outputLog = self.outputLog
  if arg_present(logFile) then begin
    isAbsolute = self.outputLog.startsWith('/') or self.outputLog.startsWith('\') or (strpos(self.outputLog, ':') eq 1)
    logFile = isAbsolute ? self.outputLog : self.dir + path_sep() + self.outputLog
  endif
  if arg_present(quiet) then quiet = (self.outputLevel eq 'quiet') ? 1 : 0
  if arg_present(verbose) then verbose = (self.outputLevel eq 'verbose') ? 1 : 0
  if arg_present(debug) then debug = self.debug
end

;+
; :Description:
;   Init method that loads the configuration file.
;
; :Returns: Sol_Config
;
; :Arguments:
;   file: in, required, String
;     Path to an `idltest.json` file. If the file does not exist, the
;     default options are used. The file is never created or modified.
;
;-
function sol_config::Init, file
  compile_opt idl2, hidden
  on_error, 2

  sol_validate, hash('file', ['required', 'string'])
  self.file = file_expand_path(file)
  self.dir = file_dirname(self.file)
  self._load

  return, 1
end

;+
; :Sol_Config:
;   coverageEnabled: Byte
;     True to track code coverage.
;   coverageProfile: Byte
;     True to profile the source code.
;   debug: Byte
;     True to stop on errors.
;   dir: String
;     Folder that contains the configuration file.
;   exclude: List<String>
;     Patterns for the test files to skip.
;   exists: Byte
;     True if the configuration file exists on disk.
;   file: String
;     Fully-qualified path of the configuration file.
;   include: List<String>
;     Patterns for the test files.
;   isolation: String
;     Either `process` or `shared`.
;   outputLevel: String
;     One of `quiet`, `normal`, or `verbose`.
;   outputLog: String
;     Name of the summary file.
;   sourceExclude: List<String>
;     Patterns for the source code to skip.
;   sourceInclude: List<String>
;     Patterns for the source code covered by the tests.
;   stopOnFailure: Byte
;     True to stop after the first failed test file.
;
;-
pro sol_config__define
  compile_opt idl2, hidden
  struct = {Sol_Config, $
    inherits IDL_Object, $
    file: '', $
    dir: '', $
    exists: 0b, $
    include: list(), $
    exclude: list(), $
    sourceInclude: list(), $
    sourceExclude: list(), $
    isolation: '', $
    stopOnFailure: 0b, $
    coverageEnabled: 0b, $
    coverageProfile: 0b, $
    outputLevel: '', $
    outputLog: '', $
    debug: 0b $
    }
end
