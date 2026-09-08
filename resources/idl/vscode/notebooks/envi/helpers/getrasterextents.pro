;+
; :Private:
;
; :Description:
;   Calculates the bounding box [xmin, ymin, xmax, ymax] in longitude
;   and latitude for the given EPSG code
;
; :Returns: Array<Number>
;
; :Arguments:
;   raster: in, required, ENVIRaster
;     Raster to get extents for
;   epsgCode: in, required, Number
;     EPSG code for spatial reference, default is web mercator (3857)
;
;-
function getRasterExtents, raster, epsgCode
  compile_opt idl2, hidden
  on_error, 2

  ; make sure we have a spatialref
  if (raster.spatialref eq !null) then begin
    message, 'ENVIRaster does not have a spatialref', level = -1
  endif

  ; make sure we have an EPSG code
  if (epsgCode eq !null) then epsgCode = 3857

  ;+ output coordinate system
  outCoordSys = ENVICoordSys(coord_sys_code = epsgCode)

  ; get our raster spatial reference
  sref = raster.spatialref
  coordSys = raster.coord_sys

  ; creating starting point for vars
  fileX = [0, raster.ncolumns, raster.ncolumns, 0, 0]
  fileY = [0, 0, raster.nrows, raster.nrows, 0]

  ; check if we need to convert our coordinates
  sref.convertFileToLonLat, fileX, fileY, lon1, lat1
  coordSys.convertLonLatToLonLat, lon1, lat1, lon, lat, outCoordSys

  ; return the bbox
  return, [min(lon, max = maxlon), min(lat, max = maxlat), maxlon, maxlat]
end