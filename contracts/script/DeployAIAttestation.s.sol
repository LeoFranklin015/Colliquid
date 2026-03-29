// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {AIAttestation} from "../src/AIAttestation.sol";

/// @title DeployAIAttestation
/// @notice Deploys AIAttestation to the Privacy Node.
///
/// Usage:
///   source .env
///   forge script script/DeployAIAttestation.s.sol --rpc-url $PRIVACY_NODE_RPC_URL --broadcast --legacy
contract DeployAIAttestation is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

        vm.startBroadcast(deployerKey);

        AIAttestation attestation = new AIAttestation();

        vm.stopBroadcast();

        console.log("=== Deployed ===");
        console.log("  AIAttestation:", address(attestation));
        console.log("");
        console.log("Next step: Set ATTESTATION_ADDRESS=%s in your .env", vm.toString(address(attestation)));
    }
}
