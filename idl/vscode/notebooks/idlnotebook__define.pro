;+
; :Description:
;   This static method registers an item as needed to be embedded
;   within a notebook cell
;
; :Arguments:
;   item: in, required, IDLNotebookEncodedPN | IDLNotebookImageFromURI | IDLNotebookAnimationFromURIs
;     The item we are adding to a notebook
;
;-
pro IDLNotebook::AddToNotebook, item
  compile_opt idl2, hidden, static
  on_error, 2

  ;+
  ; The "types" for the IDLNotebookMagic should match what typescript
  ; expects in the notebook controller
  ;-
  switch (!true) of
    isa(item, 'IDLNotebookEncodedPNG'): begin
      ; save
      !notebook_magic.add, $
        {IDLNotebookMagic, type: 'image-png-encoded', data: orderedhash(item, /fold_case)}
    end
    isa(item, 'IDLNotebookImageFromURI'): begin
      ; validate
      if ~file_test(item.uri) then begin
        mesage, 'File does not exist: "' + item.uri + '"', level = -1
      endif

      ; save
      !notebook_magic.add, $
        {IDLNotebookMagic, type: 'image', data: orderedhash(item, /fold_case)}
    end
    isa(item, 'IDLNotebookAnimationFromURIs'): begin
      ; validate
      nImages = n_elements(item.uris)

      ; make sure we have images
      if (nImages eq 0) then message, 'No images to add', level = = -1

      ; make sure all files exist
      foreach uri, item.uris do begin
        if ~file_test(uri) then begin
          mesage, 'File does not exist: "' + uri + '"', level = -1
        endif
      endforeach

      ; save
      !notebook_magic.add, $
        {IDLNotebookMagic, type: 'animation', data: orderedhash(item, /fold_case)}
    end
    else: begin
      message, 'Item is not a known structure to embed in a notebook', level = -1
    end
  endswitch
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
  compile_opt idl2, hidden, static
  on_error, 2

  if (isa(extra)) then $
    self.idlnotebook__define::SetProperty, _extra = extra

  return, 1
end

;+
; :Description:
;   Destructor
;
;-
pro IDLNotebook::Cleanup
  compile_opt idl2, hidden, static
  on_error, 2
end

;+
; :Description:
;   Class definition procedure
;
; :IDLNotebook:
; :IDLNotebookBaseImage:
;   xsize: Number
;     The width of the PNG for display
;   ysize: Number
;     The height of the PNG for display
;
; :IDLNotebookEncodedPNG:
;   data: String
;     Base64 encoded PNG
;
; :IDLNotebookImageFromURI:
;   uri: String
;     Fully-qualified filepath to an image on disk.
;
;     At this time, only PNGs are supported
;
; :IDLNotebookAnimationFromURIs:
;   uris: Array<String>
;     Fully-qualified filepaths to images on disk that you want to create
;     an animation for.
;
;     At this time, only PNGs are supported.
;
; :IDLNotebookMagic:
;   data: OrderedHash<any>
;     The paired structure for the type of notebook magic
;   type: String
;     The type of notebook magic
;
;-
pro IDLNotebook__define
  compile_opt idl2, hidden
  on_error, 2

  !null = {IDLNotebook}

  ; make sure super magic exists
  defsysv, '!notebook_magic', exists = _exists
  if ~_exists then defsysv, '!notebook_magic', list()

  ;+
  ; Base datas tructure for image
  ;-
  !null = {IDLNotebookBaseImage, $
    xsize: 0, $
    ysize: 0}

  ;+
  ; Data structure for embedding an image
  ;-
  !null = {IDLNotebookEncodedPNG, $
    inherits IDLNotebookBaseImage, $
    data: bytarr(1)}

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
    uris: strarr(1)}

  ;+
  ; Messages stored in `!notebook_magic`
  ;-
  !null = {IDLNotebookMagic, $
    type: 'string', $
    data: orderedhash()}
end