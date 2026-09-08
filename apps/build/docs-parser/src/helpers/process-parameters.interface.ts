import { IParsedHTML } from './parser.interface';

/**
 * Argument or keyword lookup by parameter name and the HTML children
 */
export interface IParameterHTML {
  [key: string]: IParsedHTML[];
}

/** By routine name, the parameters (args or keywords) for the routine */
export interface IParameterHTMLByRoutine {
  [key: string]: IParameterHTML;
}

/**
 * Argument or keyword lookup by parameter name and the docs for it
 */
export interface IParameterDocs {
  [key: string]: string;
}

/** By routine name, the parameters (args or keywords) docs for the routine */
export interface IParameterDocsByRoutine {
  [key: string]: IParameterDocs;
}
