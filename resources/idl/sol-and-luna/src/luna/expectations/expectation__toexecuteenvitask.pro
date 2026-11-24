;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies an expectation value to run the ENVI::Execute
;   method. The expectation value must be an ENVI Task.
;
; :Keywords:
;   _expect_failure: in, optional, Boolean
;     If the test fails for some reason, set this to
;     force passing because we expected failure. This
;     keyword is for internal use only.
;
; :Examples:
;   ```idl
;   ;make sure to start ENVI
;   e = envi(/HEADLESS)
;
;   ;create an ENVI task
;   task = ENVITask('SubsetRaster')
;
;   ;open an input file
;   File = Filepath('qb_boulder_msi', Subdir=['data'], $
;     Root_Dir=e.Root_Dir)
;   Raster = e.OpenRaster(File)
;
;   ;make sure to specify task input
;   subRect = [Raster.nSamples/4, Raster.nLines/4, $
;     Raster.nSamples*3/4, Raster.nLines*3/4]
;   Task.INPUT_RASTER = Raster
;   Task.SUB_RECT = subRect
;
;   ;set task input and run
;   (it.expects(task)).toExecuteENVITask
;   ```
;
;-
pro expectation::toExecuteENVITask, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required to check for valid object!', level = -1
  endif

  ; get our value
  val = self.value[0]

  ; make sure we have the right type
  sol_validate, hash('val', 'envitask')

  ; make sure that ENVI is running
  e = envi(/current)
  if (e eq !null) then begin
    message, 'ENVI has not started yet, required!', level = -1
  endif

  ; try to create our task
  val.execute, error = error

  ; process the expectation
  self._processExpectation, 'to execute ENVI task', keyword_set(error), $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
