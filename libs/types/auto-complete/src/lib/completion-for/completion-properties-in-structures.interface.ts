/**
 * Auto-complete for properties in structures
 */
export type PropertyInStructureCompletion = 'property-in-structure';

/**
 * Options for adding properties in structures
 */
export interface IPropertyInStructureCompletionOptions {
  /** Structure name */
  name: string;
  /** Properties already specified */
  found: { [key: string]: boolean };
}
