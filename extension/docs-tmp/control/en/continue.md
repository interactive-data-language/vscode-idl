### Continue

The continue statement skips to the next step of a loop.

```idl
for i=0, 9 do begin
  ; i dont like small numbers, so lets skip some
  if (i lt 5) then continue

  print, i
  ; output: 5, 6, 7, 8, 9
endforeach
```
