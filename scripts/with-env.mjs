import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const envFile = existsSync('.env')
  ? '.env'
  : existsSync('.env.example')
    ? '.env.example'
    : null;

if (envFile) {
  process.loadEnvFile(path.resolve(envFile));
}

const [command, ...args] = process.argv.slice(2);
if (!command) {
  console.error('Usage: node scripts/with-env.mjs <command> [args...]');
  process.exit(1);
}

const executable = process.platform === 'win32' ? `${command}.cmd` : command;
const child = spawn(executable, args, {
  stdio: 'inherit',
  env: process.env,
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal));
}

child.on('error', (error) => {
  console.error(`无法启动 ${command}:`, error);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exitCode = code ?? 0;
});
