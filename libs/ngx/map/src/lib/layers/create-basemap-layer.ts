import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer } from '@deck.gl/layers';

/**
 * Creates the ESRI basemap tile layer, switching between dark and light
 * variants based on the current theme
 */
export function CreateBaseMapLayer(darkTheme: boolean): TileLayer<any> {
  return new TileLayer({
    data: darkTheme
      ? `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}.png`
      : `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}.png`,

    minZoom: 0,
    maxZoom: 16,
    tileSize: 256,

    renderSubLayers: (props) => {
      const { boundingBox } = props.tile;

      return new BitmapLayer(props, {
        data: undefined,
        image: props.data,
        bounds: [
          boundingBox[0][0],
          boundingBox[0][1],
          boundingBox[1][0],
          boundingBox[1][1],
        ],
      });
    },
  });
}
