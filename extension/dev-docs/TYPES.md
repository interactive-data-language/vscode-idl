# Types

Base design doc for types in IDL

## IDL Data Types

From docs and general IDL knowledge:

https://www.nv5geospatialsoftware.com/docs/idl_data_types.html

### Base Types

Base types that are standalone:

- Null
  - a = [], a = {}, a = !null
- Number
  - Byte
  - Integer
  - Unsigned Integer
  - Long
  - Unsigned Long
  - 64-bit Long
  - 64-bit Unsigned Long
  - Floating
  - Double
  - Complex Floating
  - Complex Double
  - BigInteger
- String
- Structure

### Compound Types

These build upon and extend the types above

- Pointer
- Object
  - Structure matching object ype
- List
- Hash
- Dictionary
- OrderedHash
- Array
  Of specific type

## Explicit Types

Not going to support this in the beginning, but this would be like we do in typescript with `type Mytype = 'val1' | 'val2'` which is the end-state for where we want to be.

However, this would require some syntax to create/define custom types which would have to be in comments considering we don't have transpiling like TypeScript or syntax for it.

## Syntax

### Base Types

For Base types, we have two options and probably need some aliases to match existing type names in IDL.

All types should be case insensitive to follow IDL patterns.

```typescript
// case insensitive
type Byte = 'byte';
type Integer = 'int' | 'integer';
type UnsignedInteger = 'uint' | 'UnsignedInteger';
type Long = 'long';
type UnsignedLong = 'ulong' | 'UnsignedLong';
type Long64 = 'long64';
type UnsignedLong64 = 'ulong64' | 'UnsignedLong64';
type Float = 'float' | 'float32';
type Double = 'double' | 'float64';
type FloatComplex = 'complex';
type DoubleComplex = 'dcomplex' | 'DoubleComplex' | 'Float64Complex';

// short-hand for complex type with type argument?
type Complex<T extends Float | Double> = T extends Float
  ? FloatComplex
  : DoubleComplex;
// Complex<Float> or Complex<Double>

// returned from the function
type BigInteger = 'BigInteger';

// special numbers from number strings and special syntax
type Hex = 'hex';
type Octal = 'octal';
type Binary = 'binary;

// generic union for number types
type Number =
  | Byte
  | Integer
  | UnsignedInteger
  | Long
  | UnsignedLong
  | Long64
  | Float
  | Double
  | Complex
  | BigInteger
  | Hex
  | Octal
  | Binary;

type String = 'string';

type Structure<T extends StructureName> = 'struct<T>' | 'structure<T>';

type BaseType = Number | String | Structure | Boolean;
```

### Compound Types

These types build upon the basic types above and require additional information in order to fully-qualify the types for them. For example: If I have an array, I need to know the type of the array to properly determine what a variable might be if we return a single element from that array.

```typescript
type Pointer<T extends VariableType> = 'pointer<T>' | 'ptr<T>';

type ClassName = String;

// when we parse objects, use the name of the object directly as shorthand instead of needing to explicitly define obj<name>
type Object<T extends ClassName> = 'T' | 'object<T>' | 'obj<T>' | 'objref<T>';

type List<T extends VariableType> = 'list<T>';

type IndexType = String | Number;

// specify the index type for hashes
// optional and default to strings?
type Hash<T extends VariableType, IDX extends IndexType> = 'hash<T, IDX>';

type OrderedHash<T extends VariableType, IDX extends IndexType> =
  | 'orderedhash<T, IDX>'
  | 'ohash<T, IDX>';

type Dictionary<T extends VariableType, IDX extends IndexType> =
  | 'dict<T, IDX>'
  | 'Dictionary<T, IDX>';

type Array<T extends VariableType> = 'array<T>' | 'T[];

// union type of all types that variables can be
// so that we have recursive typing support
type VariableType =
  | BaseType
  | Object<ClassName>
  | List<VariableType, IndexType>
  | Hash<VariableType, IndexType>
  | OrderedHash<VariableType, IndexType>
  | Dictionary<VariableType, IndexType>
  | Array<VariableType>;
```

## Type Promotion Rules

- Encountering an `i` or `j` for numbers immediately promotes the statement to complex

- Typed arrays (i.e. `bytarr()`) can't change types

- If there is an array in an expression, then we need to add the ability to do "array promotion"
