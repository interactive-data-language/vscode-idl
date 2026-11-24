;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toBeAValidENVITask')

    it = suite.test('passes for an ENVI task')
      e = envi(/headless)
      (it.expects('SubsetRaster')).toBeAValidENVITask

    it = suite.test('can be negated')
      e = envi(/headless)
      (it.expects('SubsetRaster'))._not_.toBeAValidENVITask, /_expect_failure

l.generateTestSummary
end
