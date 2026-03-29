import {
  createWebAuthnCredential,
  toWebAuthnAccount,
} from "viem/account-abstraction";
import type { WebAuthnAccount } from "viem/account-abstraction";
import type { PasskeyCredential } from "./types";
import { API_BASE_URL, API_KEY } from "./constants";

interface BackendResponse<T> {
  statusCode: number;
  result: {
    data: T;
    error: null | string;
  };
}

interface PasskeyLookupResponse {
  credentialId: string;
  publicKey: string;
  displayName: string;
}

async function registerPasskeyInBackend(request: {
  credentialId: string;
  publicKey: string;
  displayName: string;
}): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/wallet/v2/passkeys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Registration failed: ${response.status} - ${errorText}`);
  }
}

async function lookupPasskeysFromBackend(
  credentialIds: string[]
): Promise<PasskeyLookupResponse[]> {
  const params = new URLSearchParams();
  credentialIds.forEach((id) => params.append("credentialIds", id));

  const response = await fetch(
    `${API_BASE_URL}/wallet/v2/passkeys?${params}`,
    { headers: { "x-api-key": API_KEY } }
  );

  if (!response.ok) {
    if (response.status === 404) throw new Error("Passkeys not found");
    throw new Error(`Lookup failed: ${response.status}`);
  }

  const json: BackendResponse<{ passkeys: PasskeyLookupResponse[] }> =
    await response.json();

  if (json.result?.data?.passkeys) return json.result.data.passkeys;
  if (json.result?.error) throw new Error(json.result.error);
  throw new Error("Invalid response");
}

async function lookupPasskeyFromBackend(
  credentialId: string
): Promise<PasskeyLookupResponse> {
  const passkeys = await lookupPasskeysFromBackend([credentialId]);
  if (!passkeys[0]) throw new Error("Passkey not found");
  return passkeys[0];
}

export async function createPasskey(
  name: string
): Promise<PasskeyCredential> {
  const credential = await createWebAuthnCredential({
    name: name.trim(),
  });

  await registerPasskeyInBackend({
    credentialId: credential.id,
    publicKey: credential.publicKey,
    displayName: name.trim(),
  });

  return {
    id: credential.id,
    name: name.trim(),
    credential: {
      id: credential.id,
      publicKey: credential.publicKey,
    },
  };
}

export async function loginWithPasskey(): Promise<PasskeyCredential> {
  const challenge = crypto.getRandomValues(new Uint8Array(32));

  const credential = (await navigator.credentials.get({
    publicKey: {
      challenge,
      userVerification: "preferred",
      timeout: 60000,
    },
  })) as PublicKeyCredential;

  if (!credential) throw new Error("No credential selected");

  const credentialIdBase64 = btoa(
    String.fromCharCode(...new Uint8Array(credential.rawId))
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  const passkeyData = await lookupPasskeyFromBackend(credentialIdBase64);

  return {
    id: credentialIdBase64,
    name: passkeyData.displayName || "Passkey",
    credential: {
      id: credentialIdBase64,
      publicKey: passkeyData.publicKey as `0x${string}`,
      raw: credential,
    },
  };
}

export async function loginWithSpecificPasskey(
  credentialId: string
): Promise<PasskeyCredential> {
  const base64 = credentialId.replace(/-/g, "+").replace(/_/g, "/");
  const paddedBase64 =
    base64 + "==".substring(0, (4 - (base64.length % 4)) % 4);
  const credentialIdArray = Uint8Array.from(atob(paddedBase64), (c) =>
    c.charCodeAt(0)
  );

  const challenge = crypto.getRandomValues(new Uint8Array(32));

  const credential = (await navigator.credentials.get({
    publicKey: {
      challenge,
      allowCredentials: [
        {
          id: credentialIdArray,
          type: "public-key",
          transports: ["internal", "hybrid"],
        },
      ],
      userVerification: "preferred",
      timeout: 60000,
    },
  })) as PublicKeyCredential;

  if (!credential) throw new Error("Authentication failed");

  const passkeyData = await lookupPasskeyFromBackend(credentialId);

  return {
    id: credentialId,
    name: passkeyData.displayName || "Passkey",
    credential: {
      id: credentialId,
      publicKey: passkeyData.publicKey as `0x${string}`,
      raw: credential,
    },
  };
}

export async function fetchPasskeyDisplayNames(
  credentialIds: string[]
): Promise<Map<string, string>> {
  try {
    const passkeys = await lookupPasskeysFromBackend(credentialIds);
    const map = new Map<string, string>();
    passkeys.forEach((p) => map.set(p.credentialId, p.displayName));
    return map;
  } catch {
    return new Map();
  }
}

export function toWalletWebAuthnAccount(
  credential: PasskeyCredential
): WebAuthnAccount {
  return toWebAuthnAccount({ credential: credential.credential });
}
