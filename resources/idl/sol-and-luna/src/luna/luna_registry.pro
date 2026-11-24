;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Private:
;
; :Description:
;   Keeps track of the `luna` objects that are created in an IDL session so
;   that `sol` can ask a child process for its test results instead of
;   searching the test file for variable names.
;
;   Supported actions:
;
;   - `add`: registers a `luna` object. Called by `luna::Init`.
;   - `reset`: forgets all registered objects.
;   - `count`: returns the number of registered objects.
;   - `results`: generates the test summary of any object that has not
;     generated one and returns the results of all objects as a JSON string.
;
; :Returns: any
;
; :Arguments:
;   action: in, required, String
;     One of `add`, `reset`, `count`, or `results`.
;   obj: in, optional, luna
;     The object to register when the action is `add`.
;
;-
function luna_registry, action, obj
  compile_opt idl2, hidden
  common luna_registry_block, registry

  if ~isa(registry, 'list') then registry = list()

  case strlowcase(action) of
    'add': begin
      registry.add, obj
      return, n_elements(registry)
    end

    'reset': begin
      registry.remove, /all
      return, 0l
    end

    'count': return, n_elements(registry)

    'results': begin
      output = list()
      foreach item, registry do begin
        if ~item.generatedSummary then item.generateTestSummary
        output.add, orderedhash( $
          'file', item.file, $
          'nTests', item.nTests, $
          'nFailed', item.nFailed, $
          'passed', item.getStatus() ? 1 : 0, $
          'coverage', item.coverage, $
          'failures', item.failures, $
          'failureMessages', item.failureMessages)
      endforeach
      return, json_serialize(output)
    end

    else: message, 'Unknown luna_registry action: ' + action
  endcase
end
