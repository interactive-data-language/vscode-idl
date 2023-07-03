import {
  GlobalProcedureToken,
  IGlobalIndexedToken,
} from '@idl/data-types/core';
import { ParsedTask } from '@idl/data-types/tasks';

/**
 * Conditional properties based on our success
 */
type ResponseProperties<T extends boolean> = T extends true
  ? {
      /**
       * Path to the task file that we generated
       *
       * This file only exists if we tell the generator to write our result
       */
      taskFile: string;
      /** The task that we generated */
      task: ParsedTask;
      /** A formatted version of the task */
      formattedTask: string;
      /** The procedure we made our task from */
      procedure: IGlobalIndexedToken<GlobalProcedureToken>;
    }
  : {
      /** If we failed, why did we */
      failureReason: string;
    };

/**
 * Result we return when generating a task with diagnostic information
 * for failures so we can have everything run in a centralized location
 *
 * The ampersand in the definition is the "union" operator and adds in properties from our conditional
 * type above
 */
export type GenerateTaskResult<T extends boolean> = ResponseProperties<T> & {
  /** Boolean flag if we succeeded or not */
  success: T;
};
