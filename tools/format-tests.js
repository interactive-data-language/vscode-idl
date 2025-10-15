const { spawnSync } = require('child_process');
const os = require('os');

// --- Detect platform ---
const isWindows = os.platform() === 'win32';

// --- Get all projects ---
const nxShowProjectsCmd = 'nx show projects --projects="tests*"';

const shell = isWindows ? 'cmd.exe' : 'bash';
const shellArgs = isWindows ? ['/c'] : ['-c'];

// Run "nx show projects"
const result = spawnSync(shell, [...shellArgs, nxShowProjectsCmd], {
  cwd: process.cwd(),
  encoding: 'utf8',
});
if (result.error) {
  console.error('Failed to run "nx show projects":', result.error);
  process.exit(1);
}
if (result.status !== 0) {
  console.error(result.stderr || result.stdout);
  process.exit(result.status);
}

const allProjects = result.stdout
  .split(/\r?\n/g)
  .map((proj) => proj.trim())
  .filter(Boolean);

if (allProjects.length === 0) {
  console.log('No projects found matching pattern:', pattern);
  process.exit(0);
}

const formatCmd = `nx format:write --projects=${allProjects.join(',')}`;

const child = spawnSync(shell, [...shellArgs, formatCmd], {
  stdio: 'inherit',
  cwd: process.cwd(),
});
if (child.error) {
  console.error(`Failed to format:`, child.error);
  process.exit(1);
}
if (child.status !== 0) {
  console.error(`"nx format:write" failed`);
  process.exit(child.status);
}
