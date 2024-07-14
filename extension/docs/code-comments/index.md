# Documenting Your Code

Some of the core features of the extension revolve around parsing the comments in your code to learn about types and directions of your parameters.

The extension has build-in capabilities to automatically format, and add documentation to your code, when you save.

This feature helps you get the most out of the code that you write and makes it easier for others to interpret, and use, your code.

::: tip
Rather than be an expert at IDLDoc, try our automation to format, and add docs, to your code on save!

Learn more about AutoDoc [here](./auto_doc.md) and how to set up automation [here](./formatting/configuration.md)
:::

## Docs Style

The standard that we follow for docs parsing is closely related to IDLDoc with a few twists.

Here are some basic examples of what code comments look like for PRO code included with the extension:

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

  ;... actual logic

end
```

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

```idl [Structure Definitions]
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
; :IDLNotebookImage_FromUri:
;   uri: String
;     Fully-qualified filepath to an image on disk.
;
;     At this time, only PNGs are supported
;
; :IDLNotebookImage_AnimationFromUris:
;   uris: List<String>
;     Fully-qualified filepaths to images on disk that you want to create
;     an animation for.
;
;     At this time, only PNGs are supported.
;
;-
pro IDLNotebookImage__define
  compile_opt idl2, hidden
  on_error, 2

  ;+
  ; Base datas tructure for image
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

  ;+
  ; Data structure for embedding an image
  ;-
  !null = {IDLNotebookImage_FromUri, $
    inherits IDLNotebookImage_Base, $
    uri: ''}

  ;+
  ; Data structure for embedding a series of image as an animation
  ;-
  !null = {IDLNotebookImage_AnimationFromUris, $
    inherits IDLNotebookImage_Base, $
    uris: list()}
end
```

```idl [Variables]
pro myAwesomePro
  compile_opt idl2

  ;+ I wonder what it is...
  meaningOfLife = 42

  ;+
  ; We can use a mulit-line block of comments to add
  ; all the important information that we want
  ;-
  but = `It's not that simple`
end
```

:::

## Embedding Examples

All comments are interpreted as Markdown which needs special markup for PRO code to embed examples that appear in hover help and notebook creation.

You have to use a Markdown code block, indicated with three backticks, within your docs. See the highlighted code below with an example of what this looks like.

````idl{4,5,6,7,8,9}
;+
; :Returns: Number
;
; :Examples:
;   See this cool code example:
;
;   ```idl
;   p = plot(/test)
;   ```
;
; :Arguments:
;   event: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function MyFunc, event
  compile_opt idl2, hidden
  return, 42
end
````
