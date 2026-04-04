// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/GovernanceToken.sol";
import "../src/TimeLock.sol";
import "../src/GovernorContract.sol";

contract DeployGovernance is Script {
    uint256 public constant DEFAULT_MIN_DELAY = 3600; // 1 hour

    // Your helper function to handle the logic
    function deploy(address admin, uint256 minDelay) public returns (GovernanceToken, TimeLock, GovernorContract) {
        GovernanceToken gt = new GovernanceToken(admin);
        TimeLock tl = new TimeLock(minDelay, new address[](0), new address[](0), admin);
        GovernorContract gc = new GovernorContract(gt, tl);
        
        // Setup roles (same as your test setup)
        tl.grantRole(tl.PROPOSER_ROLE(), address(gc));
        tl.grantRole(tl.EXECUTOR_ROLE(), address(0));
        
        return (gt, tl, gc);
    }

    // THIS IS THE PART YOU ASKED ABOUT
    function run() external {
        vm.startBroadcast();
        (GovernanceToken gt, TimeLock tl, GovernorContract gc) = deploy(msg.sender, DEFAULT_MIN_DELAY);
        vm.stopBroadcast();

        console.log("-------------------------------------");
        console.log("DEPLOYMENT SUCCESSFUL");
        console.log("Governance Token:", address(gt));
        console.log("Timelock Vault:  ", address(tl));
        console.log("Governor Brain:  ", address(gc));
        console.log("-------------------------------------");
    }
}