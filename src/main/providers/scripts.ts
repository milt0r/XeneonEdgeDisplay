import { exec } from 'node:child_process';

/**
 * Runs a user-supplied shell snippet in PowerShell (Windows) or sh (other).
 * Captures stdout/stderr; output is truncated. Timeouts default to 15s.
 *
 * Note: this is intentionally permissive — scripts run with the same
 * privileges as the renderer's main process. Don't add a script you
 * wouldn't paste into your own terminal.
 */
export class ScriptsProvider {
  run(cmd: string, timeoutMs = 15_000): Promise<{ ok: boolean; stdout: string; stderr: string; exitCode: number }> {
    const isWindows = process.platform === 'win32';
    const shell = isWindows ? 'powershell.exe' : '/bin/sh';
    const args = isWindows
      ? ['-NoProfile', '-NonInteractive', '-Command', cmd]
      : ['-c', cmd];
    return new Promise((resolve) => {
      const child = exec(`${shell} ${args.map((a) => JSON.stringify(a)).join(' ')}`, {
        timeout: timeoutMs,
        maxBuffer: 256 * 1024,
        windowsHide: true
      }, (err, stdout, stderr) => {
        const exitCode = (err && (err as any).code) ?? 0;
        resolve({
          ok: !err,
          stdout: String(stdout ?? '').slice(-4096),
          stderr: String(stderr ?? '').slice(-2048),
          exitCode: typeof exitCode === 'number' ? exitCode : 0
        });
      });
      child.on('error', () => {});
    });
  }
}
