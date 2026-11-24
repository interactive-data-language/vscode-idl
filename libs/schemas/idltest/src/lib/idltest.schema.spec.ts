import { DEFAULT_IDL_TEST, IDLTestSchema } from './idltest.schema';

describe('idltest schema', () => {
  it('accepts the default config', () => {
    expect(IDLTestSchema.safeParse(DEFAULT_IDL_TEST).success).toBe(true);
  });

  it('rejects invalid choices', () => {
    expect(
      IDLTestSchema.safeParse({ run: { isolation: 'nope' } }).success,
    ).toBe(false);
    expect(IDLTestSchema.safeParse({ output: { level: 'loud' } }).success).toBe(
      false,
    );
  });
});
