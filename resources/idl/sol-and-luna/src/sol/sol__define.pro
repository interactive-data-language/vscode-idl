;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Private:
;
; :Description:
;    Object definition for the Sol test runner.
;
;    Runs test files created with Luna. See the README for details.
;
; :Author: Zachary Norman - GitHub: [znorman-harris](https://github.com/znorman-harris)
;-

;+
; :Private:
;
; :Description:
;   Method that saves detailed information about the
;   different tests that were run and their coverage.
;   The log file which is generated will
;
; :Arguments:
;   file: in, optional, String
;     Specify a fully-qualified filepath to disk where
;     you want the output to be sent. If not provided, `idltest.log`
;     in the test directory is used.
;
;-
pro sol::GenerateTestSummary, file
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; validate our input and default to the log in the test directory
  if (n_elements(file) eq 0) then begin
    file = self.dir + path_sep() + 'idltest.log'
  endif else begin
    sol_validate, hash('file', ['string'])
  endelse

  ; get our test stats
  stats = self.testStats

  ; print to disk ONLY
  ; this looks bad when exported to the console/terminal/command prompt
  self._print, '--------------------------------------------------------', /space_before, logfile = file, /clear_log, /log_only
  self._print, 'Test summary for ' + strtrim(stats['nTests'], 2) + ' tests - ' + ((self.passed) ? 'PASSED' : '%FAILED%'), logfile = file, /log_only
  self._print, '--------------------------------------------------------', logfile = file, /log_only
  self._print, self._getTestSummary(), logfile = file, /implied_print, /log_only
  self._print, self._getTestAnalysis(self.dir, /no_update), logfile = file, /log_only
  self._print, '', /log_only
  self._print, '--------------------------------------------------------', /log_only
  self._print, 'End test summary', /log_only
  self._print, '--------------------------------------------------------', /log_only
  self._print, '', /log_only
end

;+
; :Private:
;
; :Description:
;   Routine that generates the strings for
;   creating a the report.
;
; :Returns: Array<String>
;
;-
function sol::_GetTestSummary
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; init list to hold all of our strings
  strings = list()

  ; add information on our global stats
  stats = self.testStats
  strings.add, ''
  strings.add, 'Number of tests failed  : ' + strtrim(stats['nFailed'], 2)
  strings.add, 'Number of tests passed  : ' + strtrim(stats['nPassed'], 2)
  strings.add, 'Number of tests         : ' + strtrim(stats['nTests'], 2)
  strings.add, ''

  ; lets make a table with number of tests passed/failed in each file
  ; first, get longest filename relative to self.dir
  len = 0
  foreach file, self.testInfo.keys() do len >= strlen(file.replace(self.dir, ''))

  ; make sure the length is at least 4 characters
  len >= 4

  ; specify the number of spaces between our columns
  nspaces = 5
  spaces = strtrim(nspaces, 2) + 'X'

  ; make a buffer for our filename
  buffer = (len gt 4) ? string(replicate(32b, len - 4)) : ''

  ; make the table!
  if (len gt 0) then begin
    ; make the printing format
    format = strjoin(['(A' + strtrim(len, 2), ', I10', ', I10)'], ', ' + spaces)
    formatHeader = strjoin(['(A' + strtrim(len, 2), ', A10', ', A10)'], ', ' + spaces)

    ; populate with values!
    strings.add, 'High level test information by file:'
    strings.add, ''
    strings.add, string('File' + buffer, 'Total', 'Failed', format = formatHeader)
    foreach stats, self.testInfo, file do begin
      ; get the name of the file that we want to print
      pName = (file.replace(self.dir + path_sep(), '')).replace(path_sep(), '/')

      ; add a buffer so that it lines up with the left
      nameBuffer = strlen(pName) ne len ? string(replicate(32b, len - strlen(pName))) : ''

      ; add the awesome string!
      strings.add, string(pName + nameBuffer, stats['nTests'], stats['nFailed'], format = format)
    endforeach
  endif

  ; add an extra space
  strings.add, ''

  ; return our strings - will always have them
  return, strings.toArray()
end

;+
; :Private:
;
; :Description:
;   Sets defaults for properties.
;
;-
pro sol::_Init
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; set defaults
  self.passed = 1
  self.coverage = orderedhash()
  self.coverageStats = orderedhash()
  self.testInfo = orderedhash()
  self.testStats = orderedhash()
  self.results = orderedhash()
  self.files = list()
  self.testSource = list()
end

;+
; :Description:
;   Init method for the Sol test runner. Locates the test files and
;   the source files to check for code coverage using the options in
;   an `idltest.json` configuration file (see `sol_config`). Without a
;   configuration file, all `.spec.pro` files in `dir` are run.
;
; :Returns: Sol
;
; :Arguments:
;   dir: in, optional, String
;     Specify the directory that contains the test files. If not
;     specified, the directory of the file that created the object is used.
;
; :Keywords:
;   _ref_extra: in, optional, any
;     Any other object properties can be specified as keywords
;     and are set on the object upon creation. If any are specified,
;     the quiet, verbose, and debug options in the configuration
;     file are ignored.
;   config_file: in, optional, String
;     Specify the name or path of an `idltest.json` file. If not
;     specified, `idltest.json` in `dir` is used if it exists.
;   config_path_full: in, optional, Boolean
;     Set this keyword if `CONFIG_FILE` is a fully-qualified path
;     instead of a path relative to the file that called this routine.
;   test_files: in, optional, Array<String>
;     Specify the test files to run instead of searching `dir`.
;   test_source: in, optional, Array<String>
;     Specify the source files to use for code coverage.
;
;-
function sol::Init, dir, $
  config_file = config_file, $
  config_path_full = config_path_full, $
  test_files = files, $
  test_source = test_source, $
  _ref_extra = extra
  compile_opt idl2, hidden

  ; set all extra properties that may have been passed in
  self.setProperty, _extra = extra
  if ~self.debug then on_error, 2

  ; if no directory, then use dir we were called from
  if ~arg_present(dir) then begin
    scope = scope_traceback(/structure)
    if (n_elements(scope) ge 1) then dir = file_dirname(scope[-2].filename)
  end

  ; validate input
  sol_validate, hash('dir', ['required', 'string'])
  self.dir = dir

  ; get the traceback for where we were called from
  trace = scope_traceback(/structure)
  sourcefile = trace[-2].FILENAME
  sourcedir = file_dirname(sourcefile)

  ; init defaults
  self._init

  ; check if we have a config file specified
  if keyword_set(config_file) then begin
    sol_validate, hash('config_file', ['string', 'required'])

    ; build the path to our config file if not specifed
    if ~keyword_set(config_path_full) then begin
      configFile = sourcedir + path_sep() + config_file

      ; make sure that we have consistent path separators for windows, linux, mac
      configFile = configFile.replace('\', path_sep())
      configFile = configFile.replace('/', path_sep())
    endif else begin
      configFile = config_file
    endelse

    ; make sure that the file exists
    if ~file_test(configFile) then begin
      message, 'Sol configuration file specified, but does not exist! Expected file:' + $
        string(10b) + configFile, level = -1
    endif

    ; create our configuration object
    self.config = sol_config(configFile)
  endif else begin
    ; use the configuration file next to the tests, or the defaults
    self.config = sol_config(self.dir + path_sep() + 'idltest.json')
  endelse

  ; apply the configuration, explicit keywords for quiet/verbose/debug win
  self.config.getProperty, quiet = cfgQuiet, verbose = cfgVerbose, debug = cfgDebug, $
    isolation = isolation, stoponfailure = stopOnFailure, dir = cfgDir
  if (n_elements(extra) eq 0) then begin
    self.quiet = cfgQuiet
    self.verbose = cfgVerbose
    self.debug = cfgDebug
  endif
  self.shared = isolation eq 'shared'
  self.stopOnFailure = stopOnFailure
  if self.debug and self.config.exists then self.bridge_debug_log = cfgDir + path_sep() + 'sol.log'

  ; check if we specified our test source
  if keyword_set(test_source) then begin
    sol_validate, hash('test_source', ['required', 'string', 'array'])
    self.testSource = list(test_source, /extract)
  endif else begin
    ; search for PRO files to check for code coverage
    if self.config.exists then begin
      sourceFiles = self.config.findSource()
      if (sourceFiles ne !null) then self.testSource = list(sourceFiles, /extract)
    endif
  endelse

  ; validate our input if needed
  if ~keyword_set(files) then begin
    ; search for files, which defaults to all spec files in the directory without a configuration
    if self.config.exists then begin
      files = self.config.findTests()
    endif else begin
      files = sol_glob(self.dir, '**/*.spec.pro')
    endelse
    if (files eq !null) then begin
      message, 'No test files found in directory "' + self.dir + '" that match the include patterns', level = -1
    endif
    self.files = list(files, /extract)
  endif else begin
    ; make sure that every file exists
    idxOk = where(file_test(files), countOk)
    if (countOk eq 0) then begin
      message, 'FILES specified, but no files exist on disk!', level = -1
    endif
    self.files = list(files[idxOk], /extract)
  endelse

  ; set property for where the task engine is
  ; check if windows or not
  if (!version.OS eq 'Win32') then begin
    self.taskEngine = !dir + path_sep() + 'bin' + path_sep() + 'bin.' + !version.arch + path_sep() + 'idltaskengine.bat'
  endif else begin
    self.taskEngine = !dir + path_sep() + 'bin' + path_sep() + 'idltaskengine'
  endelse

  ; validate our test files
  self._validateTestFiles

  return, 1
end

;+
; :Private:
;
; :Description:
;   Routine that combines the code coverage from the
;   luna objects of a test file with the coverage of
;   all the other files that were processed.
;
; :Arguments:
;   coverageList: in, required, List<any>
;     List of the coverage hashes to combine.
;
;-
pro sol::_JoinCoverage, coverageList
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; process all of our data!
  foreach coverage, coverageList, idx do begin
    ; process our test coverage!
    foreach routineHash, coverage, file do begin
      ; check if we have coverage already
      if ~self.coverage.hasKey(file) then begin
        foreach coverageInfo, routineHash, routineName do begin
          if (routineName eq '$coverage') then continue
          if coverageInfo.hasKey('hits') then self.profile = 1
        endforeach
        self.coverage[file] = routineHash
      endif else begin
        ; process each routine and join them accordingly
        foreach coverageInfo, routineHash, routineName do begin
          if (routineName eq '$coverage') then continue

          ; get the reference hash
          reference = self.coverage[file, routineName]

          ; save list of indices to remove
          remove = list()

          ; process each line we have covered
          foreach line, coverageInfo['executed'], lIdx do begin
            ; check if our line is in the not-executed list
            rIdx = reference['not-executed'].where(line)
            if (rIdx ne !null) then remove.add, rIdx

            ; add to our executed line if not present
            if (reference['executed'].where(line) eq !null) then reference['executed'].add, line
          endforeach

          ; check if we have anything to remove
          if (n_elements(remove) gt 0) then begin
            reference['not-executed'].remove, remove.toArray()
          endif

          ; check for profile information
          if coverageInfo.hasKey('hits') then begin
            ; check if we need to combine information
            if reference.hasKey('hits') then begin
              ; set profile information
              reference['hits'] += coverageInfo['hits']
              reference['time'] += coverageInfo['time']
              reference['time+sub'] += coverageInfo['time+sub']
              reference['time/hit'] = (reference['hits'] gt 0) ? reference['time'] / reference['hits'] : 0d
              reference['time+sub/hit'] = (reference['hits'] gt 0) ? reference['time+sub'] / reference['hits'] : 0d
            endif else begin
              ; set profile information
              reference['hits'] = coverageInfo['hits']
              reference['time'] = coverageInfo['time']
              reference['time/hit'] = coverageInfo['time/hit']
              reference['time+sub'] = coverageInfo['time+sub']
              reference['time+sub/hit'] = coverageInfo['time+sub/hit']
            endelse

            ; save our profile flag
            self.profile = 1
          endif

          ; save our changes
          self.coverage[file, routineName] = reference
        endforeach
      endelse
    endforeach
  endforeach

  ; check if we had profile information and add to all our items
  if (self.profile) and ~self.coverage.isEmpty() then begin
    foreach routineHash, self.coverage, file do begin
      foreach coverageInfo, routineHash, routineName do begin
        if ~coverageInfo.hasKey('hits') then begin
          coverageInfo['hits'] = 0l
          coverageInfo['time'] = 0d
          coverageInfo['time/hit'] = 0d
          coverageInfo['time+sub'] = 0d
          coverageInfo['time+sub/hit'] = 0d
        endif
      endforeach
    endforeach
  endif

  ; update our code coverage
  self._getCodeCoverage, /only_update_stats
end

;+
; :Description:
;   Function that runs the tests and returns a
;   simple true or false if everything passed. Returns
;   true if all tests pass.
;
; :Returns: Boolean
;
; :Keywords:
;   filter: in, optional, String | Array<String>
;     Only run the test files that match at least one of these glob patterns,
;     which are matched against the path relative to the test directory (see
;     `sol_glob`). A pattern without `*`, `?`, or `/` matches any file with that
;     text in its path, so `FILTER = 'strings'` runs every spec with `strings` in its path.
;   no_restart: in, optional, Boolean
;     If set, the same IDL-IDLBridge process will be used to run each task.
;     This is also the case when `run.isolation` is `shared` in the
;     configuration file.
;
;     Be ready for challenging debugging with many tests. There wil likely
;     be odd errors from variables that are contants/objects/static methods.
;
;     Can greatly speed up tests, but adds complexity for writing the tests.
;
;-
function sol::RunTests, no_restart = no_restart, filter = filter
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; find the files that we need to run
  files = self._filterFiles(filter)
  nFiles = n_elements(files)
  if self.shared then no_restart = 1

  ; forget the results of any previous run
  self.results = orderedhash()
  self.testInfo = orderedhash()
  self.passed = 1

  ; alert user
  self._print, 'Running tests...'

  ; get the time we started
  tStart = systime(/seconds)

  ; process each file
  obd = obj_new()
  foreach file, files, fIdx do begin
    ; make sure we dont have an empty string
    if (file eq '') then continue
    ; run the file and keep the result
    result = self._runFile(file, obd, no_restart = no_restart)
    self._record, result

    ; print what happened
    self._printFileResult, result, fIdx + 1, nFiles
    ; stop after the first failure if requested
    if self.stopOnFailure and ~result.passed then begin
      self._print, 'Stopping after the first failed test file (run.stopOnFailure).'
      break
    endif
  endforeach

  ; clean up our child process if we are sharing it
  self._closeBridge, obd

  ; print the summary in the same style as Luna
  stats = self.testStats
  nTests = n_elements(stats) gt 0 ? stats['nTests'] : 0
  nFailed = n_elements(stats) gt 0 ? stats['nFailed'] : 0
  counts = strtrim(nTests, 2) + ' total'
  if (nTests - nFailed gt 0) then counts = strtrim(nTests - nFailed, 2) + ' passed, ' + counts
  if (nFailed gt 0) then counts = strtrim(nFailed, 2) + ' failed, ' + counts
  elapsed = string(systime(/seconds) - tStart, format = '(F0.1)')
  self._print, ['', self.passed ? 'PASS' : 'FAIL', 'Tests:   ' + counts, 'Time:    ' + strtrim(elapsed, 2) + ' s', ''], /implied_print

  ; return our status
  return, self.passed
end

;+
; :Private:
;
; :Description:
;   Gets the path to show for a test file. It is relative to the folder
;   with the `idltest.json` file when there is one, otherwise it is the
;   full path.
;
; :Returns: String
;
; :Arguments:
;   file: in, required, String
;     Fully-qualified path to a file.
;
;-
function sol::_DisplayPath, file
  compile_opt idl2, hidden

  path = file.replace('\', '/')
  if ~self.config.exists then return, path

  self.config.getProperty, dir = root
  root = root.replace('\', '/')
  if ~root.endsWith('/') then root += '/'
  if (strpos(strlowcase(path), strlowcase(root)) eq 0) then path = strmid(path, strlen(root))
  return, path
end

;+
; :Private:
;
; :Description:
;   Prints the result of one test file. A file that passes gets a single
;   line, other files also get the error and where it happened.
;
; :Arguments:
;   result: in, required, Sol_Result
;     Result of running the file.
;   index: in, required, Number
;     Position of the file, starting at 1.
;   total: in, required, Number
;     Number of files being run.
;
;-
pro sol::_PrintFileResult, result, index, total
  compile_opt idl2, hidden

  position = strtrim(index, 2) + ' of ' + strtrim(total, 2)
  display = ' (' + self._displayPath(result.file) + ')'

  if (result.status eq 'passed') then begin
    self._print, '  Processed file ' + position + ' in ' + string(result.duration, format = '(F0.1)') + ' s' + display
    return
  endif

  lines = ['  %' + (result.status eq 'failed' ? 'FAILED' : 'ERROR') + '% processing file ' + position + display]
  if (result.status eq 'failed') then begin
    foreach failure, result.failures do begin
      lines = [lines, '    Error:', '      ' + failure['message'], '    Location:', '      ' + failure['location']]
    endforeach
    if (result.failures.length eq 0) then lines = [lines, '    Error:', '      ' + strtrim(result.nFailed, 2) + ' of ' + strtrim(result.nTests, 2) + ' tests failed']
  endif else begin
    lines = [lines, '    Error:', '      ' + strsplit(result.message, string(10b), /extract, /regex), '    Location:', '      ' + result.file]
  endelse
  self._print, strjoin(lines, string(10b))
end
;+
; :Description:
;   Runs a single test file in its own child process and
;   adds it to the results and the code coverage of this object.
;
; :Returns: Sol_Result
;
; :Arguments:
;   file: in, required, String
;     Fully-qualified path to the test file. The file does not need
;     to be one of the files that this object was created with.
;
;-
function sol::RunFile, file
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  sol_validate, hash('file', ['required', 'string'])

  obd = obj_new()
  result = self._runFile(file_expand_path(file), obd)
  self._closeBridge, obd
  self._record, result

  self._print, '  ' + file_basename(file) + ': ' + result.status
  if (result.status eq 'error') then self._print, '    ' + result.message, /warning
  return, result
end

;+
; :Private:
;
; :Description:
;   Runs a test file and returns what happened. Problems with the
;   file are returned in the result instead of raising an error.
;
; :Returns: Sol_Result
;
; :Arguments:
;   file: in, required, String
;     Fully-qualified path to the test file.
;   obd: bidirectional, optional, IDL_IDLBridge
;     Child process to use. A new one is created if it is not valid.
;     It is only still valid afterwards when `NO_RESTART` is set and
;     the file ran without an error.
;
; :Keywords:
;   no_restart: in, optional, Boolean
;     If set, the child process is left open for the next file.
;
;-
function sol::_RunFile, file, obd, no_restart = no_restart
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  result = sol_result(file)
  tStart = systime(/seconds)

  catch, err
  if (err ne 0) then begin
    catch, /cancel
    msg = !error_state.msg
    self._closeBridge, obd
    result.setProperty, status = 'error', passed = 0b, message = msg
  endif else begin
    self._executeFile, file, obd, result, no_restart = no_restart
  endelse
  catch, /cancel

  result.setProperty, duration = systime(/seconds) - tStart
  return, result
end

;+
; :Private:
;
; :Description:
;   Compiles and runs a test file in a child process and reads the results
;   from the `luna` objects that the file created. Raises an error if the
;   file cannot be compiled, cannot be run, or does not create a `luna` object.
;
; :Arguments:
;   file: in, required, String
;     Fully-qualified path to the test file.
;   obd: bidirectional, optional, IDL_IDLBridge
;     Child process to use. A new one is created if it is not valid.
;   result: in, required, Sol_Result
;     Result to update with what happened.
;
; :Keywords:
;   no_restart: in, optional, Boolean
;     If set, the child process is left open for the next file.
;
;-
pro sol::_ExecuteFile, file, obd, result, no_restart = no_restart
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  if ~file_test(file) then begin
    message, 'Specified file does not exist! File: ' + string(10b) + file, /noname
  endif

  ; create a new bridge or reuse the existing one
  if ~(keyword_set(no_restart) and obj_valid(obd)) then begin
    self._closeBridge, obd
    obd = self._getBridgeProcess()
  endif

  ; compile the code
  obd.execute, '.compile -v ''' + file + ''''

  ; alert user if there was an error compiling
  state = self._getBridgeErrorState(obd)
  if keyword_set(state.MSG) then begin
    message, 'Error while compiling file: ' + state.MSG, /noname
  endif

  ; compile again - something weird happens when we get error state from the child process
  ; and the source for our main program is empty
  obd.execute, '.compile -v ''' + file + ''''
  obd.execute, 'catch, /CANCEL'

  ; luna objects register themselves, so forget the ones from any previous file
  obd.execute, '!NULL = luna_registry("reset")'

  ; print some strings to the IDL_IDLBridge for nicer logs
  obd.execute, 'print'
  obd.execute, 'print, "Running test for file ' + file + '"'
  obd.execute, 'print'

  ; run the main level program in our file
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    msg = !error_state.msg
    if ~self._isIgnorableError(msg) then begin
      obd.getProperty, output = log
      message, 'Error while running tests: ' + msg + string(10b) + 'See "' + log + '" for more details.', /noname
    endif
  endif else begin
    obd.execute, '.go'
  endelse
  catch, /cancel

  ; ask the child process for the results of all of the luna objects
  obd.execute, 'sol_json = luna_registry("results")'
  data = json_parse(obd.getVar('sol_json'))
  if (n_elements(data) eq 0) then begin
    message, 'No luna object found when executing tests.', /noname
  endif

  ; combine the results of the objects in this file
  nTests = 0l
  nFailed = 0l
  passed = 1b
  coverageList = list()
  foreach item, data do begin
    nTests += item['nTests']
    nFailed += item['nFailed']
    passed = passed and (item['passed'] ne 0)
    coverageList.add, item['coverage']
    foreach location, item['failures'], fIdx do begin
      result.failures.add, orderedhash('message', item['failureMessages', fIdx], 'location', location)
    endforeach
  endforeach
  self._joinCoverage, coverageList

  result.setProperty, ntests = nTests, nfailed = nFailed, passed = passed, status = passed ? 'passed' : 'failed'

  ; just double check that error states are reset for the next file
  if keyword_set(no_restart) then obd.execute, 'message, /RESET'
  if ~keyword_set(no_restart) then self._closeBridge, obd
end

;+
; :Private:
;
; :Description:
;   Destroys a child process and removes its log file unless the
;   log is being kept for debugging.
;
; :Arguments:
;   obd: bidirectional, optional, IDL_IDLBridge
;     Child process to close. Does nothing if it is not valid.
;
;-
pro sol::_CloseBridge, obd
  compile_opt idl2, hidden
  if ~obj_valid(obd) then return

  obd.getProperty, output = logfile
  obj_destroy, obd
  if (self.bridge_debug_log eq '') then file_delete, logfile, /allow_nonexistent, /quiet
end

;+
; :Private:
;
; :Description:
;   Checks if an error message from the child process is one of the
;   known messages that are raised in the parent process for errors the
;   child process does not report as failures, such as ENVI objects being
;   cleaned up while the process closes.
;
; :Returns: Boolean
;
; :Arguments:
;   msg: in, required, String
;     Error message to check.
;
;-
function sol::_IsIgnorableError, msg
  compile_opt idl2, hidden

  ignore = [ $
    'idl_idlbridge error: attempt to call undefined procedure: ''enviparameter', $
    'idl_idlbridge error: variable is undefined: <no name>.', $
    'idl_idlbridge error: envipersistableobject::save: uri must be specified.' $
    ]

  compare = strlowcase(msg)
  foreach text, ignore do begin
    if compare.contains(text) then return, 1b
  endforeach
  return, 0b
end

;+
; :Private:
;
; :Description:
;   Saves the result of a test file and updates the overall
;   test statistics and the passing flag.
;
; :Arguments:
;   result: in, required, Sol_Result
;     Result to save.
;
;-
pro sol::_Record, result
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  self.results[result.file] = result
  self.testInfo[result.file] = orderedhash( $
    'nPassed', result.nTests - result.nFailed, 'nFailed', result.nFailed, 'nTests', result.nTests)

  ; update the totals from all of the results
  nTests = 0l
  nFailed = 0l
  passed = 1b
  foreach item, self.results do begin
    nTests += item.nTests
    nFailed += item.nFailed
    passed = passed and item.passed
  endforeach
  self.testStats = orderedhash('nPassed', nTests - nFailed, 'nFailed', nFailed, 'nTests', nTests)
  self.passed = passed
end

;+
; :Private:
;
; :Description:
;   Gets the test files that match the filter.
;
; :Returns: Array<String>
;
; :Arguments:
;   filter: in, optional, String | Array<String>
;     Glob patterns (see `sol_glob`). A pattern without any `*`, `?`, or `/`
;     matches test files that have the text anywhere in their path.
;     All test files are returned if not specified.
;
;-
function sol::_FilterFiles, filter
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  files = self.files.toArray()
  if (n_elements(filter) eq 0) then return, files
  sol_validate, hash('filter', 'string')

  ; match against paths relative to our directory and the full paths
  norm = files.replace('\', '/')
  prefix = (file_expand_path(self.dir)).replace('\', '/') + '/'
  relative = norm.replace(prefix, '')
  fold = (!version.os_family eq 'Windows')

  keep = bytarr(n_elements(files))
  foreach pattern, [filter] do begin
    glob = (strtrim(pattern, 2)).replace('\', '/')
    if (glob eq '') then continue
    if (strpos(glob, '*') eq -1) and (strpos(glob, '?') eq -1) and (strpos(glob, '/') eq -1) then begin
      glob = '**/*' + glob + '*'
    endif
    regex = sol_glob_regex(glob)
    keep OR= stregex(relative, regex, /boolean, fold_case = fold) or stregex(norm, regex, /boolean, fold_case = fold)
  endforeach

  idx = where(keep, count)
  if (count eq 0) then begin
    message, 'No test files match the filter: ' + strjoin([filter], ', ')
  endif
  return, files[idx]
end

;+
; :Private:
;
; :Description:
;   Gets a path relative to the test directory that uses `/` as the separator.
;
; :Returns: String
;
; :Arguments:
;   file: in, required, String
;     Path to convert. Returned with only the separators changed if it is
;     not in the test directory.
;
;-
function sol::_RelativePath, file
  compile_opt idl2, hidden

  prefix = (file_expand_path(self.dir)).replace('\', '/') + '/'
  norm = file.replace('\', '/')
  return, norm.startsWith(prefix, /fold_case) ? strmid(norm, strlen(prefix)) : norm
end

;+
; :Description:
;   Writes the results of the last run to disk in a format
;   that other tools, such as continuous integration systems, can read.
;
;   The `json` format has the overall `passed` flag, the `summary` counts,
;   the code `coverage` percentage, and an item in `files` for each test file.
;
;   The `junit` format has a single test suite with a test case for each
;   test file, which is considered failed if any test in the file failed and
;   errored if the file could not be run.
;
; :Arguments:
;   file: in, required, String
;     Fully-qualified path of the file to write.
;
; :Keywords:
;   format: in, optional, String
;     Either `json` or `junit`. If not specified, a file that
;     ends in `.xml` is written as `junit`.
;
;-
pro sol::WriteReport, file, format = format
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  sol_validate, hash('file', ['required', 'string'])
  if (n_elements(format) eq 0) then format = (strlowcase(file)).endsWith('.xml') ? 'junit' : 'json'

  results = self.results.values()

  case strlowcase(format) of
    'json': begin
      files = list()
      foreach result, results do begin
        item = result.toHash()
        item['file'] = self._relativePath(item['file'])
        files.add, item
      endforeach
      report = orderedhash( $
        'passed', self.passed ? 1 : 0, $
        'summary', self.testStats, $
        'files', files)
      if self.coverageStats.hasKey('coverage') then report['coverage'] = self.coverageStats['coverage']
      strings = json_serialize(report)
    end

    'junit': begin
      nFailures = 0l
      nErrors = 0l
      time = 0d
      cases = list()
      foreach result, results do begin
        time += result.duration
        name = sol_xml_escape(self._relativePath(result.file))
        body = ''
        case result.status of
          'failed': begin
            nFailures++
            body = '      <failure message="' + strtrim(result.nFailed, 2) + ' of ' + strtrim(result.nTests, 2) + ' tests failed"/>'
          end
          'error': begin
            nErrors++
            body = '      <error message="' + sol_xml_escape(result.message) + '"/>'
          end
          else:
        endcase
        cases.add, '    <testcase classname="sol" name="' + name + '" time="' + strtrim(result.duration, 2) + '"' + (body eq '' ? '/>' : '>')
        if (body ne '') then cases.add, [body, '    </testcase>'], /extract
      endforeach

      counts = 'tests="' + strtrim(n_elements(results), 2) + '" failures="' + strtrim(nFailures, 2) + $
        '" errors="' + strtrim(nErrors, 2) + '" time="' + strtrim(time, 2) + '"'
      strings = ['<?xml version="1.0" encoding="UTF-8"?>', $
        '<testsuites ' + counts + '>', $
        '  <testsuite name="sol" ' + counts + '>', $
        cases.toArray(), $
        '  </testsuite>', $
        '</testsuites>']
    end

    else: message, 'Unknown report format "' + format + '", expected "json" or "junit".'
  endcase

  self.write_file, file, strings
end

;+
; :Private:
;
; :Description:
;   Compiles the source files used for code coverage in a child
;   process, finds the routines they contain, and initializes the
;   code coverage information for them.
;
;-
pro sol::_ValidateTestFiles
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; initialize our code coverage information
  if (n_elements(self.testSource) gt 0) then begin
    ; get a bridge process
    obd = self._getBridgeProcess()

    ; clean old results
    self.coverage = orderedhash()

    ; validate that our test files all compile correctly
    filenames = self.testSource.toArray()
    foreach file, filenames do begin
      ; compile the code
      obd.execute, '.compile -v ''' + file + ''''

      ; check state after compiling
      state = self._getBridgeErrorState(obd)

      ; alert user if there was an error
      if keyword_set(state.MSG) then begin
        print, state, /implied_print
        message, 'Error while compiling file. See above for more details. File:' + $
          string(10b) + file, level = -1
      endif

      ; resolve routine here so that we get code coverage
      ; skip our own definition because recompiling it would reset this session
      if ~file.contains('sol__define') then begin
        resolve_routine, file_basename(file, '.pro'), /either, /compile_full_file, /quiet
      endif

      ; get the routines in our files
      obd.execute, 'info = json_serialize(orderedhash("procedures", routine_info(/SOURCE), "functions", routine_info(/FUNCTIONS, /SOURCE)))'
      allRoutines = json_parse(obd.getVar('info'))

      ; process our data
      foreach routineInfo, allRoutines, type do begin
        ; check if we are a function or procedure
        add = type eq 'procedures' ? '' : '()'

        ; check if we have content
        if (total(routineInfo eq '') eq n_elements(routineInfo)) then continue

        ; check which routines we need to get code coverage for
        foreach routine, routineInfo, idx do begin
          ; skip main level program
          if (routine['NAME'] eq '$MAIN$') then continue

          ; check if we have a routine in one of our files
          idxMatch = where(routine['PATH'] eq filenames, countMatch)
          if (countMatch gt 0) then begin
            ; check if we have a key already
            if ~self.coverage.hasKey(routine['PATH']) then begin
              self.coverage[routine['PATH']] = orderedhash()
            endif

            ; init data structure
            self.coverage[routine['PATH'], strlowcase(routine['NAME'])] = orderedhash('coverage', 0.0, 'executed', list(), 'not-executed', list())
          endif
        endforeach
      endforeach
    endforeach

    ; get the log file
    obd.getProperty, output = logfile

    ; clean up child process
    obj_destroy, obd

    ; clean up log unless we are keeping it for debugging
    if (self.bridge_debug_log eq '') then file_delete, logfile, /allow_nonexistent, /quiet

    ; let us get our initial code coverage
    self._getCodeCoverage
  endif
end

;+
; :Sol:
;   config: sol_config
;     Configuration that was loaded for this run
;   dir: String
;     Directory to search for files if they arent specified
;   files: List<String>
;     Files with tests in them
;   passed: Boolean
;     True if all tests have passed
;   results: OrderedHash<Sol_Result>
;     Result of each test file that was run, by file path
;   shared: Boolean
;     True to reuse one child process for all test files
;   stopOnFailure: Boolean
;     True to stop after the first failed test file
;   taskEngine: String
;     Location of the IDL task engine
;   testInfo: Hash<any>
;     Like coverage, but for test information
;   testSource: List<String>
;     Regular PRO code files that we are testing
;   testStats: Hash<any>
;     Like coverage stats, but for tests
;
;-
pro sol__define
  compile_opt idl2, hidden
  struct = {Sol, $
    inherits Luna_Sol_Base_Obj, $
    taskEngine: '', $ ; where is the task engine located
    shared: 0b, $
    stopOnFailure: 0b, $
    config: obj_new(), $
    passed: !false, $
    testInfo: orderedhash(), $ ; like coverage, but for test information
    testStats: orderedhash(), $ ; like coverage stats, but for tests
    results: orderedhash(), $ ; result of each test file by path
    dir: '', $ ; directory to search for files if they arent specified
    files: list(), $ ; files with tests in them
    testSource: list() $ ; regular PRO code files that we are testing
    }
end
