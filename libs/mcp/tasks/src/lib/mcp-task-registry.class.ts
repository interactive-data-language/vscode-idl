import { IDL_MCP_LOG, LogManager } from '@idl/logger';
import { IDLTypeHelper, TASK_REGEX } from '@idl/parsing/type-parser';
import {
  GlobalFunctionToken,
  GlobalStructureToken,
  IGlobalIndexedToken,
} from '@idl/types/idl-data-types';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import Ajv, { ValidateFunction } from 'ajv';
import { z, ZodRawShape } from 'zod';
import { JsonSchema7Type, zodToJsonSchema } from 'zod-to-json-schema';

import { GetCleanDescription } from './helpers/get-clean-description';
import { ITaskInformation } from './mcp-task-registry.interface';
import {
  TaskLocation,
  TaskLocation_File,
  TaskLocationKind,
} from './task-location.interface';
import { TaskTypeToMCPParameter } from './types-to-mcp/task-type-to-mcp-parameter';

/**
 * Class that tracks and organizes tasks for ENVI and IDL
 * and tracks information for
 *
 * All task names are tracked by lower case
 */
export class MCPTaskRegistry {
  /** Create instance of AJV */
  private ajv = new Ajv({ allErrors: true, allowUnionTypes: true });

  /**
   * Lookup of a description for a task, by name
   *
   * This lookup is a limited description that attempts to strip
   * out examples
   */
  private descriptions: { [key: string]: string } = {};

  /**
   * Input parameters for a task, by name
   */
  private inputParameters: { [key: string]: JsonSchema7Type } = {};

  /**
   * Validation functions for input parameters
   */
  private inputValidators: { [key: string]: ValidateFunction<any> } = {};

  /**
   * Location of a task, if it is not native to ENVI and IDL
   */
  private location: { [key: string]: TaskLocation<TaskLocationKind> } = {};

  /**
   * Logger
   */
  private logger: LogManager;

  /**
   * Track key notes for tasks in the registry
   */
  private notes: { [key: string]: string[] } = {};

  /**
   * Output parameters for a task, by name
   */
  private outputParameters: { [key: string]: JsonSchema7Type } = {};

  constructor(logger: LogManager) {
    this.logger = logger;
  }

  /**
   * Add notes for many tasks
   */
  addNotesForManyTasks(notes: { [key: string]: string | string[] }) {
    const names = Object.keys(notes);
    for (let i = 0; i < names.length; i++) {
      this.addNotesForTask(names[i], notes[names[i]]);
    }
  }

  /**
   * Adds notes to our task registry that are provided when
   * returning detail about a task
   */
  addNotesForTask(taskName: string, notes: string | string[]) {
    // get lower case
    const lc = taskName.toLowerCase();

    // make sure we have an array of notes
    const useNotes = !Array.isArray(notes) ? [notes] : notes;

    // check if it exists already
    if (lc in this.notes) {
      this.notes[lc] = this.notes[lc].concat(useNotes);
    } else {
      this.notes[lc] = useNotes;
    }
  }

  /**
   * Returns all task descriptions by task name
   */
  getDescriptions() {
    return this.descriptions;
  }

  /**
   * Gets information about a task
   */
  getTaskDetail(taskName: string): ITaskInformation {
    /** Get lower case name */
    const lc = taskName.toLowerCase();

    // return if no match
    if (!(lc in this.descriptions)) {
      return;
    }

    return {
      description: this.descriptions[lc],
      inputParameters: this.inputParameters[lc],
      outputParameters: this.outputParameters[lc],
      notes: this.notes[lc],
      location: this.location[lc],
    };
  }

  /**
   * Checks if we have a task registered or not
   */
  hasTask(taskName: string) {
    return taskName.toLowerCase() in this.descriptions;
  }

  /**
   * Register a task
   *
   * The function contains the helpful docs and syntax examples
   *
   * The structure contains all properties and docs for them
   *
   * **DO NOT** use the docs in the overall structure definition, as
   * it *only* contains properties
   */
  registerTask(
    taskFunction: IGlobalIndexedToken<GlobalFunctionToken>,
    taskStructure: IGlobalIndexedToken<GlobalStructureToken>
  ) {
    /** Get the task name */
    const taskName = TASK_REGEX.exec(
      taskStructure.meta.display
    )[1].toLowerCase();

    /** Get short task description */
    const description = GetCleanDescription(taskFunction.meta.docs);

    /** Get full description */
    const fullDescription = GetCleanDescription(taskFunction.meta.docs, false);

    /**
     * If there is no description, return since we need one to run tools
     */
    if (!description.trim()) {
      this.logger.log({
        log: IDL_MCP_LOG,
        type: 'warn',
        content: `ENVI Tool "${taskName}" is missing description and will be skipped`,
      });
      return;
    }

    /**
     * Track input parameters
     */
    const inputArgs: ZodRawShape = {};

    /**
     * Track output parameters
     */
    const outputArgs: ZodRawShape = {};

    /** Get task properties */
    const props = taskStructure.meta.props;

    /** Get names of properties */
    const names = Object.keys(props);

    // map them in!
    for (let i = 0; i < names.length; i++) {
      const prop = props[names[i]];

      // skip private parameters
      if (prop.private) {
        continue;
      }

      /** Track args to add to */
      let addToArgs = inputArgs;

      // if output, then add to output arguments
      if (prop.direction === 'out') {
        addToArgs = outputArgs;
      }

      /** Get cleaned parameter docs */
      const docs = GetCleanDescription(prop.docs, false);

      /** Make zod parameter */
      const param = TaskTypeToMCPParameter(names[i], docs, prop.type);

      // check if unknown parameter
      if (!param) {
        this.logger.log({
          log: IDL_MCP_LOG,
          type: 'warn',
          content: [
            `ENVI Tool "${taskName}" has an unhandled ENVI Task data type for property "${
              names[i]
            }" with type "${IDLTypeHelper.serializeIDLType(prop.type)}"`,
          ],
        });
        return;
      }

      // save parameter
      addToArgs[names[i]] = param;
    }

    // save in lookup
    this.descriptions[taskName] = description;

    // save parameters with full description
    this.inputParameters[taskName] = zodToJsonSchema(
      z
        .object(inputArgs)
        .describe(
          `Inputs for running the tool. These *MUST* be specified based on the schema. Summary:\n\n${fullDescription}`
        )
    );

    // save parameter validation function
    this.inputValidators[taskName] = this.ajv.compile(
      this.inputParameters[taskName]
    );

    // save output parameters
    this.outputParameters[taskName] = zodToJsonSchema(
      z
        .object(outputArgs)
        .describe(
          'Outputs from running the tool. These should *NEVER* be specified and are returned.'
        )
    );

    // see if we need to track task file
    if (taskStructure.file) {
      /** Create metadata so its strictly types */
      const meta: TaskLocation<TaskLocation_File> = {
        type: 'file',
        meta: {
          path: taskStructure.file,
        },
      };
      this.location[taskName] = meta;
    }
  }

  /**
   * Validate input parameters for a task
   *
   * We can validate them before they ever get to ENVI and, in fact, we should
   * because the parameters are registered as part of the MCP tool
   *
   * This means there isn't any native validation when an LLM tries to run them
   * so we need to add this in ourselves.
   */
  validateInputParameters(taskName: string, inputParameters: any) {
    /** Get lower case name */
    const lc = taskName.toLowerCase();

    // return if no match
    if (!(lc in this.descriptions)) {
      return {
        success: false,
        reason: 'Unknown ENVI Task we are validating parameters for',
      };
    }

    // Validate inputParameters against the JSON schema
    try {
      /** Create a validator function */
      const validate = this.ajv.compile(this.inputParameters[lc]);

      /** Validate parameters */
      const valid = validate(inputParameters);

      // check if we have JSON schema problems
      if (!valid) {
        // Format validation errors for the response
        const errors = validate.errors
          .map(
            (err) =>
              `- ${err.instancePath || 'root'}: ${err.message}${
                err.params ? ` (${JSON.stringify(err.params)})` : ''
              }`
          )
          .join('\n');

        return {
          success: false,
          reason: `MCP Error -32602: Input parameters validation failed for task '${taskName}':\n${errors}\n\nYou *must* follow the task schema provided by "${MCP_TOOL_LOOKUP.ENVI_GET_TOOL_PARAMETERS}"`,
        };
      }
    } catch (validationError) {
      return {
        success: false,
        reason: `Server error trying to validate input parameters: ${
          validationError instanceof Error
            ? validationError.message
            : String(validationError)
        }`,
      };
    }

    // made it here, so our schema is valid
    return { success: true };
  }
}
