### Foreach Loop

Use the foreach loop to iterate through all elements of a variable or statement.

```idl
; a basic foreach loop
foreach value, [0,1,2,3,4] do print, value
; output: 0, 1, 2, 3, 4...

; a basic foreach loop with the key to get the value we accessed
foreach value, list('thing', 0.0, [1]), index do print, index
; output: 0, 1, 2

; a basic foreach loop with the key for the value we access
foreach value, orderedhash('key1', 1, 'key2', 42), key do print, key
; output: "key1", "key2"

; foreach loop with a block
foreach value, [0,1,2,3,4] do begin
  meaningOfLine = value ; but its not that simple...
endforeach
```
