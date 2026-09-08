;+
; :Description:
;   Returns routine lookups based on the catalog XML file
;
; :Returns: OrderedHash<String>
;
;-
function getSourceMap
  compile_opt idl2, hidden

  sourceMap = orderedhash()
  sourceMap['idl_catalog.xml'] = 'idl'
  sourceMap['envi_catalog.xml'] = 'envi'
  sourceMap['deeplearning_catalog.xml'] = 'envi-dl'
  sourceMap['machinelearning_catalog.xml'] = 'envi-ml'
  sourceMap['sartoolbox_catalog.xml'] = 'sar-e'
  sourceMap['featureassistant_catalog.xml'] = 'envi-fa'

  return, sourceMap
end
