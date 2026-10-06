import { IDL_MCP_LOG, LogManager } from '@idl/logger';
import { RegistryLocationHelpers } from '@idl/mcp/shared';
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { basename, join } from 'path';

import { ParseSkillFrontmatter } from './helpers/parse-skill-frontmatter';
import { ISkill } from './mcp-skill-registry.interface';

/**
 * Standard skill file name per agentskills.io
 */
export const SKILL_FILE_NAME = 'SKILL.md';

/**
 * Helper class that tracks and manages access to skills
 */
export class MCPSkillRegistry {
  /**
   * Logger
   */
  private logger?: LogManager;

  /**
   * Lookup of skills
   *
   * Key is the lower-case name, value is all information we need for skills
   */
  private skills: { [key: string]: ISkill } = {};

  constructor(logger?: LogManager) {
    this.logger = logger;
  }

  /**
   * Adds a skill to the registry
   */
  addSkill(info: ISkill) {
    this.skills[info.name.toLowerCase()] = info;
  }

  /**
   * Adds a skill from a SKILL.md file on disk
   */
  addSkillFromFile(filePath: string, defaultName?: string) {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const fallbackName = defaultName || basename(join(filePath, '..'));
      const parsed = ParseSkillFrontmatter(content, fallbackName);

      this.addSkill({
        name: parsed.name,
        description: parsed.description,
        location: {
          type: 'file',
          meta: {
            path: filePath,
          },
        },
      });
    } catch (err) {
      this.logger?.log({
        log: IDL_MCP_LOG,
        type: 'error',
        content: [`Failed to load skill from file: ${filePath}`, err],
      });
    }
  }

  /**
   * Gets a skill's markdown content by name.
   *
   * Returns empty string if no matching skill is found.
   */
  getSkill(name: string): string {
    const lc = name.toLowerCase();

    if (!(lc in this.skills)) {
      return '';
    }

    const rawContent = RegistryLocationHelpers.retrieveContent(
      this.skills[lc].location,
    );

    // Return the body content (frontmatter stripped if present)
    const parsed = ParseSkillFrontmatter(rawContent, name);
    return parsed.content;
  }

  /**
   * Checks if a skill exists in the registry
   */
  hasSkill(name: string): boolean {
    return name.toLowerCase() in this.skills;
  }

  /**
   * Loads skills from a folder by scanning subdirectories for SKILL.md files
   * (following the agentskills.io specification).
   */
  loadSkillsFromFolder(folderPath: string) {
    if (!existsSync(folderPath)) {
      return;
    }

    try {
      const entries = readdirSync(folderPath);

      for (const entry of entries) {
        const entryPath = join(folderPath, entry);
        const stat = statSync(entryPath);

        if (stat.isDirectory()) {
          const skillFilePath = join(entryPath, SKILL_FILE_NAME);
          if (existsSync(skillFilePath)) {
            this.addSkillFromFile(skillFilePath, entry);
          }
        }
      }
    } catch (err) {
      this.logger?.log({
        log: IDL_MCP_LOG,
        type: 'error',
        content: [`Failed to load skills from folder: ${folderPath}`, err],
      });
    }
  }

  /**
   * Returns descriptions for all registered skills
   */
  skillDescriptions(): { [key: string]: string } {
    const descriptions: { [key: string]: string } = {};
    const skillList = Object.values(this.skills);

    for (const skill of skillList) {
      descriptions[skill.name] = skill.description;
    }

    return descriptions;
  }
}
