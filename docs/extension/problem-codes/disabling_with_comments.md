# Disabling Problems with Comments

::: tip
This document covers an "advanced" API for you to disable the problems can get reported within your code.

We created this because other tools like ESLint have a similar API within comments to correct errors that get reported.

Please let us know if there are any other ways that you might want to disable problems being reported for your code.
:::

For problems that get reported, we want to make sure that we have all the scenarios covered so that users can disable problems.

There are many unique situations, with any language, where line-by-line or by-file customizations are needed.

This API works for IDL Notebooks and PRO code. The main difference is that, for IDL Notebooks, there's no way to turn comments off for the entire notebook. If you think this could be a useful feature, then feel free to make a feature request on GitHub and we can take a look.

## Disabling for a File or Notebook Cell

::: tip Best Practice
Either create a standalone comment block or comment at the top of your file or notebook cell when disabling problems for an entire file.
:::

To disable reporting any problem for an entire file, add the following to the top of your file (as a standalone comment, or in a comment block).

```idl
; idl-disable
```

If you just want to turn off specific problems for a given file, then you specify the problem aliases following `idl-disable`:

```idl
; idl-disable unused-var, illegal-arrow

; im OK!
a = 42

; im OK too, even though im a syntax error!
a = ->
```

You can also use a comment block at the top of your file with many problems:

```idl
;+
; idl-disable unused-var, no-comp-opt
;-

; im OK!
a = 42

; im OK!
pro mypro
  foo = 'bar'
end
```

And you can mix-and-match between the two:

```idl
;+
; idl-disable unused-var
;-

; idl-disable no-comp-opt

; im OK!
a = 42

; im OK!
pro mypro
  foo = 'bar'
end
```

## Disabling for a Line

There are two ways that you an disable a problem code being reported by line.

First, use `idl-disable-line` to disable one or more problem codes for that exact line by adding it after your code.

```idl
a = 42 ; idl-disable-line unused-var
```

Alternatively, you can disable the problem code by putting `idl-disable-next-line` before it:

```idl
; idl-disable-next-line unused-var, illegal-arrow
a = 42
```

You can add problem disabling to any comment block (they are also stripped from the docs):

```idl
;+
; Meaning of life
;
; idl-disable-next-line unused-var, illegal-arrow
;-
a = 42
```

For the example above, the "next" line indicates the line after the comment block ends.

If you don't close your comment block, this also applies to the next line the same way:

```idl
;+ Meaning of life
; idl-disable-next-line unused-var, illegal-arrow
a = 42
```

This example isn't the cleanest (or easiest to read), but it works!

## Don't Add to Routine Comments

While we will properly detect problems being disabled in routine comments and problems will be disabled as you expect, the next time your code is formatted the `idl-disable` statements will be stripped out of the documentation for the routine.

Please follow our best practices and use comments next to problems or at the very top of your file.
