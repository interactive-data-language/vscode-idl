;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Result of running one test file with `sol`. Properties can be read
;   with dot notation, for example `result.status`.
;
;-

;+
; :Description:
;   Creates a result for a test file.
;
; :Returns: Sol_Result
;
; :Arguments:
;   file: in, required, String
;     Fully-qualified path of the test file.
;
;-
function sol_result::Init, file
  compile_opt idl2, hidden
  self.file = file
  self.status = 'passed'
  self.passed = 1b
  self.failures = list()
  return, 1
end

;+
; :Description:
;   Converts the result into a hash that can be serialized.
;
; :Returns: OrderedHash<any>
;
;-
function sol_result::ToHash
  compile_opt idl2, hidden
  return, orderedhash( $
    'file', self.file, $
    'status', self.status, $
    'passed', self.passed ? 1 : 0, $
    'nTests', self.nTests, $
    'nFailed', self.nFailed, $
    'nPassed', self.nTests - self.nFailed, $
    'duration', self.duration, $
    'message', self.message, $
    'failures', self.failures)
end

;+
; :Sol_Result:
;   duration: Double
;     Seconds it took to run the file.
;   failures: List<OrderedHash<String>>
;     One item for each failed expectation, with the keys message and
;     location (the file and line number).
;   file: String
;     Fully-qualified path of the test file.
;   message: String
;     Description of the problem when the status is `error`.
;   nFailed: Long
;     Number of tests that failed.
;   nTests: Long
;     Number of tests that were run.
;   passed: Byte
;     1 if the status is `passed`, otherwise 0.
;   status: String
;     `passed` if all tests passed, `failed` if a test failed, or `error` if the
;     file could not be compiled or run to completion.
;
;-
pro sol_result__define
  compile_opt idl2, hidden
  struct = {Sol_Result, $
    inherits Luna_Sol_Base_Obj, $
    file: '', $
    status: '', $
    passed: 0b, $
    nTests: 0l, $
    nFailed: 0l, $
    duration: 0d, $
    failures: list(), $
    message: '' $
    }
end
