### Procedure Definitions

**pro** is used to create re-usable routines called procedures. Procedures are odd-balls compared to most languages today in that they are not allowed to return a value.

```idl
pro followTheWhiteRabbit
  compile_opt idl2

  ; do some cool things to follow the rabbit
  ; and find your destiny
end
```

Then, to use your procedure, call it as a single statement:

```idl
followTheWhiteRabbit
```

### Arguments

Add arguments to a procedure definition with the following syntax:

```idl
pro followTheWhiteRabbit, fromLocation, toLocation
  compile_opt idl2

  print, `Starting ${fromLocation} and going to ${toLocation}`

end
```

Then, to use your procedure, call it as a single statement:

```idl
followTheWhiteRabbit, 'home', 'the club'
```

### Keywords

Keywords are traditionally optional parameters, but they can be used in lieu of arguments as well.

::: tip
Best practice is to have keyword share the same external and internal names. In the example below, "quickly" is the external name and "soFast" is our internal (i.e. variable) name.
:::

```idl
pro followTheWhiteRabbit, fromLocation, toLocation, quickly = soFast
  compile_opt idl2

  print, `Starting ${fromLocation} and going to ${toLocation}`

  if keyword_set(soFast) then begin
    print, 'And I am going to find the white rabbit so fast'
  endif
end
```

And there are several ways you can utilize keywords:

```idl
; "set" the keyword with a forward-slash
followTheWhiteRabbit, 'home', 'the club', /quickly

; or pass a truthy value
followTheWhiteRabbit, 'home', 'the club', quickly = !true
```

Note that the external reference for the keyword is `quickly` and the variable that represents `quickly` when inside of `followTheWhiteRabbit` is `soFast`.

> The `keyword_set()` function keys if we have passed a truthy value for our keyword "quickly" when calling our routine `followTheWhiteRabbit`
