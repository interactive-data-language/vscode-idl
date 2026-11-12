import {
  GetIDLVersionFromDir,
  NormalizeIDLVersion,
} from './find-matching-idl-installs';

describe('IDL version helpers', () => {
  it('normalizes versions', () => {
    expect(NormalizeIDLVersion('idl92')).toEqual('9.2');
    expect(NormalizeIDLVersion('IDL90')).toEqual('9.0');
    expect(NormalizeIDLVersion('9.2')).toEqual('9.2');
    expect(NormalizeIDLVersion('9.2.1')).toEqual('9.2');
    expect(NormalizeIDLVersion('nope')).toBeUndefined();
  });

  it('extracts versions from directories', () => {
    expect(
      GetIDLVersionFromDir(
        'C:\\Program Files\\NV5\\ENVI62\\IDL92\\bin\\bin.x86_64',
      ),
    ).toEqual('9.2');
    expect(
      GetIDLVersionFromDir('/usr/local/nv5/idl93/bin/bin.linux.x86_64'),
    ).toEqual('9.3');
    expect(GetIDLVersionFromDir('/usr/local/bin')).toBeUndefined();
  });
});
