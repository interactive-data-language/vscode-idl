import { SyntaxProblems } from '@idl/types/problem-codes';

/**
 * Maps a fully-qualified path to a relative path for a specific
 * workspace folder (i.e. just base path)
 */
export function SanitizePath(path: string, workspace: string): string {
  const pos = path.replace(/\\/gim, '/').indexOf(workspace);
  return path.substring(pos).replace(/\\/gim, '/');
}

/**
 * Cleans up the representation of problems for a file to be nice looking and
 * computer independent
 */
export function SanitizeProblems(problems: SyntaxProblems, workspace: string) {
  return problems.map((problem) => {
    problem.file = SanitizePath(problem.file, workspace);
    return problem;
  });
}

/**
 * Cleans up the representation of problems for a file to be nice looking and
 * computer independent
 */
export function SanitizeAllProblems(
  problems: { [key: string]: SyntaxProblems },
  workspace: string
): { [key: string]: SyntaxProblems } {
  /** initialize output */
  const out: { [key: string]: SyntaxProblems } = {};

  // set all of our problem files
  const problemFiles = Object.keys(problems);
  for (let z = 0; z < problemFiles.length; z++) {
    out[SanitizePath(problemFiles[z], workspace)] = SanitizeProblems(
      problems[problemFiles[z]],
      workspace
    );
  }

  return out;
}
