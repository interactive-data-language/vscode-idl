import { IDLConfigSchema } from '@idl/schemas/idlformat';
import { IDLPackageSchema } from '@idl/schemas/idlpackage';
import { CreateTaskFileJSONSchema } from '@idl/schemas/tasks';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { z } from 'zod';

/**
 * Describes a JSON schema file that we generate from a Zod schema
 */
interface ISchemaToGenerate {
  /** Creates the JSON schema */
  create: () => unknown;
  /** Path, relative to the repo root, of the file we create */
  file: string;
}

/**
 * Schemas that we generate for VS Code
 */
const SCHEMAS: ISchemaToGenerate[] = [
  {
    file: 'resources/language/schemas/idlpackage/schema.json',
    create: () =>
      z.toJSONSchema(IDLPackageSchema, { target: 'draft-7', io: 'input' }),
  },
  {
    file: 'resources/language/schemas/config/schema.json',
    create: () =>
      z.toJSONSchema(IDLConfigSchema, { target: 'draft-7', io: 'input' }),
  },
  {
    file: 'resources/language/schemas/tasks/schema.json',
    create: CreateTaskFileJSONSchema,
  },
];

/** Root of the repo */
const ROOT = process.cwd();

for (const { file, create } of SCHEMAS) {
  const json = create();

  const out = join(ROOT, file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, `${JSON.stringify(json, null, 2)}\n`, 'utf-8');
  console.log(`Generated ${file}`);
}
