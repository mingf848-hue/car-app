import { spawn } from 'node:child_process';

const node = process.execPath;
const api = spawn(node, ['server.js', '--api-only'], {
  stdio: 'inherit',
  env: { ...process.env, API_PORT: process.env.API_PORT || '5174' }
});

const viteBin = process.platform === 'win32' ? 'node_modules/.bin/vite.cmd' : 'node_modules/.bin/vite';
const web = spawn(viteBin, ['--host', '127.0.0.1', '--port', process.env.WEB_PORT || '5173'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: { ...process.env }
});

const shutdown = () => {
  api.kill('SIGTERM');
  web.kill('SIGTERM');
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

api.on('exit', (code) => {
  if (code && code !== 0) process.exit(code);
});

web.on('exit', (code) => {
  if (code && code !== 0) process.exit(code);
});
