;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Private:
;
; :Description:
;    Contains object definition for negating test results.
;
; :Author: Zachary Norman - GitHub: [znorman-harris](https://github.com/znorman-harris)
;-

;+
; :Description:
;   Init method for the IDL package test suite tests.
;
; :Returns: ExpectationNot
;
; :Arguments:
;   luna_test: in, required, Test
;     Specify the parent object.
;   value: in, optional, any
;     Specify the value for the test.
;   parent: in, required, expectation
;     Specify the expectation object that this object negates.
;
; :Keywords:
;   _ref_extra: in, optional, any
;     Specify the keywords VERBOSE, DEBUG, or QUIET on init
;     and the corresponding object properties will be set
;     and carry through to child objects.
;
;-
function ExpectationNot::Init, luna_test, value, parent, _ref_extra = extra
  compile_opt idl2, hidden

  ; set all extra properties that may have been passed in
  self.setProperty, _extra = extra
  if ~self.debug then on_error, 2

  ; validate input
  sol_validate, $
    hash('luna_test', ['required', 'Test']), $
    called_from = 'expectation::_init'

  ; save our parent
  self.expectation = parent

  ; init properties
  self._init, luna_test, value

  ; check if we specified a value
  if isa(value) then begin
    self.value.add, value
    self.hasValue = 1
  endif

  return, 1
end

;+
; :Private:
;
; :Description:
;   Send expectation results to our parent object
;
; :Arguments:
;   str: in, required, String
;     Specify the result string for the expectation.
;   errorFlag: in, required, Boolean
;     Specify whether the expectation failed.
;
; :Keywords:
;   _expect_failure: in, optional, any
;     Internal use only. Flag passed through to the parent expectation.
;   expected: in, optional, String
;     Description of the expected value, shown when the expectation fails.
;   received: in, optional, String
;     Description of the value that was received, shown when the expectation fails.
;
;-
pro ExpectationNot::_ProcessExpectation, str, errorFlag, _expect_failure = _expect_failure, expected = expected, received = received
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; let our parent process the expectation
  self.expectation._processExpectation, str, errorFlag, _expect_failure = _expect_failure, is_not = 1, expected = expected, received = received
end

;+
; :Description:
;   Object definition for the not property of the luna expectations
;
;-

;+
; :ExpectationNot:
;   expectation: expectation
;     Parent expectation that receives the negated results.
;
;-
pro expectationnot__define
  compile_opt idl2, hidden
  struct = {ExpectationNot, $
    inherits Expectation, $
    expectation: obj_new() $ ; save our ref
    }
end
