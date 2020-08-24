import { Contract } from "@ethersproject/contracts";
import { useMemo } from "react";
import { useActiveWeb3React } from "./index";
import { getContract } from "../utils/index";
import {
  MULTICALL_ABI,
  MULTICALL_NETWORKS,
} from "../constants/multicall/index";
import ERC20_ABI from "../constants/abis/erc20.json";

function useContract(
  address?: string,
  ABI?: any,
  withSignerIfPossible = true
): Contract | null {
  const { library, account } = useActiveWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) return null;
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && MULTICALL_NETWORKS[chainId],
    MULTICALL_ABI,
    false
  );
}

export function useTokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
}
