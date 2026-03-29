// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title AIAttestation
/// @notice EAS-like attestation contract for AI agent evaluation results.
contract AIAttestation is Ownable {

    struct Attestation {
        bytes32 uid;
        uint256 collateralId;
        bool approved;
        uint8 agentCount;
        uint8 approvalCount;
        uint16 avgConfidence;
        string summary;
        address attester;
        uint64 timestamp;
        bool revoked;
    }

    mapping(bytes32 => Attestation) public attestations;
    mapping(uint256 => bytes32[]) public collateralAttestations;
    uint256 public attestationCount;

    event Attested(bytes32 indexed uid, uint256 indexed collateralId, bool approved, uint16 avgConfidence);
    event Revoked(bytes32 indexed uid);

    constructor() Ownable(msg.sender) {}

    function attest(
        uint256 collateralId,
        bool approved,
        uint8 agentCount,
        uint8 approvalCount,
        uint16 avgConfidence,
        string calldata summary
    ) external returns (bytes32 uid) {
        uid = keccak256(abi.encodePacked(collateralId, msg.sender, block.timestamp));
        require(attestations[uid].timestamp == 0, "Attestation already exists");

        attestations[uid] = Attestation({
            uid: uid,
            collateralId: collateralId,
            approved: approved,
            agentCount: agentCount,
            approvalCount: approvalCount,
            avgConfidence: avgConfidence,
            summary: summary,
            attester: msg.sender,
            timestamp: uint64(block.timestamp),
            revoked: false
        });

        collateralAttestations[collateralId].push(uid);
        attestationCount++;

        emit Attested(uid, collateralId, approved, avgConfidence);
    }

    function revoke(bytes32 uid) external onlyOwner {
        require(attestations[uid].timestamp != 0, "Attestation not found");
        require(!attestations[uid].revoked, "Already revoked");
        attestations[uid].revoked = true;
        emit Revoked(uid);
    }

    function getAttestation(bytes32 uid) external view returns (Attestation memory) {
        return attestations[uid];
    }

    function getAttestationsByCollateral(uint256 collateralId) external view returns (bytes32[] memory) {
        return collateralAttestations[collateralId];
    }

    function getAttestationCount(uint256 collateralId) external view returns (uint256) {
        return collateralAttestations[collateralId].length;
    }

    function isAttested(uint256 collateralId) external view returns (bool) {
        bytes32[] memory uids = collateralAttestations[collateralId];
        for (uint256 i; i < uids.length; i++) {
            Attestation memory a = attestations[uids[i]];
            if (a.approved && !a.revoked) return true;
        }
        return false;
    }
}
