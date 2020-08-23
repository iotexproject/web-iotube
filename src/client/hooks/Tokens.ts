import { ChainId, Token } from "@uniswap/sdk";
import { useMemo } from "react";
import { useActiveWeb3React } from "./index";
import { CHAIN_TOKEN_LIST } from "../constants/index";
import { TokenInfo } from "@uniswap/token-lists";

export class WrappedTokenInfo extends Token {
  public readonly tokenInfo: TokenInfo;
  constructor(tokenInfo: TokenInfo) {
    super(
      tokenInfo.chainId,
      tokenInfo.address,
      tokenInfo.decimals,
      tokenInfo.symbol,
      tokenInfo.name
    );
    this.tokenInfo = tokenInfo;
  }
  public get logoURI(): string | undefined {
    return this.tokenInfo.logoURI;
  }
}

export type TokenAddressMap = Readonly<
  {
    [chainId in ChainId]: Readonly<{
      [tokenAddress: string]: WrappedTokenInfo;
    }>;
  }
>;

export function useTokens(): { [address: string]: Token } {
  const { chainId } = useActiveWeb3React();
  return useMemo(() => {
    if (!chainId) return {};
    const tokenList = {};
    CHAIN_TOKEN_LIST[chainId].forEach((aToken) => {
      tokenList[aToken.address.toLowerCase()] = new WrappedTokenInfo(aToken);
    });
    return tokenList;
  }, [chainId]);
}
