;+
; :Private:
;
; :Description:
;   Gets the extents for the specified raster in lon/lat for
;   the given EPSG code
;
; :Returns: IDLNotebookMap_Extents
;
; :Arguments:
;   epsgCode: in, optional, Long
;     Specify the EPSG code to get the extents, default is web
;     mercator (3857)
;
;-
function ENVIRaster::_getNotebookExtents, epsgCode
  compile_opt idl2, hidden
  on_error, 2

  ; make sure we have loaded our map extents structure
  vscode_notebookInit

  ; get extents for EPSG code in lon/lat
  bbox = getRasterExtents(self, epsgCode)

  ; create data structure
  extents = {IDLNotebookMap_Extents}
  extents.epsg = epsgCode
  extents.xMin = bbox[0]
  extents.xMax = bbox[2]
  extents.yMin = bbox[1]
  extents.yMax = bbox[3]

  ; return
  return, extents
end