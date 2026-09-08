import { CompletionItem, Connection } from 'vscode-languageserver/node';

export class IDL {
  // connection specific properties for vscode lang server
  connection: Connection;

  // all of our IDL helper objects
  // manager: IDLSymbolManager; // manage all symbols from all docs and workspaces
  // extractor: IDLSymbolExtractor; // load symbols from a file
  // files: IDLFileHelper; // clean strings for analysis

  constructor(connection?: Connection) {
    if (connection) {
      this.connection = connection;
    }

    // create all of our child objects
    // this.manager = new IDLSymbolManager(this);
    // this.extractor = new IDLSymbolExtractor(this);
    // this.files = new IDLFileHelper(this);
  }

  consoleLog(thing: any) {
    this.connection.console.log(JSON.stringify(thing));
  }

  // // find the definition of a selected symbol
  // findSymbolDefinition(
  //   params: TextDocumentPositionParams,
  //   limit: boolean
  // ): Definition {
  //   return this.manager.findSymbolDefinition(params, limit);
  // }

  // search for symbol definitions based on name
  // findSymbolsByName(query: string): SymbolInformation[] {
  //   return this.manager.findSymbolsByName(query);
  // }

  // getHoverHelp(position: TextDocumentPositionParams): Hover {
  //   // get the word that we are trying to complete
  //   // do this here just so we dont have to split larger files more than once
  //   // because we need the strings, split, and regex to find our work
  //   const query = this.manager.getSelectedSymbol(position);

  //   // dont search if empty string
  //   if (query.name === '') {
  //     return { contents: '' };
  //   }

  //   // search for results
  //   const res = this.helper.completion(query, true);

  //   // determine how to proceed
  //   switch (true) {
  //     // no matches no dice
  //     case res.length === 0:
  //       return { contents: '' };
  //     // if the first item matches, then send
  //     case res[0].label.toLowerCase() === query.searchName.toLowerCase():
  //       return { contents: res[0].documentation };
  //     // default, don't send anything
  //     default:
  //       return { contents: '' };
  //   }
  // }

  // // get our completion items when typing
  // getCompletionItems(position: TextDocumentPositionParams): CompletionItem[] {
  //   // get the word that we are trying to complete
  //   // do this here just so we dont have to split larger files more than once
  //   // because we need the strings, split, and regex to find our work
  //   const query = this.manager.getSelectedSymbol(position);

  //   // check if we are a method
  //   let docsMatches: CompletionItem[];
  //   if (query.isMethod) {
  //     docsMatches = this.helper.completion(query, true);
  //     if (docsMatches.length === 0) {
  //       docsMatches = this.helper.completion(query, false);
  //     }
  //   } else {
  //     docsMatches = this.helper.completion(query, false);
  //   }

  //   // get symbol matches
  //   const symMatches = this.manager.completion(query, position);
  //   if (symMatches.length > 0) {
  //     docsMatches = docsMatches.concat(symMatches);
  //   }

  //   return docsMatches;
  // }

  // after we use auto-complete on an item, do anything afterwards to clean it up?
  postCompletion(item: CompletionItem): CompletionItem {
    // // get the id
    // const key = item.data.toString();

    // // check if function or procedure
    // switch (true) {
    // 	default:
    // 		// do nothing
    // }
    return item;
  }

  // // get document outline which filters out variables
  // async getDocumentOutline(
  //   params: DocumentSymbolParams
  // ): Promise<DocumentSymbol[]> {
  //   return (await this.manager.get.documentSymbols(params.textDocument.uri))
  //     .filter((symbol) => symbol.kind !== SymbolKind.Variable)
  //     .map((symbol) => ({
  //       name: symbol.displayName,
  //       detail: symbol.detail,
  //       kind: symbol.kind,
  //       range: symbol.range,
  //       selectionRange: symbol.selectionRange,
  //       children: symbol.children,
  //     }));
  // }
}
