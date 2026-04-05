// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/GovernanceToken.sol";
import "../src/Timelock.sol";
import "../src/GovernorContract.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy Timelock
        address[] memory proposers = new address[](0);
        address[] memory executors = new address[](1);
        executors[0] = address(0); // anyone can execute
        Timelock timelock = new Timelock(2 days, proposers, executors, msg.sender);

        // Deploy Token
        GovernanceToken token = new GovernanceToken();

        // Deploy Governor
        GovernorContract governor = new GovernorContract(IVotes(address(token)), timelock);

        // Grant proposer role to governor
        timelock.grantRole(timelock.PROPOSER_ROLE(), address(governor));

        // Revoke admin role from deployer
        timelock.revokeRole(timelock.DEFAULT_ADMIN_ROLE(), msg.sender);

        vm.stopBroadcast();
    }
}