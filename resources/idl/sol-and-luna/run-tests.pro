compile_opt idl2, hidden

;+ create test class - next to idltest.json
s = sol()

; run all tests
status = s.runTests()

; write summary to disk
s.generateTestSummary

end
