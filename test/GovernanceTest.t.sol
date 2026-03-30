// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/GovernanceToken.sol";
import "../src/TimeLock.sol";
import "../src/GovernorContract.sol";
import "../script/DeployDAO.s.sol";

contract GovernanceTest is Test {
    GovernanceToken token;
    TimeLock timelock;
    GovernorContract governor;
    
    address public USER = makeAddr("user");
    address public MINTER = makeAddr("minter");
    uint256 public constant INITIAL_SUPPLY = 100 ether;

    function setUp() public {
        DeployDAO deployer = new DeployDAO();
        deployer.run();
        
        // In a real scenario, we'd get these from the deployment script
        // For simplicity in this test, let's redeploy or use the ones from the script if we can capture them
        // Since deployer.run() doesn't return them easily without storage, let's just deploy manually here for the test
        
        token = new GovernanceToken(address(this));
        timelock = new TimeLock(3600, new address[](0), new address[](0), address(this));
        governor = new GovernorContract(token, timelock);
        
        bytes32 proposerRole = timelock.PROPOSER_ROLE();
        bytes32 executorRole = timelock.EXECUTOR_ROLE();
        bytes32 adminRole = timelock.DEFAULT_ADMIN_ROLE();

        timelock.grantRole(proposerRole, address(governor));
        timelock.grantRole(executorRole, address(0));
        timelock.revokeRole(adminRole, address(this));
        
        token.mint(USER, INITIAL_SUPPLY);
        
        vm.prank(USER);
        token.delegate(USER); // Self-delegate to activate voting power
    }

    function testProposalWorkflow() public {
        string memory description = "Proposal #1: Send 5 ETH to Marketing";
        bytes memory callData = abi.encodeWithSignature("transfer(address,uint256)", address(0x123), 5 ether);
        address[] memory targets = new address[](1);
        targets[0] = address(token); // Just for example, usually it's ETH from timelock
        uint256[] memory values = new uint256[](1);
        values[0] = 0;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = callData;

        // 1. Propose
        uint256 proposalId = governor.propose(targets, values, calldatas, description);
        console.log("Proposal ID:", proposalId);
        
        // Wait for voting delay
        vm.roll(block.number + governor.votingDelay() + 1);

        // 2. Vote
        vm.prank(USER);
        governor.castVote(proposalId, 1); // 1 = For

        // Wait for voting period
        vm.roll(block.number + governor.votingPeriod() + 1);

        // 3. Queue
        bytes32 descriptionHash = keccak256(abi.encodePacked(description));
        governor.queue(targets, values, calldatas, descriptionHash);
        
        // Wait for timelock
        vm.warp(block.timestamp + 3601);

        // 4. Execute
        governor.execute(targets, values, calldatas, descriptionHash);
        
        assertEq(uint256(governor.state(proposalId)), 7); // 7 = Executed
    }
}
