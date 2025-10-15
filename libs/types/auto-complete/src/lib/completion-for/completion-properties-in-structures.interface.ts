/**
 * Auto-complete for properties in structures
 */
export type PropertyInStructureCompletion = 'property-in-structure';

/**
 * Options for adding properties in structures
 */
export interface IPropertyInStructureCompletionOptions {
  /** Properties already specified */
  found: { [key: string]: boolean };
  /** Structure name */
  name: string;
}
