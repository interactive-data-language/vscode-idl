; ---------------------------------------------------------------------------
; IDLitTool::RefreshCurrentWindow
;
; Purpose:
; Generic entry point used to update the current visualization of
; the tool.
;
; The window will be updated immediatly unless updates are currently
; disabled.
;
;+
;-
pro IDLitTool::RefreshCurrentWindow
  compile_opt idl2, hidden

  if (self._idisableupdates gt 0) then begin
    self._idisableupdates++
    return ; updates disabled, increment and return.
  endif

  oWin = self.GetCurrentWindow()
  if (~obj_valid(oWin)) then $
    return

  if (~self._bnoredraw) then begin
    ; Temporarily disable refreshes to prevent recursive re-draws.
    self._bnoredraw = 1b
    if (!magic.embed) then begin
      defsysv, '!super_magic', exists = _exists
      if ~_exists then defsysv, '!super_magic', orderedhash()
      !magic.window = obj_valid(oWin, /get_heap_id)
      !magic.type = 1
      dim = oWin.dimensions
      !magic.xsize = dim[0]
      !magic.ysize = dim[1]
      s = !super_magic
      key = strtrim(!magic.window, 2)
      if ~s.hasKey(key) then s[strtrim(!magic.window, 2)] = orderedhash(!magic, /extract, /lowercase)
    endif
    oWin.Draw
    self._bnoredraw = 0b
  endif
end