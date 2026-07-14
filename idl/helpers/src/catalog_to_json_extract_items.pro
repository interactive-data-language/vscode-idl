;+
; :Description:
;   Gets a file name from an HTML + link
;
; :Returns: String
;
; :Arguments:
;   file: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function getFileFromLink, file
  compile_opt idl2, hidden
  return, (strsplit(file.replace('#', ' '), ' ', /extract))[0]
end

;+
; :Arguments:
;   mainKey: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   item: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   nProcessed: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   allItems: bidirectional, required, List<String>
;     Placeholder docs for argument, keyword, or property
;   allNames: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   tooltips: bidirectional, required, OrderedHash<String>
;     Placeholder docs for argument, keyword, or property
;
; :Keywords:
;   method: bidirectional, optional, any
;     Placeholder docs for argument, keyword, or property
;   type: bidirectional, optional, any
;     Placeholder docs for argument, keyword, or property
;
;-
pro catalog_to_json_extract_items, mainKey, item, nProcessed, allItems, allNames, tooltips, method = method, type = type
  compile_opt idl2, hidden

  ; flag if we can use this routine or not
  flag = !true

  ; get the name and fix to lower case, this is not fortran
  name = item['%name']

  ; check if we have a task and need to clean it up
  if ~name.contains('::') and name.endsWith('Task') then begin
    if ~name.startsWith('ENVI') and ~name.startsWith('IDL') and ~name.startsWith('ESE') then name = 'ENVI' + name
    name = name.replace(' Task', 'Task')
    item['%name'] = name
  endif

  ; check for lower case
  lowName = strlowcase(name)
  if strupcase(name) eq name then begin
    item['%name'] = strlowcase(name)
  endif

  ; skip if function
  if (lowName eq 'preferences') then return
  if (lowName eq 'f') then return

  ; skip bad names
  if name.contains('/') then begin
    print, 'Routine name indicates more than one routine definition: "' + name + '"'
    return
  endif

  ; skip if not a valid name
  if ~IDL_ValidName(name) and ~keyword_set(method) then flag = !false

  ; do something fancy here is we already processed this to remove duplicates?
  ; more for classes which have the same name as functions.
  if allNames.hasKey(name) then begin
    ; print, 'Duplicate name of: "' + name + '"'

    ; there are some duplicates, only skip the envi ones because those are probably weird
    ; things that might be routines and classes
    ; other duplicates will be filtered elsewhere where we check for name and type
    if name.startsWith('ENVI') or name.startsWith('IDL') then begin
      flag = !false
    endif
  endif

  ; skip if ENVI task
  ; if lowName.startsWith('envi') AND lowName.endsWith('task') then flag = !false

  ; skip if envi task parameter, no need for these right now
  if lowName.startsWith('enviparameter') then flag = !false
  if lowName.startsWith('idlparameter') then flag = !false

  ; only process this item if we can
  if flag then begin
    ; init data structure and information
    info = orderedhash()
    info['name'] = item['%name']

    ; save in lookup
    allItems.add, info

    ; placeholder flags for what we are documenting
    isMethod = !false
    isFunction = !false
    isPro = !false
    isStruct = !false
    isSysVar = item['%name'].startsWith('!') ? !true : !false

    ; make sure we have a link that is a non-empty string
    if item.hasKey('%link') then begin
      if keyword_set(method) then begin
        tmp = item['%link']

        ; check if we dont have a link, then make it an anchor
        ; this does not always work, but we should at least have a parent page to go to
        ; in case this doesnt work
        if ~item['%link'].endsWith('.htm') then begin
          info['link'] = method['%link'] + '#' + item['%link']
        endif else begin
          info['link'] = item['%link']
        endelse
      endif else begin
        info['link'] = item['%link']
      endelse

      ; normalize the links to always use ".htm" instead of a mix and match
      info['link'] = info['link'].replace('.html', '.htm')

      ; check if we need to fix to skip
      if info['link'].contains('__') and ~info['name'].contains('::') then begin
        skipThis = !false

        ; check for problem files
        if (strlowcase(info['name']) eq 'e3dlidar') then skipThis = !true
        if (strlowcase(info['name']) eq 'idljavaobject') then skipThis = !true
        if (strlowcase(info['name']) eq 'idlneturl') then skipThis = !true

        ; skip problem child
        if skipThis then begin
          allItems.remove, allItems.length - 1
          return
        endif
      endif
    endif

    ; check if we have syntax
    if item.hasKey('SYNTAX') then begin
      syntaxes = item['SYNTAX']

      ; check if we have a stupid list and we need to get the first
      if ~isa(syntaxes, 'list') then syntaxes = list(syntaxes)

      ; placeholder for the type
      if ~keyword_set(type) then type = ''

      ; process each potential syntax
      foreach syntax, syntaxes, sIdx do begin
        ; make sure that our syntax is valid
        example = syntax['%name']

        ; check if a function or procedure
        ; if we have pro, then we need to keep checking if we have a func syntax
        ; no idea why the help is so confusing and mix + matches the func/pro
        if (type eq 'p') or (sIdx eq 0) then begin
          ; get the trimmed syntax
          trimmed = strlowcase(strcompress(syntax['%name'], /remove_all))
          if (syntax['%type'] eq 'pro') and (type ne 'f') then begin
            ; cant revert from function
            type = 'p'
          endif else begin
            type = 'f'
          endelse
        endif
      endforeach

      ; check if we are a method
      if keyword_set(method) and ~item.hasKey('%object creation') then begin
        isMethod = !true
      endif

      ; save the things and stuff
      if keyword_set(type) then begin
        if (type eq 'p') then begin
          isPro = !true
        endif else begin
          isFunction = !true
        endelse
      endif
    endif

    ; check if we have property information that indicates properties are in another file
    if item.hasKey('PROPERTY') then begin
      field = item['PROPERTY']
      if ~isa(field, 'list') then field = list(field)

      if (n_elements(field) gt 0) then begin
        first = field[0]
        if first.hasKey('%link') then begin
          if keyword_set(info['link']) and keyword_set(first['%link']) and ~first['%link'].startsWith(info['link']) then begin
            info['properties'] = getFileFromLink(first['%link'])
          endif
        endif
      endif
    endif

    ; save flags for the type
    itemName = info['name']

    ; if (strlowcase(itemName) eq 'folderwatch::init') then stop

    case !true of
      (strlowcase(itemName)).endsWith('::init'): info['type'] = 'fm'
      isSysVar: info['type'] = 'sv'
      isMethod and isFunction: info['type'] = 'fm'
      ~isMethod and isFunction: info['type'] = 'f'
      isMethod and isPro: info['type'] = 'pm'
      ~isMethod and isPro: info['type'] = 'p'
      isStruct: info['type'] = 's'
      else: begin
        case !true of
          itemName.startsWith('IDL') and ~itemName.contains('::'): info['type'] = 'f'
          itemName.startsWith('ENVI') and ~itemName.contains('::'): info['type'] = 'f'
          else: info['type'] = 'populate' ; do nothing, must auto-specify the information
        endcase
      end
    endcase

    ; ony save if we are not a class and a method
    if (mainKey ne 'CLASS') or keyword_set(method) then begin
      ; save that we processed this name
      allNames[name] = !true

      ; increment counter
      nProcessed++
    endif

    ; check if we have an object init method and need to re-run with a function placeholder
    if lowName.endswith('::init') then begin
      ; copy our item and make a new name as a function call
      init_method = json_parse(json_serialize(item))
      init_method['%name'] = (init_method['%name'].split('::'))[0]
      init_method['%object creation'] = !true

      ; add new item for this
      catalog_to_json_extract_items, mainKey, init_method, nProcessed, allItems, allNames, tooltips, type = 'f', method = method
    endif
  endif

  ; check if we have methods to process, we can have a class with a routine of the same name, but still need to save information about the routine
  ; for example, ENVIRaster is a function and a class
  ; stop if class and new
  if item.hasKey('METHOD') then begin
    ; make sure we have a list
    methods = item['METHOD']
    if ~isa(methods, 'list') then methods = list(methods)

    ; recurse!
    foreach method, methods do begin
      catalog_to_json_extract_items, mainKey, method, nProcessed, allItems, allNames, tooltips, method = item
    endforeach
  endif
end
