import type { SavedPasskey } from "./types";

const STORAGE_KEY = "colliquid_passkeys";

export function getSavedPasskeys(): SavedPasskey[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as SavedPasskey[];
  } catch {
    return [];
  }
}

export function savePasskey(passkey: Omit<SavedPasskey, "createdAt">): void {
  try {
    const passkeys = getSavedPasskeys();
    const existingIndex = passkeys.findIndex((p) => p.id === passkey.id);

    if (existingIndex >= 0) {
      passkeys[existingIndex] = {
        ...passkeys[existingIndex],
        ...passkey,
        lastUsed: Date.now(),
      };
    } else {
      passkeys.push({
        ...passkey,
        createdAt: Date.now(),
        lastUsed: Date.now(),
      });
    }

    passkeys.sort(
      (a, b) => (b.lastUsed || b.createdAt) - (a.lastUsed || a.createdAt)
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(passkeys));
  } catch {
    // silent
  }
}

export function removePasskey(passkeyId: string): void {
  try {
    const passkeys = getSavedPasskeys();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(passkeys.filter((p) => p.id !== passkeyId))
    );
  } catch {
    // silent
  }
}
