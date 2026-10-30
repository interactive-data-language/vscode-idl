import { IDL_MCP_LOG, type LogManager } from '@idl/logger';
import { LatestPackages } from '@idl/mcp/analytics-repository';
import {
  type IRuleBasedFilters,
  RegistryLocationHelpers,
  RuleBasedFilter,
} from '@idl/mcp/shared';
import type { IAnalyticRepository_ServerPackage } from '@idl/types/analytics-repository';
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { basename, join } from 'path';

import { ParseSkillFrontmatter } from './helpers/parse-skill-frontmatter';
import type { ISkill } from './mcp-skill-registry.interface';

/**
 * Standard skill file name per agentskills.io
 */
export const SKILL_FILE_NAME = 'SKILL.md';

/**
 * Helper class that tracks and manages access to skills
 */
export class MCPSkillRegistry {
  /** Object class that handles filtering items from the task registry */
  filters = new RuleBasedFilter();

  /**
   * Logger
   */
  logger?: LogManager;

  /**
   * Lookup of skills
   *
   * Key is the lower-case name, value is all information we need for skills
   */
  private skills: { [key: string]: ISkill } = {};

  constructor(logger?: LogManager, filters?: Partial<IRuleBasedFilters>) {
    this.logger = logger;
    if (filters !== undefined) {
      this.filters.updateFilters(filters);
    }
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
   * Returns empty string if no matching skill is found or we can't retrieve it.
   */
  async getSkill(name: string): Promise<string> {
    const lc = name.toLowerCase();

    if (!(lc in this.skills)) {
      return '';
    }

    const rawContent = RegistryLocationHelpers.retrieveContent(
      this.skills[lc].location,
      'skills',
      this.skills[lc].name,
    );

    // Return the body content (frontmatter stripped if present)
    return rawContent.startsWith('---')
      ? ParseSkillFrontmatter(rawContent, name).content
      : rawContent;
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
   * Removes all skills that came from a repository and replaces them with
   * the latest version of each package.
   *
   * Skills that come from local files or memory always win name conflicts
   */
  replaceRepositorySkills(packages: IAnalyticRepository_ServerPackage[]) {
    // remove everything we got from a repository
    for (const key of Object.keys(this.skills)) {
      if (this.skills[key].location.type === 'repository') {
        delete this.skills[key];
      }
    }

    for (const item of LatestPackages(packages)) {
      const skills = item.package.metadata.skills ?? {};

      for (const name of Object.keys(skills)) {
        // local skills win
        if (name.toLowerCase() in this.skills) {
          continue;
        }

        this.addSkill({
          name,
          description: ParseSkillFrontmatter(skills[name], name).description,
          location: {
            type: 'repository',
            meta: {
              package: item.package,
              url: item.server.url,
            },
          },
        });
      }
    }
  }

  /**
   * Returns descriptions for all registered skills
   */
  skillDescriptions(): { [key: string]: string } {
    const descriptions: { [key: string]: string } = {};
    const skillList = Object.values(this.skills);

    for (const skill of skillList) {
      if (!this.filters.isAllowedByFilters(skill.name)) {
        continue;
      }
      descriptions[skill.name] = skill.description;
    }

    return descriptions;
  }
}
