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
    oTool = self.__obj__.GetTool()
    if (isa(oTool)) then begin
      if (keyword_set(disable)) then begin
        oTool.DisableUpdates
      endif else begin
        oTool.DisableUpdates, previously_disabled = wasDisabled
        oTool.EnableUpdates
        ; If we weren't disabled before, then the EnableUpdates will not
        ; actually do a re-draw. So force the re-draw.
        if (~wasDisabled) then begin
          oWin = oTool.GetCurrentWindow()
          if (!magic.embed) then begin
            !magic.window = obj_valid(oWin, /get_heap_id)
            !magic.type = 1
            dim = oWin.dimensions
            !magic.xsize = dim[0]
            !magic.ysize = dim[1]
            s = !super_magic
            key = strtrim(!magic.window, 2)
            if ~s.hasKey(key) then s[strtrim(!magic.window, 2)] = orderedhash(!magic, /extract, /lowercase)
          endif
          if (isa(oWin)) then oWin.Draw
        endif
      endelse
    endif
  endif
end