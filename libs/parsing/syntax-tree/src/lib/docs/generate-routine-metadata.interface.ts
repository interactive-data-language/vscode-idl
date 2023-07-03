import { IFunctionMetadata, IRoutineMetadata } from '@idl/data-types/core';

/* Strictly typed value for functions with regards to docs */
export type FunctionRoutineType = 'function';
/* Strictly typed value for procedures with regards to docs */
export type ProcedureRoutineType = 'procedure';
/** Strictly types values used for routines types for docs */
export type RoutineType = FunctionRoutineType | ProcedureRoutineType;

/**
 * Metadata that we return based on our routine type
 */
export type RoutineMetadata<T extends RoutineType> =
  T extends FunctionRoutineType ? IFunctionMetadata : IRoutineMetadata;
