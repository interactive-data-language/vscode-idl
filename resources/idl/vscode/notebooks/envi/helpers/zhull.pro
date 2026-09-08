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
; :Returns: any
;
; :Arguments:
;   x: in, required, numberarray
;     Specify the `x` vertices of the feature you want to smooth.
;   y: in, required, numberarray
;     Specify the `y` vertices of the feature you want to smooth.
;   nLevels: in, optional, Number
;     Specify the maximum amount of recursion to apply when extracting
;     sub features. In general this value should never need to be changed.
;   level: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   area: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
; :Keywords:
;   debug: in, optional, Boolean, private
;     If set, errors are stopped on.
;   min_area: in, optional, Float
;     Specify the minimum size of features that you want to
;     have included. By default ```idl qhull``` only extracts edge features
;     so this parameter indicates how large a concave polygon must be to
;     have it's major vertices extracted.
;
;     As this parameter is increased, the shapes have fewer points. Setting to
;     a smaller value preserves more points.
;
; :Author:
;   Zachary Norman - GitHub: znorman-harris
;
;-
function zhull, x, y, nLevels, level, area, $
  debug = debug, $
  min_area = min_area
  compile_opt idl2, hidden
  if ~keyword_set(debug) then on_error, 2

  ; calculate base information
  if (level eq !null) then level = 0
  if (min_area eq !null) then min_area = .01
  if (area eq !null) then area = poly_area(x, y)
  if (nLevels eq !null) then nLevels = 10

  ; get hull information
  qhull, x, y, /delaunay, bounds = hIdx
  hIdx = hIdx.sort()
  nEdges = n_elements(hIdx)

  ; track the indices that we are adding
  newEdges = list(hIdx, /extract)

  ; get the level of depth we will be in
  newLevel = level + 1

  ; return if more than max number of levels
  if (newLevel gt nLevels) then return, !null

  ; process each potential segment
  for j = 0, nEdges - 2 do begin
    ; skip if our two points are next to each other
    if ((hIdx[j + 1] - hIdx[j]) eq 1) then continue

    ; get the indices of our polygon and close with first point
    newIdx = [[hIdx[j] : hIdx[j + 1]], hIdx[j]]

    ; get new x and y, calculate new area
    newX = x[newIdx]
    newY = y[newIdx]
    newArea = poly_area(newX, newY)

    ; get the change in area and skip if less than our threshold
    added = newArea / area
    if (added le min_area) then continue

    ; recurse
    tmp = zhull(newX, newY, nLevels, newLevel, area, min_area = min_area)
    if (tmp ne !null) then newEdges.add, newIdx[tmp], /extract
  endfor

  ; return the indices
  return, (newEdges.toArray()).uniq()
end