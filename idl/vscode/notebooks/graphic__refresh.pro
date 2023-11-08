; ---------------------------------------------------------------------------
;+
; :Keywords:
;   disable: bidirectional, optional, any
;     Placeholder docs for argument, keyword, or property
;
;-
pro Graphic::Refresh, disable = disable
  compile_opt idl2, hidden

  if (isa(self.__obj__)) then begin
    oTool = self.__obj__.getTool()
    if (isa(oTool)) then begin
      if (keyword_set(disable)) then begin
        oTool.disableUpdates
      endif else begin
        oTool.disableUpdates, previously_disabled = wasDisabled
        oTool.enableUpdates
        ; If we weren't disabled before, then the EnableUpdates will not
        ; actually do a re-draw. So force the re-draw.
        if (~wasDisabled) then begin
          oWin = oTool.getCurrentWindow()
          if (!magic.embed) then begin
            !magic.window = obj_valid(oWin, /get_heap_id)
            !magic.type = 1
            dim = oWin.dimensions
            !magic.xsize = dim[0]
            !magic.ysize = dim[1]
            IDLNotebook.addToNotebook, !magic
          endif
          if (isa(oWin)) then oWin.draw
        endif
      endelse
    endif
  endif
end