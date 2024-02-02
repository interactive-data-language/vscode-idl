### Function Definitions

`function` is used to create re-usable routines called functions. In IDL, functions always have to use a routine and, if you call a function, you need to assign the value to something.

```idl
function followTheWhiteRabbit
  compile_opt idl2

  ; do some cool things to follow the rabbit
  ; and find your destiny

  ; functions always have to return a value
  return, 1
end
```

Then, to use your function, call it as a single statement and assign the value to a variable or the `!null` system variable:

```idl
!null = followTheWhiteRabbit()
```

### Arguments

Add arguments to a function definition with the following syntax:

```idl
function followTheWhiteRabbit, fromLocation, toLocation
  compile_opt idl2

  print, `Starting ${fromLocation} and going to ${toLocation}`

  ; functions always have to return a value
  return, 1
end
```

Then, to use your procedure, call it as a single statement:

```idl
!null = followTheWhiteRabbit('home', 'the club')
```

### Keywords

Keywords are traditionally optional parameters, but they can be used in lieu of arguments as well.

::: tip
Best practice is to have keyword share the same external and internal names. In the example below, "quickly" is the external name and "soFast" is our internal (i.e. variable) name.
:::

```idl
function followTheWhiteRabbit, fromLocation, toLocation, quickly = soFast
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
!null = followTheWhiteRabbit('home', 'the club', /quickly)

; or pass a truthy value
!null = followTheWhiteRabbit('home', 'the club', quickly = !true)
```

Note that the external reference for the keyword is `quickly` and the variable that represents `quickly` when inside of `followTheWhiteRabbit` is `soFast`.

> The `keyword_set()` function keys if we have passed a truthy value for our keyword "quickly" when calling our routine `followTheWhiteRabbit`
