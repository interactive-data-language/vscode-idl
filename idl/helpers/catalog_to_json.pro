compile_opt idl2

; build the output directory
outDir = file_dirname(file_dirname(routine_filepath())) + path_sep() + 'routines'

; track all of the names
allNames = orderedhash(/fold_case)

; search for the data catalog files
files = file_search(!dir + path_sep() + 'help', '*_catalog.xml', count = nFiles)

; make sure that we found file
if ~nFiles then begin
  message, 'No files found where expected!'
endif

; source map
sourceMap = getSourceMap()

; source maps to skip
skipSourceMaps = getSkipSourceMaps()

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
; idl-disable-next-line var-use-before-def
if ~isa(parsedFiles, 'hash') then begin
  parsedFiles = orderedhash()
endif

; track number of processed items
nProcessed = 0

; initialize all of our items
allItems = list()

; add a few manual items that are missing from the XML files
allItems.add, hash('name', 'CLI_Progress::Initialize', 'link', 'CLI_Progress.htm#Initialize', 'type', 'pm', 'source', 'idl')

; type overrides for routine types
typeOverride = getTypeOverrides()

; overrides for names
nameOverride = getNameOverrides()

; process each file
foreach file, files do begin
  ;+ base file
  baseFile = file_basename(file)

  ; skip source maps
  if skipSourceMaps.hasKey(baseFile) then continue

  ; did we parse the file already?
  if ~parsedFiles.hasKey(file) then begin
    print, 'Parsing XML: ' + file
    parsedFiles[file] = xml_parse(file)
  endif

  ; extract the useful information
  parsed = parsedFiles[file]

  ; get the catalog
  catalog = parsed['CATALOG']

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
skipTheseFiles = getSkipTheseFiles()

; track base names to skip
skipTheseBases = getSkipTheseBases()

; fix HTML files being incorrect (at least is wrong with ENVI)
; key is routine name, space, then routine type
fileOverrides = getFileOverrides()

; map to fix files
fileFixMap = getFileFixMap()

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

  ;+
  ; Skip anything in sarscape for now
  ;-
  if usePath.startsWith('/sarscape') then continue
  if usePath.startsWith('/sar_essentials') then continue

  ; check if we need to skip if
  if skipTheseFiles.hasKey(usePath) then continue

  ; check if we have a problem
  if map.hasKey(base) then begin
    print, 'Duplicate HTML file detected, please resolve or verify that we can ignore it'
    print, usePath
    print, map[base]
    print, base
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
    ; special case for window which points to the wrong file
    if ~(item['link'] eq 'WINDOW_Procedure.htm') then item['type'] = typeOverride[itemName]
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
  if (itemName.startsWith('envi') or itemName.startsWith('idl')) and ~nameOverride.hasKey(itemName) then begin
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
    message, 'Missing file for item "' + item['name'] + '"'
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
      message, 'Missing file for properties for item "' + item['name'] + '"'
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
