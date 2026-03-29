"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { SmartAccount } from "viem/account-abstraction";
import type { Address } from "viem";
import type { PasskeyCredential } from "./types";
import {
  createPasskey,
  loginWithPasskey,
  loginWithSpecificPasskey,
} from "./webauthn";
import { createSmartAccount } from "./smart-account";
import { savePasskey } from "./passkey-storage";

interface WalletState {
  account: SmartAccount | null;
  address: Address | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  passkeyName: string | null;
  connect: (credentialId?: string) => Promise<void>;
  create: (name: string) => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletState | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<SmartAccount | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passkeyName, setPasskeyName] = useState<string | null>(null);

  const finalize = useCallback(
    async (credential: PasskeyCredential) => {
      const smartAccount = await createSmartAccount(credential);
      const addr = await smartAccount.getAddress();
      setAccount(smartAccount);
      setAddress(addr);
      setPasskeyName(credential.name);
      savePasskey({ id: credential.id, name: credential.name });
    },
    []
  );

  const connect = useCallback(
    async (credentialId?: string) => {
      setIsConnecting(true);
      setError(null);
      try {
        const credential = credentialId
          ? await loginWithSpecificPasskey(credentialId)
          : await loginWithPasskey();
        await finalize(credential);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Connection failed");
      } finally {
        setIsConnecting(false);
      }
    },
    [finalize]
  );

  const create = useCallback(
    async (name: string) => {
      setIsConnecting(true);
      setError(null);
      try {
        const credential = await createPasskey(name);
        await finalize(credential);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Creation failed");
      } finally {
        setIsConnecting(false);
      }
    },
    [finalize]
  );

  const disconnect = useCallback(() => {
    setAccount(null);
    setAddress(null);
    setPasskeyName(null);
    setError(null);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        account,
        address,
        isConnected: !!account,
        isConnecting,
        error,
        passkeyName,
        connect,
        create,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
