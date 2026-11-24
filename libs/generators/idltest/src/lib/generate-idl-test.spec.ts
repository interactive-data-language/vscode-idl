import { IDLTestSchema } from '@idl/schemas/idltest';
import { mkdtempSync, readFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { basename, join } from 'path';

import { GenerateIDLTest } from './generate-idl-test';

describe('GenerateIDLTest', () => {
  it('creates a valid idltest.json', () => {
    const folder = mkdtempSync(join(tmpdir(), 'idl-test-'));
    try {
      const file = GenerateIDLTest(folder);
      const parsed = JSON.parse(readFileSync(file, 'utf-8'));
      expect(basename(file)).toBe('idltest.json');
      expect(IDLTestSchema.safeParse(parsed).success).toBe(true);
    } finally {
      rmSync(folder, { recursive: true, force: true });
    }
  });
});
