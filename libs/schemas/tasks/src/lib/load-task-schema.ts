import { GetExtensionPath } from '@idl/shared';
import Ajv, { ValidateFunction } from 'ajv';
import { readFile } from 'fs/promises';
import * as RefResolver from 'json-schema-resolver';

/**
 * Validation function for parsed schema
 */
let TASK_SCHEMA_VALIDATOR: ValidateFunction<any> = undefined;

/**
 * Loads the JSON schema file for ENVI and IDL task files
 */
export async function LoadTaskSchema(): Promise<ValidateFunction<any>> {
  // load if not loaded
  if (TASK_SCHEMA_VALIDATOR === undefined) {
    // follows example: https://www.npmjs.com/package/json-schema-resolver
    const ref = RefResolver({
      clone: true, // Clone the input schema without changing it. Default: false,
      buildLocalReference(json, baseUri, fragment, i) {
        // the `json` that is being resolved
        // the `baseUri` object of the schema. Its values is the parse result from https://www.npmjs.com/package/uri-js
        // the `fragment` is the `$ref` string when the `$ref` is a relative reference
        // the `i` is a local counter to generate a unique key
        return `def-${i}`; // default value
      },
    });

    // load base schema
    const base = JSON.parse(
      await readFile(
        GetExtensionPath('extension/language/schemas/tasks/schema.json'),
        { encoding: 'utf-8' }
      )
    );

    // load actual schema for config tags
    const idl = JSON.parse(
      await readFile(
        GetExtensionPath('extension/language/schemas/tasks/idl.schema.json'),
        { encoding: 'utf-8' }
      )
    );
    const envi = JSON.parse(
      await readFile(
        GetExtensionPath('extension/language/schemas/tasks/envi.schema.json'),
        { encoding: 'utf-8' }
      )
    );
    const enviLegacy = JSON.parse(
      await readFile(
        GetExtensionPath(
          'extension/language/schemas/tasks/envi-legacy.schema.json'
        ),
        { encoding: 'utf-8' }
      )
    );

    // join them into a single schema file
    const singleSchema = ref.resolve(base, {
      externalSchemas: [idl, envi, enviLegacy],
    });

    // create a parser and compile the schema
    const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

    // compile as a single schema file
    TASK_SCHEMA_VALIDATOR = ajv.compile(singleSchema);
  }

  // return parsed schema
  return TASK_SCHEMA_VALIDATOR;
}
