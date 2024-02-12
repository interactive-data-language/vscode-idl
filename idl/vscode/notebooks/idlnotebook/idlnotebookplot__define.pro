;+
; :Returns: IDLNotebookItem
;
; :Arguments:
;   item: in, required, IDLNotebookPlot_Line | IDLNotebookPlot_LineAnimatio | IDLNotebookPlot_Bubble | IDLNotebookPlot_BubbleAnimation
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
    ; Handle line and bubble data validation
    ;-
    isa(item, 'IDLNotebookPlot_Line') or isa(item, 'IDLNotebookPlot_Bubble'): begin
      ;+ Number of y elements
      nY = item.y.length
      if (nY eq 0) then message, 'No Y data values specified, required!', level = -1

      ; make sure valid
      if ~obj_valid(item.x) then item.x = list(ulindgen(item.y.length), /extract)

      ; check if we need to set the x values
      if (item.x.length eq 0) then begin
        item.x = list(ulindgen(item.y.length), /extract)
      endif

      ; make sure we have the same number of x points
      if ~(n_elements(item.x) eq nY) then $
        message, 'Plot item does not have the same number of x and y data points', level = -1

      ; if bubble plot, check size
      if isa(item, 'IDLNotebookPlot_Bubble') then begin
        if ~obj_valid(item.r) then $
          message, 'Bubble plots are requried to have radius specified', level = -1

        ; make sure we have the same number of x points
        if ~(n_elements(item.r) eq nY) then $
          message, 'Bubble plot radii does not have the same number of x and y data points', level = -1
      endif

      ; create notebook item and return
      return, IDLNotebook._createNotebookItem(item)
    end

    ;+
    ; Handle line animations
    ;-
    isa(item, 'IDLNotebookPlot_LineAnimation'): begin
      ; make sure valid
      if ~obj_valid(item.frames) then message, 'No frames to add for IDLNotebookPlot_LineAnimation', level = -1

      ; make sure valid
      if (n_elements(item.frames) eq 0) then message, 'No frames to add for IDLNotebookPlot_LineAnimation', level = -1

      ; add to notebook
      return, IDLNotebook._createNotebookItem(item)
    end

    ;+
    ; Handle bubble animations
    ;-
    isa(item, 'IDLNotebookPlot_BubbleAnimation'): begin
      ; make sure valid
      if ~obj_valid(item.frames) then message, 'No frames to add for IDLNotebookPlot_LineAnimation', level = -1

      ; make sure valid
      if (n_elements(item.frames) eq 0) then message, 'No frames to add for IDLNotebookPlot_LineAnimation', level = -1

      ; add to notebook
      return, IDLNotebook._createNotebookItem(item)
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
  addItem.properties = obj_valid(item.properties) ? item.properties : orderedhash()

  ; process all items
  foreach val, plotThese do addItem.data.add, IDLNotebookPlot._createNotebookItem(val)

  ; track data
  IDLNotebook._trackNotebookItem, addItem
end

;+
; :Private:
;
; :IDLNotebookPlot_Properties:
;   properties: OrderedHash<any>
;     Key-value pars for properties that get passed to the plots
;     that we create.
;
; :IDLNotebookPlot:
;   data: List<IDLNotebookPlot_Line | IDLNotebookPlot_LineAnimation | IDLNotebookPlot_Bubble | IDLNotebookPlot_BubbleAnimation>
;     The data to add to our plot
;
; :IDLNotebookPlot_LineFrame:
;   x: List<Number>
;     X data to plot.
;
;     Optional. If not set, we use the index of the y values as our x
;     axis
;   y: List<Number>
;     Y data to plot (required)
;
; :IDLNotebookPlot_Line:
;
; :IDLNotebookPlot_LineAnimation:
;   frames: List<IDLNotebookPlot_LineFrame>
;     The data for each frame of our line plot plot
;
; :IDLNotebookPlot_BubbleFrame:
;   r: List<Number>
;     The size of the bubbles in the plot
;
; :IDLNotebookPlot_Bubble:
;
; :IDLNotebookPlot_BubbleAnimation:
;   frames: List<IDLNotebookPlot_BubbleFrame>
;     The data for each frame of our bubble plot
;
;-
pro IDLNotebookPlot__define
  compile_opt idl2, hidden
  on_error, 2

  ;+
  ; Properties for notebook plots, used for inheritance
  ;-
  !null = {IDLNotebookPlot_Properties, $
    properties: orderedhash()}

  ;+
  ; Data structure for embedding maps in notebooks
  ;-
  !null = {IDLNotebookPlot, $
    inherits IDLNotebookPlot_Properties, $
    data: list()}

  ;+
  ; Data format for scatter/line plot
  ;-
  !null = {IDLNotebookPlot_LineFrame, $
    x: list(), $
    y: list()}

  ;+
  ; Data structure for embedding a series of image as an animation
  ;-
  !null = {IDLNotebookPlot_Line, $
    inherits IDLNotebookPlot_Properties, $
    inherits IDLNotebookPlot_LineFrame}

  ;+
  ; Data structure for line plot animation
  ;-
  !null = {IDLNotebookPlot_LineAnimation, $
    inherits IDLNotebookPlot_Properties, $
    frames: list()}

  ;+
  ; Data format for bubble plot
  ;-
  !null = {IDLNotebookPlot_BubbleFrame, $
    inherits IDLNotebookPlot_LineFrame, $
    r: list()}

  ;+
  ; Data structure for bubble plots
  ;-
  !null = {IDLNotebookPlot_Bubble, $
    inherits IDLNotebookPlot_Properties, $
    inherits IDLNotebookPlot_BubbleFrame}

  ;+
  ; Data structure for bubble plot animation
  ; -
  !null = {IDLNotebookPlot_BubbleAnimation, $
    inherits IDLNotebookPlot_Properties, $
    frames: list()}
end