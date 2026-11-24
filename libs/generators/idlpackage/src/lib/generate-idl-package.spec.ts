import { IDLPackageSchema } from '@idl/schemas/idlpackage';
import { mkdtempSync, readFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { basename, join } from 'path';

import { GenerateIDLPackage } from './generate-idl-package';

describe('GenerateIDLPackage', () => {
  it('creates a valid idlpackage.json named after the folder', () => {
    const folder = mkdtempSync(join(tmpdir(), 'idl-pkg-'));
    try {
      const file = GenerateIDLPackage(folder);
      const parsed = JSON.parse(readFileSync(file, 'utf-8'));
      expect(basename(file)).toBe('idlpackage.json');
      expect(parsed.name).toBe(basename(folder));
      expect(IDLPackageSchema.safeParse(parsed).success).toBe(true);
    } finally {
      rmSync(folder, { recursive: true, force: true });
    }
  });
});
