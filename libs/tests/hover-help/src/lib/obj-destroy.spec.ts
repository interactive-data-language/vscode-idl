import { GetExtensionPath } from '@idl/idl/files';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { readFile } from 'fs/promises';
import { Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Correctly find find definition from obj destroy`, () => {
  it(`[auto generated] case 1`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // specify filepath
    const filepath = GetExtensionPath('idl/test/hover-help/obj_destroy.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 23, character: 8 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '[Open Examples in Notebook](command:idl.notebooks.helpAsNotebook?%7B%22type%22:%22pm%22,%22name%22:%22TestClass::Cleanup%22%7D)',
      '',
      '```idl',
      'TestClass.Cleanup, $',
      '  keyword = value',
      '```',
      '',
      '',
      '#### Keywords',
      '',
      '- **keyword**: bidirectional, optional, any',
      '',
      '    ',
      '',
      '',
    ];

    // get hover help
    const hoverHelp_0 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_0
    );

    // verify results
    expect(expectedFound_0).toEqual(
      ((hoverHelp_0?.contents as string) || '').split(/\r?\n/gim)
    );
  });

  it(`[auto generated] keywords`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // specify filepath
    const filepath = GetExtensionPath('idl/test/hover-help/obj_destroy.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 23, character: 24 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '```typescript',
      'type keyword = any',
      '```',
    ];

    // get hover help
    const hoverHelp_0 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_0
    );

    // verify results
    expect(expectedFound_0).toEqual(
      ((hoverHelp_0?.contents as string) || '').split(/\r?\n/gim)
    );
  });

  it(`[auto generated] no arguments and default to normal`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // specify filepath
    const filepath = GetExtensionPath('idl/test/hover-help/obj_destroy.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 25, character: 7 };

    // define expected token we extract
    const expectedFound_0: string[] = [
      '[Online Docs](https://www.nv5geospatialsoftware.com/docs/OBJ_DESTROY.html) | [Open Examples in Notebook](command:idl.notebooks.helpAsNotebook?%7B%22type%22:%22p%22,%22name%22:%22obj_destroy%22%7D)',
      '',
      '```idl',
      'obj_destroy, objref, arg1…argn',
      '```',
      '',
      'The OBJ\\_DESTROY procedure is used to destroy an object. If the class (or one of its superclasses) supplies a procedure method named CLEANUP, the method is called and all arguments and keywords passed by the user are passed to it. This method should perform any required cleanup on the object and return. Whether a CLEANUP method actually exists or not, IDL will destroy the heap variable representing the object and return.',
      '',
      '_Note:_ OBJ\\_DESTROY does not recurse. That is, if `object1` contains a reference to `object2`, destroying `object1` will _not_ destroy `object2`. Take care not to lose the only reference to an object by destroying an object that contains that reference. Recursive cleanup of object hierarchies is a good job for a CLEANUP method.',
      '',
      'To destroy objects automatically, see [Automatic Garbage Collection](command:idl.docs.openLink?%7B%22link%22:%22IDL_DOCS/../Subsystems/idl/Content/Creating%20IDL%20Programs/Components%20of%20the%20IDL%20Language/Automatic%255FGarbage%255FCollec.htm#pointers%255F3224653378%255F1018570%22%7D).',
      '',
      '',
      '#### Arguments',
      '',
      '- **objref**: bidirectional, optional, any',
      '',
      '  The object reference for the object to be destroyed. _ObjRef_ can be an array, in which case all of the specified objects are destroyed in turn. If the NULL object reference is passed, OBJ\\_DESTROY ignores it quietly.',
      '',
      '- **arg1…argn**: bidirectional, optional, any',
      '',
      '  Any arguments accepted by the CLEANUP method for the object being destroyed can be specified as additional arguments to OBJ\\_DESTROY.',
      '',
      '',
    ];

    // get hover help
    const hoverHelp_0 = await index.getHoverHelp(
      filepath,
      await readFile(filepath, 'utf-8'),
      position_0
    );

    // verify results
    expect(expectedFound_0).toEqual(
      ((hoverHelp_0?.contents as string) || '').split(/\r?\n/gim)
    );
  });
});
