import { ParseRegistryIDLDirs } from './find-idl-in-windows-registry';

describe('Windows registry parsing', () => {
  it('extracts IDL install directories', () => {
    const output = [
      '',
      'HKEY_LOCAL_MACHINE\\SOFTWARE\\NV5\\ENVI\\6.2',
      '    IDLInstallDir    REG_SZ    D:\\Apps\\NV5\\IDL92',
      '    Other    REG_SZ    nope',
      '',
      'HKEY_LOCAL_MACHINE\\SOFTWARE\\NV5\\ENVI\\6.3',
      '    IDLInstallDir    REG_EXPAND_SZ    C:\\Program Files\\NV5\\IDL93',
    ].join('\r\n');

    expect(ParseRegistryIDLDirs(output)).toEqual([
      'D:\\Apps\\NV5\\IDL92',
      'C:\\Program Files\\NV5\\IDL93',
    ]);
    expect(ParseRegistryIDLDirs('')).toEqual([]);
  });
});
