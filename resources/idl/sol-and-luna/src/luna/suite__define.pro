;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Definition for the luna test suite object. The object should
;   not be created directly and, instead, should be generated
;   from the luna object or a previously generated test suite.
;
;   Here are some examples for object creation:
;
;       ;create our tester
;       l = luna()
;
;         ; option 1 - create a parent suite
;         s = l.suite('Description of parent suite')
;
;           ;optiona 2 - create a child for the parent suite
;           childS = s.suite('Description of child suite')
;
;   See ![FILE](./../README.md) for more details.
;
; :Author: Zachary Norman - GitHub: [znorman-harris](https://github.com/znorman-harris)
;-

;+
; :Private:
;
; :Description:
;   Simple method that sets failure and passes information
;   up to our parent object.
;
;-
pro Suite::_failed
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; alert parent if failure - i.e. we passed a previous test
  ; check if our parent is a suite
  if obj_valid(self.luna_suite) then begin
    self.luna_suite._failed
  endif else begin
    self.luna._failed
  endelse

  ; update self
  self.passed = 0
end

;+
; :Private:
;
; :Description:
;   Method that gathers information about the tests that
;   this object's children ran.
;
; :Returns: List<String>
;
; :Keywords:
;   fancy: in, optional, Boolean
;     Set this to generate fancy output for the log file or
;     IDL Console in the workbench.
;   nfailed: out, optional, Number
;     Contains the number of tests that failed in our
;     children.
;   ntests: out, optional, Number
;     Contains the number of tests that we executed in our
;     children.
;
;-
function Suite::_generateSummary, fancy = fancy, ntests = nTests, nfailed = nFailed
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; init list to hold our strings
  strings = list()
  strings.add, ''
  strings.add, self.luna._generateFancyString(self.description, self.passed, fancy = fancy)

  ; count the number of tests
  nTests = 0
  nFailed = 0

  ; process each child and get our strings
  foreach child, self.children, idx do begin
    if (idx gt 0) then strings.add, ''
    strings.add, child._generateSummary(fancy = fancy, ntests = nTestsChild, nfailed = nFailedChild), /extract
    nTests += nTestsChild
    nFailed += nFailedChild
  endforeach

  ; return the strings
  return, strings
end

;+
; :Private:
;
; :Description:
;   Function that returns the indentation for our test suite.
;
; :Returns: String
;
; :Keywords:
;   is_expectation: in, optional, Boolean
;     Set this keyword to true for two extra levels of indentation to
;     be added for expectations.
;   is_test: in, optional, Boolean
;     Set this keyword to true for one extra level of indentation to
;     be added as tests should be indented.
;
;-
function Suite::_getIndentation, is_test = is_test, is_expectation = is_expectation
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; build our output string
  str = ''
  if (self.nLevels gt 0) then begin
    for i = 0, (self.nLevels + 1) - 1 do str += '  '
  endif

  ; check if we have a test and need an extra level of indentation
  if keyword_set(is_test) then str += '  '
  if keyword_set(is_expectation) then str += '    '

  ; return the string
  return, str
end

;+
; :Description:
;   Init method for the luna test quite object. Should only be
;   called directly from `luna` object method to create a
;   suite or from another `Suite` object so that properties
;   are correctly inherited.
;
; :Returns: Suite
;
; :Arguments:
;   luna: in, required, luna
;     Specify the parent object.
;   description: in, required, String
;     Specify the string description for the suite of tests.
;
; :Keywords:
;   _ref_extra: in, optional, any
;     Specify the keywords VERBOSE, DEBUG, or QUIET on init
;     and the corresponding object properties will be set
;     and carry through to child objects.
;   post_execute: in, optional, String
;     Set this to the name of a procedure that will be called
;     after any test in this suite is executed.
;   pre_execute: in, optional, String
;     Set this to the name of a procedure that will be called
;     before any test in this test suite in executed.
;
;-
function Suite::init, luna, description, _ref_extra = extra
  compile_opt idl2, hidden

  ; set all extra properties that may have been passed in
  self.setProperty, _extra = extra
  if ~self.debug then on_error, 2

  ; validate input
  sol_validate, $
    hash('luna', ['required', 'luna'], 'description', ['required', 'string'])

  self.children = list()
  self.luna = luna
  self.description = self._getIndentation() + strtrim(description, 2)
  self.is_workbench = luna.is_workbench
  self.platform = luna.platform

  ; print our description
  self._print, self.description, /space_before, logfile = self.logFile

  ; assume we passed
  self.passed = 1

  return, 1
end

;+
; :Description:
;   Crates a new test object for a test suite.
;   ;
;
; :Returns: Suite
;
; :Arguments:
;   description: in, required, String
;     Specify a string description of what the test should do.
;
; :Keywords:
;   pre_execute: in, optional, String
;     Set this to the name of a procedure that will be called
;     before any test in the new suite is created. Defaults to
;     the value inherited from this suite.
;
;-
function Suite::suite, description, pre_execute = pre_execute
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; validate input
  sol_validate, hash('description', ['required', 'string'])

  ; create a new test object, save, and return
  suite = obj_new('Suite', self.luna, description, $
    debug = self.debug, $
    quiet = self.quiet, $
    verbose = self.verbose, $
    logfile = self.logFile, $
    file = self.file, $
    nlevels = self.nLevels + 1, $
    pre_execute = keyword_set(pre_execute) ? pre_execute : self.pre_execute, $
    luna_suite = self) ; tell child that we came from a suite

  ; save as a child object
  self.children.add, suite

  return, suite
end

;+
; :Description:
;   Creates a new test object for a test suite.
;
; :Returns: Test
;
; :Arguments:
;   description: in, required, String
;     Specify a string description of what the test should do.
;
;-
function Suite::test, description
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; validate input
  sol_validate, hash('description', ['required', 'string'])

  ; check if we have something to call before creatitng a test
  if (self.pre_execute ne '') then call_procedure, self.pre_execute

  ; check if we need to print something
  if (n_elements(self.children) gt 0) then begin
    self._print, '', logfile = self.logFile
  endif

  ; create a new test object, save, and return
  test = obj_new('Test', self, description, debug = self.debug, quiet = self.quiet, verbose = self.verbose, logfile = self.logFile, file = self.file)
  self.children.add, test
  return, test
end

;+
; :Private:
;
; :Description:
;   Simple method that sets passing and passes information
;   up to our parent object.
;
;-
pro Suite::_passed
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; alert parent of passing
  ; check if our parent is a suite
  if obj_valid(self.luna_suite) then begin
    self.luna_suite._passed
  endif else begin
    self.luna._passed
  endelse

  ; update self
  self.passed = 1
end

;+
; :Private:
;
; :Description:
;   Object definition for the luna test suite.
;
;-

;+
; :Suite:
;   children: List<any>
;     Tests and suites that we create.
;   description: String
;     Description of our test suite.
;   file: String
;     File that the suite was called from.
;   is_workbench: Long
;     Flag for whether we are running in the workbench.
;   logFile: String
;     File that results are logged to.
;   luna: luna
;     Parent (or parent of parent) luna object.
;   luna_suite: Suite
;     Suite that created this suite, if any.
;   nLevels: Long
;     Nesting level of this suite.
;   passed: Long
;     Flag for whether the suite passed.
;   platform: String
;     Platform that we are running on.
;   pre_execute: String
;     Procedure to call before a test is run.
;
;-
pro suite__define
  compile_opt idl2, hidden
  struct = {Suite, $
    inherits Luna_Sol_Base_Obj, $
    is_workbench: 0l, $ ; are we in the workbench
    platform: '', $ ; what platform are we on?
    file: '', $ ; where were we called from?
    logFile: '', $ ; where do we log?
    description: '', $ ; description of our test suite
    luna: obj_new(), $ ; parent (or parent of parent)
    luna_suite: obj_new(), $ ; creation parent
    pre_execute: '', $ ; call this before a test is run
    nLevels: 0l, $ ; list of all test suites
    passed: 0l, $ ; flag if we passed or not
    children: list() $ ; save all tests that we create
    }
end
