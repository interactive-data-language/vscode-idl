# Routine Definition Files

Routine definition files are a new concept that allows you to create a representation of functions, procedures, and structures that are packaged with pre-compiled code.

Routine definitions allow you to have a modern user experience within VSCode and provide users with auto-complete, hover help, and type detection to make it easier for programmers to work with your code.

Routine definitions are useful for:

- Code you call from IDL that comes from external sources, such as DLLs and DLMs

- SAVE files that you distribute with your source code

> Note: In the future we will automatically create these definitions files for you through VSCode when compiling code

::: tip
If you are sharing your PRO code directly, you don't need to worry about creating routine definition files.

Your PRO code will be parsed and, as long as it is on IDL's search path or in a VSCode workspace, users will have the normal user experience.

For ease of use, we still recommend adding comments to your code so other developers can use what you have created. Learn more [here](/code-comments/) about how to comment your code.
:::

## Creating Routine Definitions

Routine definition files should end with the `.pro.def` file extension.

The contents of these files should be PRO code, but the routine definitions should be completely empty apart from argument and keyword definitions.

This makes it easy to create definition files without having to learn a brand new syntax and is patterned after TypeScript.

## Important Behaviors

Here's a few key notes about routine definition files:

- Routine definitions are compatible with format on save and AutoDoc

- Routine definitions only report problems for documentation, all other problems are ignored

- Any problems that are disabled for PRO files will also be ignored within routine definition files

- Auto-complete is disabled for routine definition files since there is no code that needs completing

- Hover help works within definition files for the routine signature to make sure you can easily check if docs are formatted correctly

## Examples

Here are a few examples showing the original code and then what the routine definition looks like.

### Function Example

::: code-group

```idl [Function]
;+
; :Description:
;   Creates our message interceptor and registers it with ENVI (requires that ENVI is launched)
;
; :Returns: VsCodeENVIMessageInterceptor
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
  if (~self.enviMessageHandler::init()) then begin
    return, 0
  endif

  ; init properties
  self.stack = 0
  self.verbose = keyword_set(verbose)
  self.lastStart = list()
  self.lastProgress = list()

  ; get the channel and subscribe
  oChannel = e.getBroadcastChannel()
  oChannel.subscribe, self

  ; return 1 as valid object
  return, 1
end
```

```idl [Function in Routine Definition File]
;+
; :Description:
;   Creates our message interceptor and registers it with ENVI (requires that ENVI is launched)
;
; :Returns: VsCodeENVIMessageInterceptor
;
; :Keywords:
;   verbose: in, optional, Boolean
;     If set, we print out all progress messages, otherwise we only print
;     the first one and not any child task messages.
;
;-
function VSCodeENVIMessageInterceptor::Init, verbose = verbose

end
```

:::

### Procedure Example

::: code-group

```idl [Procedure]
;+
; :Description:
;   Returns information from IDL about a specific scope level which
;   contains information about the call stack, variables, and IDL's prompt.
;
; :Arguments:
;   level: in, optional, Number
;     Specify the scope level to extract information for. The default
;     level is 0.
;
; :Keywords:
;   output: out, optional, String
;     Contains the results from querying a specific scope level
;
;-
pro vscode_getScopeInfo, level, output = output
  compile_opt idl2, hidden
  on_error, 2

  ;+ is it though?
  meaningOfLife = 42

end
```

```idl [Procedure in Routine Definition File]
;+
; :Description:
;   Returns information from IDL about a specific scope level which
;   contains information about the call stack, variables, and IDL's prompt.
;
; :Arguments:
;   level: in, optional, Number
;     Specify the scope level to extract information for. The default
;     level is 0.
;
; :Keywords:
;   output: out, optional, String
;     Contains the results from querying a specific scope level
;
;-
pro vscode_getScopeInfo, level, output = output

end
```

:::

### Structure Definition Example

::: warning
Compared to procedures and functions, structures require code to be present in the definition file so that we can make sure to detect inheritance and all properties (which then have types added from the documentation in the code).

This means the example below looks the same before/after.

Additionally, structures can only be detected in procedures that end with `__define` in their names.
:::

::: code-group

```idl [Structures]
;+
; :IDLNotebookImage_Base:
;   xSize: Number
;     The width of the PNG for display
;   ySize: Number
;     The height of the PNG for display
;
; :IDLNotebookImage_Png:
;   data: String
;     Base64 encoded PNG as a string
;
;-
pro IDLNotebookImage__define
  compile_opt idl2, hidden
  on_error, 2

  ;+
  ; Base data structure for image
  ;-
  !null = {IDLNotebookImage_Base, $
    xSize: 0l, $
    ySize: 0l}

  ;+
  ; Data structure for embedding an image
  ;-
  !null = {IDLNotebookImage_Png, $
    inherits IDLNotebookImage_Base, $
    data: 'base64'}

end
```

```idl [Structures in Routine Definition File]
;+
; :IDLNotebookImage_Base:
;   xSize: Number
;     The width of the PNG for display
;   ySize: Number
;     The height of the PNG for display
;
; :IDLNotebookImage_Png:
;   data: String
;     Base64 encoded PNG as a string
;
;-
pro IDLNotebookImage__define
  compile_opt idl2, hidden
  on_error, 2

  ;+
  ; Base data structure for image
  ;-
  !null = {IDLNotebookImage_Base, $
    xSize: 0l, $
    ySize: 0l}

  ;+
  ; Data structure for embedding an image
  ;-
  !null = {IDLNotebookImage_Png, $
    inherits IDLNotebookImage_Base, $
    data: 'base64'}
end
```

:::
