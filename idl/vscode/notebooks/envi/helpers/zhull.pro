;+
; :Description:
;   A custom routine that extracts the zhull of an object. The hull is extracted
;   by recursively using IDLs ```idl qhull``` procedure to extract convex and
;   concave features. Using ```idl qhull``` by itself only processes convex features
;   and preserves outer edge points.
;   
;   For processing, see the `min_area` parameter below which controls when IDL uses
;   recursion for processing concave features.
;
; :Returns:
;   Returns the indices for the vertices in the specified polygon that
;   make up the smoothed shape.
;   
;   This means that the original shape must be subsetted with `verts[*,idx]`
;   where `idx` is returned from this routine.
;   
;   If there is an error, or if there are no vertices, then this routine
;   returns a value of `!null`.
;   
; :Params:
;    x: in, required, type=numberarray
;      Specify the `x` vertices of the feature you want to smooth.
;    y: in, required, type=numberarray
;      Specify the `y` vertices of the feature you want to smooth.
;    nLevels: in, optional, type=number, default=10
;      Specify the maximum amount of recursion to apply when extracting
;      sub features. In general this value should never need to be changed.
;
; :Keywords:
;    DEBUG: in, optional, type=boolean, private
;      If set, errors are stopped on.
;    MIN_AREA: in, optional, type=float, default=0.1
;      Specify the minimum size of features that you want to 
;      have included. By default ```idl qhull``` only extracts edge features
;      so this parameter indicates how large a concave polygon must be to 
;      have it's major vertices extracted.
;      
;      As this parameter is increased, the shapes have fewer points. Setting to
;      a smaller value preserves more points.
;
; :Author: Zachary Norman - GitHub: znorman-harris
;-
function zhull, x, y, nLevels, level, area, $
  DEBUG = debug, $
  MIN_AREA = min_area
  compile_opt idl2, hidden
  if ~keyword_set(debug) then on_error, 2
  
  ;calculate base information
  if (level eq !null) then level = 0
  if (min_area eq !null) then min_area = .01
  if (area eq !null) then area = poly_area(x,y)
  if (nLevels eq !null) then nLevels = 10

  ;get hull information
  qhull, x, y, tr, /DELAUNAY, BOUNDS=hIdx, CONNECTIVITY=conn
  hIdx = hIdx.sort()
  nEdges = n_elements(hIdx)

  ;track the indices that we are adding
  newEdges = list(hIdx, /EXTRACT)

  ;get the level of depth we will be in
  newLevel = level + 1

  ;return if more than max number of levels
  if (newLevel gt nLevels) then return, !null

  ;process each potential segment
  for j=0, nEdges-2 do begin
    ;skip if our two points are next to each other
    if ((hIdx[j+1] - hIdx[j]) eq 1) then continue

    ;get the indices of our polygon and close with first point
    newIdx = [[hIdx[j]:hIdx[j+1]], hIdx[j]]

    ;get new x and y, calculate new area
    newX = x[newIdx]
    newY = y[newIdx]
    newArea = poly_area(newX, newY)

    ;get the change in area and skip if less than our threshold
    added = newArea/area
    if (added le min_area) then continue

    ;recurse
    tmp = zhull(newX, newY, nLevels, newLevel, area, MIN_AREA = min_area)
    if (tmp ne !null) then newEdges.add, newIdx[tmp], /EXTRACT
  endfor

  ;return the indices
  return, (newEdges.toArray()).uniq()
end