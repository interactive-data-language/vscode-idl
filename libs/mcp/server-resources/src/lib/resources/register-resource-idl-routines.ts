import { MCP_SERVER } from '@idl/mcp/server';
import { TrackServerResource } from '@idl/mcp/server-tools';
import { IDL_LOGGER } from '@idl/vscode/logger';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Interface for IDL routine metadata from global.json
 */
interface IDLRoutineMetadata {
  meta: {
    args: Record<string, any>;
    className?: string;
    display: string;
    docs?: string;
    docsLookup: Record<string, any>;
    kws: Record<string, any>;
    method?: string;
    private: boolean;
    source: string;
    struct: any[];
  };
  name: string;
  pos: [number, number, number];
  type: string;
}

/**
 * Formats a routine into a comprehensive markdown documentation string
 */
function formatRoutineDoc(routine: IDLRoutineMetadata): string {
  const { meta } = routine;
  let doc = `# ${meta.display}\n\n`;

  // Add type indicator
  const typeMap: Record<string, string> = {
    f: 'Function',
    p: 'Procedure',
    fm: 'Function Method',
    pm: 'Procedure Method',
    sv: 'System Variable',
  };
  const typeLabel = typeMap[routine.type] || routine.type.toUpperCase();
  doc += `**Type**: ${typeLabel}\n`;
  doc += `**Source**: ${meta.source}\n\n`;

  // Add class/method info if applicable
  if (meta.className) {
    doc += `**Class**: ${meta.className}\n`;
  }
  if (meta.method) {
    doc += `**Method**: ${meta.method}\n`;
  }
  if (meta.className || meta.method) {
    doc += '\n';
  }

  // Add main documentation
  if (meta.docs) {
    doc += meta.docs + '\n\n';
  }

  // Add arguments if present
  const argKeys = Object.keys(meta.args || {});
  if (argKeys.length > 0) {
    doc += '## Arguments\n\n';
    for (const argKey of argKeys) {
      const arg = meta.args[argKey];
      doc += `### ${arg.display || argKey}\n\n`;
      if (arg.docs) {
        doc += arg.docs + '\n\n';
      }
      if (arg.type && arg.type.length > 0) {
        const types = arg.type.map((t: any) => t.display || t.name).join(', ');
        doc += `**Type**: ${types}\n`;
      }
      if (arg.direction) {
        doc += `**Direction**: ${arg.direction}\n`;
      }
      doc += '\n';
    }
  }

  // Formulate Keywords section
  const kwKeys = Object.keys(meta.kws || {});
  if (kwKeys.length > 0) {
    doc += '## Keywords\n\n';
    
    for (const kwKey of kwKeys) {
      const kw = meta.kws[kwKey];
      doc += `### ${kw.display || kwKey}\n\n`;
      
      if (kw.docs) {
        doc += kw.docs + '\n\n';
      }

      if ((kw.type) && kw.type.length > 0) {
        const types = kw.type.map((t: any) => t.display || t.name).join(', ');
        doc += `**Type**: ${types}\n`;
      }

      // Direction is the direction of the data flow. If the keyword is a input or output.
      if (kw.direction) {
        doc += `**Direction**: ${kw.direction}\n`;
      }
      doc += '\n';
    }
  }

  return doc;
}

/**
 * Register IDL core routines as MCP resources
 */
export function RegisterResourceIDLRoutines(extensionPath: string) {
  // try catch to handle duplicate registrations.
  try {

    // We take all routines from global.json
    // So load it.
    const globalJsonPath = join(extensionPath, 'idl', 'routines', 'global.json');

    // global.json is a special type of JSON that is 
    const globalData = JSON.parse(
      readFileSync(globalJsonPath, 'utf-8')
    ) as Record<string, IDLRoutineMetadata>;

    // Get all routine entries
    const routineCount = Object.keys(globalData).length;
    IDL_LOGGER.log({
      type: 'info',
      content: `[MCP Resources] Found ${routineCount} IDL routines to register`,
    });
    console.log(
      `[IDL MCP] Registering ${routineCount} IDL routines as MCP resources...`
    );

  // Track resource for summary
  TrackServerResource(
    'idl-routines-index',
    'Index of all IDL core routines with comprehensive documentation',
    `# IDL Core Routines\n\n` +
    `This index gives you quick access to ${routineCount} IDL core routines.\n\n` +
    `Each routine has its own dedicated resource using the URI pattern:\n` +
    `docs://idl-routine-{routine-name-lowercase}\n\n` +
    `## Routine Types\n\n` +
    `- **Functions (f)**: Return a value\n` +
    `- **Procedures (p)**: Perform an action without returning a value\n` +
    `- **Function Methods (fm)**: Object-oriented functions\n` +
    `- **Procedure Methods (pm)**: Object-oriented procedures\n` +
    `- **System Variables (sv)**: Built-in IDL system variables\n\n` +
    `## Example URIs\n\n` +
    `- \`docs://idl-routine-print\` - PRINT procedure\n` +
    `- \`docs://idl-routine-plot\` - PLOT procedure\n` +
    `- \`docs://idl-routine-read_csv\` - READ_CSV function\n` +
    `- \`docs://idl-routine-idlgrwindow::init\` - IDLgrWindow::Init method\n\n` +
    `## What you get for each routine\n\n` +
    `- Syntax and basic usage\n` +
    `- Arguments and expected types\n` +
    `- Keywords and options\n` +
    `- Examples and practical best practices\n\n` +
    `Use this index as a jumping-off point whenever you need details on how a specific IDL routine behaves.` +
    `Including:\n` +
    `- Syntax and usage\n` +
    `- Arguments and their types\n` +
    `- Keywords and options\n` +
    `- Examples and best practices`
  );

    // Register the index resource itself
    try {
      MCP_SERVER.resource(
        'idl-routines-index',
        'docs://idl-routines-index',
        async () => {
          return {
            contents: [
              {
                uri: 'docs://idl-routines-index',
                mimeType: 'text/markdown',
                text:
                  `# IDL Core Routines Index\n\n` +
                  `Total routines: ${routineCount}\n\n` +
                  `## Quick Access\n\n` +
                  `To get documentation for a specific routine, use the resource URI:\n` +
                  `\`docs://idl-routine-{name}\`\n\n` +
                  `Where {name} is the routine name in lowercase with special characters replaced:\n` +
                  `- Replace \`:\` with \`-\`\n` +
                  `- Replace \`_\` with \`-\`\n` +
                  `- Convert to lowercase\n\n` +
                  `Example: \`IDLgrWindow::Init\` becomes \`docs://idl-routine-idlgrwindow--init\``,
              },
            ],
          };
        }
      );
    } catch (err) {
      // Skip if already registered
    }

    // Now we fill it
    // register each routine individually.
    for (const key in globalData) {
      const routine = globalData[key];

      // Grab the routine name and clean it. Maintain cross platform.
      const routineName = routine.meta.display.toLowerCase();
      const resourceName = `idl-routine-${routineName
        .replace(/::/g, '--')
        .replace(/[^a-z0-9-]/g, '-')}`;

      // Then grab its URI. 
      const resourceUri = `docs://${resourceName}`;

      // Format the individual routine/function.
      const docText = formatRoutineDoc(routine);

      // Track resource internally.
      TrackServerResource(
        resourceName,
        `IDL ${routine.type.toUpperCase()}: ${routine.meta.display}`,
        docText
      );

      // Set up the resource to be used by the MCP server.
      try {
        MCP_SERVER.resource(resourceName, resourceUri, async () => {
          return {
            contents: [
              {
                uri: resourceUri,
                mimeType: 'text/markdown',
                text: docText,
              },
            ],
          };
        });
      } catch (err) {
        // Skip if already registered
      }
    }

  } catch (error) {
    IDL_LOGGER.log({
      content: [
        '[MCP Resources] Error registering IDL routine resources:',
        error,
      ],
      type: 'error',
      alert: error,
    });
  }
}
