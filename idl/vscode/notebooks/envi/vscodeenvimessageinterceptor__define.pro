;+
; :Description:
;   Creates our message interceptor and registers it with ENVI (requires that ENVI is launched)
;
; :Returns: VSCodeENVIMessageInterceptor
;
; :Keywords:
;   verbose: in, optional, Boolean
;     If set, we print out all progress messages, otherwise we only print
;     the first one and not any child task messages.
;
;-
function VSCodeENVIMessageInterceptor::Init, verbose = verbose
  compile_opt idl2, hidden
  on_error, 2

  ; get the current ENVI session
  e = envi(/current)

  ; validate ENVI has started stop
  if (e eq !null) then message, 'ENVI has not started yet, required!', level = -1

  ; init super
  if (~self.ENVIMessageHandler::Init()) then begin
    return, 0
  endif

  ; init properties
  self.stack = 0
  self.verbose = keyword_set(verbose)

  ; get the channel and subscribe
  oChannel = e.GetBroadcastChannel()
  oChannel.Subscribe, self

  ; return 1 as valid object
  return, 1
end

;+
; :Description:
;   Cleans up our message interceptor
;
;-
pro VSCodeENVIMessageInterceptor::Cleanup
  compile_opt idl2, hidden
  on_error, 2

  ; clean up super
  self.ENVIMessageHandler::Cleanup

  ; get ENVI
  e = envi(/current)

  ; make sure valid
  if (e ne !null) then begin
    oChannel = e.GetBroadcastChannel()
    if (obj_valid(oChannel)) then oChannel.Unsubscribe, self
  endif
end

;+
; :Description:
;   Handle intercepted messages from ENVI
;
; :Arguments:
;   msg: in, required, ENVIStartMessage | ENVIProgressMessage | ENVIFinishMessage
;     Placeholder docs for argument, keyword, or property
;
;-
pro VSCodeENVIMessageInterceptor::OnMessage, msg
  compile_opt idl2, hidden
  on_error, 2

  ; get the indent size
  indent = self.stack eq 0 ? '' : strjoin(replicate('  ', self.stack))

  ; handle our different messages
  case (!true) of
    ;+
    ; Start of progress
    ;-
    isa(msg, 'ENVIStartMessage'): begin
      self.stack++

      ;+ get the message we print
      useMsg = (msg.message.replace('Task', '')).replace('task', '')

      if (self.stack eq 1 || self.stack gt 1 and self.verbose) then $
        print, indent + useMsg.trim()
    end

    ;+
    ; Progress message for what we are running
    ;-
    isa(msg, 'ENVIProgressMessage'): begin
      if (self.stack eq 1 || self.stack gt 1 and self.verbose) then $
        print, strjoin([indent, msg.message.trim(), ', Progress=', strtrim(long(msg.percent), 2), '%'])
    end

    ;+
    ; Progress bar finished
    ;-
    isa(msg, 'ENVIFinishMessage'): begin
      self.stack--
      if (self.stack eq 0 || self.stack gt 0 and self.verbose) then $
        print, strmid(indent, 2) + 'Finished!'
    end

    else: ; do nothing
  endcase
end

;+
; :VSCodeENVIMessageInterceptor:
;   stack: Long
;     The number of pending progress bars
;   verbose: Boolean
;     If we print all messages or not
;
;-
pro VSCodeENVIMessageInterceptor__define
  compile_opt idl2, hidden
  on_error, 2
  !null = {VSCodeENVIMessageInterceptor, $
    inherits ENVIMessageHandler, $
    stack: 0l, $
    verbose: !false}
end