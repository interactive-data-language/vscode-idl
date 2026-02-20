import { IDL_MCP_LOG, LogManager } from '@idl/logger';
import { IDLParameterToMCPParameter } from '@idl/mcp/idl-to-mcp';
import { IDLTypeHelper, TASK_REGEX } from '@idl/parsing/type-parser';
import {
  GlobalFunctionToken,
  GlobalStructureToken,
  IGlobalIndexedToken,
} from '@idl/types/idl-data-types';
import { MCP_TOOL_LOOKUP } from '@idl/types/mcp';
import Ajv from 'ajv';
import { z, ZodRawShape } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { GetCleanDescription } from './helpers/get-clean-description';
import {
  ITaskInformation,
  ITaskRegistryEntry,
} from './mcp-task-registry.interface';
import {
  TaskLocation,
  TaskLocation_File,
  TaskLocationKind,
} from './task-location.interface';

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
   * Logger
   */
  private logger: LogManager;

  /**
   * Notes for tasks, separate to simplify book keeping
   */
  private notes: { [key: string]: string[] } = {};

  /**
   * Unified registry of all tasks by name (lower case)
   *
   * This stores all task information in a single data structure
   */
  private tasks: { [key: string]: ITaskRegistryEntry } = {};

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

    // init
    if (!(lc in this.notes)) {
      this.notes[lc] = [];
    }

    // save
    this.notes[lc] = this.notes[lc].concat(useNotes);
  }

  /**
   * Returns all task descriptions by task name
   */
  getDescriptions() {
    const descriptions: { [key: string]: string } = {};
    const tasks = Object.values(this.tasks);
    for (let i = 0; i < tasks.length; i++) {
      descriptions[tasks[i].displayName] = tasks[i].description;
    }
    return descriptions;
  }

  /**
   * Gets information about a task
   */
  getTaskDetail(taskName: string): ITaskInformation {
    /** Get lower case name */
    const lc = taskName.toLowerCase();

    // return if no match
    if (!(lc in this.tasks)) {
      return;
    }

    // get
    return { ...this.tasks[lc], notes: this.notes[lc] };
  }

  /**
   * Checks if we have a task registered or not
   */
  hasTask(taskName: string) {
    return taskName.toLowerCase() in this.tasks;
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
    /** Get task display name */
    const taskDisplay = TASK_REGEX.exec(taskStructure.meta.display)[1];

    /** Get the task name */
    const taskName = taskDisplay.toLowerCase();

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
      const param = IDLParameterToMCPParameter(prop, docs);

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

    // create input parameters schema
    const inputParameters = zodToJsonSchema(
      z
        .object(inputArgs)
        .describe(
          `Inputs for running the tool. These *MUST* be specified based on the schema. Summary:\n\n${fullDescription}`
        )
    );

    // create output parameters schema
    const outputParameters = zodToJsonSchema(
      z
        .object(outputArgs)
        .describe(
          'Outputs from running the tool. These should *NEVER* be specified and are returned.'
        )
    );

    // create location metadata if we have a file
    let location: TaskLocation<TaskLocationKind> | undefined;
    if (taskStructure.file) {
      /** Create metadata so its strictly types */
      location = {
        type: 'file',
        meta: {
          path: taskStructure.file,
        },
      } as TaskLocation<TaskLocation_File>;
    }

    // save in unified registry
    this.tasks[taskName] = {
      description,
      displayName: taskDisplay,
      inputParameters,
      inputValidator: this.ajv.compile(inputParameters),
      outputParameters,
      location,
    };
  }

  /**
   * Remove a task from the registry
   *
   * Deletes entry from the unified registry
   */
  removeTask(taskName: string): boolean {
    /** Get lower case name */
    const lc = taskName.toLowerCase();

    // check if task exists
    if (!(lc in this.tasks)) {
      return false;
    }

    // remove from unified registry
    delete this.tasks[lc];

    return true;
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
    if (!(lc in this.tasks)) {
      return {
        success: false,
        reason: 'Unknown ENVI Task we are validating parameters for',
      };
    }

    // Validate inputParameters against the JSON schema
    try {
      /** Get the validator function */
      const validate = this.tasks[lc].inputValidator;

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
          reason: `MCP Error -32602: Input parameters validation failed for task '${taskName}':\n${errors}\n\nYou *must* follow the task schema provided by "${MCP_TOOL_LOOKUP.GET_ENVI_TOOL_PARAMETERS}"`,
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
