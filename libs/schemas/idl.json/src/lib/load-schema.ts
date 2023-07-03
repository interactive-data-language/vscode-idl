import { GetExtensionPath } from '@idl/shared';
import Ajv, { ValidateFunction } from 'ajv';
import { readFile } from 'fs/promises';
import * as RefResolver from 'json-schema-resolver';

/**
 * Validation function for parsed schema
 */
let PARSED_SCHEMA: ValidateFunction<any> = undefined;

/**
 * Loads the JSON schema file for the assembler config file
 */
export async function LoadSchema(): Promise<ValidateFunction<any>> {
  // load if not loaded
  if (PARSED_SCHEMA === undefined) {
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
        GetExtensionPath('extension/language/schemas/config/schema.json'),
        { encoding: 'utf-8' }
      )
    );

    // load actual schema for config tags
    const details = JSON.parse(
      await readFile(
        GetExtensionPath('extension/language/schemas/config/v1.schema.json'),
        { encoding: 'utf-8' }
      )
    );

    // join them into a single schema file
    const singleSchema = ref.resolve(base, {
      externalSchemas: [details],
    });

    // create a parser and compile the schema
    const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

    // compile as a single schema file
    PARSED_SCHEMA = ajv.compile(singleSchema);
  }

  // return parsed schema
  return PARSED_SCHEMA;
}
