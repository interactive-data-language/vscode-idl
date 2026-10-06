import * as YAML from 'yaml';

/**
 * Parsed result containing extracted content and frontmatter metadata for a skill.
 */
export interface IParsedSkill {
  /** Skill content */
  content: string;

  /** Description of the skill */
  description: string;

  /** Name of the skill */
  name: string;
}

/**
 * Regex matching YAML frontmatter blocks delimited by `---` at the start of a document.
 */
const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;

/**
 * Parses agentskills.io YAML frontmatter header from markdown skill text.
 * Strips the frontmatter block from the body content and returns normalized metadata.
 */
export function ParseSkillFrontmatter(
  rawContent: string,
  defaultName: string,
): IParsedSkill {
  const match = rawContent.match(FRONTMATTER_REGEX);

  // default metadata
  const skill: IParsedSkill = {
    name: defaultName,
    description: '',
    content: '',
  };

  // if no frontmatter, return rawContent
  if (!match) {
    return skill;
  }

  // attempt to parse and replace values in metadata
  try {
    const parsed = YAML.parse(match[1]);
    if (parsed && typeof parsed === 'object') {
      Object.assign(skill, parsed);
    }
  } catch {
    // If parsing fails, fall back to default metadata
  }

  return {
    ...skill,
    content: rawContent.substring(match[0].length),
  };
}
