;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

; get this directory
thisDir = file_dirname(routine_filepath())

; sol test dir
testDir = thisDir + path_sep() + 'test'

; specify our output test results file
results = testDir + path_sep() + 'idltest.log'
file_delete, results, /allow_nonexistent, /quiet

; lets test this!
l = luna()

  ; create a new suite of tests
  suite = l.suite('Test suite for the Sol test runner')

    ; create a new test for our suite
    it = suite.test('makes sure that we can run our tests with Sol directly')

      ; create the runner and run our tests
      s = sol(testDir)
      passed = s.runTests()
      s.generateTestSummary, results

      (it.expects(passed)).toBeTrue

      ; verify our output file exists
      (it.expects(1)).toEqual, file_test(results)

    it = suite.test('reports the result of each test file')
      s = sol(testDir)
      !null = s.runTests()
      fileResults = s.results
      (it.expects(n_elements(fileResults))).toEqual, 1
      result = (fileResults.values())[0]
      (it.expects(result.status)).toEqual, 'passed'
      (it.expects(result.nTests gt 0)).toBeTrue
      (it.expects(result.nFailed)).toEqual, 0
      (it.expects(result.duration gt 0)).toBeTrue

    it = suite.test('runs a single file with RunFile')
      s = sol(testDir)
      result = s.runFile(testDir + path_sep() + 'example.spec.pro')
      (it.expects(result.status)).toEqual, 'passed'
      (it.expects(s.passed)).toBeTrue

    it = suite.test('reports a missing file as an error instead of stopping')
      s = sol(testDir)
      result = s.runFile(testDir + path_sep() + 'missing.spec.pro')
      (it.expects(result.status)).toEqual, 'error'
      (it.expects(result.message)).toContainString, 'does not exist'
      (it.expects(s.passed)).toBeFalse

    it = suite.test('filters the files to run')
      s = sol(testDir)
      passed = s.runTests(filter = 'example')
      (it.expects(n_elements(s.results))).toEqual, 1

      ; a filter that matches nothing is an error
      catch, err
      if (err ne 0) then begin
        catch, /cancel
        filterError = !error_state.msg
      endif else begin
        !null = s.runTests(filter = 'no_such_test_file')
      endelse
      catch, /cancel
      (it.expects(filterError)).toContainString, 'No test files match'

    it = suite.test('writes JSON and JUnit reports')
      s = sol(testDir)
      !null = s.runTests()
      jsonFile = testDir + path_sep() + 'tmp_report.json'
      xmlFile = testDir + path_sep() + 'tmp_report.xml'
      s.writeReport, jsonFile
      s.writeReport, xmlFile

      report = json_parse(jsonFile)
      (it.expects(report['files', 0, 'file'])).toEqual, 'example.spec.pro'
      (it.expects(report['summary', 'nFailed'])).toEqual, 0

      xml = strjoin(Luna_Sol_Base_Obj.read_file(xmlFile), string(10b))
      (it.expects(xml)).toContainString, '<testcase classname="sol" name="example.spec.pro"'
      (it.expects(xml)).toContainString, 'failures="0" errors="0"'
      file_delete, jsonFile, xmlFile, /allow_nonexistent, /quiet

    it = suite.test('writes the summary to idltest.log in the test directory by default')
      defaultLog = testDir + path_sep() + 'idltest.log'
      file_delete, defaultLog, /allow_nonexistent, /quiet
      s = sol(testDir)
      !null = s.runTests()
      s.generateTestSummary
      (it.expects(file_test(defaultLog))).toEqual, 1
      (it.expects(strjoin(Luna_Sol_Base_Obj.read_file(defaultLog), string(10b)))).toContainString, 'Test summary for'

    it = suite.test('uses the directory of the calling file when no directory is given')
      s = sol()
      (it.expects(s.dir)).toEqual, thisDir

; generate a nice summary to visualize
l.generateTestSummary
end
