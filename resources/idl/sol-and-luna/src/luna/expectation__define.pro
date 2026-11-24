;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Definition for the luna test expectation object. The object should
;   not be created directly and, instead, should be generated directly
;   from the luna suite object.
;
;   See ![FILE](./../README.md) for more details.
;
;   Here is an example for object creation:
;
;       ;create our tester
;       l = luna()
;
;         ;create a parent suite
;         s = l.suite('Test suite that verifies')
;
;           ;create a test
;           it = s.test('our functionality works')
;
;             ;create an expectation for our test
;             (it.expects(42))._not_.toEqual, 43
;
;
; :Author: Zachary Norman - GitHub: [znorman-harris](https://github.com/znorman-harris)
;-

;+
; :Private:
;
; :Description:
;   Cleans up the expectation and destroys the expectation
;   value if it is an object reference.
;
;-
pro expectation::cleanup
  compile_opt idl2, hidden
  if self.hasValue then begin
    ; clean up objects properly
    if (size(self.value[0], /type) eq 11) then begin
      obj_destroy, self.value[0]
    endif
  endif
end

;+
; :Private:
;
; :Description:
;   Sets default properties
;
; :Arguments:
;   luna_test: in, required, Test
;     Specify the parent test object.
;   value: in, optional, any
;     Specify the value for the expectation.
;
;-
pro expectation::_init, luna_test, value
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; set/init properties
  self.luna_test = luna_test
  self.value = list()
  self.messages = list()
  self.flags = list()
  self.hasValue = 0
  self.passed = 1
  if ~self.is_not then self._not_ = ExpectationNot(luna_test, value, self, /is_not, debug = self.debug, quiet = self.quiet, verbose = self.verbose, logfile = self.logFile, file = self.file)

  ; check if we specified a value (empty lists and hashes report no elements, so check for objects too)
  hasValue = n_elements(value) gt 0
  if ~hasValue then begin
    if (size(value, /type) eq 11) then hasValue = obj_valid(value)
  endif
  if hasValue then begin
    self.value.add, value
    self.hasValue = 1
  endif

  ; pull in properties from our great grandparent
  self.is_workbench = self.luna_test.is_workbench
  self.platform = self.luna_test.platform
end

;+
; :Private:
;
; :Description:
;   Init method for test expectations.
;
; :Returns: Expectation
;
; :Arguments:
;   luna_test: in, required, Test
;     Specify the parent object.
;   value: in, optional, any
;     Specify the value for the test.
;
; :Keywords:
;   _ref_extra: in, optional, any
;     Specify the keywords VERBOSE, DEBUG, or QUIET on init
;     and the corresponding object properties will be set
;     and carry through to child objects.
;
;-
function expectation::init, luna_test, value, _ref_extra = extra
  compile_opt idl2, hidden

  ; set all extra properties that may have been passed in
  self.setProperty, _extra = extra
  if ~self.debug then on_error, 2

  ; validate input
  sol_validate, $
    hash('luna_test', ['required', 'Test']), $
    called_from = 'Test::expects'

  ; init properties
  self._init, luna_test, value

  return, 1
end

;+
; :Private:
;
; :Description:
;   Simple method that sets failure and passes information
;   up to our parent object.
;
;-
pro expectation::_failed
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; alert parent
  self.luna_test._failed

  ; update self
  self.passed = 0
end

;+
; :Private:
;
; :Description:
;   Method that gathers information about the tests that
;   this object's children ran.
;
; :Returns: List<String>
;
; :Keywords:
;   fancy: in, optional, Boolean
;     Set this to generate fancy output for the log file or
;     IDL Console in the workbench.
;   nfailed: out, optional, Number
;     Contains the number of tests that failed in our
;     children.
;
;-
function expectation::_generateSummary, fancy = fancy, nfailed = nfailed
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; init list to hold our strings
  strings = list()

  ; init counter for how many tests failed
  nfailed = 0

  ; process each child and get our strings
  foreach msg, self.messages, mIdx do begin
    strings.add, self.luna_test.luna_suite.luna._generateFancyString(msg, self.flags[mIdx], fancy = fancy)
    if ~self.flags[mIdx] then nfailed++
  endforeach

  ; return the strings
  return, strings
end

;+
; :Private:
;
; :Description:
;   Wrapper method around IDL's ```idl isa()``` function.
;
; :Returns: Boolean
;
; :Arguments:
;   type: in, required, String
;     Specify either a string value that repesents
;     the keyword for IDL's ```idl isa()``` function or
;     a typename to compare against.
;
;-
function expectation::_isa, type
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; validate input
  sol_validate, hash('type', ['required', 'string'])

  ; get lower case version of type to compare
  compareType = strlowcase(strtrim(type, 2))

  ; match our type
  case (compareType) of
    'string': return, isa(self.value[0], /string)
    'number': return, isa(self.value[0], /number)
    'file': return, isa(self.value[0], /file)
    'null': return, isa(self.value[0], /null)
    'scalar': return, self._isScalar()
    'array': return, self._isArray()
    'boolean': return, isa(self.value[0], /boolean)
    'complex': return, isa(self.value[0], /complex)
    'float': return, isa(self.value[0], /float)
    'integer': return, isa(self.value[0], /integer)
    'object': return, size(self.value[0], /type) eq 11
    else: return, isa(self.value[0], compareType)
  endcase
end

;+
; :Private:
;
; :Description:
;   Determines if the expectation value is an array. Structures and
;   objects are only arrays when they have more than one element
;   because IDL treats an anonymous structure as an array internally.
;
; :Returns: Boolean
;
;-
function expectation::_isArray
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  type = size(self.value[0], /type)
  if (type eq 11) then return, n_elements(obj_isa(self.value[0], 'IDL_OBJECT')) gt 1
  if (type eq 8) then return, n_elements(self.value[0]) gt 1
  return, isa(self.value[0], /array)
end

;+
; :Private:
;
; :Description:
;   Determines if the expectation value is a scalar (a single, non-null
;   value). See ```idl _isArray``` for how structures and objects are treated.
;
; :Returns: Boolean
;
;-
function expectation::_isScalar
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  type = size(self.value[0], /type)
  if (type eq 11) then return, n_elements(obj_isa(self.value[0], 'IDL_OBJECT')) eq 1
  if (type eq 8) then return, n_elements(self.value[0]) eq 1
  return, isa(self.value[0], /scalar)
end

;+
; :Private:
;
; :Description:
;   Counts the elements in the expectation value. Lists, hashes,
;   orderedhashes and dictionaries report their item count, other objects
;   report the number of object references, and everything else uses
;   ```idl n_elements()```.
;
; :Returns: Long64
;
;-
function expectation::_count
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  value = self.value[0]
  if (size(value, /type) eq 11) then begin
    if (n_elements(obj_isa(value, 'IDL_OBJECT')) eq 1) then begin
      if isa(value, 'list') or isa(value, 'hash') or isa(value, 'dictionary') then return, long64(value.count())
    endif
    return, long64(n_elements(obj_isa(value, 'IDL_OBJECT')))
  endif
  return, long64(n_elements(value))
end

;+
; :Private:
;
; :Description:
;   Gets the dimensions of a value that is not an object, or throws
;   an error if the value is an object. Scalars have the dimensions 0.
;
; :Returns: Long64 | Array<any>
;
; :Arguments:
;   value: in, required, any
;     Specify the value to get dimensions for.
;
;-
function expectation::_dimensions, value
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  if (size(value, /type) eq 11) then begin
    message, 'Dimensions are not supported for object references!', level = -1
  endif
  return, size(value, /dimensions)
end

;+
; :Private:
;
; :Description:
;   Determines if the expectation value is a hash, orderedhash, or
;   dictionary.
;
; :Returns: Boolean
;
;-
function expectation::_isKeyed
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  value = self.value[0]
  if (size(value, /type) ne 11) then return, 0
  if (n_elements(obj_isa(value, 'IDL_OBJECT')) ne 1) then return, 0
  return, isa(value, 'hash') or isa(value, 'dictionary')
end

;+
; :Private:
;
; :Description:
;   Determines if the expectation value (an array, list, or the values
;   of a hash, orderedhash, or dictionary) holds an item equal to
;   another item. See ```idl expectation_item_equal()``` for how items
;   are compared.
;
; :Returns: Boolean
;
; :Arguments:
;   item: in, required, any
;     Specify the item to look for.
;
;-
function expectation::_containsItem, item
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  value = self.value[0]
  type = size(value, /type)
  if (type eq 11) then begin
    case (1) of
      isa(value, 'list'): items = value
      isa(value, 'hash') or isa(value, 'dictionary'): items = value.values()
      else: message, 'Expectation value must be an array, list, hash, orderedhash, or dictionary!', level = -1
    endcase
    foreach x, items do begin
      if expectation_item_equal(x, item) then return, 1
    endforeach
    return, 0
  endif

  ; compare simple arrays all at once
  simple = (isa(value, /number) and isa(item, /number, /scalar)) or (isa(value, /string) and isa(item, /string, /scalar))
  if simple then return, max(value eq item) eq 1

  for i = 0, n_elements(value) - 1 do begin
    if expectation_item_equal(value[i], item) then return, 1
  endfor
  return, 0
end

;+
; :Private:
;
; :Description:
;   Determines if the expectation value is truthy. A value is
;   truthy if it is:
;
;   - a non-empty string
;   - a non-zero number
;   - a valid pointer or object reference (lists, hashes, orderedhashes
;     and dictionaries must also have at least one element)
;   - a structure
;   - an array (arrays always have at least one element)
;
;   Anything else, including a missing value, is falsy.
;
; :Returns: Boolean
;
;-
function expectation::_isTruthy
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  if ~self.hasValue then return, 0
  val = self.value[0]

  if (size(val, /n_dimensions) gt 0) then return, n_elements(val) gt 0

  switch (size(val, /type)) of
    7: return, strlen(val) gt 0
    8: return, 1
    10: return, ptr_valid(val) ne 0
    11: begin
      if ~obj_valid(val) then return, 0
      if isa(val, 'list') or isa(val, 'hash') or isa(val, 'orderedhash') or isa(val, 'dictionary') then begin
        return, val.count() gt 0
      endif
      return, 1
    end
    else: return, val ne 0
  endswitch
end

;+
; :Private:
;
; :Description:
;   Makes sure the expectation value is a non-complex number and,
;   if provided, that the compare value is a non-complex numeric
;   scalar. Raises an error otherwise.
;
; :Arguments:
;   compare: in, optional, Number
;     Specify a numeric scalar that the value will be compared to.
;   name: in, optional, String
;     Specify the name of the compare argument for error messages.
;
;-
pro expectation::_requireNumber, compare, name
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  if ~self.hasValue then begin
    message, 'Expectation value not set, required!', level = -1
  endif
  if ~isa(self.value[0], /number) or isa(self.value[0], /complex) then begin
    message, 'Expectation value is not a non-complex number!', level = -1
  endif
  if (n_params() gt 0) then begin
    label = (n_params() gt 1) ? name : 'Compare value'
    if (n_elements(compare) ne 1) then begin
      message, label + ' must be a numeric scalar!', level = -1
    endif
    if ~isa(compare, /number) or isa(compare, /complex) or ~isa(compare, /scalar) then begin
      message, label + ' must be a numeric scalar!', level = -1
    endif
  endif
end

;+
; :Private:
;
; :Description:
;   Simple method that sets passing and passes information
;   up to our parent object.
;
;-
pro expectation::_passed
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; alert parent
  self.luna_test._passed

  ; update self
  self.passed = 1
end

;+
; :Private:
;
; :Description:
;   Describes a value in a short form for failure messages.
;
; :Returns: String
;
; :Arguments:
;   value: in, optional, any
;     Specify the value to describe.
;
;-
function expectation::_describe, value
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  if (size(value, /type) eq 11) then begin
    if ~obj_valid(value) then return, 'null object'
    name = obj_class(value)
    if isa(value, 'list') then begin
      if (value.count() eq 0) then return, 'list()'
      nShow = value.count() < 8
      items = strarr(nShow)
      for i = 0, nShow - 1 do items[i] = self._describe(value[i])
      return, 'list(' + strjoin(items, ', ') + (value.count() gt nShow ? ', ...' : '') + ')'
    endif
    if isa(value, 'hash') or isa(value, 'orderedhash') or isa(value, 'dictionary') then begin
      if (value.count() eq 0) then return, strlowcase(name) + '()'
      keys = value.keys()
      if isa(keys, 'list') then keys = keys.toArray()
      nKeys = n_elements(keys)
      if (nKeys eq 0) then return, strlowcase(name) + '()'
      nShow = nKeys < 8
      items = strarr(nShow)
      for i = 0, nShow - 1 do items[i] = self._describe(keys[i]) + ': ' + self._describe(value[keys[i]])
      return, strlowcase(name) + '(' + strjoin(items, ', ') + (nKeys gt nShow ? ', ...' : '') + ')'
    endif
    return, name + ' object'
  endif
  if isa(value, /null) then return, '!null'
  if (n_elements(value) eq 0) then return, 'undefined'
  if (size(value, /type) eq 10) then return, 'pointer'
  if isa(value, 'struct') then begin
    name = tag_names(value, /structure_name)
    return, 'structure' + (name ne '' ? ' ' + name : '')
  endif

  ; build up to 8 elements
  n = n_elements(value)
  if (n eq 0) then return, '[]'
  nShow = n < 8
  items = strarr(nShow)
  for i = 0, nShow - 1 do begin
    case (1) of
      isa(value, /string): items[i] = "'" + value[i] + "'"
      isa(value, /float) or isa(value, /complex): items[i] = strtrim(string(value[i], format = '(G0)'), 2)
      else: items[i] = strtrim(value[i], 2)
    endcase
  endfor
  text = strjoin(items, ', ')
  if (n gt nShow) then text += ', ...'
  if ~isa(value, /array) then return, text

  dims = size(value, /dimensions)
  text = '[' + text + ']'
  if (n_elements(dims) gt 1) then text += ' with dimensions [' + strjoin(strtrim(dims, 2), ', ') + ']' else if (n gt nShow) then text += ' (' + strtrim(n, 2) + ' elements)'
  return, text
end

;+
; :Private:
;
; :Description:
;   Describes the value of the expectation in a short form for
;   failure messages.
;
; :Returns: String
;
;-
function expectation::_describeValue
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  if (self.value.count() eq 0) then return, '!null'
  return, self._describe(self.value[0])
end

;+
; :Private:
;
; :Description:
;   Builds the lines of code around a failing line, with a
;   marker on the line that failed. Up to two lines before
;   and after are included, fewer near the start or end of the file.
;
; :Returns: Array<String>
;
; :Arguments:
;   file: in, required, String
;     Specify the file that contains the failing line.
;   line: in, required, Number
;     Specify the 1-based line number that failed.
;   indent: in, required, String
;     Specify the indentation to add before each line.
;
;-
function expectation::_codeSnippet, file, line, indent
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; nothing to show if we can't read the line
  if (file eq '') then return, ''
  if ~file_test(file) then return, ''
  nLines = file_lines(file)
  if (line lt 1) or (line gt nLines) then return, ''

  ; read the file
  code = strarr(nLines)
  openr, lun, file, /get_lun
  readf, lun, code
  free_lun, lun

  ; get the range that we are showing
  first = (line - 2) > 1
  last = (line + 2) < nLines
  width = strlen(strtrim(last, 2))

  ; build each line
  snippet = strarr(last - first + 1)
  for i = first, last do begin
    marker = (i eq line) ? '> ' : '  '
    num = string(i, format = '(I' + strtrim(width, 2) + ')')
    snippet[i - first] = indent + marker + num + ' | ' + strtrim(code[i - 1], 0)
  endfor

  return, snippet
end

;+
; :Private:
;
; :Description:
;   Method that wraps the underlying print method so that
;   we can have the proper amount of indentation based on
;   how many levels deep we are.
;
; :Arguments:
;   str: in, required, String
;     Specify the string that you want to print.
;   errorFlag: in, required, Number
;     Specify a non-zero value if the expectation failed.
;
; :Keywords:
;   _expect_failure: in, optional, Boolean
;     If the test fails for some reason, set this to
;     force passing because we expected failure. This
;     keyword is for internal use only.
;   expected: in, optional, String
;     Description of the expected value, shown when the expectation fails.
;     Defaults to the expectation text when only `received` is set.
;   is_not: in, optional, Boolean
;     If set, the result of the expectation is inverted.
;   received: in, optional, String
;     Description of the value that was received, shown when the expectation fails.
;
;-
pro expectation::_processExpectation, str, errorFlag, _expect_failure = _expect_failure, expected = expected, is_not = is_not, received = received
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  sol_validate, hash('str', ['required', 'string'], 'errorFlag', ['required', 'number'])

  ; get indentation
  indent = self.luna_test.luna_suite._getIndentation(/is_expectation)

  ; trim string
  str = strlowcase(strtrim(str, 2))

  ; check if we are a not object
  if keyword_set(is_not) then begin
    str = 'not ' + str
    errorFlag = (~errorFlag)
  endif

  ; check if we expected a failure or not (override for easier testing of
  ; the test framework)
  if keyword_set(_expect_failure) then begin
    errorFlag ne= 1
  endif

  ; check if we failed and process correctly
  if (errorFlag and self.passed) then self._failed

  ; time for this expectation, including any test setup before it
  elapsed = self.luna_test._lap()
  timing = string(elapsed, format = '(F0.2)') + ' s'

  ; check how we need to print
  line = keyword_set(is_not) ? self._not_.latestLine : self.latestLine
  if ~keyword_set(errorFlag) then begin
    timing = '(' + timing + ', line ' + strtrim(line, 2) + (keyword_set(_expect_failure) ? ', overridden' : '') + ')'
    self.messages.add, indent + 'expected ' + str + ' ' + timing
    str = indent + 'expected ' + str + ' ' + timing
  endif else begin
    add = self.file + ':' + strtrim(line, 2)
    self.luna_test.luna_suite.luna.failures.add, add
    self.luna_test.luna_suite.luna.failureMessages.add, 'expected ' + str
    timing = '(' + timing + (keyword_set(_expect_failure) ? ', overridden' : '') + ')'
    self.messages.add, indent + 'expected ' + str + ' ' + timing
    snippet = self._codeSnippet(self.file, line, indent + '  ')
    failure = ['', indent + '%FAILED% expected ' + str + ' ' + timing, '']
    if (n_elements(received) gt 0) then begin
      shown = (n_elements(expected) gt 0) ? (keyword_set(is_not) ? 'not ' : '') + expected : str
      failure = [failure, indent + '  Expected: ' + shown, indent + '  Received: ' + received, '']
    endif
    str = failure
    if (snippet[0] ne '') then str = [str, snippet, '']
    str = [str, indent + '  at ' + add, '']
  endelse

  ; print our string
  self._print, str, logfile = self.logFile, /implied_print

  ; save info about our expectation
  self.flags.add, ~errorFlag
end

;+
; :Private:
;
; :Description:
;   Finds and resolves function methods for objects if they
;   don't exist.
;
; :Returns: Boolean
;
; :Arguments:
;   obj: in, required, String
;     Specify the name of the object to check for
;     a method.
;   method: in, required, String
;     Specify the method that you are checkign for in the object.
;
; :Keywords:
;   info: out, optional, any
;     If a matching object method is found, then the result
;     from ```idl routine_info()``` is returned.
;   procedure: in, optional, Boolean
;     If set, this means we are checking for a procedure method.
;
;-
function expectation_is_method, obj, method, procedure = procedure, info = info
  compile_opt idl2, hidden

  ; build the name of the routine that we are looking for
  name = obj + '::' + method

  ; handle unknown routines
  catch, err
  if (err ne 0) then begin
    catch, /cancel

    ; handle actual undefined error
    catch, err
    if (err ne 0) then begin
      catch, /cancel

      catch, err
      if (err ne 0) then begin
        catch, /cancel
        return, !false
      endif else begin
        ; resolve as if we are coming from an obj__method PRO code source
        resolve_routine, name, /compile_full_file, /either

        ; try to get  our routine information
        info = routine_info(name, /parameters, functions = ~keyword_set(procedure))
      endelse
      catch, /cancel
    endif else begin
      ; resolve as if we are coming from an obj__define PRO code source
      resolve_routine, obj + '__define', /compile_full_file, /either

      ; try to get  our routine information
      info = routine_info(name, /parameters, functions = ~keyword_set(procedure))
    endelse
    catch, /cancel
  endif else begin
    ; try to get  our routine information
    info = routine_info(name, /parameters, functions = ~keyword_set(procedure))
  endelse
  catch, /cancel

  ; made it here so we are a success
  return, !true
end

;+
; :Private:
;
; :Description:
;   Internal routine that runs a function or procedure with
;   up to 8 arguments and as many keywords as you want. All
;   parameters are arbitrary, can be any type, and are passed
;   on in the respective procedure or function call.
;
; :Arguments:
;   arg1: in, optional, any
;     First argument passed on to the routine being called.
;   arg2: in, optional, any
;     Second argument passed on to the routine being called.
;   arg3: in, optional, any
;     Third argument passed on to the routine being called.
;   arg4: in, optional, any
;     Fourth argument passed on to the routine being called.
;   arg5: in, optional, any
;     Fifth argument passed on to the routine being called.
;   arg6: in, optional, any
;     Sixth argument passed on to the routine being called.
;   arg7: in, optional, any
;     Seventh argument passed on to the routine being called.
;   arg8: in, optional, any
;     Eighth argument passed on to the routine being called.
;
; :Keywords:
;   _debug: in, optional, Boolean
;     If set, errors in the routine will be stopped on to make
;     it easier to debug errors.
;   _error_contains: in, optional, String
;     If expecting an error, the error message must contain this text.
;   _error_regex: in, optional, String
;     If expecting an error, the error message must match this regular
;     expression.
;   _expect_error: in, optional, Boolean
;     Set to indicate that the routine is expected to throw an error.
;   _expect_failure: in, optional, Boolean
;     If the test fails for some reason, set this to
;     force passing because we expected failure.
;   _max_time: in, optional, Number
;     If set, the routine must finish within this many seconds.
;   _method: in, optional, String
;     Name of the object method to call on the expectation value.
;   _nparams: in, required, Number
;     Must be  set to the number of parameters that were passed
;     in to the scope above this. If we use n_params() in this
;     scope then we will always see eight because we call this
;     method with eight arguments.
;   _output: out, optional, any
;     If you are calling a function, this keyword will return
;     the results of running the function.
;   _print_contains: in, optional, String
;     If set, the output printed while the routine runs must contain
;     this text.
;   _print_fold_case: in, optional, Boolean
;     Ignore case when checking `_print_contains`.
;   _procedure: in, optional, Boolean
;     Set this keyword to use `call_procedure` instead of
;     `call_function()`.
;   _ref_extra: in, optional, any
;     A reference to any user-specified keywords.
;   _str: in, required, String
;     Description of the expectation that is printed.
;   _time: in, optional, Boolean
;     If set, the time to run the routine is added to the output.
;
;-
pro expectation::_runRoutine, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, $
  _debug = _debug, $
  _error_contains = _error_contains, $
  _error_regex = _error_regex, $
  _expect_error = _expect_error, $
  _expect_failure = _expect_failure, $
  _method = _method, $
  _max_time = _max_time, $
  _print_contains = _print_contains, $
  _print_fold_case = _print_fold_case, $
  _nparams = _nparams, $
  _procedure = _procedure, $
  _output = _output, $
  _ref_extra = _extra, $
  _str = _str, $
  _time = time
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required to evaluate routine!', level = -2
  endif

  ; make sure we have a string or object
  if keyword_set(_method) then begin
    sol_validate, hash('_method', ['string', 'required'])
    if ~(size(self.value[0], /type) eq 11) then begin
      message, 'Expectation value set, but is not an object, required to evaluate method!', level = -2
    endif
  endif else begin
    routine = self.value[0]
    sol_validate, hash('routine', ['string', 'required'])
  endelse

  ; make sure we passed in a string for our expectation printout
  sol_validate, hash('_str', ['string', 'required'])

  ; initialize any flags
  isSystem = !false

  ; get our routine information
  ; check if we are a method
  if keyword_set(_method) then begin
    ; determine if we have a known method for our object
    help, self.value[0], /objects, output = o

    ; get our primary object name
    supers = strlowcase(typename(self.value[0]))

    ; convert to lower case
    o = strlowcase(o)

    ; check for structure tags
    idxTags = where(strpos(o, 'instance data:') ne -1, countTags)
    if (countTags ne 0) then begin
      o = o[0 : idxTags[0] - 1]
    endif

    ; check for procedure methods
    idxPro = where(strpos(o, 'known procedure methods:') ne -1, countPro)
    if (countPro gt 0) then begin
      pros = o[idxPro[0] + 1 : -1]
      o = o[0 : idxPro[0] - 1]
    endif

    ; check for function methods
    idxFunc = where(strpos(o, 'known function methods:') ne -1, countFunc)
    if (countFunc gt 0) then begin
      funcs = o[idxFunc[0] + 1 : -1]
      o = o[0 : idxFunc[0] - 1]
    endif

    ; check if we have inheritance
    idxSuper = where(strpos(o, 'superclasses:') ne -1, countSuper)
    if (countSuper gt 0) then begin
      supers = [supers, o[idxSuper[0] + 1 : -1]]
    endif

    ; clean up the supers
    supers = strtrim(supers.replace('<direct>', ''), 2)

    ; extract information on our method and verify our supers have this information
    foreach super, supers do begin
      ; check each one of our supers for a method on our object
      if expectation_is_method(super, _method, procedure = keyword_set(_procedure), info = info) then begin
        break
      endif
    endforeach

    ; check if we didnt find anything
    if ~keyword_set(info) then begin
      message, 'Attempt to call undefined ' + (keyword_set(_procedure) ? 'procedure method "' : 'function method "') + $
        strlowcase(_method) + '" for object of type "' + typename(self.value[0]), level = -2
    endif
  endif else begin
    ; handle unknown routines
    catch, err
    if (err ne 0) then begin
      catch, /cancel

      ; get all routines to check
      routines = strlowcase(routine_info(functions = ~keyword_set(_procedure), /system))
      idxRoutine = where(routines eq self.value[0], countRoutine)
      if (countRoutine eq 0) then begin
        message, 'Attempt to call undefined ' + (keyword_set(_procedure) ? 'procedure: ' : 'function: ') + self.value[0], level = -2
      endif

      ; set flag that we have a system routine to bypass checking
      isSystem = !true

      ; make fake info
      info = {NUM_KW_ARGS: n_elements(_extra)}
    endif else begin
      ; check if we are user provided
      path = routine_filepath(self.value[0], is_function = ~keyword_set(_procedure))
      if (path eq '') then begin
        resolve_routine, self.value[0], /compile_full_file, /either
      endif

      ; get information on our routine
      info = routine_info(self.value[0], /parameters, functions = ~keyword_set(_procedure))
    endelse
    catch, /cancel
  endelse

  ; verify args/keywords if needed
  if ~keyword_set(isSystem) then begin
    ; check the arguments to make sure we can run this
    if (_nparams gt info.NUM_ARGS) then begin
      message, 'Number of arguments specified exceeds the maximum number of allowed arguments!', level = -2
    endif

    ; validate keywords
    if (info.NUM_KW_ARGS gt 0) then begin
      ; check if we have ref extra which means "unlimited"
      if (where(info.KW_ARGS eq '_REF_EXTRA', /null) eq !null) then begin
        if (n_elements(_extra) gt info.NUM_KW_ARGS) then begin
          message, 'Number of keywords specified is greater than the number of allowed keywords!', level = -2
        endif

        ; validate that each keyword can be called if we passed any in
        if (n_elements(_extra) gt 0) then begin
          foreach _keyword, _extra do begin
            if (where(_keyword eq info.KW_ARGS, /null) eq !null) then begin
              message, 'Keyword "' + _keyword + '" not allowed in call to "' + $
                ((size(self.value[0], /type) eq 11) ? typename(self.value[0]) + '::' + strupcase(_method) : self.value[0]) + '"', $
                level = -2
            endif
          endforeach
        endif
      endif
    endif else begin
      ; passed in keywords when not allowed
      if (n_elements(_extra) gt 0) then begin
        message, 'Keywords not allowed in call to "' + self.value[0] + '"', level = -2
      endif
    endelse
  endif

  ; catch errors
  if ~keyword_set(_debug) then begin
    catch, err
    if (err ne 0) then begin
      catch, /cancel

      ; make sure we stop journaling
      if (n_elements(journalFile) gt 0) then void = self._journalStop(journalFile)

      ; grab the message before it is reset
      errorMessage = !error_state.msg

      ; print errors to the console if we are supposed to pass
      if ~self.is_not and ~keyword_set(_expect_error) then begin
        help, /last_message, output = o

        ; get the indentation
        indent = self.luna_test.luna_suite._getIndentation(/is_expectation)

        ; make error message look nicer
        o = '  |  ' + ['------------- Error while running routine or method -------------', o, '------------- Error while running routine or method -------------']
        self._print, indent + o, logfile = self.logFile
      endif

      ; reset our error state since we are ignoring
      message, /reset

      ; check the error message if we were asked to
      failed = ~keyword_set(_expect_error)
      if keyword_set(_expect_error) then begin
        if (n_elements(_error_contains) gt 0) then begin
          failed = strpos(errorMessage, _error_contains) eq -1
        endif else if (n_elements(_error_regex) gt 0) then begin
          failed = ~stregex(errorMessage, _error_regex, /boolean)
        endif
      endif

      ; update the user
      self._processExpectation, _str, failed, received = 'error: ' + errorMessage, _expect_failure = _expect_failure
      return
    endif
  endif

  ; check if we are supposed to time
  if keyword_set(time) or (n_elements(_max_time) gt 0) then t0 = systime(/seconds)

  ; capture output if needed
  if (n_elements(_print_contains) gt 0) then journalFile = self._journalStart()

  ; check if we have keywords or not
  if (info.NUM_KW_ARGS gt 0) then begin
    ; procedure with keywords
    if keyword_set(_procedure) then begin
      if keyword_set(_method) then begin
        case (_nparams) of
          0: call_method, _method, self.value[0], _extra = _extra
          1: call_method, _method, self.value[0], arg1, _extra = _extra
          2: call_method, _method, self.value[0], arg1, arg2, _extra = _extra
          3: call_method, _method, self.value[0], arg1, arg2, arg3, _extra = _extra
          4: call_method, _method, self.value[0], arg1, arg2, arg3, arg4, _extra = _extra
          5: call_method, _method, self.value[0], arg1, arg2, arg3, arg4, arg5, _extra = _extra
          6: call_method, _method, self.value[0], arg1, arg2, arg3, arg4, arg5, arg6, _extra = _extra
          7: call_method, _method, self.value[0], arg1, arg2, arg3, arg4, arg5, arg6, arg7, _extra = _extra
          8: call_method, _method, self.value[0], arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, _extra = _extra
        endcase
      endif else begin
        case (_nparams) of
          0: call_procedure, self.value[0], _extra = _extra
          1: call_procedure, self.value[0], arg1, _extra = _extra
          2: call_procedure, self.value[0], arg1, arg2, _extra = _extra
          3: call_procedure, self.value[0], arg1, arg2, arg3, _extra = _extra
          4: call_procedure, self.value[0], arg1, arg2, arg3, arg4, _extra = _extra
          5: call_procedure, self.value[0], arg1, arg2, arg3, arg4, arg5, _extra = _extra
          6: call_procedure, self.value[0], arg1, arg2, arg3, arg4, arg5, arg6, _extra = _extra
          7: call_procedure, self.value[0], arg1, arg2, arg3, arg4, arg5, arg6, arg7, _extra = _extra
          8: call_procedure, self.value[0], arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, _extra = _extra
        endcase
      endelse
      ; procedure without keywords
    endif else begin
      if keyword_set(_method) then begin
        case (_nparams) of
          0: _output = call_method(_method, self.value[0], _extra = _extra)
          1: _output = call_method(_method, self.value[0], arg1, _extra = _extra)
          2: _output = call_method(_method, self.value[0], arg1, arg2, _extra = _extra)
          3: _output = call_method(_method, self.value[0], arg1, arg2, arg3, _extra = _extra)
          4: _output = call_method(_method, self.value[0], arg1, arg2, arg3, arg4, _extra = _extra)
          5: _output = call_method(_method, self.value[0], arg1, arg2, arg3, arg4, arg5, _extra = _extra)
          6: _output = call_method(_method, self.value[0], arg1, arg2, arg3, arg4, arg5, arg6, _extra = _extra)
          7: _output = call_method(_method, self.value[0], arg1, arg2, arg3, arg4, arg5, arg6, arg7, _extra = _extra)
          8: _output = call_method(_method, self.value[0], arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, _extra = _extra)
        endcase
      endif else begin
        case (_nparams) of
          0: _output = call_function(self.value[0], _extra = _extra)
          1: _output = call_function(self.value[0], arg1, _extra = _extra)
          2: _output = call_function(self.value[0], arg1, arg2, _extra = _extra)
          3: _output = call_function(self.value[0], arg1, arg2, arg3, _extra = _extra)
          4: _output = call_function(self.value[0], arg1, arg2, arg3, arg4, _extra = _extra)
          5: _output = call_function(self.value[0], arg1, arg2, arg3, arg4, arg5, _extra = _extra)
          6: _output = call_function(self.value[0], arg1, arg2, arg3, arg4, arg5, arg6, _extra = _extra)
          7: _output = call_function(self.value[0], arg1, arg2, arg3, arg4, arg5, arg6, arg7, _extra = _extra)
          8: _output = call_function(self.value[0], arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, _extra = _extra)
        endcase
      endelse
    endelse
  endif else begin
    ; procedure without keywords
    if keyword_set(_procedure) then begin
      if keyword_set(_method) then begin
        case (_nparams) of
          0: call_method, _method, self.value[0]
          1: call_method, _method, self.value[0], arg1
          2: call_method, _method, self.value[0], arg1, arg2
          3: call_method, _method, self.value[0], arg1, arg2, arg3
          4: call_method, _method, self.value[0], arg1, arg2, arg3, arg4
          5: call_method, _method, self.value[0], arg1, arg2, arg3, arg4, arg5
          6: call_method, _method, self.value[0], arg1, arg2, arg3, arg4, arg5, arg6
          7: call_method, _method, self.value[0], arg1, arg2, arg3, arg4, arg5, arg6, arg7
          8: call_method, _method, self.value[0], arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8
        endcase
      endif else begin
        case (_nparams) of
          0: call_procedure, self.value[0]
          1: call_procedure, self.value[0], arg1
          2: call_procedure, self.value[0], arg1, arg2
          3: call_procedure, self.value[0], arg1, arg2, arg3
          4: call_procedure, self.value[0], arg1, arg2, arg3, arg4
          5: call_procedure, self.value[0], arg1, arg2, arg3, arg4, arg5
          6: call_procedure, self.value[0], arg1, arg2, arg3, arg4, arg5, arg6
          7: call_procedure, self.value[0], arg1, arg2, arg3, arg4, arg5, arg6, arg7
          8: call_procedure, self.value[0], arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8
        endcase
      endelse
      ; function without keywords
    endif else begin
      if keyword_set(_method) then begin
        case (_nparams) of
          0: _output = call_method(_method, self.value[0])
          1: _output = call_method(_method, self.value[0], arg1)
          2: _output = call_method(_method, self.value[0], arg1, arg2)
          3: _output = call_method(_method, self.value[0], arg1, arg2, arg3)
          4: _output = call_method(_method, self.value[0], arg1, arg2, arg3, arg4)
          5: _output = call_method(_method, self.value[0], arg1, arg2, arg3, arg4, arg5)
          6: _output = call_method(_method, self.value[0], arg1, arg2, arg3, arg4, arg5, arg6)
          7: _output = call_method(_method, self.value[0], arg1, arg2, arg3, arg4, arg5, arg6, arg7)
          8: _output = call_method(_method, self.value[0], arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8)
        endcase
      endif else begin
        case (_nparams) of
          0: _output = call_function(self.value[0])
          1: _output = call_function(self.value[0], arg1)
          2: _output = call_function(self.value[0], arg1, arg2)
          3: _output = call_function(self.value[0], arg1, arg2, arg3)
          4: _output = call_function(self.value[0], arg1, arg2, arg3, arg4)
          5: _output = call_function(self.value[0], arg1, arg2, arg3, arg4, arg5)
          6: _output = call_function(self.value[0], arg1, arg2, arg3, arg4, arg5, arg6)
          7: _output = call_function(self.value[0], arg1, arg2, arg3, arg4, arg5, arg6, arg7)
          8: _output = call_function(self.value[0], arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8)
        endcase
      endelse
    endelse
  endelse

  ; check if we are timing
  elapsed = (keyword_set(time) or (n_elements(_max_time) gt 0)) ? systime(/seconds) - t0 : 0d
  if keyword_set(time) then begin
    _str += ' (time: ' + strtrim(elapsed, 2) + ')'
  endif

  ; process accordingly, a run that is too slow counts as an error
  failed = keyword_set(_expect_error)
  if keyword_set(_expect_error) then received = 'no error'
  if (n_elements(_max_time) gt 0) then begin
    failed = elapsed gt _max_time
    received = 'ran in ' + string(elapsed, format = '(F0.3)') + ' s'
  endif

  ; check the printed output
  if (n_elements(journalFile) gt 0) then begin
    printed = self._journalStop(journalFile)
    failed = keyword_set(_print_fold_case) ? $
      strpos(strlowcase(printed), strlowcase(_print_contains)) eq -1 : $
      strpos(printed, _print_contains) eq -1
    received = 'printed ' + self._describe(printed)
  endif
  self._processExpectation, _str, failed, received = received, _expect_failure = _expect_failure
end

;+
; :Private:
;
; :Description:
;   Starts capturing everything printed to the console in a
;   temporary journal file.
;
; :Returns: any
;
;-
function expectation::_journalStart
  compile_opt idl2, hidden

  if (!journal ne 0) then begin
    message, 'Unable to capture output, journaling is already active!', level = -2
  endif
  file = filepath('luna_print_' + strtrim(long(systime(/seconds) * 1000) mod 100000000l, 2) + '.txt', /tmp)
  journal, file
  return, file
end

;+
; :Private:
;
; :Description:
;   Stops the journal started with `_journalStart` and removes it.
;
; :Returns: any
;
; :Arguments:
;   file: in, required, String
;     Path to the journal file.
;
;-
function expectation::_journalStop, file
  compile_opt idl2, hidden

  if (!journal ne 0) then journal
  lines = ''
  if file_test(file, /regular) then begin
    n = file_lines(file)
    if (n gt 0) then begin
      lines = strarr(n)
      openr, lun, file, /get_lun
      readf, lun, lines
      free_lun, lun
    endif
    file_delete, file, /quiet
  endif

  ; printed output follows the header and is commented out
  idx = where(strmid(lines, 0, 7) eq '; Date:', count)
  if (count eq 0) or (idx[0] + 1 ge n_elements(lines)) then return, ''
  lines = lines[idx[0] + 1 : -1]
  idx = where(strmid(lines, 0, 1) eq ';', count)
  if (count eq 0) then return, ''
  return, strjoin(strmid(lines[idx], 1), string(10b))
end

;+
; :Private:
;
; :Description:
;   Shared implementation for the `toThrow*` expectations. If the
;   expectation value is an object, the first argument is the name
;   of the method to call and the rest are passed to the method.
;   Otherwise, the value is the name of the routine to call.
;
; :Arguments:
;   arg1: in, optional, any
;     Method name (objects) or first argument for the routine.
;   arg2: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   arg3: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   arg4: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   arg5: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   arg6: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   arg7: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   arg8: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   arg9: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
; :Keywords:
;   _debug: in, optional, Boolean
;     If set, errors are not caught.
;   _error_contains: in, optional, String
;     Text the error message must contain.
;   _error_regex: in, optional, String
;     Regular expression the error message must match.
;   _expect_failure: in, optional, Boolean
;     Internal keyword that forces passing.
;   _nparams: in, required, Number
;     Number of arguments (arg1-arg9) passed to the calling matcher.
;   _procedure: in, optional, Boolean
;     Set if the routine or method is a procedure.
;   _ref_extra: in, optional, any
;     Keywords passed on to the routine or method.
;   _str: in, required, String
;     Description of the expectation that is printed.
;
;-
pro expectation::_throw, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, $
  _debug = _debug, $
  _error_contains = _error_contains, $
  _error_regex = _error_regex, $
  _expect_failure = _expect_failure, $
  _nparams = _nparams, $
  _procedure = _procedure, $
  _ref_extra = _extra, $
  _str = _str
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  if self.hasValue && (size(self.value[0], /type) eq 11) then begin
    if (_nparams lt 1) then begin
      message, 'Method name required when the expectation value is an object!', level = -2
    endif
    self._runRoutine, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, $
      _extra = _extra, _procedure = _procedure, _nparams = _nparams - 1, _expect_error = 1, $
      _method = (isa(arg1, /string, /scalar) ? arg1 : 1), $
      _error_contains = _error_contains, _error_regex = _error_regex, $
      _str = _str, _debug = _debug, _expect_failure = _expect_failure
  endif else begin
    if (_nparams gt 8) then begin
      message, 'Too many arguments, a maximum of 8 can be passed to the routine!', level = -2
    endif
    self._runRoutine, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, $
      _extra = _extra, _procedure = _procedure, _nparams = _nparams, _expect_error = 1, $
      _error_contains = _error_contains, _error_regex = _error_regex, $
      _str = _str, _debug = _debug, _expect_failure = _expect_failure
  endelse
end

;+
; :Private:
;
; :Description:
;   This procedure *MUST* be run in the to-level
;   expectation that is being called so that we have
;   proper debug information about each method.
;
;-
pro expectation::_setCallLine
  compile_opt idl2, hidden

  ; get the traceback
  trace = scope_traceback(/structure)

  ; update our property
  self.latestLine = trace[-3].LINE
end

;+
; :Private:
;
; :Description:
;   Validates if we can compare two items with one another or not
;
; :Returns: Boolean
;
; :Arguments:
;   compare: in, required, any
;     Compare value from one of the methods on this object.
;
; :Keywords:
;   errors: out, required, List<String>
;     A list of string errors that are returned.
;
;-
function expectation::_validateComparators, compare, errors = errors
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; init output
  errors = list()

  ; make sure we have a value
  if self.hasValue then begin
    ; validate inputs
    sol_validate, hash('compare', ['required']), level = -1

    case (1) of
      typename(compare) eq 'UNDEFINED': begin
      end
    endcase

    ; compare the typenames
    if typename(compare) ne typename(self.value) then begin
      errors.add, 'Types do not match for expected value and compare value'
    endif
  endif else begin
    message, 'Expectation does not have a set value, cannot perform comparison. If you ' + $
      'are comparing undefined variable, use the expectation::toBeNull method.', level = -1
  endelse

  ; return
  return, n_elements(errors) eq 0
end

;+
; :Private:
;
; :Description:
;   Object definition for luna expectations
;
; :Expectation:
;   _not_: lunanot
;     Copy of the expectation used for the not operator
;   file: String
;     File that the expectation came from
;   flags: List<Boolean>
;     Tracks which expectations passed or failed
;   hasValue: Boolean
;     Flag if the expectation has a value or not
;   is_not: Boolean
;     Flag if we have a not operator when evaluating tests
;   is_workbench: Boolean
;     Flag if we are running in the workbench
;   latestLine: Long
;     Last line where an expectation was run, used for debugging
;   logFile: String
;     Path to the file where output is logged
;   luna_test: Test
;     Test that the expectation comes from
;   messages: List<String>
;     Tracks all messages that were created
;   passed: Boolean
;     Overall flag if we pass an expectation or not
;   platform: String
;     Platform that the tests are running on
;   value: List<any>
;     Expected value stored in a list so that any type can be held
;
;-
pro expectation__define
  compile_opt idl2, hidden
  struct = {Expectation, $
    inherits Luna_Sol_Base_Obj, $
    is_not: 0l, $ ; flag if we have a not operator when evaluating tests
    is_workbench: 0l, $ ; are we in the workbench
    platform: '', $ ; what platform are we on?
    passed: 0, $ ; overall flag if we pass an expectation or not
    latestLine: '', $ ; save the last line where we ran an expectation for debugging
    file: '', $ ; where did we come from
    logFile: '', $ ; where do we log
    flags: list(), $ ; track which things we passed or failed
    messages: list(), $ ; track all messages that we created
    _not_: obj_new(), $ ; create copy of ourself for not operator, accessed as ._not_
    luna_test: obj_new(), $ ; test that we come from
    hasValue: 0b, $ ; save flag if we have a value or not
    value: list() $ ; save the expected value in a list so that we can store anything that we want
    }
end
