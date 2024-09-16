/** When an edit has partial overlap with a token */
type PartialOverlap = 'partial-overlap';

/** When an edit completely covers the extent of a token */
type CompleteOverlap = 'complete-overlap';

/** When an edit is inside of a token */
type InteriorEdit = 'interior-edit';

/**
 * Types of edits made to tokens
 */
export type TokenEditType = PartialOverlap | CompleteOverlap | InteriorEdit;

/**
 * Strict lookup of structures
 */
interface ITokenEditTypeLookup {
  /** When an edit has partial overlap with a token */
  PARTIAL: PartialOverlap;
  /** When an edit completely covers the extent of a token */
  COMPLETE: CompleteOverlap;
  /** When an edit is inside of a token */
  INTERIOR: InteriorEdit;
}

/**
 * Types of token edits
 */
export const TOKEN_EDIT_TYPE_LOOKUP: ITokenEditTypeLookup = {
  PARTIAL: 'partial-overlap',
  COMPLETE: 'complete-overlap',
  INTERIOR: 'interior-edit',
};
