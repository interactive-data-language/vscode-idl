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
  self.laststart = list()
  self.lastprogress = list()

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
      if (n_elements(self.laststart) gt 0) then begin
        if (self.laststart[-1] eq msg.message) then return
      endif

      self.stack++

      ;+ get the message we print
      useMsg = (msg.message.replace('Task', '')).replace('task', '')

      if (self.stack eq 1 || self.stack gt 1 and self.verbose) then $
        print, indent + useMsg.trim()

      ; track info about progress
      self.laststart.add, msg.message
      self.lastprogress.add, -1
    end

    ;+
    ; Progress message for what we are running
    ;-
    isa(msg, 'ENVIProgressMessage'): begin
      ; return if same as last
      if (msg.percent le self.lastprogress[self.stack - 1]) then return

      ; track current progress
      self.lastprogress[self.stack - 1] = msg.percent

      if (self.stack eq 1 || self.stack gt 1 and self.verbose) then $
        print, strjoin([indent, msg.message.trim(), ', Progress=', strtrim(long(msg.percent), 2), '%'])
    end

    ;+
    ; Progress bar finished
    ;-
    isa(msg, 'ENVIFinishMessage'): begin
      ; ; update stack count
      self.stack--

      ; remove last progress
      self.laststart.remove
      self.lastprogress.remove

      ; attempt to print
      if (self.stack eq 0 || self.stack gt 0 and self.verbose) then begin
        print, strmid(indent, 2) + 'Finished!'
        print
      endif
    end

    else: ; do nothing
  endcase
end

;+
; :VSCodeENVIMessageInterceptor:
;   lastprogress: List<Byte>
;     Track the previous progress percentage
;   laststart: List<String>
;     Titles of start messages to filter duplicates
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
    laststart: list(), $
    lastprogress: list(), $
    verbose: !false}
end