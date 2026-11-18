import { IDLPackageSchema } from '@idl/schemas/idlpackage';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { z } from 'zod';

/**
 * Describes a JSON schema file that we generate from a Zod schema
 */
interface ISchemaToGenerate {
  /** Path, relative to the repo root, of the file we create */
  file: string;
  /** Zod schema to convert */
  schema: z.ZodType;
}

/**
 * Schemas that we generate for VS Code
 */
const SCHEMAS: ISchemaToGenerate[] = [
  {
    file: 'resources/language/schemas/idlpackage/schema.json',
    schema: IDLPackageSchema,
  },
];

/** Root of the repo */
const ROOT = process.cwd();

for (const { file, schema } of SCHEMAS) {
  /** Generate for the version of JSON schema that VS Code supports */
  const json = z.toJSONSchema(schema, {
    target: 'draft-7',
    io: 'input',
  });

  const out = join(ROOT, file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, `${JSON.stringify(json, null, 2)}\n`, 'utf-8');
  console.log(`Generated ${file}`);
}
