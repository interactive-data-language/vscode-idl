# TLDR: Types

This is a brief introduction to types in IDL.

> Pro tip: Types are, for now, built around documentation for your code. It is recommended to use format-on-save in VSCode with AutoDoc enabled for the extension. You can disable formatting apart from adding documentation if desired.

## Using Types

With the help of AutoDoc, type details will be added to documentation for you to quickly change/update.

Here is an example showing functions, procedures, arguments, keywords, and properties in structure definitions (from "\_\_define" procedures).

```idl
;+
; :Arguments:
;   a: in, required, Array<Number>
;     First argument
;   b: in, required, List<Hash<Number>>
;     Second argument
;
;-
pro mypro, a, b
  compile_opt idl2
  c = a + b
end

;+
; :Returns: Long
;
; :Keywords:
;   kw1: in, optional, ENVIRaster
;     First keyword
;   kw2: out, optional, String
;     Second keyword
;
;-
function myFunc, kw1 = kw1, kw2 = kw2
  compile_opt idl2
  kw2 = 'string!'
  return, 1
end

;+
; :MyClass:
;   prop: Long
;     Favorite property
;   prop2: Array<String>
;     Second favorite property
;
;-
pro class__define
  compile_opt idl2

  !null = {MyClass, prop: 1, prop2: ptr_new()}
end
```

## Task Types

When using types for ENVI and IDL tasks, we have a shorthand notation that is easier to read.

It also has a special case where, to specify more thank one type of task, we use the "|" operator with another task.

Here's some examples

```idl
;+
; :Arguments:
;   a: in, required, IDLTask<MyTask>
;     First argument
;   b: in, required, ENVITask<BuildMosaicRaster>
;     A single task
;   c: in, required, ENVITask<BuildMosaicRaster> | ENVITask<SubsetRaster>
;     More than one kind of task
;
;-
pro mypro, a, b, c
  compile_opt idl2
end
```

## Basic Types

Basic types are data types in IDL that are standalone and don't require any additional information.

> All aliases are mapped to the type in the left-most column and, when formatted, are replaced with that value

| Type          | Represents                  | Aliases (case insensitive)             |
| ------------- | --------------------------- | -------------------------------------- |
| any           | Literally anything          | any                                    |
| BigInteger    | Big integers                | BigInteger, BigInteger                 |
| Boolean       | Binary values of true/false | Bool, Boolean                          |
| Byte          | Byte number                 | Byte                                   |
| ComplexNumber | Generic complex number      | ComplexNumber                          |
| Complex       | Float complex number        | Complex, ComplexFloat, FloatComplex    |
| DoubleComplex | Double complex number       | DComplex, DoubleComplex, DoubleComplex |
| Double        | Double-precision number     | Double, Float64                        |
| Int           | Integer number              | Int, Integer                           |
| Long          | Long number                 | Long                                   |
| Long64        | 64-bit long number          | Long64                                 |
| Null          | Null values (i.e. !null)    | Null                                   |
| Number        | Generic number              | Number                                 |
| String        | String                      | String                                 |
| UInt          | Unsigned integer number     | UInt, UnsignedInt, UnsignedInteger     |
| ULong         | Unsigned long number        | ULong, UnsignedLong                    |
| ULong64       | Unsigned 64-bit long number | ULong64, UnsignedLong64                |

## Compound Types

Unlike basic types, compound types require additional information (known as a type argument) in order to be fully qualified. These type arguments typically contain basic types or other compound types.

Here are a few examples of how you create and use compound types:

- An array of strings: `Array<String>`

- An object array of lists that contain numbers: `Array<List<Number>>`

Why do we need a type argument? The type argument, wrapped in `<TypeArg>` indicates the return value when indexing or what the type contains. For example, if you index a data type that is an `Array<String>` you would get back a scalar `String`.

> If you don't specify a type argument, it defaults "any", indicating it can contain any value

> If you don't specify a type argument, when you next use AutoDoc, it will automatically have "<any>" added to the type

> Pro tip: Do not create nested array types for multi-dimensional arrays. Dimensionality of arrays is not handled at this point in time.

| Type       | Represents                          | Aliases (case insensitive) | Examples (case insensitive) |
| ---------- | ----------------------------------- | -------------------------- | --------------------------- |
| Array      | Arrays of values (no dimensions)    | Array                      | Array<String>, Array<Hash>  |
| Dictionary | Dictionary and values within        | Dictionary, Dict           | Dictionary<List\<Hash\>>    |
| ENVITask   | Named ENVI Task                     | ENVITask                   | ENVITask<SubsetRaster>      |
| Hash       | Hash and values within              | Hash                       | Hash<Number>, Hash<List>    |
| IDLTask    | Named IDL Task                      | IDLTask                    | IDLTask<MyCustomTask>       |
| List       | List and values within              | List                       | List<Number \| String>      |
| Pointer    | Pointer what the pointer represents | Pointer, Ptr               | Pointer<Array<Number>>      |

## Custom Types

If you create your own object classes or structure definitions, you can use the name of the structure or class as the type. This allows you to have easy access to properties, methods, auto complete, and hover help.

For example:

- If you want to represent a `plot` object, you would use `Plot`
- If you wanted to represent a raster, you would use `ENVIRaster`

## Union Types

If a value can have more than one type, you can use a single pipe `|` to separate two IDL types.

For example:

- If I can have a byte or long: `Byte | Long`

- If I can have a hash or dictionary: `Hash<Number> | Dictionary<Number>`

Union types will, when interacted with, provide hover help and auto complete for each type.
