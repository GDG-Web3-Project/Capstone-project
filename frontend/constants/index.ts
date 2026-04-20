// Import your ABIs directly from the Foundry build folder
import GovernanceTokenABI from "../../contracts/out/GovernanceToken.sol/GovernanceToken.json";
import GovernorContractABI from "../../contracts/out/GovernorContract.sol/GovernorContract.json";
import TimeLockABI from "../../contracts/out/TimeLock.sol/TimeLock.json";

// These are your actual addresses from the Anvil deployment
export const GOVERNANCE_TOKEN_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
export const GOVERNOR_CONTRACT_ADDRESS = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0";
export const TIMELOCK_ADDRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

export const ABIs = {
    GovernanceToken: GovernanceTokenABI.abi,
    GovernorContract: GovernorContractABI.abi,
    TimeLock: TimeLockABI.abi,
};
