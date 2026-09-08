;+
; :Description:
;   Returns source maps that we skip loading from
;
; :Returns: OrderedHash<String>
;
;-
function getSkipSourceMaps
  compile_opt idl2, hidden

  ; source maps to skip
  skipSourceMaps = orderedhash()
  skipSourceMaps['sartoolbox_catalog.xml'] = !true

  return, skipSourceMaps
end
