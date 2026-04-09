import {
  IFunctionMetadata,
  IRoutineMetadata,
  IStructureMetadata,
} from '@idl/types/idl-data-types';

/* Strictly typed value for functions with regards to docs */
export type FunctionRoutineType = 'function';

/* Strictly typed value for procedures with regards to docs */
export type ProcedureRoutineType = 'procedure';

/** Task routine (function) */
export type TaskRoutineType = 'task';

/* Strictly typed value for procedures with regards to docs */
export type StructureRoutineType = 'structure';

/** Strictly types values used for routines types for docs */
export type RoutineType =
  | FunctionRoutineType
  | ProcedureRoutineType
  | StructureRoutineType
  | TaskRoutineType;

/**
 * Metadata that we return based on our routine type
 */
export type RoutineMetadata<T extends RoutineType> =
  T extends FunctionRoutineType
    ? IFunctionMetadata
    : T extends ProcedureRoutineType
      ? IRoutineMetadata
      : T extends StructureRoutineType
        ? IStructureMetadata
        : T extends TaskRoutineType
          ? IFunctionMetadata
          : never;
