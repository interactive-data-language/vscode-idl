/**
 * Track the display names of global types (i.e. structures).
 *
 * This is the extension point for types that allows us to
 * add in user/internal structures beyond IDL and have them
 * parse/display correctly.
 *
 * This is primarily for display and AutoDoc to have formatting
 * be consistent.
 */
export const CUSTOM_TYPE_DISPLAY_NAMES: { [key: string]: string } = {};
