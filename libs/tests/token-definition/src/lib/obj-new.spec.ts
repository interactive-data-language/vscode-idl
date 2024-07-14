import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly find find definition from obj new`, () => {
  it(`[auto generated] real`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // specify reference filepath
    const filepath = GetExtensionPath('idl/test/token-def/obj_new.pro');

    // parse file for tests
    await index.indexFile(GetExtensionPath('idl/test/token-def/obj_new.pro'));

    // define position
    const position_0: Position = { line: 53, character: 12 };

    // define expected token we extract
    const expectedFound_0 = {
      type: 'f',
      name: 'myclass',
      pos: [8, 9, 13],
      meta: {
        source: 'user',
        args: {},
        docs: '\n```idl\n;+\n; :Returns: myclass\n;+\nresult = myclass()\n```\n\nConstructor\n',
        docsLookup: { default: 'Constructor', returns: 'myclass' },
        display: 'myclass',
        kws: {},
        private: false,
        returns: [{ name: 'myclass', display: 'myclass', args: [], meta: {} }],
        struct: [],
      },
    };

    // get expected and remove file
    const found_0 = await index.getTokenDef(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_0
    );
    if (found_0 !== undefined) {
      delete found_0.file;
    }

    // verify results
    expect(expectedFound_0).toEqual(found_0);
  });

  it(`[auto generated] fake`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // specify reference filepath
    const filepath = GetExtensionPath('idl/test/token-def/obj_new.pro');

    // parse file for tests
    await index.indexFile(GetExtensionPath('idl/test/token-def/obj_new.pro'));

    // define position
    const position_0: Position = { line: 56, character: 12 };

    // define expected token we extract
    const expectedFound_0 = {
      type: 'f',
      name: 'obj_new',
      pos: [0, 0, 0],
      meta: {
        display: 'obj_new',
        source: 'internal',
        docs: '[Online Docs](https://www.nv5geospatialsoftware.com/docs/OBJ_NEW.html)\n\n```idl\n;+\n; :Returns: any\n;+\nresult = obj_new(objectclassname, arg1…argn, $\n  _extra = value)\n```\n\nGiven the name of a structure that defines an object class, the OBJ\\_NEW function returns an object reference to a new instance of the specified object type by carrying out the following operations in order:\n\nIf called without arguments, OBJ\\_NEW returns a NULL object reference. The NULL object reference is a special value that never refers to a value object. It is primarily used as a placeholder in structure definitions, and as the initial value for elements of object arrays created via OBJARR. The null object reference is useful as an indicator that an object reference is currently not usable.\n\n\n#### Arguments\n\n- **objectclassname**: bidirectional, optional, any\n\n  String giving the name of the structure type that defines the object class for which a new object should be created.\n  \n  If _ObjectClassName_ is not provided, OBJ\\_NEW does not create a new heap variable, and returns the _Null Object_, which is a special object reference that is guaranteed to never point at a valid object heap variable. The null object is a convenient value to use when defining structure definitions for fields that are object references, since it avoids the need to have a pre-existing valid object reference.\n\n- **arg1…argn**: bidirectional, optional, any\n\n  Any arguments accepted by the INIT method for the class of object being created can be specified when the object is created.\n\n\n\n#### Keywords\n\n- **_extra**: bidirectional, optional, any\n\n    Support for additional keywords\n\n\n\n### Return Value\n\nReturns a reference to a new instance of the specified object type. If called without arguments, OBJ\\_NEW returns a NULL object reference. The NULL object reference is a special value that never refers to a value object. It is primarily used as a placeholder in structure definitions, and as the initial value for elements of object arrays created via OBJARR. The null object reference is useful as an indicator that an object reference is currently not usable.',
        private: false,
        returns: [{ name: 'any', display: 'any', args: [], meta: {} }],
        args: {
          objectclassname: {
            display: 'objectclassname',
            docs: 'String giving the name of the structure type that defines the object class for which a new object should be created.\n\nIf _ObjectClassName_ is not provided, OBJ\\_NEW does not create a new heap variable, and returns the _Null Object_, which is a special object reference that is guaranteed to never point at a valid object heap variable. The null object is a convenient value to use when defining structure definitions for fields that are object references, since it avoids the need to have a pre-existing valid object reference.',
            type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            direction: 'bidirectional',
            source: 'internal',
            code: true,
            pos: [0, 0, 0],
          },
          'arg1…argn': {
            display: 'arg1…argn',
            docs: 'Any arguments accepted by the INIT method for the class of object being created can be specified when the object is created.',
            type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            direction: 'bidirectional',
            source: 'internal',
            code: true,
            pos: [0, 0, 0],
          },
        },
        kws: {
          _extra: {
            display: '_extra',
            docs: 'Support for additional keywords',
            type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            direction: 'bidirectional',
            source: 'internal',
            code: true,
            pos: [0, 0, 0],
          },
        },
        docsLookup: {},
        struct: [],
      },
    };

    // get expected and remove file
    const found_0 = await index.getTokenDef(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_0
    );
    if (found_0 !== undefined) {
      delete found_0.file;
    }

    // verify results
    expect(expectedFound_0).toEqual(found_0);
  });
});
