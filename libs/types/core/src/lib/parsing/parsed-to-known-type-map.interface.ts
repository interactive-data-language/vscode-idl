import { IDL_TYPE_LOOKUP, IDLTypes } from '../..';

/**
 * Maps types that we find in code to known types to normalize what we parse
 * and be less struct about the starting point for user's code.
 *
 * When we serialize, the original types will be the values listed
 * below.
 *
 * User's code will only change if they have AutoDoc enabled with formatting
 */
export const PARSED_TO_KNOWN_TYPES: { [key: string]: IDLTypes } = {
  any: IDL_TYPE_LOOKUP.ANY,

  array: IDL_TYPE_LOOKUP.ARRAY,

  arraypromotion: IDL_TYPE_LOOKUP.ARRAY_PROMOTION,

  bigint: IDL_TYPE_LOOKUP.BIG_INTEGER,
  biginteger: IDL_TYPE_LOOKUP.BIG_INTEGER,

  bool: IDL_TYPE_LOOKUP.BOOLEAN,
  boolean: IDL_TYPE_LOOKUP.BOOLEAN,

  byte: IDL_TYPE_LOOKUP.BYTE,

  complexnumber: IDL_TYPE_LOOKUP.COMPLEX_NUMBER,

  complex: IDL_TYPE_LOOKUP.COMPLEX_FLOAT,
  complexfloat: IDL_TYPE_LOOKUP.COMPLEX_FLOAT,
  floatcomplex: IDL_TYPE_LOOKUP.COMPLEX_FLOAT,

  dcomplex: IDL_TYPE_LOOKUP.COMPLEX_DOUBLE,
  doublecomplex: IDL_TYPE_LOOKUP.COMPLEX_DOUBLE,
  complexdouble: IDL_TYPE_LOOKUP.COMPLEX_DOUBLE,

  dict: IDL_TYPE_LOOKUP.DICTIONARY,
  dictionary: IDL_TYPE_LOOKUP.DICTIONARY,

  envitask: IDL_TYPE_LOOKUP.ENVI_TASK,

  float64: IDL_TYPE_LOOKUP.DOUBLE,
  double: IDL_TYPE_LOOKUP.DOUBLE,

  float32: IDL_TYPE_LOOKUP.FLOAT,
  float: IDL_TYPE_LOOKUP.FLOAT,

  hash: IDL_TYPE_LOOKUP.HASH,

  idltask: IDL_TYPE_LOOKUP.IDL_TASK,

  int: IDL_TYPE_LOOKUP.INTEGER,
  integer: IDL_TYPE_LOOKUP.INTEGER,

  list: IDL_TYPE_LOOKUP.LIST,

  long: IDL_TYPE_LOOKUP.LONG,

  long64: IDL_TYPE_LOOKUP.LONG64,

  null: IDL_TYPE_LOOKUP.NULL,

  number: IDL_TYPE_LOOKUP.NUMBER,

  class: IDL_TYPE_LOOKUP.OBJECT,
  obj: IDL_TYPE_LOOKUP.OBJECT,
  object: IDL_TYPE_LOOKUP.OBJECT,

  orderedhash: IDL_TYPE_LOOKUP.ORDERED_HASH,

  ptr: IDL_TYPE_LOOKUP.POINTER,
  pointer: IDL_TYPE_LOOKUP.POINTER,

  string: IDL_TYPE_LOOKUP.STRING,

  struct: IDL_TYPE_LOOKUP.STRUCTURE,
  structure: IDL_TYPE_LOOKUP.STRUCTURE,

  typeofarg: IDL_TYPE_LOOKUP.TYPE_OF_ARG,

  uint: IDL_TYPE_LOOKUP.UNSIGNED_INTEGER,
  unsignedint: IDL_TYPE_LOOKUP.UNSIGNED_INTEGER,
  unsignedinteger: IDL_TYPE_LOOKUP.UNSIGNED_INTEGER,

  ulong: IDL_TYPE_LOOKUP.UNSIGNED_LONG,
  unsignedlong: IDL_TYPE_LOOKUP.UNSIGNED_LONG,

  ulong64: IDL_TYPE_LOOKUP.UNSIGNED_LONG64,
  unsignedlong64: IDL_TYPE_LOOKUP.UNSIGNED_LONG64,
};
