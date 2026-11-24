;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toBeAValidObject')

    it = suite.test('passes for a valid object')
      p = plot(/test, /buffer)
      (it.expects(p)).toBeAValidObject

l.generateTestSummary
end
