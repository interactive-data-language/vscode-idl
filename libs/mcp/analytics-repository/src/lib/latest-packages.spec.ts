import type { IAnalyticRepository_ServerPackage } from '@idl/types/analytics-repository';

import { CompareVersions, LatestPackages } from './latest-packages';

function Pkg(name: string, version: string): IAnalyticRepository_ServerPackage {
  return {
    package: { name, version } as any,
    server: { url: 'http://localhost' },
  };
}

describe('LatestPackages', () => {
  it('compares versions numerically', () => {
    expect(CompareVersions('1.10.0', '1.9.0')).toBeGreaterThan(0);
    expect(CompareVersions('1.0.0', '1.0.0-beta')).toBeGreaterThan(0);
    expect(CompareVersions('1.0', '1.0.0')).toBe(0);
    expect(CompareVersions('bad', '0.0.1')).toBeLessThan(0);
  });

  it('keeps only the latest version of each package', () => {
    const result = LatestPackages([
      Pkg('a', '1.2.0'),
      Pkg('b', '1.0.0'),
      Pkg('a', '1.10.0'),
      Pkg('a', '1.9.0'),
    ]);

    expect(
      result.map((item) => `${item.package.name}@${item.package.version}`),
    ).toEqual(['a@1.10.0', 'b@1.0.0']);
  });
});
