import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly find find definition from obj destroy`, () => {
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
    const filepath = GetExtensionPath('idl/test/token-def/obj_destroy.pro');

    // parse file for tests
    await index.indexFile(
      GetExtensionPath('idl/test/token-def/obj_destroy.pro')
    );

    // define position
    const position_0: Position = { line: 23, character: 6 };

    // define expected token we extract
    const expectedFound_0 = {
      type: 'pm',
      name: 'testclass::cleanup',
      pos: [12, 4, 18],
      meta: {
        className: 'testclass',
        method: 'cleanup',
        source: 'user',
        args: {},
        docs: '\n```idl\nTestClass.Cleanup, $\n  keyword = value\n```\n\n\n#### Keywords\n\n- **keyword**: bidirectional, optional, any\n\n    \n\n',
        docsLookup: {},
        display: 'TestClass::Cleanup',
        kws: {
          keyword: {
            docs: '',
            private: false,
            source: 'internal',
            type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            direction: 'bidirectional',
            req: false,
            display: 'keyword',
            code: true,
            pos: [12, 24, 7],
          },
        },
        private: false,
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
    const filepath = GetExtensionPath('idl/test/token-def/obj_destroy.pro');

    // parse file for tests
    await index.indexFile(
      GetExtensionPath('idl/test/token-def/obj_destroy.pro')
    );

    // define position
    const position_0: Position = { line: 25, character: 6 };

    // define expected token we extract
    const expectedFound_0 = {
      type: 'p',
      name: 'obj_destroy',
      pos: [0, 0, 0],
      meta: {
        display: 'obj_destroy',
        source: 'internal',
        docs: '[Online Docs](https://www.nv5geospatialsoftware.com/docs/OBJ_DESTROY.html)\n\n```idl\nobj_destroy, objref, arg1…argn\n```\n\nThe OBJ\\_DESTROY procedure is used to destroy an object. If the class (or one of its superclasses) supplies a procedure method named CLEANUP, the method is called and all arguments and keywords passed by the user are passed to it. This method should perform any required cleanup on the object and return. Whether a CLEANUP method actually exists or not, IDL will destroy the heap variable representing the object and return.\n\n_Note:_ OBJ\\_DESTROY does not recurse. That is, if `object1` contains a reference to `object2`, destroying `object1` will _not_ destroy `object2`. Take care not to lose the only reference to an object by destroying an object that contains that reference. Recursive cleanup of object hierarchies is a good job for a CLEANUP method.\n\nTo destroy objects automatically, see [Automatic Garbage Collection](IDL_DOCS/../Subsystems/idl/Content/Creating IDL Programs/Components of the IDL Language/Automatic%5FGarbage%5FCollec.htm#pointers%5F3224653378%5F1018570).\n\n\n#### Arguments\n\n- **objref**: bidirectional, optional, any\n\n  The object reference for the object to be destroyed. _ObjRef_ can be an array, in which case all of the specified objects are destroyed in turn. If the NULL object reference is passed, OBJ\\_DESTROY ignores it quietly.\n\n- **arg1…argn**: bidirectional, optional, any\n\n  Any arguments accepted by the CLEANUP method for the object being destroyed can be specified as additional arguments to OBJ\\_DESTROY.\n\n',
        private: false,
        args: {
          objref: {
            display: 'objref',
            docs: 'The object reference for the object to be destroyed. _ObjRef_ can be an array, in which case all of the specified objects are destroyed in turn. If the NULL object reference is passed, OBJ\\_DESTROY ignores it quietly.',
            type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            direction: 'bidirectional',
            source: 'internal',
            code: true,
            pos: [0, 0, 0],
          },
          'arg1…argn': {
            display: 'arg1…argn',
            docs: 'Any arguments accepted by the CLEANUP method for the object being destroyed can be specified as additional arguments to OBJ\\_DESTROY.',
            type: [{ name: 'any', display: 'any', args: [], meta: {} }],
            direction: 'bidirectional',
            source: 'internal',
            code: true,
            pos: [0, 0, 0],
          },
        },
        kws: {},
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
