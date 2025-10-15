import {
  IParameterDocs,
  IParameterHTML,
} from './helpers/process-parameters.interface';

/**
 * HTML elements by section of our docs
 */
export interface IRoutineHTML {
  /** By argument name, the docs we extracted */
  args: IParameterHTML;
  /** By section name the HTML elements that we extract */
  docs: IParameterHTML;
  /** By keyword name, the docs we extract */
  keywords: IParameterHTML;
  /** Link for the routine */
  link: string;
  /** Name of the routine */
  name: string;
  /** By keyword name, the docs we extract */
  properties: IParameterHTML;
}

/** By routine name, the HTML docs for it */
export interface IHTMLByRoutine {
  [key: string]: IRoutineHTML;
}

/**
 * Docs for each routine
 */
export interface IRoutineDocs {
  /** By argument name, the docs we extracted */
  args: IParameterDocs;
  /** By section name the HTML elements that we extract */
  docs: IParameterDocs;
  /** By keyword name, the docs we extract */
  keywords: IParameterDocs;
  /** Link for the routine */
  link: string;
  /** Name of the routine */
  name: string;
  /** By keyword name, the docs we extract */
  properties: IParameterDocs;
}

/** By routine name, the docs for it */
export interface IDocsByRoutine {
  [key: string]: IRoutineDocs;
}
