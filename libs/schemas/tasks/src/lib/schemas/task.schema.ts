import { z } from 'zod';

import { ENVILegacyTask_5_2_1, ENVILegacyTask_5_3 } from './envi-legacy.schema';
import { ENVITask_3_0, ENVITask_3_1, ENVITask_3_2 } from './envi.schema';
import { IDLTask_1_0, IDLTask_1_1, IDLTask_1_2 } from './idl.schema';

/**
 * Task files are validated by the value of the `schema` property (current)
 * or `version` property (legacy ENVI tasks), which select the schema that the
 * rest of the file must satisfy
 */
export interface ITaskSchemaVersion {
  /** Property in the task file that selects the schema */
  key: 'schema' | 'version';
  /** Value of the property that selects the schema */
  value: string;
  /** Schema that task files with this value must satisfy */
  schema: z.ZodType;
}

/**
 * Lookup of which schema to use for task files
 */
export const TASK_SCHEMA_VERSIONS: ITaskSchemaVersion[] = [
  { key: 'schema', value: 'idltask_1.2', schema: IDLTask_1_2 },
  { key: 'schema', value: 'idltask_1.1', schema: IDLTask_1_1 },
  { key: 'schema', value: 'idltask_1.0', schema: IDLTask_1_0 },
  { key: 'schema', value: 'envitask_3.3', schema: ENVITask_3_2 },
  { key: 'schema', value: 'envitask_3.2', schema: ENVITask_3_2 },
  { key: 'schema', value: 'envitask_3.1', schema: ENVITask_3_1 },
  { key: 'schema', value: 'envitask_3.0', schema: ENVITask_3_0 },
  { key: 'version', value: '5.3.2', schema: ENVILegacyTask_5_3 },
  { key: 'version', value: '5.3.1', schema: ENVILegacyTask_5_3 },
  { key: 'version', value: '5.3', schema: ENVILegacyTask_5_3 },
  { key: 'version', value: '5.2.1', schema: ENVILegacyTask_5_2_1 },
];

/**
 * Properties that every task file can have and that select the schema
 */
export const TaskFileSchema = z.object({
  version: z
    .enum(['5.3.2', '5.3.1', '5.3', '5.2.1'])
    .meta({
      title: 'Version - Deprecated',
      description:
        'A string listing the earliest version of ENVI that the task will work with. The "schema" tag is preferred as it is the newer task schema to work with.\nThe valid values are "5.3.2", "5.3.1", "5.3", and "5.2.1"',
      deprecated: true,
    })
    .optional(),
  schema: z
    .enum(
      TASK_SCHEMA_VERSIONS.filter((item) => item.key === 'schema').map(
        (item) => item.value,
      ) as [string, ...string[]],
    )
    .meta({
      title: 'Task Schema',
      description:
        'A string listing the version of ENVITask JSON schema or IDLTask JSON schema that was used to write this task.\nThe valid values are "envitask_3.3", "envitask_3.2", "envitask_3.1" or "envitask_3.0", "idltask_1.2","idltask_1.1", "idltask_1.0".',
    })
    .optional(),
});

/**
 * Validates the contents of a parsed task file
 *
 * Does not modify or return the parsed content, only the problems we find
 */
export function ValidateTaskFile(content: unknown): {
  success: boolean;
  issues: z.core.$ZodIssue[];
} {
  /** Check the properties that select the schema */
  const root = TaskFileSchema.safeParse(content);
  if (!root.success) {
    return { success: false, issues: root.error.issues };
  }

  /** Track problems from each schema that applies */
  const issues: z.core.$ZodIssue[] = [];

  for (const item of TASK_SCHEMA_VERSIONS) {
    if ((content as Record<string, unknown>)[item.key] === item.value) {
      const result = item.schema.safeParse(content);
      if (!result.success) {
        issues.push(...result.error.issues);
      }
    }
  }

  return { success: issues.length === 0, issues };
}

/**
 * Creates the JSON schema for task files that is used by VS Code
 */
export function CreateTaskFileJSONSchema() {
  /** Unique schemas that we refer to by id */
  const schemas = Array.from(
    new Set(TASK_SCHEMA_VERSIONS.map((item) => item.schema)),
  );

  /** Registers all schemas (and their parameters) as definitions */
  const lookup = z.toJSONSchema(
    z.object(
      Object.fromEntries(schemas.map((schema, i) => [`schema${i}`, schema])),
    ),
    { target: 'draft-7', io: 'input' },
  );

  /** Properties for selecting a schema */
  const root = z.toJSONSchema(TaskFileSchema, {
    target: 'draft-7',
    io: 'input',
  });

  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: root.properties,
    allOf: TASK_SCHEMA_VERSIONS.map((item) => ({
      if: {
        properties: { [item.key]: { const: item.value } },
        required: [item.key],
      },
      then: {
        allOf: [
          { $ref: `#/definitions/${z.globalRegistry.get(item.schema)?.id}` },
        ],
      },
    })),
    definitions: lookup.definitions,
  };
}
