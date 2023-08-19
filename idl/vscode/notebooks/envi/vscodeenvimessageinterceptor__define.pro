;+
; :Returns: VSCodeENVIMessageInterceptor
;
;-
function VSCodeENVIMessageInterceptor::Init
  compile_opt idl2, hidden
  on_error, 2
  if (~self.ENVIMessageHandler::Init()) then begin
    RETURN, 0
  endif

  e = envi(/current)
  oChannel = e.GetBroadcastChannel()
  oChannel.Subscribe, self
  return, 1
end

;+
;-
pro VSCodeENVIMessageInterceptor::Cleanup
  compile_opt idl2, hidden
  on_error, 2
  self.ENVIMessageHandler::Cleanup
  e = envi(/current)
  oChannel = e.GetBroadcastChannel()
  if (obj_valid(oChannel)) then begin
    oChannel.Unsubscribe, self
  endif
end

;+
; :Arguments:
;   msg: in, required, ENVIStartMessage | ENVIProgressMessage | ENVIFinishMessage
;     Placeholder docs for argument, keyword, or property
;
;-
pro VSCodeENVIMessageInterceptor::OnMessage, msg
  compile_opt idl2, hidden
  on_error, 2
  case (1) of
    isa(msg, 'ENVIStartMessage'): begin
      print, 'Start ', msg.message
    end
    isa(msg, 'ENVIProgressMessage'): begin
      print, '    ', 'Percent Complete:', msg.percent, '%'
    end
    isa(msg, 'ENVIFinishMessage'): begin
      print, 'Finish'
    end
    else: ; do nothing
  endcase
end

;+
; :VSCodeENVIMessageInterceptor:
;
;-
pro VSCodeENVIMessageInterceptor__define
  compile_opt idl2, hidden
  on_error, 2
  !null = {VSCodeENVIMessageInterceptor, $
    inherits ENVIMessageHandler}
end