// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/GovernanceToken.sol";
import "../src/Timelock.sol";
import "../src/GovernorContract.sol";

contract DAOTest is Test {
    GovernanceToken token;
    Timelock timelock;
    GovernorContract governor;

    address proposer = address(1);
    address voter1 = address(2);
    address voter2 = address(3);
    address recipient = address(4);

    uint256 constant INITIAL_SUPPLY = 1000000 * 10**18;

    function setUp() public {
        // Deploy contracts
        address[] memory proposers = new address[](0);
        address[] memory executors = new address[](1);
        executors[0] = address(0);
        timelock = new Timelock(2 days, proposers, executors, address(this));

        token = new GovernanceToken();

        governor = new GovernorContract(IVotes(address(token)), timelock);

        // Setup roles
        timelock.grantRole(timelock.PROPOSER_ROLE(), address(governor));
        timelock.revokeRole(timelock.DEFAULT_ADMIN_ROLE(), address(this));

        // Distribute tokens
        token.transfer(proposer, 100000 * 10**18);
        token.transfer(voter1, 300000 * 10**18);
        token.transfer(voter2, 200000 * 10**18);

        // Fund timelock with ETH
        vm.deal(address(timelock), 10 ether);

        // Delegate votes
        vm.prank(proposer);
        token.delegate(proposer);
        vm.prank(voter1);
        token.delegate(voter1);
        vm.prank(voter2);
        token.delegate(voter2);
    }

    function testProposeAndVote() public {
        // Propose sending 1 ETH to recipient
        address[] memory targets = new address[](1);
        targets[0] = recipient;
        uint256[] memory values = new uint256[](1);
        values[0] = 1 ether;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = "";
        string memory description = "Send 1 ETH to recipient";

        vm.prank(proposer);
        uint256 proposalId = governor.propose(targets, values, calldatas, description);

        // Wait for voting delay
        vm.roll(block.number + governor.votingDelay() + 1);

        // Vote
        vm.prank(voter1);
        governor.castVote(proposalId, 1); // For
        vm.prank(voter2);
        governor.castVote(proposalId, 1); // For

        // Wait for voting period
        vm.roll(block.number + governor.votingPeriod());

        // Check proposal succeeded
        assertEq(uint256(governor.state(proposalId)), uint256(IGovernor.ProposalState.Succeeded));

        // Queue
        governor.queue(targets, values, calldatas, keccak256(bytes(description)));

        // Wait for timelock
        vm.warp(block.timestamp + 2 days + 1);

        // Execute
        governor.execute(targets, values, calldatas, keccak256(bytes(description)));

        // Check recipient received ETH
        assertEq(recipient.balance, 1 ether);
    }

    // function testFuzzVotingPower(uint256 amount) public {
    //     amount = bound(amount, 1, 100000); // 1 to 100k tokens
    //     uint256 amountWei = amount * 10**18;

    //     address user = address(5);

    //     // Mint to user directly by calling _mint, but since private, transfer from deployer
    //     vm.prank(address(this));
    //     token.transfer(user, amountWei);

    //     vm.prank(user);
    //     token.delegate(user);

    //     assertEq(token.getVotes(user), amountWei);
    // }
}