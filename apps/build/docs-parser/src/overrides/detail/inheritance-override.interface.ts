/**
 * Any classes that we need to manually specify inheritance for,
 * we can do it here instead of needing to add extra information
 */
export const INHERITANCE_OVERRIDE: { [key: string]: string[] } = {};
INHERITANCE_OVERRIDE['orderedhash'] = ['hash'];
INHERITANCE_OVERRIDE['dictionary'] = ['hash'];
INHERITANCE_OVERRIDE['envigeojson'] = ['hash'];
INHERITANCE_OVERRIDE['envirasterserieslayer'] = ['envirasterlayer'];
INHERITANCE_OVERRIDE['enviabortabletaskfromprocedure'] = ['envitask'];
INHERITANCE_OVERRIDE['envitaskfromprocedure'] = ['envitask'];
INHERITANCE_OVERRIDE['idl_integer'] = ['idl_number'];
INHERITANCE_OVERRIDE['idl_number'] = ['idl_variable'];
INHERITANCE_OVERRIDE['idl_pointer'] = ['idl_variable'];
INHERITANCE_OVERRIDE['idl_string'] = ['idl_variable'];
INHERITANCE_OVERRIDE['array'] = ['idl_variable'];
INHERITANCE_OVERRIDE['idlffxmldomdocument'] = ['idlffxmldomnode'];
