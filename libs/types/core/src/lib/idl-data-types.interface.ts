import { IPropertyLookup } from './global/global-types.interface';

/** Byte numbers */
export type IDLByte = 'Byte';

/** Integer numbers */
export type IDLInteger = 'Int';

/** Unsigned integer */
export type IDLUnsignedInteger = 'UInt';

/** Long numbers */
export type IDLLong = 'Long';

/** Unsigned long numbers */
export type IDLUnsignedLong = 'ULong';

/** 64-bit long numbers */
export type IDLLong64 = 'Long64';

/** Unsigned 64-bit long */
export type IDLUnsignedLong64 = 'ULong64';

/** 32-bit floating point */
export type IDLFloat = 'Float';

/** 64-bit floating point */
export type IDLDouble = 'Double';

/** 32-bit floating point complex */
export type IDLComplexFloat = 'Complex';

/** 64-bit floating point complex */
export type IDLDoubleComplex = 'DoubleComplex';

/** Generic type for complex numbers */
export type IDLComplexNumber = 'ComplexNumber';

/** Big integers from the BigInteger function */
export type IDLBigInteger = 'BigInteger';

/** Union type of all numbers */
export type IDLNumberUnion =
  | IDLByte
  | IDLInteger
  | IDLUnsignedInteger
  | IDLLong
  | IDLUnsignedLong
  | IDLLong64
  | IDLUnsignedLong64
  | IDLFloat
  | IDLDouble
  | IDLComplexFloat
  | IDLDoubleComplex
  | IDLComplexNumber
  | IDLBigInteger;

/** Generic number type */
export type IDLNumber = 'Number';

/** When we can have any value for the data type */
export type IDLAny = 'any';

/** IDL array */
export type IDLArray = 'Array';

/** IDL array promotion based on routine arguments */
export type IDLArrayPromotion = 'ArrayPromotion';

/** IDL boolean data type */
export type IDLBoolean = 'Boolean';

/** Dictionaries in IDL */
export type IDLDictionary = 'Dictionary';

/** Hashes in IDL */
export type IDLHash = 'Hash';

/** Ordered hashes in IDL */
export type IDLOrderedHash = 'OrderedHash';

/** IDL lists */
export type IDLList = 'List';

/** A Null or undefined value in IDL */
export type IDLNull = 'Null';

/** Object classes in IDL */
export type IDLObject = 'Object';

/** When we have a pointer in IDL */
export type IDLPointer = 'Pointer';

/** IDL data type for string */
export type IDLString = 'String';

/** IDL data type for structures */
export type IDLStructure = 'Structure';

/** Type of of argument, expects an index for the array element */
export type IDLTypeOfArg = 'TypeOfArg';

/** Type for IDL Task */
export type IDLTaskType = 'IDLTask';

/** Type for ENVI Task */
export type ENVITaskType = 'ENVITask';

/** Known IDL data types from core IDL */
export type IDLKnownTypes =
  | IDLAny
  | IDLArray
  | IDLBoolean
  | IDLDictionary
  | IDLHash
  | IDLOrderedHash
  | IDLList
  | IDLNull
  | IDLNumber
  | IDLNumberUnion
  | IDLObject
  | IDLPointer
  | IDLString
  | IDLStructure
  | IDLTaskType
  | ENVITaskType;

/** Union type of allowed variables */
export type IDLTypes =
  | IDLKnownTypes
  | IDLArrayPromotion
  | IDLTypeOfArg
  | string;

/**
 * Strictly typed lookup for core IDL data types
 */
interface IIDLTypeLookup {
  /** When we can have any value for the data type */
  ANY: IDLAny;
  /** IDL array */
  ARRAY: IDLArray;
  /** When we have basic array promotion based on arguments */
  ARRAY_PROMOTION: IDLArrayPromotion;
  /** Big integers from the BigInteger function */
  BIG_INTEGER: IDLBigInteger;
  /** IDL boolean data type */
  BOOLEAN: IDLBoolean;
  /** Byte numbers */
  BYTE: IDLByte;
  /** 64-bit floating point complex */
  COMPLEX_DOUBLE: IDLDoubleComplex;
  /** 32-bit floating point complex */
  COMPLEX_FLOAT: IDLComplexFloat;
  /** Generic type for complex numbers */
  COMPLEX_NUMBER: IDLComplexNumber;
  /** 64-bit floating point */
  DOUBLE: IDLDouble;
  /** Dictionaries in IDL */
  DICTIONARY: IDLDictionary;
  /** ENVI Task */
  ENVI_TASK: ENVITaskType;
  /** 32-bit floating point */
  FLOAT: IDLFloat;
  /** Hashes in IDL */
  HASH: IDLHash;
  /** IDL Task */
  IDL_TASK: IDLTaskType;
  /** Integer numbers */
  INTEGER: IDLInteger;
  /** IDL lists */
  LIST: IDLList;
  /** Long numbers */
  LONG: IDLLong;
  /** 64-bit long numbers */
  LONG64: IDLLong64;
  /** A Null or undefined value in IDL */
  NULL: IDLNull;
  /** Generic number type */
  NUMBER: IDLNumber;
  /** Object classes in IDL */
  OBJECT: IDLObject;
  /** Ordered hashes in IDL */
  ORDERED_HASH: IDLOrderedHash;
  /** When we have a pointer in IDL */
  POINTER: IDLPointer;
  /** IDL data type for string */
  STRING: IDLString;
  /** IDL data type for structures */
  STRUCTURE: IDLStructure;
  /** Shorthand for the type of arguments */
  TYPE_OF_ARG: IDLTypeOfArg;
  /** Unsigned integer */
  UNSIGNED_INTEGER: IDLUnsignedInteger;
  /** Unsigned long numbers */
  UNSIGNED_LONG: IDLUnsignedLong;
  /** Unsigned 64-bit long */
  UNSIGNED_LONG64: IDLUnsignedLong64;
}

/**
 * Strictly typed lookup for core IDL data types
 */
export const IDL_TYPE_LOOKUP: IIDLTypeLookup = {
  ANY: 'any',
  ARRAY: 'Array',
  ARRAY_PROMOTION: 'ArrayPromotion',
  BIG_INTEGER: 'BigInteger',
  BOOLEAN: 'Boolean',
  BYTE: 'Byte',
  COMPLEX_DOUBLE: 'DoubleComplex',
  COMPLEX_FLOAT: 'Complex',
  COMPLEX_NUMBER: 'ComplexNumber',
  DICTIONARY: 'Dictionary',
  DOUBLE: 'Double',
  ENVI_TASK: 'ENVITask',
  FLOAT: 'Float',
  HASH: 'Hash',
  IDL_TASK: 'IDLTask',
  INTEGER: 'Int',
  LIST: 'List',
  LONG: 'Long',
  LONG64: 'Long64',
  NULL: 'Null',
  NUMBER: 'Number',
  OBJECT: 'Object',
  ORDERED_HASH: 'OrderedHash',
  POINTER: 'Pointer',
  STRING: 'String',
  STRUCTURE: 'Structure',
  TYPE_OF_ARG: 'TypeOfArg',
  UNSIGNED_INTEGER: 'UInt',
  UNSIGNED_LONG: 'ULong',
  UNSIGNED_LONG64: 'ULong64',
};

/**
 * Base structure for types in IDL for a single type
 */
export interface IDLDataTypeBase<T extends IDLTypes> {
  /** Type value for our item */
  name: T;
  /** Type to display to the user */
  display: string;
  /** Sub-types */
  args: IDLDataType[];
  /**
   * Metadata for our type, most likely always empty, but is intended to store
   * properties about our member.
   *
   * Specifically, if we have an anonymous structure, we store type information
   * about the properties right here.
   */
  meta: IPropertyLookup;
  /**
   * The value of a type (if it can be inferred or if it is literal)
   */
  value?: string;
}

/**
 * Data structure for types in IDL
 */
export type IDLDataType = IDLDataTypeBase<IDLTypes>[];
