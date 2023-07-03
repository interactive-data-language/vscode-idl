/**
 * What level do we allow IDL setting to be made at
 *
 * Applied for all settings in a similar way to the workbench and helps simplify
 * by not allowing workspace overrides for now.
 *
 * See `scope` here: https://code.visualstudio.com/api/references/contribution-points#contributes.configuration
 */
export const IDL_CONFIG_SCOPE = 'machine-overridable';
