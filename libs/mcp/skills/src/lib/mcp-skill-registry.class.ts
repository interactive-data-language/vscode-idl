import { IDL_MCP_LOG, type LogManager } from '@idl/logger';
import {
  type AnalyticsRepositoryRegistry,
  LatestPackages,
  PackageSource,
} from '@idl/mcp/analytics-repository';
import { RegistryLocationHelpers, RuleBasedFilter } from '@idl/mcp/shared';
import type { IAnalyticRepository_ServerPackage } from '@idl/types/analytics-repository';
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { basename, join } from 'path';

import { ParseSkillFrontmatter } from './helpers/parse-skill-frontmatter';
import type {
  IMCPSkillRegistryOptions,
  ISkill,
} from './mcp-skill-registry.interface';

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
  private logger?: LogManager;

  /**
   * Optional analytics repositories that we pull skills from
   */
  private repository?: AnalyticsRepositoryRegistry;

  /**
   * Lookup of skills
   *
   * Key is the lower-case name, value is all information we need for skills
   */
  private skills: { [key: string]: ISkill } = {};

  constructor(options: IMCPSkillRegistryOptions = {}) {
    const { repository, filters, logger } = options;
    this.logger = logger;
    this.repository = repository;
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
      'agent_skills',
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
   * Refreshes skills from analytics repositories (if configured) and returns
   * the descriptions for all registered skills.
   *
   * If we can't reach the repositories, we log and keep the current skills.
   */
  async list(): Promise<{ [key: string]: string }> {
    if (this.repository) {
      try {
        this.replaceRepositorySkills(
          await this.repository.getAgentSkillPackages(),
        );
      } catch (err) {
        this.logger?.log({
          log: IDL_MCP_LOG,
          type: 'error',
          content: [
            'Unable to refresh skills from analytics repositories',
            err,
          ],
        });
      }
    }

    return this.skillDescriptions();
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
   * Sets the logger used to report problems, like reaching analytics repositories
   */
  setLogger(logger?: LogManager) {
    this.logger = logger;
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

  /**
   * Removes all skills that came from a repository and replaces them with
   * the latest version of each package.
   *
   * Skills that come from local files or memory always win name conflicts
   */
  private replaceRepositorySkills(
    packages: IAnalyticRepository_ServerPackage[],
  ) {
    // remove everything we got from a repository
    for (const key of Object.keys(this.skills)) {
      if (this.skills[key].location.type === 'repository') {
        delete this.skills[key];
      }
    }

    for (const item of LatestPackages(packages)) {
      const skills = item.package.metadata.agent_skills || {};

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
              url: PackageSource(item),
              version: item.package.version,
            },
          },
        });
      }
    }
  }
}
