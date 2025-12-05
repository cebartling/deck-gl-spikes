import { spawn, ChildProcess } from 'child_process';
import waitOn from 'wait-on';

let serverProcess: ChildProcess | null = null;
const BASE_URL = 'http://localhost:5173';

export async function startDevServer(): Promise<void> {
  if (serverProcess) {
    return;
  }

  console.log('Starting Vite dev server...');

  serverProcess = spawn('npx', ['vite'], {
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true,
  });

  serverProcess.stdout?.on('data', (data) => {
    const output = data.toString();
    if (process.env.DEBUG) {
      console.log(`[vite] ${output}`);
    }
  });

  serverProcess.stderr?.on('data', (data) => {
    const output = data.toString();
    if (process.env.DEBUG) {
      console.error(`[vite] ${output}`);
    }
  });

  serverProcess.on('error', (error) => {
    console.error('Failed to start dev server:', error);
  });

  try {
    await waitOn({
      resources: [BASE_URL],
      timeout: 30000,
      interval: 100,
      validateStatus: (status: number) => status === 200,
    });
    console.log('Vite dev server is ready');
  } catch (error) {
    console.error('Timeout waiting for dev server to start');
    await stopDevServer();
    throw error;
  }
}

export async function stopDevServer(): Promise<void> {
  if (!serverProcess) {
    return;
  }

  console.log('Stopping Vite dev server...');

  return new Promise((resolve) => {
    if (!serverProcess) {
      resolve();
      return;
    }

    serverProcess.on('close', () => {
      serverProcess = null;
      console.log('Vite dev server stopped');
      resolve();
    });

    const pid = serverProcess.pid;

    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', String(pid), '/f', '/t']);
    } else if (pid) {
      // Kill the entire process group (negative PID)
      try {
        process.kill(-pid, 'SIGTERM');
      } catch {
        // Process might already be dead
      }
    }

    setTimeout(() => {
      if (serverProcess && pid) {
        try {
          process.kill(-pid, 'SIGKILL');
        } catch {
          // Process might already be dead
        }
      }
      serverProcess = null;
      resolve();
    }, 3000);
  });
}

export function getBaseUrl(): string {
  return BASE_URL;
}
