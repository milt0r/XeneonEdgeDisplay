import Store from 'electron-store';
import type { SafeStorage } from 'electron';

interface SecretShape {
  [key: string]: string; // base64-encoded encrypted blob
}

export class SecretsStore {
  private store = new Store<SecretShape>({ name: 'xeneon-edge-secrets', defaults: {} });

  constructor(private safeStorage: SafeStorage) {}

  set(key: string, value: string): void {
    if (!this.safeStorage.isEncryptionAvailable()) {
      // dev fallback: store plaintext but flag it
      this.store.set(key, `plain:${value}`);
      return;
    }
    const encrypted = this.safeStorage.encryptString(value).toString('base64');
    this.store.set(key, `enc:${encrypted}`);
  }

  get(key: string): string | null {
    const raw = this.store.get(key);
    if (!raw) return null;
    if (raw.startsWith('plain:')) return raw.slice('plain:'.length);
    if (raw.startsWith('enc:')) {
      try {
        return this.safeStorage.decryptString(Buffer.from(raw.slice('enc:'.length), 'base64'));
      } catch {
        return null;
      }
    }
    return null;
  }

  has(key: string): boolean {
    return !!this.store.get(key);
  }

  clear(key: string): void {
    this.store.delete(key);
  }
}
