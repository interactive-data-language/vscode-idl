/**
 * Override to assume that keywords we have defined are actually
 * properties.
 *
 * Initial use case for this is with some of our graphics objects which
 * follow this paradigm
 */
export const KEYWORD_ARE_PROPS: { [key: string]: any } = {};
KEYWORD_ARE_PROPS['plot'] = true;
KEYWORD_ARE_PROPS['barplot'] = true;
KEYWORD_ARE_PROPS['boxplot'] = true;
KEYWORD_ARE_PROPS['bubbleplot'] = true;
KEYWORD_ARE_PROPS['plot3d'] = true;
KEYWORD_ARE_PROPS['image'] = true;
KEYWORD_ARE_PROPS['surface'] = true;
KEYWORD_ARE_PROPS['scatterplot'] = true;
KEYWORD_ARE_PROPS['scatterplot3d'] = true;
KEYWORD_ARE_PROPS['contour'] = true;
KEYWORD_ARE_PROPS['vector'] = true;
KEYWORD_ARE_PROPS['streamline'] = true;
KEYWORD_ARE_PROPS['volume'] = true;
KEYWORD_ARE_PROPS['text'] = true;
KEYWORD_ARE_PROPS['polygon'] = true;
KEYWORD_ARE_PROPS['polyline'] = true;
KEYWORD_ARE_PROPS['ellipse'] = true;
KEYWORD_ARE_PROPS['mapgrid'] = true;
KEYWORD_ARE_PROPS['arrow'] = true;
KEYWORD_ARE_PROPS['mapgridline'] = true;
KEYWORD_ARE_PROPS['crosshair'] = true;
KEYWORD_ARE_PROPS['fillplot'] = true;
