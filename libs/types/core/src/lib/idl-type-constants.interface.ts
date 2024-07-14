import {
  IDL_TYPE_LOOKUP,
  IDLAny,
  IDLBoolean,
  IDLByte,
  IDLComplexFloat,
  IDLDataTypeBase,
  IDLDouble,
  IDLDoubleComplex,
  IDLFloat,
  IDLInteger,
  IDLLong,
  IDLLong64,
  IDLNull,
  IDLNumber,
  IDLString,
  IDLStructure,
  IDLTypes,
  IDLUnsignedInteger,
  IDLUnsignedLong,
  IDLUnsignedLong64,
} from './idl-data-types.interface';
import { ParseIDLType } from './parsing/parse-idl-type';

/**
 * Default data type used for return values from functions, variables, or procedures
 */
export const DEFAULT_DATA_TYPE: IDLTypes = IDL_TYPE_LOOKUP.ANY;

/**
 * Type for unknown things, like properties that don't exist
 */
export const UNKNOWN_TYPE: IDLDataTypeBase<string>[] = [
  {
    display: 'Unknown',
    name: 'Unknown',
    args: [],
    meta: {},
  },
];

/**
 * Any type
 */
export const IDL_ANY_TYPE: IDLDataTypeBase<IDLAny>[] = [
  {
    display: IDL_TYPE_LOOKUP.ANY,
    name: IDL_TYPE_LOOKUP.ANY,
    args: [],
    meta: {},
  },
];

/**
 * Boolean type
 */
export const IDL_BOOLEAN_TYPE: IDLDataTypeBase<IDLBoolean>[] = [
  {
    display: IDL_TYPE_LOOKUP.BOOLEAN,
    name: IDL_TYPE_LOOKUP.BOOLEAN,
    args: [],
    meta: {},
  },
];

/**
 * Generic type for arrays
 */
export const IDL_ARRAY_TYPE = ParseIDLType(IDL_TYPE_LOOKUP.ARRAY);

/**
 * Structure data type, for anonymous structures
 *
 * Any named structures will have their name as the type
 */
export const IDL_STRUCTURE_TYPE: IDLDataTypeBase<IDLStructure>[] = [
  {
    display: IDL_TYPE_LOOKUP.STRUCTURE,
    name: IDL_TYPE_LOOKUP.STRUCTURE,
    args: [],
    meta: {},
  },
];

/**
 * Generic type for numbers
 */
export const IDL_NUMBER_TYPE: IDLDataTypeBase<IDLNumber>[] = [
  {
    display: IDL_TYPE_LOOKUP.NUMBER,
    name: IDL_TYPE_LOOKUP.NUMBER,
    args: [],
    meta: {},
  },
];

/**
 * Type for double numbers
 */
export const IDL_DOUBLE_TYPE: IDLDataTypeBase<IDLDouble>[] = [
  {
    display: IDL_TYPE_LOOKUP.DOUBLE,
    name: IDL_TYPE_LOOKUP.DOUBLE,
    args: [],
    meta: {},
  },
];

/**
 * Type for double complex numbers
 */
export const IDL_DOUBLE_COMPLEX_TYPE: IDLDataTypeBase<IDLDoubleComplex>[] = [
  {
    display: IDL_TYPE_LOOKUP.COMPLEX_DOUBLE,
    name: IDL_TYPE_LOOKUP.COMPLEX_DOUBLE,
    args: [],
    meta: {},
  },
];

/**
 * Type for float numbers
 */
export const IDL_FLOAT_TYPE: IDLDataTypeBase<IDLFloat>[] = [
  {
    display: IDL_TYPE_LOOKUP.FLOAT,
    name: IDL_TYPE_LOOKUP.FLOAT,
    args: [],
    meta: {},
  },
];

/**
 * Type for floating complex numbers
 */
export const IDL_FLOAT_COMPLEX_TYPE: IDLDataTypeBase<IDLComplexFloat>[] = [
  {
    display: IDL_TYPE_LOOKUP.COMPLEX_FLOAT,
    name: IDL_TYPE_LOOKUP.COMPLEX_FLOAT,
    args: [],
    meta: {},
  },
];

/**
 * Type for ulong64 numbers
 */
export const IDL_ULONG64_TYPE: IDLDataTypeBase<IDLUnsignedLong64>[] = [
  {
    display: IDL_TYPE_LOOKUP.UNSIGNED_LONG64,
    name: IDL_TYPE_LOOKUP.UNSIGNED_LONG64,
    args: [],
    meta: {},
  },
];

/**
 * Type for long64 numbers
 */
export const IDL_LONG64_TYPE: IDLDataTypeBase<IDLLong64>[] = [
  {
    display: IDL_TYPE_LOOKUP.LONG64,
    name: IDL_TYPE_LOOKUP.LONG64,
    args: [],
    meta: {},
  },
];

/**
 * Type for ulong numbers
 */
export const IDL_ULONG_TYPE: IDLDataTypeBase<IDLUnsignedLong>[] = [
  {
    display: IDL_TYPE_LOOKUP.UNSIGNED_LONG,
    name: IDL_TYPE_LOOKUP.UNSIGNED_LONG,
    args: [],
    meta: {},
  },
];

/**
 * Type for long numbers
 */
export const IDL_LONG_TYPE: IDLDataTypeBase<IDLLong>[] = [
  {
    display: IDL_TYPE_LOOKUP.LONG,
    name: IDL_TYPE_LOOKUP.LONG,
    args: [],
    meta: {},
  },
];

/**
 * Type for uint numbers
 */
export const IDL_UINT_TYPE: IDLDataTypeBase<IDLUnsignedInteger>[] = [
  {
    display: IDL_TYPE_LOOKUP.UNSIGNED_INTEGER,
    name: IDL_TYPE_LOOKUP.UNSIGNED_INTEGER,
    args: [],
    meta: {},
  },
];

/**
 * Type for int numbers
 */
export const IDL_INT_TYPE: IDLDataTypeBase<IDLInteger>[] = [
  {
    display: IDL_TYPE_LOOKUP.INTEGER,
    name: IDL_TYPE_LOOKUP.INTEGER,
    args: [],
    meta: {},
  },
];

/**
 * Type for int numbers
 */
export const IDL_BYTE_TYPE: IDLDataTypeBase<IDLByte>[] = [
  {
    display: IDL_TYPE_LOOKUP.BYTE,
    name: IDL_TYPE_LOOKUP.BYTE,
    args: [],
    meta: {},
  },
];

/**
 * NUll type
 */
export const IDL_NULL_TYPE: IDLDataTypeBase<IDLNull>[] = [
  {
    display: IDL_TYPE_LOOKUP.NULL,
    name: IDL_TYPE_LOOKUP.NULL,
    args: [],
    meta: {},
  },
];

/**
 * String type
 */
export const IDL_STRING_TYPE: IDLDataTypeBase<IDLString>[] = [
  {
    display: IDL_TYPE_LOOKUP.STRING,
    name: IDL_TYPE_LOOKUP.STRING,
    args: [],
    meta: {},
  },
];

/**
 * Generic type for arrays
 */
export const IDL_TYPE_CODE_TYPE = ParseIDLType(
  '0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15'
);
