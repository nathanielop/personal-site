import { spawn } from 'node:child_process';

const children = [];
let shuttingDown = false;

const shutdown = code => {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM');
  }
  process.exit(code ?? 0);
};

const start = (args, env) => {
  const child = spawn('node', args, {
    stdio: 'inherit',
    env: { ...process.env, ...env }
  });
  child.on('exit', code => shutdown(code ?? 0));
  children.push(child);
};

start(['--watch-path=src', '--watch-path=scripts', 'scripts/build.mjs'], {
  LIVERELOAD: '1'
});
start(['scripts/serve.mjs']);

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
