import { GLOBAL_TOKEN_TYPES, GlobalRoutineTokenType } from '@idl/types/core';

/**
 * If we can handle any keyword, add a new one for '_ref_extra to the
 * routine definition
 */
export const HAS_EXTRA_KEYWORDS: { [key: string]: GlobalRoutineTokenType[] } =
  {};

function SaveExtra(key: string, type: GlobalRoutineTokenType) {
  if (key in HAS_EXTRA_KEYWORDS) {
    HAS_EXTRA_KEYWORDS[key].push(type);
  } else {
    HAS_EXTRA_KEYWORDS[key] = [type];
  }
}

/**
 * Random things
 */
SaveExtra('call_function', GLOBAL_TOKEN_TYPES.FUNCTION);
SaveExtra('call_procedure', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('call_method', GLOBAL_TOKEN_TYPES.FUNCTION);
SaveExtra('call_method', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('file_gunzip', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('obj_new', GLOBAL_TOKEN_TYPES.FUNCTION);
SaveExtra('help', GLOBAL_TOKEN_TYPES.PROCEDURE);

/**
 * Function graphics
 */
SaveExtra('plot', GLOBAL_TOKEN_TYPES.FUNCTION);
SaveExtra('barplot', GLOBAL_TOKEN_TYPES.FUNCTION);
SaveExtra('boxplot', GLOBAL_TOKEN_TYPES.FUNCTION);
SaveExtra('bubbleplot', GLOBAL_TOKEN_TYPES.FUNCTION);
SaveExtra('plot3d', GLOBAL_TOKEN_TYPES.FUNCTION);
SaveExtra('image', GLOBAL_TOKEN_TYPES.FUNCTION);
SaveExtra('surface', GLOBAL_TOKEN_TYPES.FUNCTION);
SaveExtra('scatterplot', GLOBAL_TOKEN_TYPES.FUNCTION);
SaveExtra('scatterplot3d', GLOBAL_TOKEN_TYPES.FUNCTION);
SaveExtra('contour', GLOBAL_TOKEN_TYPES.FUNCTION);
SaveExtra('vector', GLOBAL_TOKEN_TYPES.FUNCTION);
SaveExtra('streamline', GLOBAL_TOKEN_TYPES.FUNCTION);
SaveExtra('volume', GLOBAL_TOKEN_TYPES.FUNCTION);
SaveExtra('text', GLOBAL_TOKEN_TYPES.FUNCTION);
SaveExtra('polygon', GLOBAL_TOKEN_TYPES.FUNCTION);
SaveExtra('polyline', GLOBAL_TOKEN_TYPES.FUNCTION);
SaveExtra('ellipse', GLOBAL_TOKEN_TYPES.FUNCTION);
SaveExtra('mapgrid', GLOBAL_TOKEN_TYPES.FUNCTION);
SaveExtra('arrow', GLOBAL_TOKEN_TYPES.FUNCTION);
SaveExtra('mapgridline', GLOBAL_TOKEN_TYPES.FUNCTION);
SaveExtra('crosshair', GLOBAL_TOKEN_TYPES.FUNCTION);
SaveExtra('fillplot', GLOBAL_TOKEN_TYPES.FUNCTION);
SaveExtra('axis', GLOBAL_TOKEN_TYPES.FUNCTION);

/**
 * Direct graphics
 */
SaveExtra('annotate', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('arrow', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('axis', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('bar_plot', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('box_cursor', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('contour', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('cursor', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('cw_animate_run', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('device', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('draw_roi', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('empty', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('erase', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('errplot', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('flick', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('image_statistics', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('oplot', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('oploterr', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('plot', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('plot_3dbox', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('ploterr', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('plots', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('polar_contour', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('polyfill', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('polyshade', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('ps_show_fonts', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('project_vol', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('rdpix', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('scale3', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('scale3d', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('set_shading', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('shade_surf', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('shade_surf_irr', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('shade_volume', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('show3', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('surface', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('threed', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('tv', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('tvcrs', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('tvlct', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('tvrd', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('tvscl', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('wset', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('wshow', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('xyouts', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('zoom', GLOBAL_TOKEN_TYPES.PROCEDURE);
SaveExtra('zoom_24', GLOBAL_TOKEN_TYPES.PROCEDURE);

/**
 * Widgets
 */
SaveExtra('cw_filesel', GLOBAL_TOKEN_TYPES.FUNCTION);
