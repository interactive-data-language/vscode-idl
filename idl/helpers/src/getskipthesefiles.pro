;+
; :Description:
;   Returns files we skip
;
; :Returns: OrderedHash<String>
;
;-
function getSkipTheseFiles
  compile_opt idl2, hidden

  ; track files to skip
  skipTheseFiles = orderedhash()
  skipTheseFiles['/idl/Content/External Development/Using CALL_EXTERNAL/CALL_EXTERNAL.htm'] = !true
  skipTheseFiles['/envi/Content/ExtendCustomize/Obsolete/ENVI_GET_HEADER_VALUE.htm'] = !true
  skipTheseFiles['/envi/Content/ExtendCustomize/Obsolete/MORPH_DOIT.htm'] = !true
  skipTheseFiles['/envi/Content/ExtendCustomize/Obsolete/ENVI_GET_ROI_INFORMATION.htm'] = !true
  skipTheseFiles['/envi/Content/ExtendCustomize/Obsolete/ENVI_GET_PATH.htm'] = !true
  skipTheseFiles['/machine_learning/Content/WhatsNewPrevReleases/WhatsNewList.htm'] = !true
  skipTheseFiles['/envi/Content/ExtendCustomize/Obsolete/ENVISpectralLibrary__GetSpectrum.htm'] = !true

  return, skipTheseFiles
end
