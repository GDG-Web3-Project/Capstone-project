// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {GovernanceToken} from "../src/GovernanceToken.sol";
import {TimeLock} from "../src/TimeLock.sol";
import {GovernorContract} from "../src/GovernorContract.sol";

contract DeployDAO is Script {
	GovernanceToken public token;
	TimeLock public timelock;
	GovernorContract public governor;

	uint256 public constant DEFAULT_MIN_DELAY = 2 days;

	function deploy(address initialOwner, uint256 minDelay)
		public
		returns (GovernanceToken, TimeLock, GovernorContract)
	{
		address[] memory proposers = new address[](0);
		address[] memory executors = new address[](0);

		token = new GovernanceToken(initialOwner);
		timelock = new TimeLock(minDelay, proposers, executors, initialOwner);
		governor = new GovernorContract(token, timelock);

		bytes32 proposerRole = timelock.PROPOSER_ROLE();
		bytes32 executorRole = timelock.EXECUTOR_ROLE();
		bytes32 adminRole = timelock.DEFAULT_ADMIN_ROLE();

		timelock.grantRole(proposerRole, address(governor));
		timelock.grantRole(executorRole, address(0));
		timelock.revokeRole(adminRole, initialOwner);

		return (token, timelock, governor);
	}

	function run() external {
		vm.startBroadcast();
		deploy(msg.sender, DEFAULT_MIN_DELAY);
		vm.stopBroadcast();
	}
}
