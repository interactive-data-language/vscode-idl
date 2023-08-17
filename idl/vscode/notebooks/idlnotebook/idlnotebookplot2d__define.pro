;+
; :Description:
;   Static method that adds a 2D plot to an IDL Notebook
;
;   This specific method manages the validation of the data and should
;   only be added through the `IDLNotebook::AddToNotebook` method
;
; :Arguments:
;   item: in, required, IDLNotebookPlot2D
;     The plot data for notebooks
;
;-
pro IDLNotebookPlot2D::_AddToNotebook, item
  compile_opt idl2, hidden, static
  on_error, 2

  ; validate input
  if ~isa(item, 'IDLNotebookPlot2D') then begin
    message, 'Expected input argument to be an IDLNotebookPlot2D structure', level = -1
  endif

  ;+ Number of y elements
  nY = item.y.length
  if (nY eq 0) then message, 'No Y data values specified, required!', level = -1

  ; make sure valid
  if ~obj_valid(item.x) then item.x = list(ulindgen(item.y.length), /extract)

  ; check if we need to set the x values
  if (item.x.length eq 0) then begin
    item.x = list(ulindgen(item.y.length), /extract)
  endif

  ; track data
  IDLNotebook._TrackNotebookItem, item
end

;+
; :IDLNotebookPlot2D:
;   x: List<Number>
;     X data to plot.
;
;     Optional. If not set, we use the index of the y values as our x
;     axis
;   y: List<Number>
;     Y data to plot (required)
;
;-
pro IDLNotebookPlot2D__define
  compile_opt idl2, hidden
  on_error, 2

  ;+
  ; Data structure for embedding a series of image as an animation
  ;-
  !null = {IDLNotebookPlot2D, $
    x: list(), $
    y: list()}
end