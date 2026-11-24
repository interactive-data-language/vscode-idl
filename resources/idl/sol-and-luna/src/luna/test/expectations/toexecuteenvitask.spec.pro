;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toExecuteENVITask')

    it = suite.test('fails until the task inputs are set')
      e = envi(/headless)
      task = ENVITask('SubsetRaster')
      (it.expects(task)).toExecuteENVITask, /_expect_failure
      (it.expects(task)).toRunProcedureMethod, 'execute', /_expect_failure

    it = suite.test('passes when the task can run')
      e = envi(/headless)
      task = ENVITask('SubsetRaster')

      File = filepath('qb_boulder_msi', subdir = ['data'], $
        root_dir = e.root_dir)
      Raster = e.openRaster(File)

      subRect = [Raster.nSamples / 4, Raster.nLines / 4, $
        Raster.nSamples * 3 / 4, Raster.nLines * 3 / 4]
      task.INPUT_RASTER = Raster
      task.SUB_RECT = subRect

      (it.expects(task)).toExecuteENVITask
      task.OUTPUT_RASTER_URI = e.getTemporaryFilename()
      (it.expects(task)).toRunProcedureMethod, 'execute'

      ; output raster methods
      (it.expects(task.output_raster)).toRunFunctionMethod, 'getData'
      (it.expects(it.expects(task.output_raster))).toThrow, 'toRunFunctionMethod', 'export'

l.generateTestSummary
end
