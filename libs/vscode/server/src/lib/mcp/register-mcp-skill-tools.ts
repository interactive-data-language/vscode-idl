import { GetExtensionPath } from '@idl/idl/files';
import { IDL_LSP_LOG } from '@idl/logger';
import { MCPServer } from '@idl/mcp/server';
import {
  RegisterMCPTool_GetSkill,
  RegisterMCPTool_ListSkills,
} from '@idl/mcp/server-tools';
import { MCPSkillRegistry } from '@idl/mcp/skills';

/**
 * Registers MCP Skill tools
 */
export function RegisterMCPSkillTools(server: MCPServer) {
  server.logManager.log({
    log: IDL_LSP_LOG,
    type: 'info',
    content: 'Registering MCP skill tools',
  });

  /** Create skill registry */
  const registry = new MCPSkillRegistry(server.logManager);

  // dynamically load skills from resources folder
  const skillsDir = GetExtensionPath('resources/agents/skills');
  registry.loadSkillsFromFolder(skillsDir);

  // register tools
  RegisterMCPTool_GetSkill(server, registry);
  RegisterMCPTool_ListSkills(server, registry);

  // emit MCP event that tools have changed
  server.sendToolListChanged();
}
