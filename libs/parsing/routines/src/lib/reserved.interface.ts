import { MANUAL_FUNCTION_METHODS } from './reserved-overrides/manual-function-methods.interface';
import { MANUAL_FUNCTIONS } from './reserved-overrides/manual-functions.interface';
import { MANUAL_PROCEDURE_METHODS } from './reserved-overrides/manual-procedure-methods.interface';
import { MANUAL_PROCEDURES } from './reserved-overrides/manual-procedures.interface';

/**
 * Names of reserved functions from our documentation that we should not override
 */
export const RESERVED_FUNCTIONS: { [key: string]: number } = {};

/**
 * Names of reserved procedures from our documentation that we should not override
 */
export const RESERVED_PROCEDURES: { [key: string]: number } = {};

/**
 * Names of reserved function methods from our documentation that we should not override
 */
export const RESERVED_PROCEDURE_METHODS: { [key: string]: number } = {};

/**
 * Names of reserved procedure methods from our documentation that we should not override
 */
export const RESERVED_FUNCTION_METHODS: { [key: string]: number } = {};

/**
 * Names of reserved methods from our documentation that we should not override. This catches
 * any methods that we may not know if they are functions or procedures
 */
export const RESERVED_METHODS: { [key: string]: number } = {};

// process all manual values
for (let i = 0; i < MANUAL_FUNCTIONS.length; i++) {
  RESERVED_FUNCTIONS[MANUAL_FUNCTIONS[i].toLowerCase()] = -1;
}
for (let i = 0; i < MANUAL_FUNCTION_METHODS.length; i++) {
  RESERVED_FUNCTION_METHODS[MANUAL_FUNCTION_METHODS[i].toLowerCase()] = -1;
}
for (let i = 0; i < MANUAL_PROCEDURES.length; i++) {
  RESERVED_PROCEDURES[MANUAL_PROCEDURES[i].toLowerCase()] = -1;
}
for (let i = 0; i < MANUAL_PROCEDURE_METHODS.length; i++) {
  RESERVED_PROCEDURE_METHODS[MANUAL_PROCEDURE_METHODS[i].toLowerCase()] = -1;
}
