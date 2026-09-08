# Task Creation

This doc covers the basics of how ENVI and IDL task creation works within VSCode.

## What are Tasks?

Tasks are a core concept for ENVI and IDL that have been about for about 7 years. Tasks represent small pieces of processing with pre-defined inputs and outputs for a specific task that you want to achieve.

If you are a programmer, you might be thinking "that's what my code does too" and you would be right!

However, the difference is that, when you wrap your code as an ENVI or IDL task, it allows you to easily run it from almost anywhere. A task is a non-IDL-or-ENVI way to describe parameters to run ENVI and IDL code.

That means we can:

- Run ENVI and IDL tasks using the task engine (included with ENVI and IDL) using stdio

- Run ENVI and IDL tasks in a server environment using GSF (freely available through our downloads portal)

- Run ENVI and IDL tasks directly from Python without needing to set up the IDL-Python bridge

## Creating Tasks

Tasks have two components:

1. An IDL procedure that has keywords used as input/output parameters

2. A JSON file (.task) describing the keywords used for input/output

Below is a description of how you make a task within the extension

1. Create new IDL procedure or open existing file

2. Add documentation to your procedure and update the docs within your code.

::: tip
The documentation is used to add types and define the direction for parameters

With format-on-save enabled for the extension, this happens automatically!
:::

3. From the IDL sidebar in the extension, select "Generate IDL or ENVI Task"

4. From the drop-down that appears, pick the right task for you. If you are using the ENVI API, then you should pick "ENVI" otherwise you can just select "IDL".

5. The task file should automatically appear in the display and you can now use it!

::: tip
You might need to refine the task parameters, so you can use auto-complete (and hover-help) directly within VSCode to help you write your tasks.

If you need for information, here are links to where you can find more about [ENVI](https://www.nv5geospatialsoftware.com/docs/tasktemplateenvi551.html) and [IDL](https://www.nv5geospatialsoftware.com/docs/TaskTemplateIDL8.7.1.html) tasks
:::

## Using Tasks

If you don't have a main level program in your selected PRO file, we will automatically create one for you!

It shows how to use ENVI or IDL tasks and adds some helpful comments in boilerplate code to help get you started.

### ENVI Task Example

Here is what the ENVI Task main level program generated for a sample procedure might look like:

```idl
;+
; :Keywords:
;   input_raster: in, optional, ENVIRaster
;     Placeholder docs for argument, keyword, or property
;   output_raster_uri: in, optional, String
;     Placeholder docs for argument, keyword, or property
;
;-
pro envitasktest, input_raster = input_raster, output_raster_uri = output_raster_uri
  compile_opt idl2

  ; get the current session of ENVI
  e = envi(/current)
  if (e eq !null) then begin
    message, 'ENVI has not started yet, required!'
  endif
end

; Main level program
compile_opt idl2

;+ Start ENVI (feel free to add "/headless" so the UI does not appear)
e = envi()

;+
; This code always loads the latest task from disk for ENVI
; to be aware of
;
; If you make changes to your task, the next time you run this,
; ENVI will pick them up and is great for easy development
;+
myTask = ENVITask(routine_dir() + 'envitasktest.task')

; TODO: set task parameters
myTask.input_raster = !null
myTask.output_raster_uri = !null

; run our awesome task
myTask.execute

;+
; If you have problems with your task, it can be easier to run
; as a procedure instead
;
; Remove the return statement just below to run our procedure instead of
; the task, but remember to comment out the task execution code above so
; things don't run twice!
;-
return

; Set/reset the values of output keywords so we have a fresh run
output_raster_uri = !null

;+
; Run our procedure
;
; TODO: Set keywords
;-
envitasktest, $
  input_raster = !null, $
  output_raster_uri = output_raster_uri

end
```

### IDL Task Example

Here is what the IDL Task main level program generated for a sample procedure might look like:

```idl
;+
; :Keywords:
;   input_array: in, optional, Array<String>
;     Placeholder docs for argument, keyword, or property
;   input_parameter: in, optional, String
;     Placeholder docs for argument, keyword, or property
;   output_parameter: out, optional, String
;     Placeholder docs for argument, keyword, or property
;
;-
pro idltasktest, input_parameter = input_parameter, input_array = input_array, $
  output_parameter = output_parameter
  compile_opt idl2
end

; Main level program
compile_opt idl2

;+
; This code always loads the latest task from disk for IDL
; to be aware of
;
; If you make changes to your task, the next time you run this,
; IDL will pick them up and is great for easy development
;+
myTask = = IDLTask(routine_dir() + 'idltasktest.task')

; TODO: set task parameters
myTask.input_array = !null
myTask.input_parameter = !null

; run our awesome task
myTask.execute

;+
; If you have problems with your task, it can be easier to run
; as a procedure instead
;
; Remove the return statement just below to run our procedure instead of
; the task, but remember to comment out the task execution code above so
; things don't run twice!
;-
return

; Set/reset the values of output keywords so we have a fresh run
output_parameter = !null

;+
; Run our procedure
;
; TODO: Set keywords
;-
idltasktest, $
  input_array = !null, $
  input_parameter = !null, $
  output_parameter = output_parameter

end
```
