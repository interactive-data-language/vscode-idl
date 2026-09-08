;+
; :Description:
;   LatLon_Distance
;     Computes the distance of a rhumb line connecting two points on a sphere or spheroid
;
;   The distance between the 2 points, [km] by default
;
; :Returns: any
;
; :Arguments:
;   lon1: in, required, any
;     Longitude and latitude of the 1st point, p0
;   lat1: in, required, any
;     Longitude and latitude of the 1st point, p0
;   lon2: in, required, any
;     Longitude and latitude of the 2nd point, p1
;   lat2: in, required, any
;     Longitude and latitude of the 2nd point, p1
;   method: in, required, any
;     The method to be used, options are:
;       1 - Haversine (sphere) - selected by default
;       2 - Vincenty  (spheroid)
;
; :Keywords:
;   meters: bidirectional, required, any
;     Set this keyword to return the distance in meters
;   radians: bidirectional, required, any
;     Set this keyword if inputs are specified in radians (the default is degrees)
;   radius: bidirectional, required, any
;     Set this keyword to a value specifying the radius of the sphere to be used, in [km]
;       the default value is the Authalic radius (equal area hyothetical perfect sphere) = 6371.0072
;   semimajor_axis: bidirectional, required, any
;     Set this keyword to the length of the semimajor axis of the reference ellipsoid, in [m]
;       the default value is the WGS-84 6378137
;   semiminor_axis: bidirectional, required, any
;     Set this keyword to the length of the semiminor axis of the reference ellipsoid, in [m]
;       the default value is the WGS-84 6356752.314245
;
; :References:
;   Haversine formula ( great-circle distance between two points on a sphere )
;     https://en.wikipedia.org/wiki/Haversine_formula
;   Vincenty formula ( distance between two points on the surface of a spheroid )
;     https://en.wikipedia.org/wiki/Vincenty%27s_formulae
;     https://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf
;
; :Revisions:
;   Thu Jul 29, 2021 - Introduce the Vincenty equation (computation of distances over an spheroid)
;   Sun Apr 23, 2023 - Fix the Vincenty calculation at latitudes close to zero
;   Wed May 10, 2023 - Allow arrays in the Vincenty method
;
;-
function idltasktest, lon1, lat1, lon2, lat2, method, meters = meters, radians = radians, radius = radius, semimajor_axis = semimajor_axis, semiminor_axis = semiminor_axis
  compile_opt idl2

  return, 1
end