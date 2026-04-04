// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/GovernanceToken.sol";
import "../src/TimeLock.sol";
import "../src/GovernorContract.sol";

contract GovernanceTest is Test {
    GovernanceToken token;
    TimeLock timelock;
    GovernorContract governor;
    
    address public USER = makeAddr("user");
    uint256 public constant INITIAL_SUPPLY = 100 ether;

    function setUp() public {
        token = new GovernanceToken(address(this));
        // Using 3600 (1 hour) as the minDelay for the Timelock
        timelock = new TimeLock(3600, new address[](0), new address[](0), address(this));
        governor = new GovernorContract(token, timelock);

        bytes32 proposerRole = timelock.PROPOSER_ROLE();
        bytes32 executorRole = timelock.EXECUTOR_ROLE();
        bytes32 adminRole = timelock.DEFAULT_ADMIN_ROLE();

        timelock.grantRole(proposerRole, address(governor));
        timelock.grantRole(executorRole, address(0));
        timelock.revokeRole(adminRole, address(this));

        token.mint(USER, INITIAL_SUPPLY);
        token.mint(address(timelock), 5 ether);
        
        vm.prank(USER);
        token.delegate(USER); 
    }

    // --- NEW: Helper function to avoid repeating code ---
    function _createAndPassProposal(address target, uint256 amount, string memory description) internal returns (uint256, bytes32) {
        address[] memory targets = new address[](1);
        targets[0] = target;
        uint256[] memory values = new uint256[](1);
        values[0] = 0;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encodeWithSignature("transfer(address,uint256)", address(0x123), amount);

        // 1. Propose
        uint256 proposalId = governor.propose(targets, values, calldatas, description);
        vm.roll(block.number + governor.votingDelay() + 1);

        // 2. Vote
        vm.prank(USER);
        governor.castVote(proposalId, 1); 
        vm.roll(block.number + governor.votingPeriod() + 1);

        // 3. Queue
        bytes32 descriptionHash = keccak256(abi.encodePacked(description));
        governor.queue(targets, values, calldatas, descriptionHash);
        
        return (proposalId, descriptionHash);
    }

    function testProposalWorkflow() public {
        string memory desc = "Proposal #1: Send 5 ETH";
        (uint256 proposalId, bytes32 descHash) = _createAndPassProposal(address(token), 5 ether, desc);

        vm.warp(block.timestamp + 3601);

        // Prepare execution data
        address[] memory targets = new address[](1);
        targets[0] = address(token);
        uint256[] memory values = new uint256[](1);
        values[0] = 0;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encodeWithSignature("transfer(address,uint256)", address(0x123), 5 ether);

        governor.execute(targets, values, calldatas, descHash);
        assertEq(uint256(governor.state(proposalId)), 7); 
    }

    function testFuzz_ProposalExecution(uint256 grantAmount) public {
        vm.assume(grantAmount > 0 && grantAmount <= 5 ether);
        console.log("Testing DAO grant for amount:", grantAmount);
        string memory desc = "Fuzz Test: Grant";
        (uint256 proposalId, bytes32 descHash) = _createAndPassProposal(address(token), grantAmount, desc);

        vm.warp(block.timestamp + 3601);

        // Execute the fuzz amount
        address[] memory targets = new address[](1);
        targets[0] = address(token);
        uint256[] memory values = new uint256[](1);
        values[0] = 0;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encodeWithSignature("transfer(address,uint256)", address(0x123), grantAmount);

        governor.execute(targets, values, calldatas, descHash);

        assertEq(token.balanceOf(address(0x123)), grantAmount);
    }
}