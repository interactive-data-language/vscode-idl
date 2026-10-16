import { GetExtensionPath } from '@idl/idl/files';
import {
  DEFAULT_AGENT_SERVER_CONFIG,
  IAgentServerConfig,
  MigrateAgentServerConfig,
} from '@idl/types/agents';
import { copy } from 'fast-copy';
import { existsSync, readFileSync, writeFileSync } from 'fs';

/**
 * Saves our agent server config to disk formatted as 2-space indented JSON
 */
export function SaveConfig(
  config: IAgentServerConfig,
  filePath?: string,
): void {
  const file = filePath ?? GetExtensionPath('desktop-agents.config.json');
  writeFileSync(file, JSON.stringify(config, null, 2) + '\n', 'utf-8');
}

/**
 * Loads our agent server config from the optional "desktop-agents.config.json"
 * file on disk.
 *
 * If the file does not exist, returns a copy of DEFAULT_AGENT_SERVER_CONFIG without
 * creating a file on disk.
 *
 * If the file exists, parses the JSON, applies any necessary schema migrations and
 * default-filling, and if updates were made, saves the migrated config back out to disk.
 */
export async function LoadConfig(
  filePath?: string,
): Promise<IAgentServerConfig> {
  let file: string | undefined;

  try {
    file = filePath ?? GetExtensionPath('desktop-agents.config.json');
  } catch (err: any) {
    // If extension path cannot be resolved, return default config
    return copy(DEFAULT_AGENT_SERVER_CONFIG);
  }

  // If file does not exist, fall back to default config without creating file
  if (!existsSync(file)) {
    return copy(DEFAULT_AGENT_SERVER_CONFIG);
  }

  let raw: any;
  try {
    console.log('[Config] Loading config from file on disk');
    raw = JSON.parse(readFileSync(file, 'utf-8'));
  } catch (err: any) {
    console.log('[Config] Problem loading or parsing config from file:', err);
    return copy(DEFAULT_AGENT_SERVER_CONFIG);
  }

  const { config, hasChanges } = MigrateAgentServerConfig(raw);

  if (hasChanges) {
    console.log(
      `[Config] Migrated config to version ${config.version}, saving updates to disk`,
    );
    try {
      SaveConfig(config, file);
    } catch (writeErr: any) {
      console.log('[Config] Problem saving migrated config to disk:', writeErr);
    }
  }

  return config;
}
