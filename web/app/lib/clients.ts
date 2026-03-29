import { createPublicClient, http, toHex } from "viem";
import {
  createBundlerClient,
  type SmartAccount,
} from "viem/account-abstraction";
import { RPC_URL, BUNDLER_URL, PAYMASTER_URL, CHAIN } from "./constants";

const publicClient = createPublicClient({
  chain: CHAIN,
  transport: http(RPC_URL),
});

export function getPublicClient() {
  return publicClient;
}

async function paymasterRpc(method: string, params: unknown[]) {
  const res = await fetch(PAYMASTER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      { id: 1, jsonrpc: "2.0", method, params },
      (_, v) => (typeof v === "bigint" ? toHex(v) : v)
    ),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.result;
}

export function getBundlerClient(
  _account: SmartAccount,
  options?: { usePaymaster?: boolean }
) {
  const usePaymaster = options?.usePaymaster ?? false;

  return createBundlerClient({
    client: publicClient,
    transport: http(BUNDLER_URL),
    ...(usePaymaster
      ? {
          paymaster: {
            async getPaymasterStubData(parameters) {
              const { entryPointAddress, chainId, ...userOperation } =
                parameters;
              return await paymasterRpc("pm_getPaymasterStubData", [
                userOperation,
                entryPointAddress,
                toHex(chainId),
              ]);
            },
            async getPaymasterData(parameters) {
              const { entryPointAddress, chainId, ...userOperation } =
                parameters;
              return await paymasterRpc("pm_getPaymasterData", [
                userOperation,
                entryPointAddress,
                toHex(chainId),
              ]);
            },
          },
        }
      : {}),
  });
}
