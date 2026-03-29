import type { SmartAccount } from "viem/account-abstraction";
import { type Address, type Hash, parseEther } from "viem";
import { getBundlerClient } from "./clients";

export async function sendTransaction(
  smartAccount: SmartAccount,
  to: Address,
  value?: bigint,
  data?: `0x${string}`
): Promise<Hash> {
  const bundlerClient = getBundlerClient(smartAccount, {
    usePaymaster: false,
  });

  const userOpHash = await bundlerClient.sendUserOperation({
    account: smartAccount,
    calls: [
      {
        to,
        value: value ?? 0n,
        data: data ?? "0x",
      },
    ],
    callGasLimit: 500_000n,
  });

  const receipt = await bundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  return receipt.receipt.transactionHash;
}

export async function sendETH(
  smartAccount: SmartAccount,
  to: Address,
  amount: string
): Promise<Hash> {
  return sendTransaction(smartAccount, to, parseEther(amount));
}
