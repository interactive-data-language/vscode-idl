;+
; :Returns: IDLNotebookItem
;
; :Arguments:
;   item: in, required, IDLNotebookPlot_2D
;     The type of item we want to plot
;
;-
function IDLNotebookPlot::_CreateNotebookItem, item
  compile_opt idl2, hidden, static
  on_error, 2

  ;+
  ; See what we are trying to add to our plot
  ;-
  case (!true) of
    ;+
    ; Handle raw GeoJSON
    ;-
    isa(item, 'IDLNotebookPlot_2D'): begin
      ;+ Number of y elements
      nY = item.y.length
      if (nY eq 0) then message, 'No Y data values specified, required!', level = -1

      ; make sure valid
      if ~obj_valid(item.x) then item.x = list(ulindgen(item.y.length), /extract)

      ; check if we need to set the x values
      if (item.x.length eq 0) then begin
        item.x = list(ulindgen(item.y.length), /extract)
      endif

      ; create notebook item and return
      return, IDLNotebook._CreateNotebookItem(item)
    end

    ;+
    ; Unknown data type that we can't handle
    ;-
    else: begin
      message, 'Found an unsupported data type in list of items to add to map', level = -1
    end
  endcase
end

;+
; :Description:
;   Static method that adds a 2D plot to an IDL Notebook
;
;   This specific method manages the validation of the data and should
;   only be added through the `IDLNotebook::AddToNotebook` method
;
; :Arguments:
;   item: in, required, IDLNotebookPlot
;     The plot data structure
;
;-
pro IDLNotebookPlot::_AddToNotebook, item
  compile_opt idl2, hidden, static
  on_error, 2

  ; check if we have an item or if we are making a new map
  if arg_present(item) then begin
    if ~isa(item, 'IDLNotebookPlot') then $
      message, 'Expected input argument to be an IDLNotebookPlot structure', level = -1
    plotThese = item.data
  endif else begin
    ; throw error if we dont have data, keep this logi here in case we want to follow the
    ; pattern for maps
    message, 'Do data, no plot', level = -1

    ;+ get items that we are supposed to map
    plotThese = !idlnotebookmagic.mapitems

    ; return if nothing to add
    if (plotThese.length eq 0) then return
  endelse

  ;+ Create new data structure so that we don't dirty the first
  addItem = {IDLNotebookPlot}
  addItem.data = list()

  ; process all items
  foreach val, plotThese do addItem.data.add, IDLNotebookPlot._CreateNotebookItem(val)

  ; track data
  IDLNotebook._TrackNotebookItem, addItem
end

;+
; :IDLNotebookPlot:
;   data: List<IDLNotebookPlot_2D>
;     The data to add to our plot
;
; :IDLNotebookPlot_Properties:
;   properties: OrderedHash<any>
;     Key-value pars for properties that get passed to the plots
;     that we create.
;
; :IDLNotebookPlot_2D:
;   x: List<Number>
;     X data to plot.
;
;     Optional. If not set, we use the index of the y values as our x
;     axis
;   y: List<Number>
;     Y data to plot (required)
;
;-
pro IDLNotebookPlot__define
  compile_opt idl2, hidden
  on_error, 2

  ;+
  ; Data structure for embedding maps in notebooks
  ;-
  !null = {IDLNotebookPlot, $
    data: list()}

  ;+
  ; Properties for notebook plots, used for inheritance
  ;-
  !null = {IDLNotebookPlot_Properties, $
    properties: orderedhash()}

  ;+
  ; Data structure for embedding a series of image as an animation
  ;-
  !null = {IDLNotebookPlot_2D, $
    inherits IDLNotebookPlot_Properties, $
    x: list(), $
    y: list()}
end