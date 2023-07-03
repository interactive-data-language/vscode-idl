import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { CompletionItem, Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Include properties`, () => {
  it(`[auto generated] for procedure methods with only dots`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // specify filepath
    const filepath = GetExtensionPath('idl/test/auto-complete/examples.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 22, character: 4 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      {
        label: 'all',
        insertText: 'all',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'An anonymous structure containing the values of all of the properties associated with the _state_ of this object. State information about the object includes things like color, range, tick direction, etc., but not image, vertex, or connectivity data, or user values.\n\n**Note:** The fields of this structure may change in subsequent releases of IDL.\n\n| **Property Type** | Structure       |              |                    |\n| ----------------- | --------------- | ------------ | ------------------ |\n| **Name String**   | _not displayed_ |              |                    |\n| **Get:** Yes      | **Set:** No     | **Init:** No | **Registered:** No |',
        },
      },
      {
        label: 'alpha_channel',
        insertText: 'alpha_channel',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'Set this property to a floating-point value in the range \\[0.0, 1.0\\] to specify the opacity of the surface. The default value of 1.0 causes IDL to draw the surface completely opaque. If the value of this property is less than 1.0, then the pixels of the surface are blended with the pixels already on the screen. The color of the surface is multiplied by the alpha value and the pixels already on the screen are multiplied by 1.0-alpha. \n\nBecause an object can only be blended with objects already drawn on the screen, the drawing order of the objects must be considered carefully in order to obtain the desired results. This also applies to the individual facets of the surface that IDL generates to represent the surface geometry. Since you do not have control over the rendering order of the facets that form the surface, there is little you can do to change the ordering so that the facets draw in a back-to-front order. Therefore, using this property to draw semi-transparent surfaces is not recommended unless the surface geometry and orientation is such that the surface can be viewed without self-overlapping areas. \n\nThis property has no effect on devices using indexed color mode.\n\nWhen used with textures, the ALPHA\\_CHANNEL value controls the opacity of the polygon in the same manner as when not using a texture. If the texture contains alpha information, the effective alpha of each texel is the texel’s alpha multiplied by the polygon’s alpha value (ALPHA\\_CHANNEL property).\n\n**Note:** \n\n| **Property Type** | Float-point value |               |                     |\n| ----------------- | ----------------- | ------------- | ------------------- |\n| **Name String**   | _Transparency_    |               |                     |\n| **Get:** Yes      | **Set:** Yes      | **Init:** Yes | **Registered:** Yes |',
        },
      },
      {
        label: 'ambient',
        insertText: 'ambient',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'Set this property to a three-element vector \\[_red_, _green_, _blue_\\] to specify the ambient reflective color of the object. The default is black or \\[0,0,0\\], which specifies that the value of the COLOR property determines the ambient reflective color of the object. Setting an ambient color other than black makes the object use that color for ambient reflectance. Ambient reflectance affects the overall color of the object and is most noticeable where the object is not directly lit by a light source. This property has no effect on devices using indexed color mode.\n\n| **Property Type** | COLOR                      |               |                     |\n| ----------------- | -------------------------- | ------------- | ------------------- |\n| **Name String**   | _Ambient reflective color_ |               |                     |\n| **Get:** Yes      | **Set:** Yes               | **Init:** Yes | **Registered:** Yes |',
        },
      },
      {
        label: 'antialias',
        insertText: 'antialias',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A Boolean value that indicates whether anti-aliasing should be used when drawing the lines for the wire mesh or ruled styles. The default is 0, which disables anti-aliasing.\n\n| **Property Type** | BOOLEAN         |               |                     |\n| ----------------- | --------------- | ------------- | ------------------- |\n| **Name String**   | _Anti-aliasing_ |               |                     |\n| **Get:** Yes      | **Set:** Yes    | **Init:** Yes | **Registered:** Yes |',
        },
      },
      {
        label: 'bottom',
        insertText: 'bottom',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A scalar or three-element vector \\[_red_, _green_, _blue_\\] specifying the color used to draw the bottom of the surface. Set this property to a scalar to draw the bottom with the same color as the top. If set to a scalar, IDL returns the default value of -1 if the property is retrieved with GetProperty. Setting a bottom color is only supported when the destination device uses RGB color mode.\n\n| **Property Type** | COLOR        |               |                     |\n| ----------------- | ------------ | ------------- | ------------------- |\n| **Name String**   | Bottom color |               |                     |\n| **Get:** Yes      | **Set:** Yes | **Init:** Yes | **Registered:** Yes |',
        },
      },
      {
        label: 'clip_planes',
        insertText: 'clip_planes',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A 4-by-_N_ floating-point array that specifies the coefficients of the clipping planes to be applied to this object. The four coefficients for each clipping plane are of the form \\[A, B, C, D\\], where A_x_ \\+ B_y_ \\+ C_z_ \\+ D = 0\\. Portions of this object that fall in the half space A_x_ \\+ B_y_ \\+ C_z_ \\+ D > 0 will be clipped. By default, the value of this property is a scalar (-1) indicating that no clipping planes are to be applied.\n\n**Note:** The clipping planes specified via this property are applied in addition to the near and far clipping planes associated with the IDLgrView in which this object appears.\n\n**Note:** Clipping planes are applied in the data space of this object (prior to the application of any _x_, _y_, or _z_ coordinate conversion).\n\n**Note:** To determine the maximum number of clipping planes supported by the device, use the MAX\\_NUM\\_CLIP\\_PLANES property of the GetDeviceInfo method for the IDLgrBuffer, IDLgrClipboard, IDLgrWindow, and IDLgrVRML objects.\n\n| **Property Type** | Floating-point array |               |                    |\n| ----------------- | -------------------- | ------------- | ------------------ |\n| **Name String**   | _not displayed_      |               |                    |\n| **Get:** Yes      | **Set:** Yes         | **Init:** Yes | **Registered:** No |',
        },
      },
      {
        label: 'color',
        insertText: 'color',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'The color to be used as the foreground color for this model. The color may be specified as a color lookup table index or as a three-element vector \\[_red_, _green_, _blue_\\]. The default is \\[0, 0, 0\\].\n\nIn a property sheet, this property appears as a color property.\n\n| **Property Type** | COLOR        |               |                     |\n| ----------------- | ------------ | ------------- | ------------------- |\n| **Name String**   | Color        |               |                     |\n| **Get:** Yes      | **Set:** Yes | **Init:** Yes | **Registered:** Yes |',
        },
      },
      {
        label: 'data',
        insertText: 'data',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'An array of any type that specifies the surface data. The array format is based upon the following: \n\n* If the DATAZ property (or Data argument) was set to an _M_ x _N_ array (via the ::Init or ::SetProperty methods), then the value returned via the DATA property is a 3 x _M_ x _N_ array, \\[\\[\\[_x_,_y_,_z_\\],\\[_x_,_y_,_z_\\],...\\],\\[\\[_x_,_y_,_z_\\],\\[_x_,_y_,_z_\\],...\\],...\\].\n* If the DATAZ keyword (or Data argument) was never set, then the value returned via the DATA property is an undefined variable.\n\nThe value of the DATA array represents the combination of the DATAX, DATAY, and DATAZ values defined using ::SetProperty. If DATAZ was set, and DATAX and DATAY were not, the DATA value returned includes the implied X and Y grid locations. \n\n| **Property Type** | Array of any type |              |                    |\n| ----------------- | ----------------- | ------------ | ------------------ |\n| **Name String**   | _not displayed_   |              |                    |\n| **Get:** Yes      | **Set:** No       | **Init:** No | **Registered:** No |',
        },
      },
      {
        label: 'datax',
        insertText: 'datax',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A floating-point vector or a two-dimensional array specifying the X coordinates of the surface grid. This property is stored as double precision floating point values if the property is of type DOUBLE or if the DOUBLE property is non-zero, otherwise it is stored as single precision floating point.\n\nSpecifying this property is the same as specifying the optional _X_ argument to the [IDLgrSurface::Init](https://www.nv5geospatialsoftware.com/docs/IDLgrSurface__Init.html) method. \n\n| **Property Type** | Floating-point vector or array |               |                    |\n| ----------------- | ------------------------------ | ------------- | ------------------ |\n| **Name String**   | _not displayed_                |               |                    |\n| **Get:** No       | **Set:** Yes                   | **Init:** Yes | **Registered:** No |',
        },
      },
      {
        label: 'datay',
        insertText: 'datay',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A floating-point vector or a two-dimensional array specifying the Y coordinates of the surface grid. This property is stored as double precision floating point values if the property is of type DOUBLE or if the DOUBLE property is non-zero, otherwise it is stored as single precision floating point.\n\nSpecifying this property is the same as specifying the optional _Y_ argument to the [IDLgrSurface::Init](https://www.nv5geospatialsoftware.com/docs/IDLgrSurface__Init.html) method.\n\n| **Property Type** | Floating-point vector or array |               |                    |\n| ----------------- | ------------------------------ | ------------- | ------------------ |\n| **Name String**   | _not displayed_                |               |                    |\n| **Get:** No       | **Set:** Yes                   | **Init:** Yes | **Registered:** No |',
        },
      },
      {
        label: 'dataz',
        insertText: 'dataz',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A two-dimensional floating-point array to display as a surface. This property is stored as double precision floating point values if the property is of type DOUBLE or if the DOUBLE property is non-zero, otherwise it is stored as single precision floating point.\n\nSpecifying this property is the same as specifying the optional _Z_ argument to the [IDLgrSurface::Init](https://www.nv5geospatialsoftware.com/docs/IDLgrSurface__Init.html) method.\n\n| **Property Type** | Floating-point array |               |                    |\n| ----------------- | -------------------- | ------------- | ------------------ |\n| **Name String**   | _not displayed_      |               |                    |\n| **Get:** No       | **Set:** Yes         | **Init:** Yes | **Registered:** No |',
        },
      },
      {
        label: 'depth_offset',
        insertText: 'depth_offset',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'An integer value that specifies an offset in depth to be used when rendering filled primitives. This offset is applied along the viewing axis, with positive values moving the primitive away from the viewer.\n\nThe units are “Z-Buffer units,” where a value of 1 is used to specify a distance that corresponds to a single step in the device’s Z-Buffer.\n\nUse DEPTH\\_OFFSET to always cause a filled primitive to be rendered slightly deeper than other primitives, independent of model transforms. This is useful for avoiding stitching artifacts caused by rendering lines or polygons on top of other polygons at the same depth.\n\n**Note:** Use this feature to remove stitching artifacts and not as a means for “layering” complex scenes with multiple DEPTH\\_OFFSET values. It is safest to use only a DEPTH\\_OFFSET value of 0, the default, and one other non-zero value, such as 1\\. Many system-level graphics drivers are not consistent in their handling of DEPTH\\_OFFSET values, particularly when multiple non-zero values are used. This can lead to portability problems because a set of DEPTH\\_OFFSET values may produce better results on one machine than on another. Using IDL’s software renderer will help improve the cross-platform consistency of scenes that use DEPTH\\_OFFSET.\n\n**Note:** DEPTH\\_OFFEST has no effect unless the value of the STYLE property is 2 or 6 (Filled or LegoFilled).\n\n| **Property Type** | INTEGER      |               |                     |\n| ----------------- | ------------ | ------------- | ------------------- |\n| **Name String**   | Depth offset |               |                     |\n| **Get:** Yes      | **Set:** Yes | **Init:** Yes | **Registered:** Yes |',
        },
      },
      {
        label: 'depth_test_disable',
        insertText: 'depth_test_disable',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'An integer value that determines whether depth testing is disabled.\n\n* Set this property to 0 (the default) to inherit the value set by the parent model or view. The parent view always enables depth testing. A model may also enable or disable depth testing.\n* Set this property to 1 to explicitly disable depth buffer testing while drawing this object.\n* Set this property to 2 to explicitly enable depth testing for this object.\n\nDisabling depth testing allows an object to draw itself “on top” of other objects already on the screen, even if the object is located behind them.\n\n**Note:** Disabling depth testing also disables depth buffer writing. When disabling depth testing, the DEPTH\\_TEST\\_FUNCTION and DEPTH\\_WRITE\\_DISABLE properties are effectively ignored.\n\nThis property is registered as an enumerated list, but it is hidden by default.\n\n| **Property Type** | ENUMLIST        |               |                    |\n| ----------------- | --------------- | ------------- | ------------------ |\n| **Name String**   | _not displayed_ |               |                    |\n| **Get:** Yes      | **Set:** Yes    | **Init:** Yes | **Registered:** No |',
        },
      },
      {
        label: 'depth_test_function',
        insertText: 'depth_test_function',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'An integer value that determines the depth test function. Set this property to 0 (the default) to inherit the value set by the parent model or view. The parent view always sets a depth test function of LESS. A model may also set a depth test function value. The graphics device compares the object’s depth at a particular pixel location with the depth stored in the depth buffer at that same pixel location. If the comparison test passes, the object’s pixel is drawn at that location on the screen and the depth buffer is updated (if depth writing is enabled).\n\nSet this property to any of the following values to use the desired function while rendering this object.\n\n* 0 = INHERIT - use value from parent model or view.\n* 1 = NEVER - never passes.\n* 2 = LESS - passes if the object’s depth is less than the depth buffer’s value.\n* 3 = EQUAL - passes if the object’s depth is equal to the depth buffer’s value.\n* 4 = LESS OR EQUAL - passes if the object’s depth is less than or equal to the depth buffer’s value.\n* 5 = GREATER - passes if the object’s depth is greater than or equal to the depth buffer’s value.\n* 6 = NOT EQUAL - passes if the object’s depth is not equal to the depth buffer’s value.\n* 7 = GREATER OR EQUAL - passes if the object’s depth is greater than or equal to the depth buffer’s value.\n* 8 = ALWAYS - always passes\n\nLess means closer to the viewer.\n\nThis property is registered as an enumerated list, but it is hidden by default.\n\n| **Property Type** | ENUMLIST        |               |                    |\n| ----------------- | --------------- | ------------- | ------------------ |\n| **Name String**   | _not displayed_ |               |                    |\n| **Get:** Yes      | **Set:** Yes    | **Init:** Yes | **Registered:** No |',
        },
      },
      {
        label: 'depth_write_disable',
        insertText: 'depth_write_disable',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'An integer value that determines whether depth writing is disabled. \n\n* Set this property to 0 (the default) to inherit the value set by the parent model or view. The parent view always enables depth writing. A model may also enable or disable depth writing.\n* Set this property to 1 to explicitly disable depth buffer writing while rendering this object.\n* Set this property to 2 to explicitly enable depth writing for this object.\n\nDisabling depth writing allows an object to be overdrawn by other objects, even if the object is located in front of them. \n\n**Note:** If depth testing (see DEPTH\\_TEST\\_DISABLE property) is disabled, depth writing is also automatically disabled.\n\nThis property is registered as an enumerated list, but it is hidden by default.\n\n| **Property Type** | ENUMLIST        |               |                    |\n| ----------------- | --------------- | ------------- | ------------------ |\n| **Name String**   | _not displayed_ |               |                    |\n| **Get:** Yes      | **Set:** Yes    | **Init:** Yes | **Registered:** No |',
        },
      },
      {
        label: 'diffuse',
        insertText: 'diffuse',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'Set this property to a three-element vector \\[_red_, _green_, _blue_\\] to specify the diffuse reflectance color of the object. The default is black or \\[0,0,0\\], which specifies that the value of the COLOR property determines the diffuse reflective color of the object. Setting a diffuse color other than black makes the object use that color for diffuse reflectance. Diffuse reflectance is an important factor in determining the color of the object and is affected by the color and angle of the light sources in a scene. This property has no effect on devices using indexed color mode. \n\n| **Property Type** | COLOR                      |               |                     |\n| ----------------- | -------------------------- | ------------- | ------------------- |\n| **Name String**   | _Diffuse reflective color_ |               |                     |\n| **Get:** Yes      | **Set:** Yes               | **Init:** Yes | **Registered:** Yes |',
        },
      },
      {
        label: 'double',
        insertText: 'double',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A Boolean value that indicates whether data provided by any of the input arguments will be stored in this object as using double-precision floating-point format. \n\n* Set this property equal to 1 to convert input data to double-precision floating-point format.\n* Set this property equal to 0 to convert input data to single-precision floating-point format.\n* If you do not specify a value for this property, no data type conversion will be performed, and the data will be stored with its original precision.\n\nSetting this property may be desirable if the data consists of large integers that cannot be accurately represented in single-precision floating-point arithmetic. This property is also automatically set to 1 if any of the input arguments are stored using a variable of type DOUBLE.\n\n| **Property Type** | Boolean         |               |                    |\n| ----------------- | --------------- | ------------- | ------------------ |\n| **Name String**   | _not displayed_ |               |                    |\n| **Get:** Yes      | **Set:** Yes    | **Init:** Yes | **Registered:** No |',
        },
      },
      {
        label: 'emission',
        insertText: 'emission',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'Set this property to a three-element vector \\[_red_, _green_, _blue_\\] to specify the emissive color of the object. The default is black or \\[0,0,0\\], which specifies that the object contributes no additional color in an emissive sense. Setting an emission color other than black makes the object appear as if it were emitting that color. This property is used to simulate light sources or other objects that emit light in a scene. This property has no effect on devices using indexed color mode.\n\n| **Property Type** | COLOR            |               |                     |\n| ----------------- | ---------------- | ------------- | ------------------- |\n| **Name String**   | _Emissive color_ |               |                     |\n| **Get:** Yes      | **Set:** Yes     | **Init:** Yes | **Registered:** Yes |',
        },
      },
      {
        label: 'extended_lego',
        insertText: 'extended_lego',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A Boolean value that determines whether to force the IDLgrSurface object to display the last row and column of data when lego display styles are selected.\n\n| **Property Type** | Boolean                   |               |                     |\n| ----------------- | ------------------------- | ------------- | ------------------- |\n| **Name String**   | Show last lego row/column |               |                     |\n| **Get:** Yes      | **Set:** Yes              | **Init:** Yes | **Registered:** Yes |',
        },
      },
      {
        label: 'hidden_lines',
        insertText: 'hidden_lines',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A Boolean value that determines whether to draw point and wireframe surfaces using hidden line (point) removal. By default, hidden line removal is disabled.\n\n| **Property Type** | Boolean             |               |                     |\n| ----------------- | ------------------- | ------------- | ------------------- |\n| **Name String**   | Remove hidden lines |               |                     |\n| **Get:** Yes      | **Set:** Yes        | **Init:** Yes | **Registered:** Yes |',
        },
      },
      {
        label: 'hide',
        insertText: 'hide',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A Boolean value or an enumerated list item indicating whether this object should be drawn: \n\n| Value | Property Sheet Value | Description                |\n| ----- | -------------------- | -------------------------- |\n| 0     | True                 | Draw graphic (the default) |\n| 1     | False                | Do no draw graphic         |\n\n| **Property Type** | ENUMLIST     |               |                     |\n| ----------------- | ------------ | ------------- | ------------------- |\n| **Name String**   | Show         |               |                     |\n| **Get:** Yes      | **Set:** Yes | **Init:** Yes | **Registered:** Yes |',
        },
      },
      {
        label: 'linestyle',
        insertText: 'linestyle',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            "An integer value that indicates the line style to use to draw the surface lines. The value can be either an integer value specifying a pre-defined line style, or a two-element vector specifying a stippling pattern.\n\nTo use a pre-defined line style, set this property equal to one of the following integer values:\n\n| 0 | Solid line (the default) |\n| - | ------------------------ |\n| 1 | Dotted                   |\n| 2 | Dashed                   |\n| 3 | Dash dot                 |\n| 4 | Dash dot dot dot         |\n| 5 | Long dash                |\n| 6 | No line drawn            |\n\nTo define your own stippling pattern, specify a two-element vector \\[_repeat_, _bitmask_\\], where _repeat_ indicates the number of times consecutive runs of 1’s or 0’s in the _bitmask_ should be repeated. (That is, if three consecutive 0’s appear in the _bitmask_ and the value of _repeat_ is 2, then the line that is drawn will have six consecutive bits turned off.) The value of _repeat_ must be in the range 1 ≤ _repeat_ ≤ 255.\n\nThe _bitmask_ indicates which pixels are drawn and which are not along the length of the line. _Bitmask_ is most conveniently specified as a 16-bit hexadecimal value.\n\nFor example, `LINESTYLE = [2, 'F0F0'X]` describes a dashed line (8 bits on, 8 bits off, 8 bits on, 8 bits off).\n\nIn a property sheet, this property appears as follows:\n\n![](https://www.nv5geospatialsoftware.com/docs/html/images/linestyle.gif) \n\n| **Property Type** | Linestyle    |               |                     |\n| ----------------- | ------------ | ------------- | ------------------- |\n| **Name String**   | Line style   |               |                     |\n| **Get:** Yes      | **Set:** Yes | **Init:** Yes | **Registered:** Yes |",
        },
      },
      {
        label: 'max_value',
        insertText: 'max_value',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A double-precision floating-point value that determines the maximum value to be plotted. If this property is present, data values greater than the value of MAX\\_VALUE are treated as missing data and are not plotted. Note that the IEEE floating-point value NaN is also treated as missing data. IDL converts, maintains, and returns this data as double-precision floating-point.\n\n| **Property Type** | FLOAT         |               |                     |\n| ----------------- | ------------- | ------------- | ------------------- |\n| **Name String**   | Maximum value |               |                     |\n| **Get:** Yes      | **Set:** Yes  | **Init:** Yes | **Registered:** Yes |',
        },
      },
      {
        label: 'min_value',
        insertText: 'min_value',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A double-precision floating-point value that determines the minimum value to be plotted. If this property is present, data values less than the value of MIN\\_VALUE are treated as missing data and are not plotted. Note that the IEEE floating-point value NaN is also treated as missing data. IDL converts, maintains, and returns this data as double-precision floating-point.\n\n| **Property Type** | FLOAT         |               |                     |\n| ----------------- | ------------- | ------------- | ------------------- |\n| **Name String**   | Minimum value |               |                     |\n| **Get:** Yes      | **Set:** Yes  | **Init:** Yes | **Registered:** Yes |',
        },
      },
      {
        label: 'palette',
        insertText: 'palette',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'An object reference to a palette object (an instance of the IDLgrPalette object class) that defines the color palette of this object. This property is only used if the destination device is using the RGB color model. If so, and a color value for the object is specified as a color index value, the palette set by this property is used to translate the color to RGB space. If the PALETTE property on this object is not set, the destination object PALETTE property is used (which defaults to a grayscale ramp).\n\n**Note:** Objects specified via this property are not automatically cleaned up when the IDLgrSurface object is destroyed.\n\nThis property is registered as a user-defined property, but it is hidden by default.\n\n| **Property Type** | USERDEF       |               |                     |\n| ----------------- | ------------- | ------------- | ------------------- |\n| **Name String**   | Color palette |               |                     |\n| **Get:** Yes      | **Set:** Yes  | **Init:** Yes | **Registered:** Yes |',
        },
      },
      {
        label: 'parent',
        insertText: 'parent',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'An object reference to the object that contains this object.\n\n| **Property Type** | Object reference |              |                    |\n| ----------------- | ---------------- | ------------ | ------------------ |\n| **Name String**   | _not displayed_  |              |                    |\n| **Get:** Yes      | **Set:** No      | **Init:** No | **Registered:** No |',
        },
      },
      {
        label: 'register_properties',
        insertText: 'register_properties',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A Boolean value that determines whether to register properties available for this object. If this property is set, all properties marked in this properties section as “Registered: Yes” will be registered for display in a property sheet. This property is useful mainly when creating iTools. By default, no properties are registered.\n\n| **Property Type** | Boolean         |               |                    |\n| ----------------- | --------------- | ------------- | ------------------ |\n| **Name String**   | _not displayed_ |               |                    |\n| **Get:** No       | **Set:** No     | **Init:** Yes | **Registered:** No |',
        },
      },
      {
        label: 'reset_data',
        insertText: 'reset_data',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A Boolean value that determines whether to treat the data provided via one of the DATA\\[XYZ\\] properties as a new data set unique to this object, rather than overwriting data that is shared by other objects. There is no reason to use this property if the object on which the property is being set does not currently share data with another object (that is, if the SHARE\\_DATA property is not in use). This property has no effect if no new data is provided via a DATA\\[XYZ\\] property. .\n\n| **Property Type** | Boolean         |               |                    |\n| ----------------- | --------------- | ------------- | ------------------ |\n| **Name String**   | _not displayed_ |               |                    |\n| **Get:** No       | **Set:** Yes    | **Init:** Yes | **Registered:** No |',
        },
      },
      {
        label: 'shade_range',
        insertText: 'shade_range',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A two-element integer array that specifies the range of pixel values (color indices) to use for shading. The first element is the color index for the darkest pixel. The second element is the color element for the brightest pixel. This value is ignored when the polygons are drawn to a graphics destination that uses the RGB color model.\n\n| **Property Type** | Integer array   |               |                    |\n| ----------------- | --------------- | ------------- | ------------------ |\n| **Name String**   | _not displayed_ |               |                    |\n| **Get:** Yes      | **Set:** Yes    | **Init:** Yes | **Registered:** No |',
        },
      },
      {
        label: 'shader',
        insertText: 'shader',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'An object reference to an [IDLgrShader](https://www.nv5geospatialsoftware.com/docs/IDLgrShader.html) object (or an object containing IDLgrShader as a superclass). When there is suitable graphics card hardware support, the surface is rendered using the GLSL shader program (executed on the graphics card) instead of using fixed OpenGL properties when initially drawn. (If a suitable graphics card is not present, IDL ignores the shader object when the scene is drawn.) A single IDLgrShader object may be associated with additional surface objects or other graphic objects that have the SHADER property.\n\n| **Property Type** | Object reference |               |                    |\n| ----------------- | ---------------- | ------------- | ------------------ |\n| **Name String**   | _not displayed_  |               |                    |\n| **Get:** Yes      | **Set:** Yes     | **Init:** Yes | **Registered:** No |',
        },
      },
      {
        label: 'shading',
        insertText: 'shading',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'An integer value or enumerated list item representing the type of shading to use if STYLE is set to 2 (Filled).\n\n| Value | Property Sheet Value | Description                                                                                               |\n| ----- | -------------------- | --------------------------------------------------------------------------------------------------------- |\n| 0     | Flat                 | The color has a constant intensity for each face of the surface, based on the normal vector (the default) |\n| 1     | Gouraud              | The colors are interpolated between vertices, and then along scanlines from each of the edge intensities  |\n\nGouraud shading may be slower than flat shading, but results in a smoother appearance.\n\n| **Property Type** | ENUMLIST     |               |                     |\n| ----------------- | ------------ | ------------- | ------------------- |\n| **Name String**   | Fill shading |               |                     |\n| **Get:** Yes      | **Set:** Yes | **Init:** Yes | **Registered:** Yes |',
        },
      },
      {
        label: 'share_data',
        insertText: 'share_data',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'An object reference to an object whose data is to be shared by this surface. A surface may only share data with another surface. The SHARE\\_DATA property is intended for use when data values are not set via an argument to the object’s Init method or by setting the object’s DATA property.\n\n**Note:** Objects specified via this property are not automatically cleaned up when the IDLgrSurface object is destroyed.\n\n| **Property Type** | Object reference |               |                    |\n| ----------------- | ---------------- | ------------- | ------------------ |\n| **Name String**   | _not displayed_  |               |                    |\n| **Get:** No       | **Set:** Yes     | **Init:** Yes | **Registered:** No |',
        },
      },
      {
        label: 'shininess',
        insertText: 'shininess',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'Set this property to a floating-point value between 0.0 and 128.0, inclusive. The default value is 25.0\\. Higher values of shininess concentrate specular highlights into smaller and brighter areas, while lower values will spread out specular highlights over a wider area and make them appear dimmer.\n\n| **Property Type** | FLOAT        |               |                     |\n| ----------------- | ------------ | ------------- | ------------------- |\n| **Name String**   | _Shininess_  |               |                     |\n| **Get:** Yes      | **Set:** Yes | **Init:** Yes | **Registered:** Yes |',
        },
      },
      {
        label: 'show_skirt',
        insertText: 'show_skirt',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A Boolean value that determines whether to enable skirt drawing. The default is to disable skirt drawing. .\n\n| **Property Type** | Boolean      |               |                     |\n| ----------------- | ------------ | ------------- | ------------------- |\n| **Name String**   | Show skirt   |               |                     |\n| **Get:** Yes      | **Set:** Yes | **Init:** Yes | **Registered:** Yes |',
        },
      },
      {
        label: 'skirt',
        insertText: 'skirt',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A floating-point value that determines the _Z_ value at which a skirt is to be defined around the array. The _Z_ value is expressed in data units; the default is 0.0\\. If a skirt is defined, each point on the four edges of the surface is connected to a point on the skirt which has the given _Z_ value, and the same _X_ and _Y_ values as the edge point. In addition, each point on the skirt is connected to its neighbor. The skirt value is ignored if skirt drawing is disabled (see SHOW\\_SKIRT above). IDL converts, maintains, and returns this data as double-precision floating-point.\n\n| **Property Type** | FLOAT               |               |                     |\n| ----------------- | ------------------- | ------------- | ------------------- |\n| **Name String**   | Skirt bottom height |               |                     |\n| **Get:** Yes      | **Set:** Yes        | **Init:** Yes | **Registered:** Yes |',
        },
      },
      {
        label: 'specular',
        insertText: 'specular',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'Set this property to a three-element vector \\[_red_, _green_, _blue_\\] to specify the color of the specular highlights of an object. The default is white or \\[255,255,255\\]. This property is used to simulate and control reflective highlights on an object. This property has no effect on devices using indexed color mode.\n\n| **Property Type** | COLOR                      |               |                     |\n| ----------------- | -------------------------- | ------------- | ------------------- |\n| **Name String**   | _Specular highlight color_ |               |                     |\n| **Get:** Yes      | **Set:** Yes               | **Init:** Yes | **Registered:** Yes |',
        },
      },
      {
        label: 'style',
        insertText: 'style',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'An integer value or an enumerated list item that indicates the style to be used to draw the surface. Valid values are:\n\n| Value | Property Sheet Value | Description                                                         |\n| ----- | -------------------- | ------------------------------------------------------------------- |\n| 0     | Points               | Points                                                              |\n| 1     | Wire mesh            | Wire mesh (the default)                                             |\n| 2     | Filled               | Filled                                                              |\n| 3     | RuledXZ              | RuledXZ                                                             |\n| 4     | RuledYZ              | RuledYZ                                                             |\n| 5     | Lego                 | Lego                                                                |\n| 6     | Lego filled          | Lego filled for outline or shaded and stacked histogram-style plots |\n\n**Note:** Stitching effects may appear when combining an unfilled style (STYLE=0, 1, 3, 4, or 5) and hidden lines (HIDDEN\\_LINES=1). In such a case, missing lines may be caused by depth buffer resolution, limited depth offset support of the graphics card, or invisible parts of a surface occluding line visibility. \n\n| **Property Type** | ENUMLIST      |               |                     |\n| ----------------- | ------------- | ------------- | ------------------- |\n| **Name String**   | Surface style |               |                     |\n| **Get:** Yes      | **Set:** Yes  | **Init:** Yes | **Registered:** Yes |',
        },
      },
      {
        label: 'texture_coord',
        insertText: 'texture_coord',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A 2-by-_n_ floating-point array of texture map coordinate pairs that are internally mapped to surface vertex coordinates. The number of data points in the surface and the value of _n_ in the 2-by-_n_ array should be equal. \n\nEach texture map coordinate pair is mapped to a surface vertex coordinate pair in array order. For example, with a 2-by-9 element array, texture map coordinates will be mapped to a 3-by-3 surface as follows: \n\n![](https://www.nv5geospatialsoftware.com/docs/html/images/textmap1.gif) \n\nUse this property in conjunction with the TEXTURE\\_MAP property to warp images over the surface. To stretch (or shrink) the texture map to cover the surface mesh completely, set TEXTURE\\_COORD to a scalar. By default, IDL stretches (or shrinks) the texture map to cover the surface mesh completely, and sets TEXTURE\\_COORD to a scalar (-1).\n\nTexture coordinates are normalized. This means that the _m_ x _n_ image object specified via the TEXTURE\\_MAP property is mapped into the range \\[0.0, 0.0\\] to \\[1.0, 1.0\\]. As the texture coordinates run from 0.0 to 1.0 across a texture, a texture coordinate of \\[0.5, 0.5\\] at a vertex specifies that the image pixel at the exact center of the image is mapped to the surface at that vertex. If texture coordinates outside the range \\[0.0, 0.0\\] to \\[1.0, 1.0\\] are specified, the image object is tiled into the larger range.\n\nFor example, suppose the image object specified via TEXTURE\\_MAP is a 256 x 256 array, and we want to map the image into a surface two units on each side. To completely fill the 2 x 2 surface with a single copy of the image:\n\n```idl\n  TEXTURE_COORD = [[0, 0], [1, 0], [0, 1], [1, 1]]\n```\n\nTo fill the 2 x 2 surface with four tiled copies of the image:\n\n```idl\n  TEXTURE_COORD = [[0, 0], [2, 0], [0, 2], [2, 2]]\n```\n\nBecause of the way in which high-resolution textures require modified texture coordinates, if the TEXTURE\\_COORD property is used, TEXTURE\\_HIGHRES will be disabled.\n\n| **Property Type** | Floating-point array |               |                    |\n| ----------------- | -------------------- | ------------- | ------------------ |\n| **Name String**   | _not displayed_      |               |                    |\n| **Get:** Yes      | **Set:** Yes         | **Init:** Yes | **Registered:** No |',
        },
      },
      {
        label: 'texture_highres',
        insertText: 'texture_highres',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'An integer value or enumerated list item that determines the type of texture tiling, if any, that will be used to maintain the full pixel resolution of the original texture image. \n\n| Value | Property Sheet Value | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |\n| ----- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |\n| 0     | No tiling            | If the texture map is larger than the maximum resolution supported by the 3-D hardware, the texture is scaled down to this resolution (the default).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |\n| 1     | LOD tiling           | If the texture map is larger than the maximum resolution supported by the hardware, texture tiling is used to ensure no loss of data. As a large image could easily consume all available video memory, this mode employs texture Level of Detail (LoD). Rather than loading the entire image into the texture tiles at the full resolution, the image tiles are downsampled based on the level of zoom. If the entire image is visible the texture tiles will contain highly downsampled data from the image to conserve video memory. As a portion of the image is zoomed in on, progressively higher resolution image data is loaded into the visible tiles, until the maximum resolution is reached. The tiles that are not visible during zooming are not loaded with high resolution data. This mode is recommended if IDL is running on modern 3-D hardware and resolution loss due to downscaling becomes problematic when TEXTURE\\_HIGHRES=0. |\n| 2     | Tiling               | If the texture map is larger than the maximum resolution supported by the hardware, texture tiling is used to ensure no loss of data. However, the highest resolution data is loaded into all tiles. LoD tiling is disabled. This mode should only be used if the video memory is sufficient for the image size.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |\n\n**Note:** TEXTURE\\_HIGHRES is supported only when STYLE\\=2 (Filled). \n\n**Note:** Because of the way in which high-resolution textures require modified texture coordinates, if you specify the TEXTURE\\_COORD property, high resolution textures (TEXTURE\\_HIGHRES) will be disabled.\n\n| **Property Type** | ENUMLIST      |               |                     |\n| ----------------- | ------------- | ------------- | ------------------- |\n| **Name String**   | Texture hires |               |                     |\n| **Get:** Yes      | **Set:** Yes  | **Init:** Yes | **Registered:** Yes |',
        },
      },
      {
        label: 'texture_interp',
        insertText: 'texture_interp',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A Boolean value or enumerated list item that indicates whether bilinear sampling is to be used with texture mapping. \n\n| Value | Property Sheet Value | Description                                          |\n| ----- | -------------------- | ---------------------------------------------------- |\n| 0     | Nearest neighbor     | Surveys the value of the nearest pixel (the default) |\n| 1     | Bilinear             | Surveys the 4 closest pixels                         |\n\n| **Property Type** | ENUMLIST              |               |                     |\n| ----------------- | --------------------- | ------------- | ------------------- |\n| **Name String**   | Texture interpolation |               |                     |\n| **Get:** Yes      | **Set:** Yes          | **Init:** Yes | **Registered:** Yes |',
        },
      },
      {
        label: 'texture_map',
        insertText: 'texture_map',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'An object reference to an instance of the [IDLgrImage](https://www.nv5geospatialsoftware.com/docs/IDLgrImage.html) object class to be texture mapped onto the surface. If this property is omitted or set to a null object reference, no texture map is applied and the surface is filled with the color specified by the COLOR or VERT\\_COLORS property. If both TEXTURE\\_MAP and COLORS or VERT\\_COLORS properties exist, the color of the texture is modulated by the base color of the object. (This means that for the clearest display of the texture image, the COLOR property should be set equal to \\[255,255,255\\].) By default, the texture map will be stretched (or shrunk) to cover the surface mesh completely.\n\nSetting TEXTURE\\_MAP to the object reference of an IDLgrImage that contains an alpha channel allows you to create a transparent IDLgrSurface object. If an alpha channel is present in the IDLgrImage object, IDL blends the texture using the blend function src = alpha and dst = 1 - alpha, which corresponds to a BLEND\\_FUNCTION of (3,4) as described for the IDLgrImage object.\n\nIf a texture is provided without texture coordinates, IDLgrSurface generates its own texture mapping coordinates to map the texture onto the surface without resampling artifacts, even if the provided texture image does not have dimensions that are an exact power of two. If texture coordinates are provided, the image is resampled to the nearest larger dimensions that are exact powers of two.\n\n**Note:** Texture mapping is disabled when rendering to a destination object that uses Indexed color mode.\n\n**Note:** Texture mapping is applied to all styles that are set by the STYLE property except Lego and LegoFilled.\n\n**Note:** Objects specified via this property are not automatically cleaned up when the IDLgrSurface object is destroyed.\n\nThis property is registered as a user-defined property, but it is hidden by default.\n\n| **Property Type** | USERDEF      |               |                     |\n| ----------------- | ------------ | ------------- | ------------------- |\n| **Name String**   | Texture map  |               |                     |\n| **Get:** Yes      | **Set:** Yes | **Init:** Yes | **Registered:** Yes |',
        },
      },
      {
        label: 'thick',
        insertText: 'thick',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A floating-point value between 0.0 and 10.0, specifying the line thickness to use to draw surface lines, in points. A thickness of 0 displays a thin hairline on the chosen device. Out-of-range values are quietly clamped to the allowed range. The default is 1.0 points.\n\nIn a property sheet, this property appears as follows:\n\n![](https://www.nv5geospatialsoftware.com/docs/html/images/thickness.gif) \n\n| **Property Type** | Thickness      |               |                     |\n| ----------------- | -------------- | ------------- | ------------------- |\n| **Name String**   | Line thickness |               |                     |\n| **Get:** Yes      | **Set:** Yes   | **Init:** Yes | **Registered:** Yes |',
        },
      },
      {
        label: 'use_triangles',
        insertText: 'use_triangles',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A Boolean value or an enumerated list item that determines whether to force the IDLgrSurface object to use triangles instead of quads to draw the surface and skirt. \n\n| Value | Property Sheet Value | Description                                           |\n| ----- | -------------------- | ----------------------------------------------------- |\n| 0     | Quads                | Use quads to draw the surface and skirt (the default) |\n| 1     | Triangles            | Use triangles to draw the surface and skirt           |\n\n | **Property Type** | Boolean      |               |                     |\n| ----------------- | ------------ | ------------- | ------------------- |\n| **Name String**   | Draw method  |               |                     |\n| **Get:** Yes      | **Set:** Yes | **Init:** Yes | **Registered:** Yes |',
        },
      },
      {
        label: 'vert_colors',
        insertText: 'vert_colors',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A vector of colors to be used to specify the color of a surface vertex. The vector may be of the form \\[_n_\\] where each entry is a color index, or of the form \\[3,_n_\\] where each 3-element row is an RGB color, or of the form \\[4,_n_\\] where each 4-element row is an RGBA color. To remove vertex colors after they have been set, set VERT\\_COLORS to a scalar. \n\nIf VERT\\_COLORS is not specified, the entire surface is drawn in the single color provided by the COLOR property, which is the default action.\n\nIf SHADING is set to 0 (Flat, the default) the color of a surface polygon is the color of the first vertex of that surface polygon. Color is interpolated between vertices if SHADING is set to 1 (Gouraud).\n\nIf there are more vertices than elements in VERT\\_COLORS, the elements of VERT\\_COLORS are cyclically repeated. \n\n**Note:** If the surface object is being rendered on a destination device that uses the Indexed color model, and the view that contains the surface also contains one or more light objects, the VERT\\_COLORS property is ignored and the SHADE\\_RANGE property is used instead.\n\nThis property is registered as a user-defined property, but it is hidden by default.\n\n| **Property Type** | USERDEF       |               |                     |\n| ----------------- | ------------- | ------------- | ------------------- |\n| **Name String**   | Vertex colors |               |                     |\n| **Get:** Yes      | **Set:** Yes  | **Init:** Yes | **Registered:** Yes |',
        },
      },
      {
        label: 'xcoord_conv',
        insertText: 'xcoord_conv',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A floating-point vector, \\[_s_0, _s_1\\], of scaling factors used to convert _X_ coordinates from data units to normalized units. The formula for the conversion is as follows:\n\nNormalized_X_ \\= _s_0 \\+ _s_1 \\* Data_X_\n\nRecommended values are:\n\n\\[(-_Xmin_)/(_Xmax_\\-_Xmin_), 1/(_Xmax_\\-_Xmin_)\\]\n\nThe default is \\[0.0, 1.0\\]. IDL converts, maintains, and returns this data as double-precision floating-point.\n\n| **Property Type** | Floating-point vector |               |                    |\n| ----------------- | --------------------- | ------------- | ------------------ |\n| **Name String**   | _not displayed_       |               |                    |\n| **Get:** Yes      | **Set:** Yes          | **Init:** Yes | **Registered:** No |',
        },
      },
      {
        label: 'xrange',
        insertText: 'xrange',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A two-element floating-point vector of the form \\[_xmin_, _xmax_\\] that specifies the range of _x_ data coordinates covered by the graphic object. IDL maintains and returns this property in double-precision floating-point.\n\n| **Property Type** | Floating-point vector |              |                    |\n| ----------------- | --------------------- | ------------ | ------------------ |\n| **Name String**   | _not displayed_       |              |                    |\n| **Get:** Yes      | **Set:** No           | **Init:** No | **Registered:** No |',
        },
      },
      {
        label: 'ycoord_conv',
        insertText: 'ycoord_conv',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A floating-point vector, \\[_s_0, _s_1\\], of scaling factors used to convert _Y_ coordinates from data units to normalized units. The formula for the conversion is as follows:\n\nNormalized_Y_ \\= _s_0 \\+ _s_1 \\* Data_Y_\n\nRecommended values are:\n\n\\[(-_Ymin_)/(_Ymax_\\-_Ymin_), 1/(_Ymax_\\-_Ymin_)\\]\n\nThe default is \\[0.0, 1.0\\]. IDL converts, maintains, and returns this data as double-precision floating-point.\n\n| **Property Type** | Floating-point vector |               |                    |\n| ----------------- | --------------------- | ------------- | ------------------ |\n| **Name String**   | _not displayed_       |               |                    |\n| **Get:** Yes      | **Set:** Yes          | **Init:** Yes | **Registered:** No |',
        },
      },
      {
        label: 'yrange',
        insertText: 'yrange',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A two-element floating-point vector of the form \\[_ymin_, _ymax_\\] that specifies the range of _y_ data coordinates covered by the graphic object. IDL maintains and returns this property in double-precision floating-point.\n\n| **Property Type** | Floating-point vector |              |                    |\n| ----------------- | --------------------- | ------------ | ------------------ |\n| **Name String**   | _not displayed_       |              |                    |\n| **Get:** Yes      | **Set:** No           | **Init:** No | **Registered:** No |',
        },
      },
      {
        label: 'zcoord_conv',
        insertText: 'zcoord_conv',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A floating-point vector, \\[_s_0, _s_1\\], of scaling factors used to convert _Z_ coordinates from data units to normalized units. The formula for the conversion is as follows:\n\nNormalized_Z_ \\= _s_0 \\+ _s_1 \\* Data_Z_\n\nRecommended values are:\n\n\\[(-_Zmin_)/(_Zmax_\\-_Zmin_), 1/(_Zmax_\\-_Zmin_)\\]\n\nThe default is \\[0.0, 1.0\\]. IDL converts, maintains, and returns this data as double-precision floating-point.\n\n| **Property Type** | Floating-point vector |               |                    |\n| ----------------- | --------------------- | ------------- | ------------------ |\n| **Name String**   | _not displayed_       |               |                    |\n| **Get:** Yes      | **Set:** Yes          | **Init:** Yes | **Registered:** No |',
        },
      },
      {
        label: 'zero_opacity_skip',
        insertText: 'zero_opacity_skip',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDLgrSurface',
        documentation: {
          kind: 'markdown',
          value:
            'A Boolean value that determines whether to gain finer control over the rendering of textured surface pixels (texels) by setting an opacity of 0 in the texture map. Texels with zero opacity do not affect the color of a screen pixel since they have no opacity. If this property is set to 1, any texels are “skipped” and not rendered at all. If this property is set to zero, the Z-buffer is updated for these pixels and the display image is not affected as noted above. By updating the Z-buffer without updating the display image, the surface can be used as a _clipping_ surface for other graphics primitives drawn after the current graphics object. The default value for this property is 1.\n\n**Note:** This property has no effect if no texture map is used or if the texture map in use does not contain an opacity channel.\n\n| **Property Type** | Boolean           |               |                     |\n| ----------------- | ----------------- | ------------- | ------------------- |\n| **Name String**   | Skip zero opacity |               |                     |\n| **Get:** Yes      | **Set:** Yes      | **Init:** Yes | **Registered:** Yes |',
        },
      },
    ];

    // verify results
    expect(expectedFound_0).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_0
        )
      ).slice(0, 50)
    );
  });

  it(`[auto generated] for static properties`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // specify filepath
    const filepath = GetExtensionPath('idl/test/auto-complete/examples.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 26, character: 15 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      {
        label: 'api_version',
        insertText: 'api_version',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVI',
        documentation: {
          kind: 'markdown',
          value:
            'This property retrieves a semantic version number for the ENVI API. This version number is also displayed in the **Help > About** dialog in the ENVI application. Semantic versioning provides a quick way to extract information about a new software release using a convention of _X_._Y_._Z_, where:\n\n* _X_ represents the major version. An incremented value indicates that API additions and updates are _not_ backward-compatible.\n* _Y_ represents the minor version. An incremented value indicates that API additions and updates are backward-compatible.\n* _Z_ represents the patch number. An incremented value indicates bug fixes that do not affect the API.\n\nFor example, suppose that your current ENVI API version is 3.1\\. If version 3.1.125 is available, you can tell that this version only contains bug fixes and you are safe to upgrade without breaking any API scripts. However, if version 4.0 becomes available, upgrading to the new version may break your API scripts because the new API is not backward-compatible.\n\n**Note:** The API version number is the same value displayed in the `schema` key in [ENVITask templates](https://www.nv5geospatialsoftware.com/docs/TaskTemplatesMain.html).',
        },
      },
      {
        label: 'current',
        insertText: 'current',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVI',
        documentation: {
          kind: 'markdown',
          value:
            'Set this keyword to get a reference to a currently running instance of ENVI. If this keyword is set and ENVI is not already running, the application will not be launched..',
        },
      },
      {
        label: 'data',
        insertText: 'data',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVI',
        documentation: {
          kind: 'markdown',
          value:
            'This property retrieves a reference to the [ENVIDataCollection](https://www.nv5geospatialsoftware.com/docs/ENVIDataCollection.html) object, which is a collection of data objects currently available in the Data Manager.',
        },
      },
      {
        label: 'error',
        insertText: 'error',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVI',
        documentation: {
          kind: 'markdown',
          value:
            "Set this keyword to a named variable that will contain any error message issued during execution of this routine. If no error occurs, the ERROR variable will be set to a null string (''). If an error occurs and the routine is a function, then the function result will be undefined.\n\nWhen this keyword is not set and an error occurs, ENVI returns to the caller and execution halts. In this case, the error message is contained within !ERROR_STATE and can be caught using IDL's CATCH routine. See IDL Help for more information on !ERROR_STATE and CATCH.",
        },
      },
      {
        label: 'headless',
        insertText: 'headless',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVI',
        documentation: {
          kind: 'markdown',
          value:
            'Set this property to 1 to start the application without creating the user interface. The WIDGET\\_ID property is 0 when running ENVI in headless mode.',
        },
      },
      {
        label: 'language',
        insertText: 'language',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVI',
        documentation: {
          kind: 'markdown',
          value:
            "**Note:** Windows only\n\nSet this property to a string specifying the name of the language to use for the user interface. This property affects components such as menus, buttons and messages. You can also specify the three-character [ISO 639-3 language code](https://iso639-3.sil.org/code%5Ftables/639/data) (for example, jpn for Japanese).\n\nThe following example shows how to set the interface language to Japanese:\n\n```idl\n  e = envi(language = 'jpn')\n```",
        },
      },
      {
        label: 'layout',
        insertText: 'layout',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVI',
        documentation: {
          kind: 'markdown',
          value:
            'Set this property to a two-element array specifying the layout of [ENVIViews](https://www.nv5geospatialsoftware.com/docs/enviView.html). The number of views is limited to 16\\. The options are as follows:\n\n* \\[1, 1\\]: One view (default)\n* \\[2, 1\\]: Two vertical views\n* \\[1, 2\\]: Two horizontal views\n* \\[3, 1\\]: Three vertical views\n* \\[1, 3\\]: Three horizontal views\n* \\[4,1\\]: Four vertical views\n* \\[1, 4\\]: Four horizontal views\n* \\[2, 2\\]: Four views, 2 x 2 layout\n* \\[3, 3\\]: Nine views, 3 x 3 layout\n* \\[4, 4\\]: Sixteen views, 4 x 4 layout\n\nFor other layout options (for example, three views) that were created using [ENVI::CreateView](https://www.nv5geospatialsoftware.com/docs/ENVI__CreateView.html), retrieving this property returns the scalar 0\\. If LAYOUT is set to an invalid value, it defaults to one view.',
        },
      },
      {
        label: 'log_file',
        insertText: 'log_file',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVI',
        documentation: {
          kind: 'markdown',
          value:
            "Set this property to a string specifying a full path and filename for a log file that will contain any warnings or errors issued during execution of ENVI routines. Set this property to a null string (`''`) to turn off error logging. To add custom messages to the default content, use the [ENVI::LogMessage](https://www.nv5geospatialsoftware.com/docs/ENVI__LogMessage.html) method.\n\nErrors that occur through user interaction of ENVI (non-programmatically) are not written to this log file but are handled by the **[Enable System Logging](https://www.nv5geospatialsoftware.com/docs/Preferences.html#EnableSystemLogging)** preference.\n\nSee [Manage Errors](https://www.nv5geospatialsoftware.com/docs/ErrorHandling.html) for more information on error handling in ENVI programming.",
        },
      },
      {
        label: 'preferences',
        insertText: 'preferences',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVI',
        documentation: {
          kind: 'markdown',
          value:
            'This property retrieves the [ENVIPreferences](https://www.nv5geospatialsoftware.com/docs/ENVIPreferences.html) class associated with the ENVI application. At application start-up, set the PREFERENCES keyword to the URI of a JSON file in which ENVI will load and save preferences.',
        },
      },
      {
        label: 'root_dir',
        insertText: 'root_dir',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVI',
        documentation: {
          kind: 'markdown',
          value: 'A string specifying the ENVI installation path.',
        },
      },
      {
        label: 'task_names',
        insertText: 'task_names',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVI',
        documentation: {
          kind: 'markdown',
          value:
            'A string array with the names of all available [ENVITasks](https://www.nv5geospatialsoftware.com/docs/ENVITask.html).',
        },
      },
      {
        label: 'ui',
        insertText: 'ui',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVI',
        documentation: {
          kind: 'markdown',
          value:
            'This property retrieves a reference to the [ENVIUI](https://www.nv5geospatialsoftware.com/docs/ENVIUI.html) object.',
        },
      },
      {
        label: 'uvalue',
        insertText: 'uvalue',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVI',
        documentation: {
          kind: 'markdown',
          value: 'Set this property to an IDL variable of any data type.',
        },
      },
      {
        label: 'version',
        insertText: 'version',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVI',
        documentation: {
          kind: 'markdown',
          value:
            'This property retrieves the current ENVI version number. This version number is for marketing purposes and is different from the API version.',
        },
      },
      {
        label: 'widget_id',
        insertText: 'widget_id',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVI',
        documentation: {
          kind: 'markdown',
          value:
            'The widget ID for the top-level base of the ENVI application. This widget ID may be used as both the group leader to IDL routines like WIDGET\\_BASE and the dialog parent to the IDL DIALOG\\_\\* routines. (See the DIALOG\\_PARENT keyword description in the DIALOG\\_MESSAGE function in IDL Help, for an example.) If ENVI is started without a user interface (using the HEADLESS property), the WIDGET\\_ID will be 0.',
        },
      },
      {
        label: 'root_direction',
        insertText: 'root_direction',
        kind: 5,
        sortText: '02',
        detail: 'Property of ENVI',
        documentation: '',
      },
      {
        label: 'ENVI::createRaster()',
        insertText: 'createRaster()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVI::createRasterMetadata()',
        insertText: 'createRasterMetadata()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVI::createRasterSpatialRef()',
        insertText: 'createRasterSpatialRef()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVI::createView()',
        insertText: 'createView()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVI::getBroadcastChannel()',
        insertText: 'getBroadcastChannel()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVI::getOpenData()',
        insertText: 'getOpenData()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVI::getPreference()',
        insertText: 'getPreference()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVI::getTemporaryFilename()',
        insertText: 'getTemporaryFilename()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVI::getView()',
        insertText: 'getView()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVI::openAnnotation()',
        insertText: 'openAnnotation()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVI::openPointCloud()',
        insertText: 'openPointCloud()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVI::openRaster()',
        insertText: 'openRaster()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVI::openROI()',
        insertText: 'openROI()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVI::openVector()',
        insertText: 'openVector()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'ENVI::queryPointCloud()',
        insertText: 'queryPointCloud()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
    ];

    // verify results
    expect(expectedFound_0).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_0
        )
      ).slice(0, 50)
    );
  });
});
