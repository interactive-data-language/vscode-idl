;+
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
function ENVIRaster::getExtents, epsgCode
  compile_opt idl2, hidden
  on_error, 2

  self.getProperty, spatialref = sref

  ; make sure we have a spatialref
  if (sref eq !null) then begin
    message, 'ENVIRaster does not have a spatialref', level = -1
  endif

  ; make sure we have an EPSG code
  if ~arg_present(epsgCode) then epsgCode = 3857

  ; make sure we have loaded our map extents structure
  IDLNotebookMap__define

  ; reproject
  reprojected = ENVIReprojectRaster(self, $
    coord_sys = ENVICoordSys(coord_sys_code = epsgCode))

  ; get the extents of our image in lon lat
  reprojected.spatialref.convertFileToLonLat, $
    [0, reprojected.ncolumns], [0, reprojected.nrows], lon, lat

  ; clean up
  reprojected.close

  ; create data structure
  extents = {IDLNotebookMap_Extents}
  extents.epsg = epsgCode
  extents.xMin = min(lon)
  extents.xMax = max(lon)
  extents.yMin = min(lat)
  extents.yMax = max(lat)

  ; return
  return, extents
end