import { ChainId } from "@uniswap/sdk";
import MULTICALL_ABI from "./abi.json";
import { AllChainId } from "../index";

const MULTICALL_NETWORKS: { [chainId: number]: string } = {
  [AllChainId.MAINNET]: "0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441",
  [AllChainId.ROPSTEN]: "0x53C43764255c17BD724F74c4eF150724AC50a3ed",
  [AllChainId.KOVAN]: "0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A",
  [AllChainId.RINKEBY]: "0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821",
  [AllChainId.GÖRLI]: "0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e",
  [AllChainId.BSC]: "0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb",
  [AllChainId.MATIC]: "0xa0FD7430852361931b23a31F84374BA3314e1682",
};

export { MULTICALL_ABI, MULTICALL_NETWORKS };
