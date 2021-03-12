import { Currency, CurrencyAmount, JSBI, Token, TokenAmount } from "@uniswap/sdk";
import { useMemo } from "react";
import { useMulticallContract, useTokenContract } from "../../hooks/useContract";
import { isAddress } from "../../utils/index";
import { useSingleContractMultipleData } from "../multicall/hooks";

/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function useETHBalances(uncheckedAddresses?: (string | undefined)[]): { [address: string]: CurrencyAmount | undefined } {
  const multicallContract = useMulticallContract();

  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a): a is string => a !== false)
            .sort()
        : [],
    [uncheckedAddresses]
  );

  const results = useSingleContractMultipleData(
    multicallContract,
    "getEthBalance",
    addresses.map((address) => [address])
  );

  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: CurrencyAmount }>((memo, address, i) => {
        const value = results?.[i]?.result?.[0];
        if (value) memo[address] = CurrencyAmount.ether(JSBI.BigInt(value.toString()));
        return memo;
      }, {}),
    [addresses, results]
  );
}

export function useTokenBalances(tokenAddress: string | undefined, token: Token, uncheckedAddresses?: (string | undefined)[]): { [address: string]: CurrencyAmount | undefined } {
  const tokenContract = useTokenContract(tokenAddress || "");

  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a): a is string => a !== false)
            .sort()
        : [],
    [uncheckedAddresses]
  );

  const results = useSingleContractMultipleData(
    tokenContract,
    "balanceOf",
    addresses.map((address) => [address])
  );

  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: CurrencyAmount }>((memo, address, i) => {
        const value = results?.[i]?.result?.[0];
        if (value) {
          memo[address] = new TokenAmount(token, JSBI.BigInt(value.toString()));
        }
        return memo;
      }, {}),
    [addresses, results]
  );
}
