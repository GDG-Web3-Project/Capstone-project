// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/TimelockController.sol";

/**
 * @title TimeLock
 * @dev This is "The Vault." It holds the DAO's treasure (ETH, DAI, etc.).
 * Even if a vote passes, the Timelock forces a "waiting period" (e.g., 48 hours)
 * before the money actually moves. This is the community's final safety window.
 */
contract TimeLock is TimelockController {
    // minDelay: The "cooling off" period before a passed proposal can be executed.
    // proposers: Who can submit proposals? (Usually just the Governor)
    // executors: Who can trigger the final execution? (Usually address(0) - anyone)
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(minDelay, proposers, executors, admin) {}
}
