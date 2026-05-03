import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

/**
 * Lightweight network diagnostics. Speedtest uses a Cloudflare-hosted
 * test file (no API key) for download throughput plus a small HEAD ping
 * for latency. ARP uses the OS's `arp -a` table.
 */
export class NetProvider {
  async speedtest(): Promise<{ pingMs: number; downloadMbps: number; jitterMs: number; ok: boolean; error?: string }> {
    try {
      // 5 HEAD requests for ping + jitter
      const target = 'https://www.cloudflare.com/cdn-cgi/trace';
      const samples: number[] = [];
      for (let i = 0; i < 5; i++) {
        const t0 = performance.now();
        await fetch(target, { method: 'GET', cache: 'no-store', signal: AbortSignal.timeout(3000) });
        samples.push(performance.now() - t0);
      }
      const pingMs = Math.round(samples.reduce((s, v) => s + v, 0) / samples.length);
      const mean = pingMs;
      const variance = samples.reduce((s, v) => s + (v - mean) * (v - mean), 0) / samples.length;
      const jitterMs = Math.round(Math.sqrt(variance));

      // 25MB Cloudflare speed file
      const url = 'https://speed.cloudflare.com/__down?bytes=25000000';
      const t0 = performance.now();
      const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(15000) });
      const buf = await res.arrayBuffer();
      const elapsedSec = (performance.now() - t0) / 1000;
      const bits = buf.byteLength * 8;
      const downloadMbps = Math.round((bits / elapsedSec / 1_000_000) * 10) / 10;

      return { pingMs, downloadMbps, jitterMs, ok: true };
    } catch (e: any) {
      return { pingMs: 0, downloadMbps: 0, jitterMs: 0, ok: false, error: String(e?.message ?? e) };
    }
  }

  async arp(): Promise<Array<{ ip: string; mac: string; iface?: string; vendor?: string }>> {
    const isWindows = process.platform === 'win32';
    const cmd = isWindows ? 'arp -a' : 'arp -an';
    try {
      const { stdout } = await execAsync(cmd, { timeout: 5000, maxBuffer: 1024 * 1024 });
      return parseArp(stdout, isWindows);
    } catch {
      return [];
    }
  }
}

function parseArp(out: string, isWindows: boolean): Array<{ ip: string; mac: string; iface?: string }> {
  const results: Array<{ ip: string; mac: string; iface?: string }> = [];
  let currentIface: string | undefined;
  for (const line of out.split(/\r?\n/)) {
    if (isWindows) {
      const ifMatch = line.match(/Interface:\s*([\d.]+)/);
      if (ifMatch) { currentIface = ifMatch[1]; continue; }
      const m = line.match(/^\s*([\d.]+)\s+([0-9a-fA-F-]{17})\s+(\w+)/);
      if (m && m[2].toLowerCase() !== 'ff-ff-ff-ff-ff-ff') {
        results.push({ ip: m[1], mac: m[2].toLowerCase().replace(/-/g, ':'), iface: currentIface });
      }
    } else {
      const m = line.match(/\((\d+\.\d+\.\d+\.\d+)\)\s+at\s+([0-9a-fA-F:]{17})/);
      if (m) results.push({ ip: m[1], mac: m[2].toLowerCase() });
    }
  }
  // Dedupe by mac
  const seen = new Set<string>();
  return results.filter((r) => (seen.has(r.mac) ? false : (seen.add(r.mac), true)));
}
