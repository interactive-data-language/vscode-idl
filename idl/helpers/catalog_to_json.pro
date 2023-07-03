;+
; :Description:
;   Wrapper routine that converts IDL help catalog files to a condensed,
;   more organized, JSON file format for use with the IDL extension.
;
;   To use this you should have ENVI + IDL and the ENVI Deep Learning Module
;   installed because they have all of the routines needed for creating the
;   JSON lookup table.
;
; :Returns: Hash<String>
;
; :Author:
;   Zachary Norman - GitHub: znorman-harris
;
;-
function getTypeOverrides
  compile_opt idl2, hidden

  ;+ type overrides for routine types
  ; automatically maps functions and procedures to function./procedure methods
  ; before returning (that way you have less to specify)
  typeOverride = orderedhash(/fold_case)
  typeOverride['openr'] = 'p'
  typeOverride['openw'] = 'p'
  typeOverride['openu'] = 'p'
  typeOverride['print'] = 'p'
  typeOverride['printf'] = 'p'
  typeOverride['read'] = 'p'
  typeOverride['readu'] = 'p'
  typeOverride['readf'] = 'p'
  typeOverride['crosshair'] = 'f'
  typeOverride['ENVIBoundingBoxSet::GetGeoJSON'] = 'f'
  typeOverride['class_doit'] = 'p'
  typeOverride['ENVITask::Validate'] = 'f'
  typeOverride['ENVIWorkflowStep::GetUIObject'] = 'fm'
  typeOverride['ENVIWorkflowStep::StyleSheetResetUIClass'] = 'p'
  typeOverride['ENVIWorkflowStep::StyleSheetSetUIClass'] = 'p'
  typeOverride['ENVIWorkflowStep::StyleSheetShowParameters'] = 'p'
  typeOverride['ENVIConfusionMatrix::Save'] = 'p'
  typeOverride['ENVIPreferences::Load'] = 'p'
  typeOverride['ENVISVMClassifier::Save'] = 'p'
  typeOverride['E3DLasHeader'] = 'f'
  typeOverride['E3DLidar'] = 'f'
  typeOverride['E3DLidar::GetLasHeader'] = 'f'
  typeOverride['E3DLidarPointFilter'] = 'f'
  typeOverride['E3DLidarSpatialRef'] = 'f'
  typeOverride['E3DProductionParameters'] = 'f'
  typeOverride['E3DProductsInfo'] = 'f'
  typeOverride['E3De'] = 'f'
  typeOverride['ENVIIterativeTrainer::Save'] = 'p'
  typeOverride['envi'] = 'f'
  typeOverride['ENVIExamples::Save'] = 'p'
  typeOverride['envinitf'] = 'f'
  typeOverride['CreateSVMClassifier'] = 'f'
  typeOverride['ENVIGradientDescentTrainer::Save'] = 'p'
  typeOverride['ENVIServer::GetExecutedTask'] = 'f'
  typeOverride['enviui'] = 'f'
  typeOverride['enviroi'] = 'f'
  typeOverride['ENVIPointCloudViewer::GetViewExtents'] = 'f'
  typeOverride['ENVIPointCloudViewer::SetProgress'] = 'p'
  typeOverride['ENVIPointCloudViewer::SetViewExtents'] = 'p'
  typeOverride['ENVISoftmaxRegressionClassifier::Save'] = 'p'
  typeOverride['cdf_attget_entry'] = 'p'
  typeOverride['grib_getdata'] = 'f'
  typeOverride['hdf_parse'] = 'f'
  typeOverride['h5_putdata'] = 'p'
  typeOverride['h5_put'] = 'p'
  typeOverride['image_threshold'] = 'f'
  typeOverride['symbol'] = 'f'
  typeOverride['ncdf_parse'] = 'f'
  typeOverride['ts_lanczos'] = 'f'
  typeOverride['map'] = 'f'
  typeOverride['arrow'] = 'f'
  typeOverride['IDLffXMLDOMDocumentFragment::Init'] = 'f'
  typeOverride['axis'] = 'f'
  typeOverride['ESETaskParameter'] = 'f'
  typeOverride['ese'] = 'f'
  typeOverride['barplot'] = 'f'
  typeOverride['plot'] = 'f'
  typeOverride['BigInteger'] = 'f'
  typeOverride['BigInteger::GCD'] = 'f'
  typeOverride['BigInteger::LCM'] = 'f'
  typeOverride['BigInteger::ModInverse'] = 'f'
  typeOverride['BigInteger::ModPower'] = 'f'
  typeOverride['BigInteger::NextPrime'] = 'f'
  typeOverride['BigInteger::Signum'] = 'f'
  typeOverride['BigInteger::Sqrt'] = 'f'
  typeOverride['BigInteger::ToDouble'] = 'f'
  typeOverride['BigInteger::ToInteger'] = 'f'
  typeOverride['BigInteger::ToString'] = 'f'
  typeOverride['plot3d'] = 'f'
  typeOverride['boxplot'] = 'f'
  typeOverride['bubbleplot'] = 'f'
  typeOverride['widget_window'] = 'f'
  typeOverride['Python::Run'] = 'p'
  typeOverride['IDLffXMLDOMEntityReference::Init'] = 'f'
  typeOverride['polyline'] = 'f'
  typeOverride['ESEServer'] = 'f'
  typeOverride['ESEServer::FindTask'] = 'f'
  typeOverride['clipboard'] = 'f'
  typeOverride['Clipboard::Set'] = 'p'
  typeOverride['ESETask'] = 'f'
  typeOverride['colorbar'] = 'f'
  typeOverride['IDLffXMLDOMAttr::Init'] = 'f'
  typeOverride['contour'] = 'f'
  typeOverride['window'] = 'f'
  typeOverride['IDLnetJPIP::Cleanup'] = 'p'
  typeOverride['IDLnetJPIP::GetData'] = 'f'
  typeOverride['IDLnetJPIP::GetProperty'] = 'f'
  typeOverride['IDLnetJPIP::GetStatistics'] = 'f'
  typeOverride['IDLnetJPIP::GetUuid'] = 'f'
  typeOverride['IDLnetJPIP::Init'] = 'f'
  typeOverride['IDLnetJPIP::Open'] = 'f'
  typeOverride['IDLnetJPIP::SetProperty'] = 'p'
  typeOverride['list'] = 'f'
  typeOverride['volume'] = 'f'
  typeOverride['ESEJob'] = 'f'
  typeOverride['TrackBall'] = 'f'
  typeOverride['dictionary'] = 'f'
  typeOverride['Dictionary::HasKey'] = 'f'
  typeOverride['Dictionary::Keys'] = 'f'
  typeOverride['Dictionary::ToStruct'] = 'f'
  typeOverride['Dictionary::Values'] = 'f'
  typeOverride['IDLffXMLDOMNode::Init'] = 'f'
  typeOverride['ellipse'] = 'f'
  typeOverride['ESEFolder'] = 'f'
  typeOverride['folderwatch'] = 'f'
  typeOverride['FolderWatch::Check'] = 'p'
  typeOverride['FolderWatch::Start'] = 'p'
  typeOverride['ESECatalog'] = 'f'
  typeOverride['errorplot'] = 'f'
  typeOverride['scatterplot3d'] = 'f'
  typeOverride['ESEService'] = 'f'
  typeOverride['fillplot'] = 'f'
  typeOverride['IDLffVideoWrite::AddVideoStream'] = 'f'
  typeOverride['IDLffVideoWrite::GetStreams'] = 'f'
  typeOverride['hash'] = 'f'
  typeOverride['Hash::HasKey'] = 'f'
  typeOverride['Hash::Keys'] = 'f'
  typeOverride['Hash::ToStruct'] = 'f'
  typeOverride['Hash::Values'] = 'f'
  typeOverride['IDLTaskFromProcedure::PreExecute'] = 'p'
  typeOverride['IDLTaskFromProcedure::DoExecute'] = 'p'
  typeOverride['IDLTaskFromProcedure::PostExecute'] = 'p'
  typeOverride['IDLffXMLDOMCharacterData::Init'] = 'f'
  typeOverride['IDLffXMLDOMComment::Init'] = 'f'
  typeOverride['text'] = 'f'
  typeOverride['IDLTask::Parameter'] = 'f'
  typeOverride['IDL_Object::_overloadForeach'] = 'p'
  typeOverride['idl_primitive'] = 'f'
  typeOverride['IDL_Primitive::Dehydrate'] = 'f'
  typeOverride['IDL_Primitive::Hydrate'] = 'f'
  typeOverride['IDL_Primitive::IsPrimitive'] = 'f'
  typeOverride['IDLffXMLDOMProcessingInstruction::Init'] = 'f'
  typeOverride['IDLffXMLDOMCDATASection::Init'] = 'f'
  typeOverride['IDLffXMLDOMDocumentType::Init'] = 'f'
  typeOverride['IDLffXMLDOMElement::Init'] = 'f'
  typeOverride['IDLffXMLDOMEntity::Init'] = 'f'
  typeOverride['IDLffXMLDOMNamedNodeMap::Init'] = 'f'
  typeOverride['IDLffXMLDOMNodeIterator::Init'] = 'f'
  typeOverride['IDLffXMLDOMNodeList::Init'] = 'f'
  typeOverride['IDLffXMLDOMNotation::Init'] = 'f'
  typeOverride['IDLffXMLDOMText::Init'] = 'f'
  typeOverride['IDLffXMLDOMTreeWalker::Init'] = 'f'
  typeOverride['image'] = 'f'
  typeOverride['surface'] = 'f'
  typeOverride['mapgrid'] = 'f'
  typeOverride['timestamp'] = 'f'
  typeOverride['mapcontinents'] = 'f'
  typeOverride['legend'] = 'f'
  typeOverride['vector'] = 'f'
  typeOverride['polygon'] = 'f'
  typeOverride['symbol'] = 'f'
  typeOverride['polarplot'] = 'f'
  typeOverride['orderedhash'] = 'f'
  typeOverride['OrderedHash::HasKey'] = 'f'
  typeOverride['OrderedHash::Keys'] = 'f'
  typeOverride['scatterplot'] = 'f'
  typeOverride['streamline'] = 'f'
  typeOverride['timer'] = 'f'
  typeOverride['Timer::Fire'] = 'f'
  typeOverride['IDLUnit'] = 'f'
  typeOverride['FilterTiePointsByGlobalTransformWithOrthorectificationTask'] = 'f'
  typeOverride['asdf_file'] = 'f'
  typeOverride['asdf_ndarray'] = 'f'
  typeOverride['yaml_stream_map'] = 'f'
  typeOverride['yaml_alias'] = 'f'
  typeOverride['yaml_map'] = 'f'
  typeOverride['yaml_multidoc'] = 'f'
  typeOverride['yaml_sequence'] = 'f'
  typeOverride['yaml_stream_sequence'] = 'f'
  typeOverride['yaml_value'] = 'f'

  ; valuidate our overrides
  stahp = !false
  foreach val, typeOverride, key do begin
    if (strlowcase(val) eq 'populate') then begin
      stahp = !true
      print, 'Bad type for "' + key + '"'
    endif else begin
      ; check if we need to map to method names
      if key.contains('::') then begin
        case strlowcase(val) of
          'f': typeOverride[key] = 'fm'
          'p': typeOverride[key] = 'pm'
          else: ; do nothing
        endcase
      endif
    endelse
  endforeach

  ; check if we have blocking problem with user-specified data
  if stahp then message, 'Problems with typeOverrides, see above for more details'

  return, typeOverride
end

;+
; :Returns: Hash<String>
;
;-
function getNameOverrides
  compile_opt idl2, hidden

  ; overrides for names
  nameOverride = orderedhash(/fold_case)
  nameOverride['idlunit'] = 'IDLUnit'
  nameOverride['enviroi'] = 'ENVIROI'
  nameOverride['envinitf'] = 'ENVINITF'
  nameOverride['enviui'] = 'ENVIUI'
  nameOverride['idl_primitive'] = 'IDL_Primitive'
  nameOverride['idl_base64'] = 'IDL_Base64'
  nameOverride['idl_validname'] = 'IDL_ValidName'
  nameOverride['idlexbr_assistant'] = 'IDLExBr_Assistant'
  nameOverride['idlitsys_createtool'] = 'IDLITSys_CreateTool'

  return, nameOverride
end

;+
; :Description:
;   Gets a file name from an HTML + link
;
; :Returns: String
;
; :Arguments:
;   file: bidirectional, required, String
;     Placeholder docs for argument, keyword, or property
;
;-
function getFileFromLink, file
  compile_opt idl2
  return, (strsplit(file.replace('#', ' '), ' ', /extract))[0]
end

;+
; :Private:
;
; :Description:
;   Updates the contents of the IDL SAVE file that
;   contains the routines for tooltips and documentation
;   by reading from a file called idl_routines.csv in this
;   directory.
;
; :Returns: OrderedHash<String>
;
;-
function catalog_to_json_get_tooltips
  compile_opt idl2, hidden

  ; get the current directory
  thisdir = file_dirname(routine_filepath())

  ; check for the CSV file
  routines = thisdir + path_sep() + 'idl_routines.csv'

  ; read in the strings
  nLines = file_lines(routines)
  toolDatabase = strarr(nLines)
  openr, lun, routines, /get_lun
  readf, lun, toolDatabase
  free_lun, lun

  ; track duplicate objects
  duplicates = list()

  ; create a hash with our tooltips
  tooltips = orderedhash(/fold_case)

  ; process and validate we can ingest
  foreach line, toolDatabase, idx do begin
    ; split our line
    split = strsplit(line, ';', /extract)

    ; skip if not enough splits for routines
    if (n_elements(split) ne 6) then continue

    ; extract our information
    name = strlowcase(strmid(split[1], 1, strlen(split[1]) - 2))
    tt = strmid(split[2], 1, strlen(split[2]) - 2)
    link = strmid(split[4], 1, strlen(split[4]) - 2)

    ; create our hash lookup
    lookup = {tooltip: tt, link: link}

    ; save to our hash
    tooltips[name] = lookup

    ; check if we have an object name
    pos = strpos(name, '::')
    if (pos ne -1) then begin
      ; get our method name
      method = strmid(name, pos)

      ; check if we need to skip
      if (duplicates.where(strlowcase(method)) ne !null) then continue

      ; check if we have a key already and remove as there are two methods
      ; with the same name meaning we cant correctly identify it
      if tooltips.hasKey(method) then begin
        ; preserve duplicate tooltips if the tooltips are the same
        if (strlowcase(tooltips[method].tooltip) eq strlowcase(tt)) then begin
          ; if two tooltips, blast the method links!
          if (strlowcase(tooltips[method].tooltip) ne strlowcase(link)) then begin
            s = tooltips[method]
            s.link = ''
            tooltips[method] = s
          endif
        endif else begin
          ; conflicting tooltips, so throw them out
          duplicates.add, strlowcase(method)
          tooltips.remove, method
        endelse
      endif else begin
        tooltips[method] = {tooltip: tt, link: link}
      endelse
    endif

    ; check if we have a control statement
    pos = strpos(name, '...')
    if (pos ne -1) then begin
      ; extract the start of the control statement
      control = strmid(name, 0, pos + 3)

      ; make a new entry in our hash
      tooltips[control] = {tooltip: tt, link: link}
    endif
  endforeach

  ; return the tooltips that we have created
  return, tooltips
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

    if (strlowcase(itemName) eq 'folderwatch::init') then stop

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

compile_opt idl2

; build the output directory
outDir = file_dirname(file_dirname(routine_filepath())) + path_sep() + 'routines'

; track all of the names
allNames = orderedhash(/fold_case)

; search for the data catalog files
folder = !dir
files = file_search(folder, '*_catalog.xml', count = nFiles)

; make sure that we found file
if ~nFiles then begin
  message, 'No files found where expected!'
endif

; source map
sourceMap = orderedhash()
sourceMap['idl_catalog.xml'] = 'idl'
sourceMap['envi_catalog.xml'] = 'envi'
sourceMap['deeplearning_catalog.xml'] = 'envi-dl'
sourceMap['machinelearning_catalog.xml'] = 'envi-ml'

;+ internal procedures
internalPro = routine_info(/system)
internalProHash = hash(/fold_case)
for i = 0, n_elements(internalPro) - 1 do internalProHash[internalPro[i]] = !true

;+ internal functions
internalFunc = routine_info(/system, /functions)
internalFuncHash = hash(/fold_case)
for i = 0, n_elements(internalFunc) - 1 do internalFuncHash[internalFunc[i]] = !true

; DO NOT USE THIS LOGIC - not correct for IDL 8.8.2 and ENVI 5.6.2
; check if we have envi and idl, need to skip IDL if that is the case
; if max(files.endswith('envi_catalog.xml')) then begin
; idxKeep = where(~files.endsWith('idl_catalog.xml'), countKeep)
; if (countKeep eq 0) then begin
; message, 'Problem with logic somewhere'
; endif
; files = files[idxKeep]
; endif

; parse files if we have not already
; this is a main level program to store the results in memory
; because they are large XML files to parse
if ~isa(parsedFiles, 'hash') then begin
  parsedFiles = orderedhash()
endif

; load our tooltips
if ~isa(tooltips, 'orderedhash') then begin
  print, 'Loading tooltips...'
  tooltips = catalog_to_json_get_tooltips()
endif

; track number of processed items
nProcessed = 0

; initialize all of our items
allItems = list()

; type overrides for routine types
typeOverride = getTypeOverrides()

; overrides for names
nameOverride = getNameOverrides()

; process each file
foreach file, files do begin
  ; did we parse the file already?
  if ~parsedFiles.hasKey(file) then begin
    print, 'Parsing XML: ' + file
    parsedFiles[file] = xml_parse(file)
  endif

  ; extract the useful information
  parsed = parsedFiles[file]

  ; get the catalog
  catalog = parsed['CATALOG']

  ;+ base file
  baseFile = file_basename(file)

  ; get internal source
  source = sourceMap[baseFile]

  ; flag if we should check internal routine or not
  checkInternal = baseFile eq 'idl_catalog.xml'

  ; process the catalogs of routines into something much more useful
  foreach mainKey, ['SYSVAR', 'ROUTINE', 'CLASS'] do begin
    ; skip if we don't have the key
    if ~catalog.hasKey(mainKey) then continue

    ; process each item we have
    foreach item, catalog[mainKey], idx do begin
      lastCount = allItems.length

      ; extract items from our catalog entry
      catalog_to_json_extract_items, mainKey, item, nProcessed, allItems, allNames, tooltips

      ; skip if nothing new
      if (allItems.length eq lastCount) then continue

      ; check all new features
      foreach newItem, allItems[lastCount : -1] do begin
        if (checkInternal) then begin
          case (!true) of
            internalProHash.hasKey(newItem['name']): newItem['source'] = 'internal'
            internalFuncHash.hasKey(newItem['name']): newItem['source'] = 'internal'
            else: newItem['source'] = source
          endcase
        endif else begin
          newItem['source'] = source
        endelse
      endforeach
    endforeach
  endforeach
endforeach

; map file links to files on disk some
print, 'Finding matching files for routine help'
folder = strjoin([!dir, 'help', 'online_help', 'Subsystems'], path_sep())
htmls = file_search(strjoin([!dir, 'help', 'online_help', 'Subsystems'], path_sep()), '*.htm*', count = nFiles)

; track files to skip
skipTheseFiles = orderedhash()
skipTheseFiles['/idl/Content/External Development/Using CALL_EXTERNAL/CALL_EXTERNAL.htm'] = !true
skipTheseFiles['/envi/Content/ExtendCustomize/Obsolete/ENVI_GET_HEADER_VALUE.htm'] = !true
skipTheseFiles['/envi/Content/ExtendCustomize/Obsolete/MORPH_DOIT.htm'] = !true
skipTheseFiles['/envi/Content/ExtendCustomize/Obsolete/ENVI_GET_ROI_INFORMATION.htm'] = !true
skipTheseFiles['/envi/Content/ExtendCustomize/Obsolete/ENVI_GET_PATH.htm'] = !true

; track base names to skip
skipTheseBases = orderedhash()
skipTheseBases['ContactUs.htm'] = !true
skipTheseBases['Preferences.htm'] = !true
skipTheseBases['LegalAndCopyrightNotices.htm'] = !true
skipTheseBases['WhatsNew.htm'] = !true
skipTheseBases['EventHandling.htm'] = !true
skipTheseBases['SampleIDLObject.htm'] = !true
skipTheseBases['Projects.htm'] = !true
skipTheseBases['ErrorHandling.htm'] = !true
skipTheseBases['CommandLineInputOutput.htm'] = !true
skipTheseBases['ParameterClasses.htm'] = !true
skipTheseBases['Parameters.htm'] = !true
skipTheseBases['PlatformSupportTable.htm'] = !true
skipTheseBases['PlatformSupportTable.htm'] = !true
skipTheseBases['ProgrammingRoutinesTasks.htm'] = !true
skipTheseBases['Introduction.htm'] = !true
skipTheseBases['Tutorials.htm'] = !true
skipTheseBases['SystemRequirements.htm'] = !true

; fix HTML files being incorrect (at least is wrong with ENVI)
; key is routine name, space, then routine type
fileOverrides = orderedhash(/fold_case)
fileOverrides['envi f'] = 'ENVI.htm'
fileOverrides['e3dlidar f'] = 'E3DLidar.htm'

; map to fix files
fileFixMap = orderedhash()
fileFixMap['Graphics_System_Variables.htm'] = 'Graphics_System_Variable.htm'

; create a map for the HTML file names
map = orderedhash()

if (nFiles eq 0) then message, 'No files found'

; process all of our files
foreach file, htmls do begin
  ; get the base name
  base = file_basename(file)

  ; skip files in an obsolete folder
  ; if strlowcase(file_basename(file_dirname(file))) eq 'obsolete' then continue

  ; check if we need to skip
  if skipTheseBases.hasKey(base) then continue

  ; get relative path
  usePath = (file.replace(folder, '')).replace('\', '/')

  ; check if we need to skip if
  if skipTheseFiles.hasKey(usePath) then continue

  ; check if we have a problem
  if map.hasKey(base) then begin
    print, 'Duplicate HTML file detected, please resolve or verify that we can ignore it'
    print, usePath
    print, map[base]
  endif else begin
    map[base] = (file.replace(folder, '')).replace('\', '/')
  endelse
endforeach

; populate auto-override with text to add to type override function
autoOverride = list()

; flag to stop if missing types
typeStahp = !false

; filter duplicate entries by name and type
processed = orderedhash(/fold_case)

; track items to save
saveItems = list()

; map all of the links for our items to the relative files on disk
foreach item, allItems do begin
  ; get item name
  itemName = item['name']

  ; validate we have source captured
  if ~item.hasKey('source') then message, 'Houston, we have a problem'

  ; check for type override
  if typeOverride.hasKey(itemName) then begin
    if item.hasKey('type') then begin
      if (item['type'] eq 'populate') then item['type'] = typeOverride[itemName]
    endif else begin
      item['type'] = typeOverride[itemName]
    endelse
  endif

  ; check for name override
  if nameOverride.hasKey(itemName) then begin
    itemName = nameOverride[itemName]
    item['name'] = itemName
  endif

  ; get duplicate name
  dupName = item['name'] + ' ' + item['type']

  ; skip if duplicate
  if processed.hasKey(dupName) then begin
    continue
  endif

  ; save as processed
  processed[dupName] = !true

  ; validate type
  if ~item.hasKey('type') || item['type'] eq 'populate' then begin
    autoOverride.add, 'typeOverride["' + itemName + '"] = "populate"'
    print, 'Missing type for construct "' + itemName + '", see "autoOverride" with text to copy/paste into type override function'
    typeStahp = !true
  endif

  ; check display name problems
  if itemName.startsWith('envi') or itemName.startsWith('idl') then begin
    print, 'Potential name override required for: "' + itemName + '"'
  endif

  ; get the docs file we need
  origfile = getFileFromLink(item['link'])

  ; check if we need to map the file name
  if fileFixMap.hasKey(origfile) then file = fileFixMap[origfile] else file = origfile

  ; check if we have an override for our file
  if fileOverrides.hasKey(dupName) then file = fileOverrides[dupName]

  ; map our file
  if map.hasKey(file) then begin
    item['link'] = map[file] + item['link'].replace(origfile, '')
  endif else begin
    print, 'Missing file for item "' + item['label'] + '"'
  endelse

  ; check if we have properties
  if item.hasKey('properties') then begin
    ; get the docs file we need
    origfile = getFileFromLink(item['properties'])

    ; check if we need to map the file name
    if fileFixMap.hasKey(origfile) then file = fileFixMap[origfile] else file = origfile

    ; map our file
    if map.hasKey(file) then begin
      item['properties'] = map[file] + item['properties'].replace(origfile, '')
    endif else begin
      message, 'Missing file for properties for item "' + item['label'] + '"'
    endelse
  endif

  ; save item
  saveItems.add, item
endforeach

; stop if types are not perfect
if typeStahp then message, 'Missing types detected, see above for details and please correct'

; write to a file on disk
print, 'Exporting to disk'
str = json_serialize(saveItems)

; write to disk
openw, lun, outDir + path_sep() + 'routines.json', lun, /get_lun
printf, lun, str
free_lun, lun

end