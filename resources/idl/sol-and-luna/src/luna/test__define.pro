;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Definition for the luna test object. The object should
;   not be created directly and, instead, should be generated
;   from the luna suite object.
;
;   Here is an example of object creation:
;
;       ;create our tester
;       l = luna()
;
;         ;create a parent suite
;         s = l.suite('Test suite that verifies')
;
;           ;create a test
;           it = s.test('our functionality works')
;
;   See ![FILE](./../README.md) for more details.
;
;
; :Author: Zachary Norman - GitHub: [znorman-harris](https://github.com/znorman-harris)
;-

;+
; :Description:
;   This method generates a new expectation for a test to pass
;   or fail.
;
; :Returns: Expectation
;
; :Arguments:
;   value: in, optional, any
;     Specify any value for the test expectation if needed. Some
;     tests do not require a value to be present for validation.
;
;-
function Test::expects, value
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; make new expectations
  new = expectation(self, value, debug = self.debug, quiet = self.quiet, verbose = self.verbose, logfile = self.logFile, file = self.file)

  ; increment number of expectations
  self.expectations.add, new

  ; create a new expectation and return
  return, new
end

;+
; :Private:
;
; :Description:
;   Simple method that sets failure and passes information
;   up to our parent object.
;
;-
pro Test::_failed
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; alert parent
  self.luna_suite._failed

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
function Test::_generateSummary, fancy = fancy, ntests = nTests, nfailed = nfailed
  compile_opt idl2, hidden

  ; init list to hold our strings
  strings = list()
  strings.add, self.luna_suite.luna._generateFancyString(self.description, self.passed, fancy = fancy)

  ; each test counts once, and fails if any expectation failed
  nTests = 1
  nfailed = self.passed ? 0 : 1

  ; process each child and get our strings
  foreach expectation, self.expectations do begin
    strings.add, expectation._generateSummary(fancy = fancy), /extract
  endforeach

  ; return the strings
  return, strings
end

;+
; :Description:
;   Init method for the IDL package test suite tests. Should only
;   be called from a `Suite` object an not on it's own.
;
; :Returns: Test
;
; :Arguments:
;   luna_suite: in, required, Suite
;     Specify the parent object.
;   description: in, required, String
;     Specify the string description for the suite of tests.
;
; :Keywords:
;   _ref_extra: in, optional, any
;     Specify the keywords VERBOSE, DEBUG, or QUIET on init
;     and the corresponding object properties will be set
;     and carry through to child objects.
;
;-
function Test::init, luna_suite, description, _ref_extra = extra
  compile_opt idl2, hidden

  ; set all extra properties that may have been passed in
  self.setProperty, _extra = extra
  if ~self.debug then on_error, 2

  ; validate input
  sol_validate, $
    hash('luna_suite', ['required', 'Suite'], 'description', ['required', 'string']), $
    called_from = 'Suite::test'

  self.luna_suite = luna_suite
  self.description = self.luna_suite._getIndentation(/is_test) + strtrim(description, 2)
  self.is_workbench = luna_suite.is_workbench
  self.platform = luna_suite.platform

  ; init counter
  self.expectations = list()
  self.lastTime = systime(/seconds)

  ; print our description
  self._print, self.description, logfile = self.logFile

  ; assume we passed
  self.passed = 1

  return, 1
end

;+
; :Private:
;
; :Description:
;   Returns the seconds since the test started or since this method was
;   last called, and starts timing again. This is the time that an
;   expectation takes, including any setup in the test before it.
;
; :Returns: Double
;
;-
function Test::_lap
  compile_opt idl2, hidden

  now = systime(/seconds)
  elapsed = now - self.lastTime
  self.lastTime = now
  return, elapsed
end
;+
; :Private:
;
; :Description:
;   Simple method that sets passed and passes information
;   up to our parent object.
;
;-
pro Test::_passed
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; alert parent
  self.luna_suite._passed

  ; update self
  self.passed = 1
end

;+
; :Private:
;
; :Description:
;   Object definition for the luna test object.
;
;-

;+
; :Test:
;   description: String
;     Test description.
;   expectations: List<expectation>
;     Expectations that belong to this test.
;   file: String
;     File that the test was called from.
;   is_workbench: Long
;     Flag for whether we are running in the workbench.
;   logFile: String
;     File that results are logged to.
;   lastTime: Double
;     Time in seconds when the last expectation finished.
;   luna_suite: Suite
;     Parent suite.
;   passed: Long
;     Flag for whether the test passed.
;   platform: String
;     Platform that we are running on.
;
;-
pro test__define
  compile_opt idl2, hidden
  struct = {Test, $
    inherits Luna_Sol_Base_Obj, $
    is_workbench: 0l, $ ; are we in the workbench
    platform: '', $ ; what platform are we on?
    file: '', $ ; where were we called from
    logFile: '', $ ; where do we log
    description: '', $ ; test description
    expectations: list(), $ ; track our expectations we have
    lastTime: 0d, $ ; when the last expectation finished
    luna_suite: obj_new(), $ ; parent
    passed: 0l $ ; flag if passed or not
    }
end
