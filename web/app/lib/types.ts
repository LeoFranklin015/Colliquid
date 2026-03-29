import type { SmartAccount } from "viem/account-abstraction";
import type { Address } from "viem";

export interface PasskeyCredential {
  id: string;
  name: string;
  credential: {
    id: string;
    publicKey: `0x${string}`;
    raw?: unknown;
    [key: string]: unknown;
  };
}

export interface SmartAccountState {
  account: SmartAccount | null;
  address: Address | null;
  isLoggedIn: boolean;
}

export interface SavedPasskey {
  id: string;
  name: string;
  createdAt: number;
  lastUsed?: number;
}
