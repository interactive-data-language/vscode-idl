;+
; :Description:
;   This static method registers an item as needed to be embedded
;   within a notebook cell
;
; :Arguments:
;   item: in, required, !magic | IDLNotebookEncodedPNG | IDLNotebookImageFromURI | IDLNotebookAnimationFromURIs
;     The item we are adding to a notebook
;
;-
pro IDLNotebook::AddToNotebook, item
  compile_opt idl2, hidden, static
  on_error, 2

  ;+
  ; The "types" for the IDLNotebookMagicItem should match what typescript
  ; expects in the notebook controller
  ;-
  case (!true) of
    ;+
    ; Check for encoded PNG
    ;-
    isa(item, '!magic'): begin
      ; return if we dont have an item to track
      if (!magic.window eq -1) then return

      ; get the ID of the window
      id = strtrim(!magic.window, 2)

      ; if we havent tracked it yet, save it
      if ~!idlnotebookmagic.graphics.hasKey(id) then begin
        !idlnotebookmagic.graphics[id] = orderedhash(!magic, /extract, /lowercase)

        ; save in our list
        !idlnotebookmagic.items.add, $
          {IDLNotebookLegacyMagic, magic: orderedhash(!magic, /extract, /lowercase)}
      endif
    end

    ;+
    ; Check for encoded PNG
    ;-
    isa(item, 'IDLNotebookEncodedPNG'): IDLNotebook._TrackNotebookItem, item

    ;+
    ; Check for image we are adding from a URI
    ;-
    isa(item, 'IDLNotebookImageFromURI'): begin
      ; validate
      if ~file_test(item.uri) then begin
        mesage, 'File does not exist: "' + item.uri + '"', level = -1
      endif

      ; track
      IDLNotebook._TrackNotebookItem, item
    end

    ;+
    ; Check if we have an animation based on multiple images on disk
    ;-
    isa(item, 'IDLNotebookAnimationFromURIs'): begin
      ; validate
      nImages = n_elements(item.uris)

      ; make sure we have images
      if (nImages eq 0) then message, 'No images to add', level = -1

      ; make sure all files exist
      foreach uri, item.uris do begin
        if ~file_test(uri) then begin
          mesage, 'File does not exist: "' + uri + '"', level = -1
        endif
      endforeach

      ; track
      IDLNotebook._TrackNotebookItem, item
    end
    else: begin
      message, 'Item is not a known structure to embed in a notebook', level = -1
    end
  endcase
end

;+
; :Private:
;
; :Returns: IDLNotebookMagicItem
;
; :Arguments:
;   item: in, required, Structure
;     The structure we are creating a notebook magic item from
;
;-
function IDLNotebook::_CreateNotebookMagicItem, item
  compile_opt idl2, hidden, static
  on_error, 2

  ; validate input
  if ~arg_present(item) then message, 'Item not specified, required!', level = -1

  ; create and return
  return, {IDLNotebookMagicItem, $
    type: strlowcase(tag_names(item, /structure_name)), $
    item: orderedhash(item, /lowercase)}
end

;+
; :Description:
;   Exports (to the console via print) all of the magic items that
;   we are currently tracking
;
;   Cleans up and removes everything after we have exported
;
;-
pro IDLNotebook::Export
  compile_opt idl2, hidden, static
  ; on_error, 2

  catch, err
  if (err ne 0) then begin
    catch, /cancel
    help, /last_message
    message, /reissue_last
  endif

  ; check if we have a new graphics item (or maybe direct graphics)
  if (!magic.window ne -1) then IDLNotebook.AddToNotebook, !magic

  ;+ Track the items that we will report
  export = list()

  ; convert all items for export
  foreach item, !idlnotebookmagic.items do begin
    ;+
    ; If we have a legacy magic item, convert to encoded PNG first
    ;-
    if isa(item, 'IDLNotebookLegacyMagic') then begin
      ; encode graphic
      encoded = EncodeGraphic(item.magic['window'], item.magic['type'])

      ; skip if we werent able to encode
      if (encoded eq !null) then continue

      ;+ Create PNG data structre
      png = {IDLNotebookEncodedPNG}
      png.data = encoded
      png.xsize = long(item.magic['xsize'])
      png.ysize = long(item.magic['ysize'])

      ; Why doesnt this work??
      ; png = {IDLNotebookEncodedPNG, $
      ; data: encoded, $
      ; xsize: long(item.magic['xsize']), $
      ; ysize: long(item.magic['ysize'])}

      ; create exportable structure and return
      export.add, IDLNotebook._CreateNotebookMagicItem(png)
    endif else begin
      export.add, item
    endelse
  endforeach

  ; clean up
  IDLNotebook.Reset

  ; print
  print, json_serialize(export, /lowercase)
end

;+
; :Description:
;   Constructor
;
; :Returns: IDLNotebook
;
; :Keywords:
;   _extra: bidirectional, optional, any
;     Placeholder docs for argument, keyword, or property
;
;-
function IDLNotebook::Init, _extra = extra
  compile_opt idl2, hidden
  on_error, 2

  if (isa(extra)) then $
    self.idlnotebook__define::SetProperty, _extra = extra

  return, 1
end

;+
; :Description:
;   Resets properties and clears all tracked items
;
;-
pro IDLNotebook::Reset
  compile_opt idl2, hidden, static
  on_error, 2

  ; clean up our objects
  !idlnotebookmagic.items.remove, /all
  !idlnotebookmagic.graphics.remove, /all

  ; clear any IDs for the window that we have currently embedded
  !magic.window = -1
end

;+
; :Private:
;
; :Arguments:
;   item: in, required, Structure
;     The structure we are creating a notebook magic item from
;
;-
pro IDLNotebook::_TrackNotebookItem, item
  compile_opt idl2, hidden, static
  on_error, 2

  ; add and return
  !idlnotebookmagic.items.add, IDLNotebook._CreateNotebookMagicItem(item)
end

;+
; :Description:
;   Class definition procedure
;
; :IDLNotebook:
;   _foo: any
;     Placeholder docs for argument, keyword, or property
;
; :IDLNotebookLegacyMagic:
;   magic: OrderedHash<any>
;     An ordered-hash version of our !magic system variable
;     at the time of it being added
;
; :IDLNotebookBaseImage:
;   xsize: Number
;     The width of the PNG for display
;   ysize: Number
;     The height of the PNG for display
;
; :IDLNotebookEncodedPNG:
;   data: String
;     Base64 encoded PNG as a string
;
; :IDLNotebookImageFromURI:
;   uri: String
;     Fully-qualified filepath to an image on disk.
;
;     At this time, only PNGs are supported
;
; :IDLNotebookAnimationFromURIs:
;   uris: List<String>
;     Fully-qualified filepaths to images on disk that you want to create
;     an animation for.
;
;     At this time, only PNGs are supported.
;
; :IDLNotebookMagicItem:
;   item: OrderedHash<any>
;     The paired structure for the type of notebook magic
;   type: String
;     The type of notebook magic
;
; :IDLNotebookMagic:
;   graphics: OrderedHash<!magic>
;     By window ID, track graphics that we need to embed
;   items: List<any>
;     The items that we are adding to our notebook
;
;-
pro IDLNotebook__define
  compile_opt idl2, hidden
  on_error, 2

  ;+
  ; Data structure for this class, null because we dont
  ; store anything ourselved
  ;-
  !null = {IDLNotebook, _foo: 'bar'}

  ;+
  ; Legacy magic definition for all of our graphics
  ;-
  !null = {IDLNotebookLegacyMagic, $
    magic: orderedhash()}

  ;+
  ; Base datas tructure for image
  ;-
  !null = {IDLNotebookBaseImage, $
    xsize: 0l, $
    ysize: 0l}

  ;+
  ; Data structure for embedding an image
  ;-
  !null = {IDLNotebookEncodedPNG, $
    inherits IDLNotebookBaseImage, $
    data: 'base64'}

  ;+
  ; Data structure for embedding an image
  ;-
  !null = {IDLNotebookImageFromURI, $
    inherits IDLNotebookBaseImage, $
    uri: ''}

  ;+
  ; Data structure for embedding a series of image as an animation
  ;-
  !null = {IDLNotebookAnimationFromURIs, $
    inherits IDLNotebookBaseImage, $
    uris: list()}

  ;+
  ; Messages stored in `!IDLNotebookMagic`
  ;-
  !null = {IDLNotebookMagicItem, $
    type: 'string', $
    item: orderedhash()}

  ;+
  ; Data structure for the notebook magic system variable
  ;-
  !null = {IDLNotebookMagic, $
    items: list(), $
    graphics: orderedhash()}

  ; make sure super magic exists
  defsysv, '!IDLNotebookMagic', exists = _exists
  if ~_exists then defsysv, '!IDLNotebookMagic', $
    {IDLNotebookMagic, items: list(), graphics: orderedhash(/fold_case)}
end