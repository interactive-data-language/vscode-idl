import { CleanIDLOutput } from '@idl/idl/idl-interaction-manager';
import { IDL_MCP_LOG } from '@idl/logger';
import {
  MCPTool_AddDataToMap,
  MCPToolParams,
  MCPToolResponse,
} from '@idl/types/mcp';
import { IDLNotebookEmbeddedItem, IDLNotebookMap } from '@idl/types/notebooks';
import { IDL_DEBUG_ADAPTER, StartIDL } from '@idl/vscode/debug';
import { IDL_LOGGER } from '@idl/vscode/logger';

/**
 * Builds the IDL code to embed and export map data.
 *
 * NOTE: This is placeholder code — the exact IDL API calls will need to be
 * refined once the pipes are in place and you can test interactively.
 *
 * The code:
 * 1. Calls IDLNotebook.Reset to start clean
 * 2. Adds the requested layer to the IDLNotebook map
 * 3. Calls IDLNotebook.Export and prints the JSON to stdout
 */
function buildIDLCode(params: MCPToolParams<MCPTool_AddDataToMap>): string {
  const { layerType, uri, geojson, layerName } = params;

  const nameExpr = layerName ? `name='${layerName.replace(/'/g, "''")}'` : '';

  switch (layerType) {
    case 'geojson': {
      // Placeholder: write inline GeoJSON to a temp file and add as vector layer
      const safeGeojson = (geojson ?? '{}')
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "''");
      return [
        `compile_opt idl2`,
        `IDLNotebook.Reset`,
        `!null = IDLNotebook.Map(geojson='${safeGeojson}'${nameExpr ? ', ' + nameExpr : ''})`,
        `print, IDLNotebook.Export`,
      ].join(' & ');
    }

    case 'raster': {
      // Placeholder: open raster with ENVI and add as a map image layer
      const safeUri = (uri ?? '').replace(/'/g, "''");
      return [
        `compile_opt idl2`,
        `IDLNotebook.Reset`,
        `raster = e.OpenRaster('${safeUri}')`,
        `nb_map = IDLNotebook.CreateMap()`,
        `nb_map.AddLayer, raster${nameExpr ? ', ' + nameExpr : ''}`,
        `nb_map.Commit`,
        `print, IDLNotebook.Export`,
      ].join(' & ');
    }

    case 'vector': {
      // Placeholder: open vector with ENVI and add as a map vector layer
      const safeUri = (uri ?? '').replace(/'/g, "''");
      return [
        `compile_opt idl2`,
        `IDLNotebook.Reset`,
        `vector = e.OpenVector('${safeUri}')`,
        `nb_map = IDLNotebook.CreateMap()`,
        `nb_map.AddLayer, vector${nameExpr ? ', ' + nameExpr : ''}`,
        `nb_map.Commit`,
        `print, IDLNotebook.Export`,
      ].join(' & ');
    }

    default:
      return `print, '{}'`;
  }
}

/**
 * VSCode-side handler for the add-data-to-map MCP tool.
 *
 * Runs IDL code that constructs a map embed, calls IDLNotebook.Export,
 * and returns the parsed IDLNotebookEmbeddedItem<IDLNotebookMap>.
 */
export async function RunMCPTool_AddDataToMap(
  id: string,
  params: MCPToolParams<MCPTool_AddDataToMap>,
): Promise<MCPToolResponse<MCPTool_AddDataToMap>> {
  // Ensure IDL is running
  const started = await StartIDL(false);
  if (!started.started) {
    return { success: false, err: started.reason };
  }

  const code = buildIDLCode(params);

  try {
    // Execute the IDL code that builds and exports the map
    const raw = await IDL_DEBUG_ADAPTER.evaluate(code, {
      echo: false,
      silent: true,
    });

    const cleaned = CleanIDLOutput(raw);

    // The export should print JSON containing IDLNotebookEmbeddedItems
    // We expect the first item to be the map embed
    const exported = JSON.parse(
      cleaned,
    ) as IDLNotebookEmbeddedItem<IDLNotebookMap>[];

    const mapEmbed = exported.find((item) => item.type === 'idlnotebookmap') as
      | IDLNotebookEmbeddedItem<IDLNotebookMap>
      | undefined;

    if (!mapEmbed) {
      return {
        success: false,
        err: 'IDLNotebook.Export did not return a map embed. Check the IDL code and layer types.',
      };
    }

    return { success: true, mapData: mapEmbed };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    IDL_LOGGER.log({
      type: 'error',
      log: IDL_MCP_LOG,
      content: [`add-data-to-map failed`, err],
    });

    return { success: false, err: message };
  }
}
