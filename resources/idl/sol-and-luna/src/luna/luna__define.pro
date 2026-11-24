;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
;
;   Object definition for the Luna tester object. Luna is the object that creates
;   and runs tests while Sol is the test orchestrator and executes the different
;   tests.
;
;   See ![FILE](./../README.md) for more details.
;
;   There are a few ways to create the object which all achieve similar results. See
;   the init method for full details on creating the object. Ideally you want to use
;   a config file as a standalone test or as part of an package built with the
;   IDL Package Creator. The reason for this is that, when you create the Luna
;   object, it will verify that every piece of PRO code in a repository compiles
;   before running tests. This ensures that files without tests will cause failure
;   if they have syntax errors and this comes from lessons learned the hard way!
;
; :Examples:
;
;   Here are a few examples for how you can instantiate the test object. See
;   README.md for details on how to write the tests. The Luna object can only
;   be created from a main level program.
;
;       ;easiest way to create the object with no options
;       l = luna()
;
;       ;can also specify the path to a config file which works
;       ;cross-platform and is useful for configuring multiple
;       ;tests to perform the same way
;       l = luna(CONFIG_FILE = './idltest.json')
;
;       ;if the tests live under a folder with an idltest.json
;       ;file then it is found automatically
;
;
;
;-

;+
; :Description:
;   Method that returns if we have passed or not as true/false.
;
; :Returns: Boolean
;
;-
function luna::getStatus
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  return, self.passed
end

;+
; :Description:
;   Procedure method that checks status and raises an
;   expection if we have failed any tests.
;
;-
pro luna::checkStatus
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; have we failed?
  if ~self.passed then message, 'Tests failed! See above for details.', level = -1
end

;+
; :Private:
;
; :Description:
;   Simple method that sets failure, called from children.
;
;-
pro luna::_failed
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; update self
  self.passed = 0
end

;+
; :Description:
;   Method that prints test summary to the IDL Console for
;   quick visualization of how the overall test process went.
;
;   Calling this method also generates a detailed information
;   for the log file if logging was set when the luna test
;   object was initialized.
;
;-
pro luna::generateTestSummary
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; get our test summary which will grab the number
  ; of tests that we ran
  summary = self._getTestSummary()

  ; get the test analysis
  analysis = self._getTestAnalysis(self.dir)

  ; build the summary, details of each failure were printed as the tests ran
  counts = strtrim(self.nTests, 2) + ' total'
  if (self.nTests - self.nFailed gt 0) then counts = strtrim(self.nTests - self.nFailed, 2) + ' passed, ' + counts
  if (self.nFailed gt 0) then counts = strtrim(self.nFailed, 2) + ' failed, ' + counts
  elapsed = string(systime(/seconds) - self.startTime, format = '(F0.1)')
  results = ['', self.passed ? 'PASS' : 'FAIL', 'Tests:   ' + counts, 'Time:    ' + strtrim(elapsed, 2) + ' s']
  self._print, results, logfile = self.logFile, /implied_print

  ; the log already holds the test output, so add the analysis at the bottom
  if (self.logFile ne '') then self._print, analysis, logfile = self.logFile, /log_only, /space_before

  ; update flag that we generated the test summary
  self.generatedSummary = 1

  ; clear error messages since we made it this far in our testing
  ; helps reduce the number of "error" messages that pop up when running
  ; through the IDL-IDL Bridge which are related to errors that are
  ; swallowed not being handled correctly
  message, /reset
end

;+
; :Private:
;
; :Description:
;   Wrapper method that generates the strings for us to
;   share with users about how the tests went.
;
; :Returns: String | Array<String>
;
; :Keywords:
;   fancy: in, optional, Boolean
;     Forces the generation of "fancy" strings which have a
;     check mark or an x if there is an error.
;
;-
function luna::_getTestSummary, fancy = fancy
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; init list to hold our strings
  strings = list()

  ; init number of tests
  self.nTests = 0
  self.nFailed = 0

  ; validate that we have test suites
  if (n_elements(self.suites) eq 0) then begin
    strings.add, 'No tests, no summary'
  endif else begin
    ; process each test suite and get our strings
    foreach suite, self.suites do begin
      foreach sub, suite._generateSummary(fancy = fancy, ntests = nTestsChild, nfailed = nFailedChild) do strings.add, sub
      self.nTests += nTestsChild
      self.nFailed += nFailedChild
    endforeach
  endelse

  ; check if we have strings
  if (n_elements(strings) eq 0) then begin
    return, ''
  endif else begin
    return, strings.toArray()
  endelse
end

;+
; :Private:
;
; :Description:
;   Function method that takes an input string and
;   returns a "fancy" string with a multibyte character
;   that looks nice in the IDL Console of the workbench.
;
; :Returns: String
;
; :Arguments:
;   str: in, required, String
;     The string to make fancy, indentation is preserved
;   passed: in, required, Boolean
;     Flag if the string passed or failed for the part of
;     the test that it represents. A value of `true` represents
;     that we passed.
;
; :Keywords:
;   fancy: in, optional, Boolean
;     Forces the generation of "fancy" strings which have a
;     check mark or an x if there is an error.
;
;-
function luna::_generateFancyString, str, passed, fancy = fancy
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; validate input
  sol_validate, hash('str', ['required', 'string'], 'passed', ['required', 'number'])

  ; get the start
  trim = strtrim(str, 2)
  start = strpos(str, trim) > 0

  if keyword_set(passed) then begin
    return, strmid(str, 0, start) + 'PASSED: ' + strmid(str, start)
  endif else begin
    return, strmid(str, 0, start) + '%FAILED%: ' + strmid(str, start)
  endelse
end

;+
; :Private:
;
; :Description:
;   Sets defaults for properties.
;
; :Keywords:
;   profile: in, optional, Boolean
;     If set, then all routines will be watched by the profiler.
;
;-
pro luna::_init, profile = profile
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; placeholder for directory
  if ~keyword_set(self.dir) then self.dir = ''

  ; set property
  self.profile = keyword_set(profile)

  ; init structure to store information about the routines that we are testing
  self.coverage = orderedhash()
  self.coverageStats = orderedhash()

  ; init list to hold our test suites
  self.suites = list()

  ; init where our failures are
  self.failures = list()
  self.failureMessages = list()

  ; get platform and if we are in an IDE or not
  case !version.OS_FAMILY of
    'Windows': self.platform = 'windows'
    'Unix': self.platform = (strpos(strlowcase(!version.os_name), 'mac') ne -1) ? 'osx' : 'linux'
    else:
  endcase
  self.is_workbench = sol_is_workbench()

  ; pass until we fail
  self.passed = 1
  self.startTime = systime(/seconds)

  ; init number of tests
  self.nTests = 0
  self.nFailed = 0

  ; flag that we have not generated the summary yet
  self.generatedSummary = 0
end

;+
; :Private:
;
; :Description:
;   Finds the closest folder to a directory (the directory itself or one
;   of its parents) that contains an idltest.json file.
;
; :Returns: String
;   Path to the folder, or an empty string if none is found.
;
; :Arguments:
;   dir: in, required, String
;     Directory to start searching from.
;
;-
function luna::_findConfigDir, dir
  compile_opt idl2, hidden

  ; collect the directory and all parents, longest path first
  dirs = list(dir)
  repeat begin
    parent = file_dirname(dirs[-1])
    if (parent eq dirs[-1]) then break
    dirs.add, parent
  endrep until 0

  foreach d, dirs do begin
    if file_test(d + path_sep() + 'idltest.json') then return, d
  endforeach
  return, ''
end
;+
; :Description:
;   Init method for the luna code tester. You are only allowed
;   to call this routine from a main level program so that it
;   will work correctly with sol, the code test runner.
;
;   **Note**: this object can only be created from main level
;   programs.
;
; :Returns: Luna
;
; :Arguments:
;   routines: in, optional, String | Array<String>
;     Specify an array of strings that represents the routines
;     that this luna object will be testing. The routines
;     represent the highest priority names in a PRO code file. For
;     example, to specify that we are testing the routines in
;     myawesomeroutine.pro, you would specify 'myawesomeroutine'
;     as the routine name.
;
;     This is used for information about things like code coverage,
;     profiling, and validates that the routines can actually be
;     compiled for testing. If this is not specified, then we
;     take an educated guess at the routine being tested based
;     on the file where this is called from.
;
;     For example, if we call this from luna__define.spec.pro then
;     we assume that the routine being tested is luna__define. The
;     same goes for this being called from luna__define.pro where
;     we assume the routine is luna__define.
;
;     The reason that you are allowed to specify multiple routines
;     is that, one test suite may be covering all the routines in
;     multiple files and this ensures that all of the code coverage
;     information is tracked for each of those separate files.
;
; :Keywords:
;   _ref_extra: in, optional, any
;     Specify the keywords VERBOSE, DEBUG, or QUIET on init
;     and the corresponding object properties will be set
;     and carry through to child objects.
;   bridge_debug_log: in, optional, String
;     If `CONFIG_FILE` is not set and no `idltest.json` is found, then you
;     can specify the base name of any file that all debug
;     information will be written to. The file will be generated
;     in IDL's current directory.
;   config_file: in, optional, String
;     Specify the fully-qualified or relative filepath to a
;     configuration file for your tests (see `sol_config`). The
;     file must exist. If not set, the `idltest.json` closest to the
;     test file (in its folder or a parent folder) is used, otherwise
;     default settings apply. You
;     can use `/` or `\\` in the relative paths and it will resolve
;     the location.
;   log_file: in, optional, String
;     Specify the fully qualified filepath to a file on disk
;     where you want the debug log information to go if you want
;     to override the default behavior. If this file exists on
;     disk, then the contents will be truncated.
;   no_log: in, optional, Boolean
;     If set, then no log file will be generated.
;   no_routines: in, optional, Boolean
;     When set, this keyword indicates that there are no routines
;     to check for syntax errors.
;   profile: in, optional, Boolean
;     If set, then all routines will be watched by the profiler
;     to determine performance information about them.
;
;-
function luna::init, routines, $
  config_file = config_file, $
  bridge_debug_log = bridge_debug_log, $
  log_file = log_file, $
  no_log = no_log, $
  no_routines = no_routines, $
  profile = profile, $
  _ref_extra = extra
  compile_opt idl2, hidden

  ; set all extra properties that may have been passed in
  self.setProperty, _extra = extra
  if ~keyword_set(extra) then extra = ['']
  if ~self.debug then on_error, 2

  ; get the traceback for where we were called from
  trace = scope_traceback(/structure)
  sourcefile = trace[-2].FILENAME
  sourcedir = file_dirname(sourcefile)

  ; get the routine name
  routineName = file_basename(sourcefile.replace('.spec.pro', ''))

  ; determine how to initialize the object
  configFile = ''
  case (1) of
    ; check if we manually specify a config file
    keyword_set(config_file): begin
      sol_validate, hash('config_file', ['string', 'required']), $
        called_from = '$MAIN$'

      ; build the path to our config file
      configFile = sourcedir + path_sep() + config_file

      ; make sure that we have consistent path separators for windows, linux, mac
      configFile = configFile.replace('\', path_sep())
      configFile = configFile.replace('/', path_sep())

      ; make sure that the file exists
      if ~file_test(configFile) then begin
        message, 'Luna configuration file specified, but does not exist! Expected file:' + $
          string(10b) + configFile, level = -1
      endif
    end

    ; no config file specified, so use the closest idltest.json if there is one
    else: begin
      sol_validate, hash('routines', ['string', 'array']), $
        called_from = '$MAIN$'

      packageDir = self._findConfigDir(sourcedir)
      if (packageDir ne '') then begin
        configFile = packageDir + path_sep() + 'idltest.json'
        self.dir = packageDir
      endif

      ; check for keywords
      if keyword_set(bridge_debug_log) then begin
        self.bridge_debug_log = bridge_debug_log
      endif
    end
  endcase

  ; load the configuration, which is read-only
  sourceFiles = !null
  cfgDir = ''
  if (configFile ne '') then begin
    cfg = sol_config(configFile)
    cfg.getProperty, quiet = cfgQuiet, verbose = cfgVerbose, debug = cfgDebug, $
      coverageenabled = coverageEnabled, coverageprofile = coverageProfile, dir = cfgDir

    ; set our properties, but keyword values win
    if (where(extra eq 'QUIET', /null) eq !null) then self.quiet = cfgQuiet
    if (where(extra eq 'VERBOSE', /null) eq !null) then self.verbose = cfgVerbose
    if (where(extra eq 'DEBUG', /null) eq !null) then self.debug = cfgDebug
    if self.debug and cfg.exists then self.bridge_debug_log = cfgDir + path_sep() + 'luna.log'
    if coverageProfile then profile = 1
    if ~coverageEnabled then no_routines = !true

    ; find the source code to check for coverage unless routines were specified
    if ~keyword_set(no_routines) and (routines eq !null) then begin
      sourceFiles = cfg.findSource()
      if (sourceFiles ne !null) then begin
        idxKeep = where(file_lines(sourceFiles) gt 0, count)
        sourceFiles = (count gt 0) ? sourceFiles[idxKeep] : !null
      endif
      if (sourceFiles ne !null) then routines = file_basename(sourceFiles, '.pro')
    endif
  endif

  ; save our routine name
  self.routine_name = routineName

  ; init properties
  self._init, profile = profile

  ; check if we have routines to process or not
  if ~keyword_set(no_routines) then begin
    ; no routines found, so specify where we come from
    if (routines eq !null) then begin
      parent = (scope_traceback(/structure))[-2]

      ; get the base filename
      file = file_basename(parent.FILENAME)

      ; check if we are a test or not
      sourceFiles = parent.FILENAME
      if file.endsWith('.spec.pro') then begin
        routines = file_basename(file, '.spec.pro')
      endif else begin
        routines = file_basename(file, '.pro')
      endelse
    endif

    ; initialize coverage and validate routines that are provided
    self._validateRoutines, routines, sourceFiles
  endif

  ; save the file we come from
  self.file = trace[-2].FILENAME

  ; check if we need to log or not
  if ~keyword_set(no_log) then begin
    ; check if we make our log file or if it is specified by a user
    if ~keyword_set(log_file) then begin
      self.logFile = self.file + '.log'
    endif else begin
      self.logFile = log_file
    endelse

    ; clean up if our file exists already
    if file_test(self.logFile) then begin
      file_delete, self.logFile, /quiet
    endif
  endif else begin
    self.logFile = ''
  endelse

  ; print which file we are testing, relative to the config folder when there is one
  display = self.file.replace('\', '/')
  root = cfgDir.replace('\', '/')
  if (root ne '') then begin
    if ~root.endsWith('/') then root += '/'
    if (strpos(strlowcase(display), strlowcase(root)) eq 0) then display = strmid(display, strlen(root))
  endif
  self._print, 'Test file: ' + display, /space_before, logfile = self.logFile

  ; let sol find this object when it runs the file in a child process
  !null = luna_registry('add', self)

  ; valid object
  return, 1
end

;+
; :Description:
;   Creates a new test suite.
;
; :Returns: Suite
;
; :Arguments:
;   description: in, required, String
;     Specify a string that describes the suite of tests that
;     you will run.
;
;-
function luna::suite, description
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; validate input
  sol_validate, hash('description', ['required', 'string'])

  ; create test object and return
  suite = obj_new('Suite', self, description, debug = self.debug, quiet = self.quiet, verbose = self.verbose, logfile = self.logFile, file = self.file, nlevels = 0)
  self.suites.add, suite
  return, suite
end

;+
; :Private:
;
; :Description:
;   Simple method that sets passing, called from children.
;
;-
pro luna::_passed
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; update self
  self.passed = 1
end

;+
; :Private:
;
; :Description:
;   Method that will be called from our init method
;   to make sure that the routines that we want to test
;   will indeed compile correctly and stores a list of
;   each function/procedure within each. This information
;   is required to generate information about code coverage.
;
; :Arguments:
;   routines: in, required, String | Array<String>
;     Names of the routines to validate.
;   files: in, optional, String | Array<String>
;     Source files that correspond to the routines.
;
;-
pro luna::_validateRoutines, routines, files
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; hold the location of our files
  filenames = strarr(n_elements(routines))

  ; make sure that we can find and compile our routines
  foreach routine, routines, idx do begin
    ; resolve the routine here as well so that we can get counts for code coverage
    ; skip ourself so we dont halt by recompiling while active
    if (strpos(strlowcase(routine), 'luna__define') eq -1) then begin
      catch, err
      if (err ne 0) then begin
        catch, /cancel
        ; check if method for object which needs to update the '__' in the file
        ; to contain '::'
        if (routine.contains('__')) then begin
          resolve_routine, routine.replace('__', '::'), /compile_full_file, /either
        endif else begin
          ; read strings and check to see if the file has routine definitions or not
          strings = Luna_Sol_Base_Obj.read_file(files[idx])

          ; get comparison for searching
          strComp = strlowcase(strings)

          ; find all routine defs
          idxDefs = where((strpos(strComp, 'pro ') eq 0) or (strpos(strComp, 'function ') eq 0), countDef, $
            complement = idxNoDef, ncomplement = countNoDef)

          ; if routines, but cant resolve/compile issue error
          if (countDef gt 0) then begin
            message, /reissue_last
          endif
        endelse
      endif else begin
        resolve_routine, routine, /compile_full_file, /either
        catch, /cancel
      endelse
    endif

    ; get our source file
    ; TODO: what do we do if we are from a SAVE file?
    filenames[idx] = strlowcase(file_which(routine + '.pro'))
  endforeach

  ; get the routines in our files
  allRoutines = orderedhash('procedures', routine_info(/source), 'functions', routine_info(/functions, /source))

  ; check if we need to profile
  if (self.profile) then begin
    profiler, /clear
    profiler, /reset
  endif

  ; process our data
  foreach routineInfo, allRoutines, type do begin
    ; check if we are a function or procedure
    add = type eq 'procedures' ? '' : '()'

    ; check if we have content - we get null string if not
    if isa(routineInfo, /string) then continue

    ; check which routines we need to get code coverage for
    foreach routine, routineInfo, idx do begin
      ; skip main level program
      if (routine.NAME eq '$MAIN$') then continue
      if (routine.PATH eq '') then continue

      ; check if we have a routine in one of our files
      idxMatch = where(strlowcase(routine.PATH) eq filenames, countMatch)
      if (countMatch gt 0) then begin
        ; check if we have a key already
        if ~self.coverage.hasKey(routine.PATH) then begin
          self.coverage[routine.PATH] = orderedhash()
        endif

        ; turn on profiling of our routine
        if (self.profile) then profiler, routine.NAME

        ; init data structure
        self.coverage[routine.PATH, strlowcase(routine.NAME)] = orderedhash('coverage', 0.0, 'executed', list(), 'not-executed', list())
      endif
    endforeach
  endforeach

  ; get our initial code coverage for this test
  self._getCodeCoverage
end

;+
; :Private:
;
; :Description:
;   Object definition for the luna tester.
;
;-

;+
; :Luna:
;   dir: String
;     Directory we are running tests in.
;   failureMessages: List<String>
;     Description of each failed expectation, in the same order as failures.
;   failures: List<String>
;     Files and lines where there are failures.
;   file: String
;     File we come from.
;   generatedSummary: Long
;     Flag for whether the test summary has been generated.
;   is_workbench: Int
;     Flag for whether we are running in the workbench.
;   logFile: String
;     Path to a file on disk where we can log.
;   nFailed: Long
;     Number of tests that we have failed.
;   nTests: Long
;     Number of tests that we have.
;   passed: Long
;     Flag for whether all tests have passed.
;   platform: String
;     Platform that we are running on.
;   routine_name: String
;     Name of the routine/file we are processing.
;   startTime: Double
;     Time in seconds when the tests started, used for the summary.
;   suites: List<Suite>
;     All test suites that we create.
;
;-
pro luna__define
  compile_opt idl2, hidden
  struct = {Luna, $
    inherits Luna_Sol_Base_Obj, $
    dir: '', $ ; directory of the idltest.json we are running tests in
    is_workbench: 0, $
    platform: '', $
    passed: 0l, $
    generatedSummary: 0l, $
    startTime: 0d, $ ; seconds since epoch when the tests started
    routine_name: '', $ ; name of the routine/file we are processing
    nTests: 1l, $ ; number of tests that we have
    nFailed: 0l, $ ; track the number of tests that we hav failed
    failures: list(), $ ; files and lines where there are failures
    failureMessages: list(), $ ; description of each failure, in the same order as failures
    file: '', $ ; the file we come from
    logFile: '', $ ; path to file on disk where we can log
    suites: list() $ ; save all test suites that we create
    }
end
