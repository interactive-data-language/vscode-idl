;+
; :Description:
;   Returns file overrides for ENVI docs, some of these are
;   incorrect
;
; :Returns: OrderedHash<String>
;
;-
function getFileOverrides
  compile_opt idl2, hidden

  ; fix HTML files being incorrect (at least is wrong with ENVI)
  ; key is routine name, space, then routine type
  fileOverrides = orderedhash(/fold_case)
  fileOverrides['envi f'] = 'ENVI.htm'
  fileOverrides['e3dlidar f'] = 'E3DLidar.htm'

  return, fileOverrides
end
